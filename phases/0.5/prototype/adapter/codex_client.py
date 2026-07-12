"""The JSON-RPC seat (spec §1, channel-protocol.svg).

JSON-RPC 2.0 is a message FORMAT, not a server: we spawn `codex app-server`
as a child process and exchange newline-delimited JSON over its stdin/stdout.
No port, no HTTP. This is the same seat the VS Code / Cursor extension sits in.

CodexAppServer speaks the real boundary; MockCodex fakes the same events so
the adapter is demoable without a codex install or an LLM key.

Method names below are the PUBLISHED ones from the app-server README
(github.com/openai/codex -> codex-rs/app-server). The machine-readable
contract is `codex app-server generate-ts --out ./schemas` — regenerate and
diff on every codex upgrade (ADR-015).
"""
import json
import subprocess
import time


class CodexAppServer:
    """Real client: spawn once at boot, restart-on-exit (spec lifecycle)."""

    def __init__(self, codex_bin="codex"):
        self.proc = subprocess.Popen(
            [codex_bin, "app-server"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True,
        )
        self._id = 0
        self._request("initialize", {"clientInfo": {"name": "edge-adapter"}})

    def _request(self, method, params):
        self._id += 1
        self.proc.stdin.write(json.dumps(
            {"jsonrpc": "2.0", "id": self._id, "method": method, "params": params}) + "\n")
        self.proc.stdin.flush()
        while True:  # skip notifications until our response arrives
            msg = json.loads(self.proc.stdout.readline())
            if msg.get("id") == self._id:
                return msg["result"]

    def new_conversation(self, colleague):
        return self._request("thread/start", {
            "profile": colleague.id,           # compiled from colleagues.yaml
            "sandbox": colleague.sandbox_mode,
            "approvalPolicy": colleague.approval_policy,
        })["threadId"]

    def send_user_turn(self, thread_id, text):
        """Yields the event stream: deltas, item activity, turn/completed."""
        self._id += 1
        self.proc.stdin.write(json.dumps(
            {"jsonrpc": "2.0", "id": self._id, "method": "turn/start",
             "params": {"threadId": thread_id, "input": text}}) + "\n")
        self.proc.stdin.flush()
        while True:
            msg = json.loads(self.proc.stdout.readline())
            if "method" in msg:               # notification = event
                yield msg["method"], msg.get("params", {})
                if msg["method"] == "turn/completed":
                    return
            elif msg.get("id") == self._id and "error" in msg:
                raise RuntimeError(msg["error"])


class MockCodex:
    """Same interface, canned events — lets the demo run with zero deps."""

    def __init__(self):
        self._n = 0

    def new_conversation(self, colleague):
        self._n += 1
        return f"conv-{colleague.id}-{self._n:03d}"

    def send_user_turn(self, thread_id, text):
        persona = thread_id.split("-")[1]
        reply = _CANNED.get(persona, "Done.").format(request=text.strip().splitlines()[0])
        yield "turn/started", {"threadId": thread_id}
        for chunk in [reply[i:i + 40] for i in range(0, len(reply), 40)]:
            yield "item/agentMessage/delta", {"delta": chunk}
        yield "thread/tokenUsage/updated", {"input": 312, "output": len(reply) // 4}
        yield "turn/completed", {"finalMessage": reply}
        time.sleep(0)  # keep generator semantics obvious


_CANNED = {
    "vanessa": (
        "Here's my take on “{request}”:\n\n"
        "1. Problem framing — what user outcome are we buying?\n"
        "2. Proposed scope for a first slice (1 week, demoable)\n"
        "3. Open risks: adoption, data access, review loop\n\n"
        "I drafted the one-pager in workspace/docs/brd-draft.md — reply on this\n"
        "thread with corrections and I'll revise.\n\n"
        "— Vanessa (digital colleague)"
    ),
    "david": (
        "Architecture view on “{request}”:\n\n"
        "Keep the boundary at the adapter; the harness stays unmodified.\n"
        "Trade-off table is in my reply below. Read-only sandbox, so this is\n"
        "advice, not applied changes.\n\n"
        "— David (digital colleague)"
    ),
}
