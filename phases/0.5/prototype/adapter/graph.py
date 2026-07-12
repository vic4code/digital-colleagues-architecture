"""Real Microsoft Graph backends — Outlook implemented, reference quality.

Dependencies (real mode only; the mock demo needs none):

    pip install msal requests

Auth is the spec §4 story: one delegated device-code sign-in as the owner,
token cache on disk for the prototype (OS keychain in v0.1 proper — see
msal-extensions for the portable keychain wrapper).

Register one public-client app in Entra (or use IT's existing one):
delegated permissions Mail.ReadWrite, Mail.Send, offline_access — plus
Chat.Read, ChatMessage.Send when Teams personal mode is enabled.
"""
import time

try:
    import msal
    import requests
except ImportError:                                    # mock demo path
    msal = requests = None

from .mailbox import Message

GRAPH = "https://graph.microsoft.com/v1.0"
SCOPES_MAIL = ["Mail.ReadWrite", "Mail.Send"]
SCOPES_TEAMS = ["Chat.Read", "ChatMessage.Send"]


class DeviceCodeAuth:
    """One sign-in at install; silent refresh afterwards."""

    def __init__(self, client_id, tenant_id, cache_path, scopes):
        cache = msal.SerializableTokenCache()
        if cache_path.exists():
            cache.deserialize(cache_path.read_text())
        self._cache_path, self._cache, self.scopes = cache_path, cache, scopes
        self.app = msal.PublicClientApplication(
            client_id, authority=f"https://login.microsoftonline.com/{tenant_id}",
            token_cache=cache)

    def token(self):
        accounts = self.app.get_accounts()
        result = self.app.acquire_token_silent(self.scopes, account=accounts[0]) if accounts else None
        if not result:
            flow = self.app.initiate_device_flow(scopes=self.scopes)
            print(flow["message"])                     # "visit https://microsoft.com/devicelogin …"
            result = self.app.acquire_token_by_device_flow(flow)
        if self._cache.has_state_changed:
            self._cache_path.write_text(self._cache.serialize())
        if "access_token" not in result:
            raise RuntimeError(result.get("error_description", result))
        return result["access_token"]

    def _headers(self):
        return {"Authorization": f"Bearer {self.token()}"}


class GraphOutlook:
    """The real mailbox. Same interface as MockMailbox; three endpoints."""

    def __init__(self, auth: DeviceCodeAuth, state):
        self.auth, self.state = auth, state            # state stores the delta link

    def poll_new(self):
        url = self.state.get_kv("delta_link") or (
            f"{GRAPH}/me/mailFolders/inbox/messages/delta"
            "?$select=id,conversationId,from,toRecipients,subject,body,receivedDateTime")
        msgs = []
        while url:
            page = requests.get(url, headers=self.auth._headers(), timeout=30).json()
            for m in page.get("value", []):
                if "@removed" in m:
                    continue
                msgs.append(Message(
                    id=m["id"],
                    thread_id=m["conversationId"],
                    sender=m["from"]["emailAddress"]["address"],
                    to=m["toRecipients"][0]["emailAddress"]["address"] if m.get("toRecipients") else "",
                    subject=m.get("subject", ""),
                    body=m["body"]["content"],
                    received_at=time.time(),
                ))
            url = page.get("@odata.nextLink")
            if "@odata.deltaLink" in page:
                self.state.set_kv("delta_link", page["@odata.deltaLink"])
        return msgs

    def send_reply(self, original, body, from_display):
        requests.post(
            f"{GRAPH}/me/messages/{original.id}/reply",
            headers=self.auth._headers(),
            json={"comment": f"[{from_display}]\n\n{body}"}, timeout=30,
        ).raise_for_status()

    def mark_processed(self, msg):
        folder = self._processed_folder_id()
        requests.post(
            f"{GRAPH}/me/messages/{msg.id}/move",
            headers=self.auth._headers(),
            json={"destinationId": folder}, timeout=30,
        ).raise_for_status()

    def _processed_folder_id(self):
        fid = self.state.get_kv("processed_folder_id")
        if fid:
            return fid
        r = requests.post(f"{GRAPH}/me/mailFolders", headers=self.auth._headers(),
                          json={"displayName": "Colleagues-Processed"}, timeout=30)
        if r.status_code == 409:                       # already exists — find it
            r = requests.get(f"{GRAPH}/me/mailFolders?$filter=displayName eq 'Colleagues-Processed'",
                             headers=self.auth._headers(), timeout=30)
            fid = r.json()["value"][0]["id"]
        else:
            fid = r.json()["id"]
        self.state.set_kv("processed_folder_id", fid)
        return fid
