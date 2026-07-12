"""Router + scheduler + trace tap — the deterministic part (spec §1–§3).

One cycle = poll → gate → route → run turns → relay + ack. The mailbox is the
queue; SQLite holds the only adapter-owned state (thread map, processed ids).
"""
import json
import sqlite3
import time
from pathlib import Path


class Traces:
    """Business-audit layer (ADR-016). Append-only JSONL; never optional."""

    def __init__(self, path: Path):
        self.path = path
        path.parent.mkdir(parents=True, exist_ok=True)

    def emit(self, **record):
        record["ts"] = round(time.time(), 3)
        with self.path.open("a") as f:
            f.write(json.dumps(record) + "\n")


class State:
    def __init__(self, path: Path):
        self.db = sqlite3.connect(path)
        self.db.executescript(
            "CREATE TABLE IF NOT EXISTS thread_map (thread_id TEXT PRIMARY KEY, conversation_id TEXT);"
            "CREATE TABLE IF NOT EXISTS processed (message_id TEXT PRIMARY KEY);"
        )

    def conversation_for(self, thread_id):
        row = self.db.execute("SELECT conversation_id FROM thread_map WHERE thread_id=?",
                              (thread_id,)).fetchone()
        return row[0] if row else None

    def map_thread(self, thread_id, conversation_id):
        self.db.execute("INSERT OR REPLACE INTO thread_map VALUES (?,?)", (thread_id, conversation_id))
        self.db.commit()

    def seen(self, message_id):
        return self.db.execute("SELECT 1 FROM processed WHERE message_id=?", (message_id,)).fetchone()

    def mark(self, message_id):
        self.db.execute("INSERT OR IGNORE INTO processed VALUES (?)", (message_id,))
        self.db.commit()


class Adapter:
    def __init__(self, config, mailbox, codex, state: State, traces: Traces, log=print):
        self.config, self.mailbox, self.codex = config, mailbox, codex
        self.state, self.traces, self.log = state, traces, log

    def run_cycle(self):
        """One poll cycle. In production this loops every poll_seconds."""
        for msg in self.mailbox.poll_new():
            if self.state.seen(msg.id):
                continue                                   # at-least-once, idempotent
            if msg.sender.split("<")[-1].strip("> ") != self.config.owner:
                self.traces.emit(event="sender_rejected", message_id=msg.id, sender=msg.sender)
                self.log(f"  ✗ rejected (sender not allow-listed): {msg.sender}")
                self.state.mark(msg.id)                    # remember, or we re-reject every cycle
                continue                                   # no reply — never a probe target
            tag = msg.plus_tag()
            colleague = self.config.find_by_plus_tag(tag) if tag else None
            if not colleague:
                self.traces.emit(event="no_colleague_tag", message_id=msg.id, to=msg.to)
                self.state.mark(msg.id)
                continue                                   # ordinary mail, not for us
            self._run_turn(msg, colleague)

    def _run_turn(self, msg, colleague):
        conv = self.state.conversation_for(msg.thread_id)
        if conv is None:
            conv = self.codex.new_conversation(colleague)
            self.state.map_thread(msg.thread_id, conv)
            self.traces.emit(event="conversation_opened", thread_id=msg.thread_id,
                             conversation_id=conv, colleague=colleague.id)
        self.traces.emit(event="turn_started", message_id=msg.id, conversation_id=conv,
                         channel="email", sender=msg.sender, colleague=colleague.id)
        self.log(f"  → turn: {colleague.display_name} on thread {msg.thread_id} (session {conv})")

        final = None
        prompt = f"Subject: {msg.subject}\n\n{msg.body}"
        for event, params in self.codex.send_user_turn(conv, prompt):
            self.traces.emit(event=event, conversation_id=conv, **{
                k: v for k, v in params.items() if k != "delta"})
            if event == "turn/completed":
                final = params["finalMessage"]

        reply = self.mailbox.send_reply(msg, final, from_display=colleague.display_name)
        self.mailbox.mark_processed(msg)                    # the ack — deterministic, last
        self.state.mark(msg.id)
        self.traces.emit(event="reply_sent", message_id=msg.id, reply_id=reply.id,
                         conversation_id=conv)
        self.log(f"  ← replied on thread, original → Processed")
