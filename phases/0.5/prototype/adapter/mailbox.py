"""Mailbox backends.

The mailbox IS the queue (spec §2): a message is "done" only when the reply is
sent and the original moved to Processed. Two backends behind one interface:

- MockMailbox — a local JSON folder simulating Exchange Online, so the whole
  adapter runs (and is demoable) with no tenant, no token, no network.
- GraphMailbox — the real thing; the two REST calls are spelled out and the
  auth is the one device-code sign-in from spec §4. Marked TODO for v0.1.
"""
import json
import time
import uuid
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class Message:
    id: str
    thread_id: str
    sender: str
    to: str            # e.g. "victor+vanessa@company.com" — the plus-tag rides here
    subject: str
    body: str
    received_at: float
    channel: str = "email"

    def colleague_tag(self):
        """Email addressing: the plus-tag names the colleague (ADR-010)."""
        local = self.to.split("@", 1)[0]
        return local.split("+", 1)[1].lower() if "+" in local else None

    def text(self):
        return f"Subject: {self.subject}\n\n{self.body}"


class MockMailbox:
    """Simulates the cloud mailbox as inbox/ and processed/ JSON files."""

    def __init__(self, root: Path):
        self.inbox = root / "inbox"
        self.processed = root / "processed"
        self.sent = root / "sent"
        for d in (self.inbox, self.processed, self.sent):
            d.mkdir(parents=True, exist_ok=True)

    # -- what the poller calls -------------------------------------------
    def poll_new(self):
        msgs = [Message(**json.loads(p.read_text())) for p in sorted(self.inbox.glob("*.json"))]
        return sorted(msgs, key=lambda m: m.received_at)  # FIFO across threads

    # -- what the relay calls (the deterministic ack, spec §2) ----------
    def send_reply(self, original: Message, body: str, from_display: str):
        reply = Message(
            id=uuid.uuid4().hex[:8],
            thread_id=original.thread_id,          # same thread = same session next time
            sender=f"{from_display} <{original.to}>",
            to=original.sender,
            subject="Re: " + original.subject.removeprefix("Re: "),
            body=body,
            received_at=time.time(),
        )
        (self.sent / f"{reply.id}.json").write_text(json.dumps(asdict(reply), indent=2))
        return reply

    def mark_processed(self, msg: Message):
        src = self.inbox / f"{msg.id}.json"
        src.rename(self.processed / f"{msg.id}.json")

    # -- demo helper ------------------------------------------------------
    def deliver(self, sender, to, subject, body, thread_id=None):
        m = Message(
            id=uuid.uuid4().hex[:8],
            thread_id=thread_id or uuid.uuid4().hex[:8],
            sender=sender, to=to, subject=subject, body=body,
            received_at=time.time(),
        )
        (self.inbox / f"{m.id}.json").write_text(json.dumps(asdict(m), indent=2))
        return m


class GraphMailbox:
    """The real backend. Same interface; two REST endpoints do all the work.

    Auth: one delegated device-code sign-in (Mail.ReadWrite, Mail.Send,
    offline_access), refresh token in the OS keychain — spec §4.
    """

    DELTA = "GET https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages/delta"
    SEND = "POST https://graph.microsoft.com/v1.0/me/sendMail"
    MOVE = "POST https://graph.microsoft.com/v1.0/me/messages/{id}/move"

    def poll_new(self):
        raise NotImplementedError(f"v0.1: call {self.DELTA} with the stored delta token")

    def send_reply(self, original, body, from_display):
        raise NotImplementedError(f"v0.1: call {self.SEND} on the original conversation")

    def mark_processed(self, msg):
        raise NotImplementedError(f"v0.1: call {self.MOVE} to the Processed folder")
