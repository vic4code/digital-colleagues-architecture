"""Teams channel — personal mode, outbound-only.

Two distinct ways to put a colleague in Teams, and they are NOT equal:

- **Bot identity** (colleague appears as its own Teams user): requires Azure
  Bot Service and a public webhook — resident-box territory, not edge.
- **Personal mode (this file)**: the adapter polls the *owner's own chats*
  with delegated Graph permissions (`Chat.Read` + `ChatMessage.Send`) —
  outbound-only, works on a NAT'd laptop, same one device-code sign-in as
  mail. Addressing is a text convention (`@vanessa …` at the start of a
  message, typically in a dedicated chat); replies post *as the owner*, the
  same From-is-you limitation email has.

A chat is a thread: one Teams chat maps to one codex session, so a dedicated
"Vanessa" chat behaves like a persistent conversation with her.
"""
import json
import time
import uuid
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class ChatMessage:
    id: str
    thread_id: str     # the chat id — one chat = one codex session
    sender: str
    body: str
    received_at: float
    channel: str = "teams"

    def colleague_tag(self):
        """Teams addressing: message starts with @<colleague-id>."""
        first = self.body.strip().split(None, 1)[0] if self.body.strip() else ""
        return first[1:].lower() if first.startswith("@") else None

    def text(self):
        return self.body.strip().split(None, 1)[1] if len(self.body.split(None, 1)) > 1 else ""


class MockTeamsChat:
    """Simulates watched chats as JSON files, mirroring MockMailbox."""

    def __init__(self, root: Path):
        self.new = root / "new"
        self.seen = root / "seen"
        self.posted = root / "posted"
        for d in (self.new, self.seen, self.posted):
            d.mkdir(parents=True, exist_ok=True)

    def poll_new(self):
        msgs = [ChatMessage(**json.loads(p.read_text())) for p in sorted(self.new.glob("*.json"))]
        return sorted(msgs, key=lambda m: m.received_at)

    def send_reply(self, original, body, from_display):
        reply = ChatMessage(
            id=uuid.uuid4().hex[:8], thread_id=original.thread_id,
            sender=f"{from_display} (via you)", body=body, received_at=time.time(),
        )
        (self.posted / f"{reply.id}.json").write_text(json.dumps(asdict(reply), indent=2))
        return reply

    def mark_processed(self, msg):
        (self.new / f"{msg.id}.json").rename(self.seen / f"{msg.id}.json")

    # -- demo helper ------------------------------------------------------
    def deliver(self, sender, body, chat_id=None):
        m = ChatMessage(id=uuid.uuid4().hex[:8], thread_id=chat_id or uuid.uuid4().hex[:8],
                        sender=sender, body=body, received_at=time.time())
        (self.new / f"{m.id}.json").write_text(json.dumps(asdict(m), indent=2))
        return m


class GraphTeamsChat:
    """Real backend: delegated polling of the owner's chats. Same interface.

    Watched chats come from adapter.toml (e.g. the dedicated "Vanessa" chat's
    id); last-seen message ids live in the adapter's SQLite state. Mind Graph
    throttling — poll watched chats only, 15–30 s interval.
    """

    LIST_MSGS = "GET https://graph.microsoft.com/v1.0/me/chats/{chat_id}/messages?$top=20"
    POST_MSG = "POST https://graph.microsoft.com/v1.0/chats/{chat_id}/messages"

    def __init__(self, auth, watched_chat_ids):
        self.auth, self.watched = auth, watched_chat_ids

    def poll_new(self):
        raise NotImplementedError(f"v0.2: {self.LIST_MSGS} per watched chat, newest-first")

    def send_reply(self, original, body, from_display):
        raise NotImplementedError(f"v0.2: {self.POST_MSG} with body prefixed '[{{from_display}}]'")

    def mark_processed(self, msg):
        pass  # no folders in chat — the last-seen id in SQLite is the cursor
