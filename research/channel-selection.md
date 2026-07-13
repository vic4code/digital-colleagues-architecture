# Channel Selection for a Codex-Based Digital Colleague

- **Status:** Research note — recommendation ready for validation, not an accepted ADR
- **Research cutoff:** 2026-07-14
- **Scope:** Human and machine initiation, collaboration, review, approval, and notification channels
- **Runtime constraint:** The digital colleague is based on Codex; model selection is out of scope
- **Evidence rule:** Vendor capability claims use official primary sources.
  Recommendations are explicitly separated from documented facts and pilot
  evidence.

## Executive decision

Do not choose one universal channel, and do not make Outlook or Teams mandatory.
Choose a channel separately for each interaction role and only after it beats the
simpler native baseline for a measured customer workflow.

The current recommendation is:

1. **Use direct native Codex as the comparison baseline for owner-operated
   work.** Routing a person's private Codex task through email or Teams adds no
   inherent colleague value. Direct Codex is not automatically a governed
   digital-colleague channel, however: it does not by itself prove integration
   with the platform's persistent identity, authoritative state, policy, and
   audit. If those semantics are required, evaluate a governed Codex-native
   owner client that enters through the colleague control plane.
2. **Keep authoritative work state in the product store.** In line with
   [ADR-003](../decisions/ADR-003-linear-as-control-plane.md), Postgres plus the
   authoritative artifact store own lifecycle and audit. Linear or Jira can be
   human-facing work-tracking projections, but must not become a second mutable
   source of truth without a superseding ADR.
3. **Require version-bound authenticated approval, without preselecting a new
   UI.** First compare existing DMS/CLM, e-signature, SharePoint, Jira Service
   Management, and other governed workflow capabilities. Build a dedicated
   workbench only when a mandatory approval or artifact-review requirement
   remains unmet. A chat message or email reply may initiate or notify, but
   should not be the sole authority for a consequential action.
4. **Use Teams only as an internal collaboration edge.** It is suitable when
   authenticated employees already coordinate the target work in Teams and
   shared discussion, mentions, cards, or proactive updates improve that work.
   It is not a reason to replace Codex with Copilot, and it should not own task
   or artifact state.
5. **Use email only as an external asynchronous edge.** An Exchange shared
   mailbox is one suitable implementation when customers, vendors, or outside
   counsel need a broad-reach, no-product-account address for requests and
   attachments. Per-colleague addresses from ADR-010 are a distinct identity
   design. Neither is suitable as the primary surface for an owner talking to
   their own colleague or as the sole approval mechanism.
6. **Use API, webhook, and schedule paths for system- or time-initiated work.**
   Do not translate a structured machine event into email or chat merely to
   make it look human.
7. **Keep Slack, Teams, Exchange, Linear, and Jira adapters thin and
   replaceable.** They should all produce the same canonical work request and
   should never bypass colleague identity, policy, audit, or lifecycle rules.

Therefore, the answer is not “Outlook versus Teams.” The defensible portfolio is:

```text
private owner work        -> direct Codex comparison baseline
governed owner work       -> candidate Codex-native client through colleague core
internal shared work      -> existing team surface, if proven by usage data
external asynchronous     -> email address or service portal
machine/time initiated    -> signed API, webhook, or scheduler
authoritative task state  -> product Postgres
business artifacts        -> authoritative source connector / document system
review and final approval -> version-bound authenticated approval capability
execution                 -> Codex-based digital colleague runtime
```

Phase 0.5 remains a reference architecture that is deliberately not being
built. Preserve the adapter contract and the prototype as reference evidence;
do not present personal self-email as a supported product workflow. Use direct
Codex as the comparison baseline, and require a superseding ADR plus real
initiation evidence before changing the accepted Phase 0.5 scope.

## What is being selected

The word “channel” hides several different jobs. They must be evaluated
separately because a surface can be excellent for one and unsafe for another.

| Interaction role | Question it answers | Typical candidates |
|---|---|---|
| Intake | How does a new governed request enter? | Codex-native client, email, Teams, Slack, portal, API |
| Collaboration | Where do people clarify and coordinate? | Teams, Slack, Linear/Jira comments |
| Work tracking | Where are owner, state, priority, and lifecycle projected? | Linear, Jira, product UI |
| Artifact review | Where can a human inspect the actual output and evidence? | Code diff, DMS/CLM, document system, product UI |
| Approval | Where is an exact consequential action authorized? | Version-bound authenticated workflow |
| Notification | Where should progress and results be projected? | Teams, Slack, email, tracker |
| Machine trigger | How does a system or clock create work? | API, webhook, event bus, scheduler |
| System of record | Where is authoritative state retained? | Product Postgres plus authoritative artifact source |

A channel adapter answers “how did this request or response cross the product
boundary?” A source connector answers “where does the business artifact live?”
A control surface answers “where can an authorized human inspect and decide?”
The system of record answers “which state wins?” These are composable concepts,
not synonyms. This preserves the distinction established in
[ADR-009](../decisions/ADR-009-source-connectors-distinct-from-channels.md).

For the current architecture, the answer to “which mutable task state wins?” is
the product store. Linear, Jira, Teams, Slack, and email are projections and
edges. If a future workflow makes an external tracker authoritative, that is a
system-of-record change requiring an explicit ADR and a conflict/migration
design—not an adapter configuration choice.

“Outlook” is also too imprecise for an architecture decision. Outlook is a
client. The Microsoft-hosted server-side channel evaluated here is **Exchange
email through Microsoft Graph**. A shared mailbox is one possible team-role
address; it is not the same architecture as Phase 0.5 personal plus-addressing
or ADR-010's per-colleague SES addresses. An agent rendered inside the Outlook
UI would be a fourth product surface with different limitations.

## Strategic constraint: Codex is the core, not every surface

This assessment accepts the product decision that the colleague is based on
Codex. It does not reopen a cross-model comparison. It does, however, separate
three layers that vendors often bundle:

1. **Surface and transport:** Teams, Slack, email, Linear, web, or API.
2. **Colleague control plane:** identity, work lifecycle, policy, audit,
   approvals, artifact provenance, and channel bindings.
3. **Execution runtime:** Codex and its tools.

Direct use of the Codex app, CLI, or IDE sits outside this three-layer product
unless a governed client explicitly binds it to colleague identity, policy,
authoritative work state, and audit. It remains the correct comparison baseline
for private owner work; it must not be mislabeled as evidence that the digital
colleague platform itself has those controls.

Microsoft's own [Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)
describes itself as an AI-agnostic message and channel plumbing layer, and the
[Teams SDK AI integration guidance](https://learn.microsoft.com/en-us/microsoftteams/platform/teams-sdk/in-depth-guides/ai-integrations/overview)
says a Teams app can use any AI framework or model. A Teams front end therefore
does not imply a Copilot runtime. It can remain a thin channel around Codex.

There is nevertheless a real product risk to validate: OpenAI currently
describes the [Codex SDK](https://developers.openai.com/codex/codex-sdk) as the
tool for “coding-focused Codex threads” and recommends treating Codex as a
specialist behind a broader orchestrator when the workflow is wider. Because
the repository targets legal and other non-code colleagues, “Codex-based” is a
design constraint, not evidence that the complete non-code workflow already
fits. The legal pilot must validate the runtime and the channel independently.

## Native-substitution test

Before custom integration work, compare the proposed path with capabilities
that already exist.

### OpenAI-native baselines

- [Codex in Slack](https://developers.openai.com/codex/third-party/slack)
  already turns an `@Codex` mention in a channel or thread into a Codex cloud
  coding task, uses prior thread context, and posts progress/results. It
  requires a GitHub-connected environment.
- [Codex in Linear](https://developers.openai.com/codex/third-party/linear)
  already supports issue assignment, `@Codex` comments, follow-up discussion,
  progress, results, and automatic delegation through triage rules. It is also
  repository/environment oriented.
- [ChatGPT Workspace Agents](https://help.openai.com/en/articles/20001143/)
  support repeatable shared workflows through ChatGPT, Slack, schedules, and
  API triggers, with tools, apps, shared connections, access controls, and
  write-action confirmation/approval settings. Those settings are not evidence
  of a G6 domain approval receipt. Workspace Agents are a serious buy/native
  baseline, but official documentation does not establish that they are the
  Codex runtime required by this architecture. The API trigger currently
  returns `202 Accepted` without a run ID or retrievable result.
- [Plugins in ChatGPT and Codex](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex)
  can package skills and apps that connect Codex or ChatGPT to external data and
  actions. Workspace controls can restrict role access and actions and configure
  action confirmation/approval behavior; they do not by themselves satisfy G6.
- OpenAI documents an
  [Outlook app for ChatGPT](https://help.openai.com/en/articles/12512241-outlook-email-and-calendar-app-for-chatgpt)
  with mailbox access, shared/delegated mailbox scopes, and mail write/send
  scopes. It also documents a
  [Teams app for ChatGPT](https://help.openai.com/en/articles/12552368-microsoft-teams-app-for-chatgpt)
  with message search and requested chat/channel send, create, and task scopes.
  The generic plugin documentation covers both ChatGPT and Codex, but these two
  app pages establish on-demand ChatGPT use—not availability in every Codex
  surface. Codex availability must be tenant-tested. The reviewed official
  pages also do **not** document an incoming email or Teams mention independently
  invoking a persistent Codex colleague. Both are evidence gaps, not proof that
  an implementation is impossible.

### Microsoft-native baselines

- Microsoft 365 Copilot already provides common Outlook assistance such as
  drafting, summarizing, search, and scheduling; see
  [Chat with Copilot in Outlook](https://support.microsoft.com/en-US/Outlook/copilot-outlook/chat-with-copilot-in-outlook).
- Microsoft 365 Copilot already summarizes Teams chats and channels, identifies
  decisions and action items, and links back to source messages; see
  [Use Copilot in Teams chats and channels](https://support.microsoft.com/en-us/teams/copilot/how-to-use-microsoft-365-copilot-in-teams-chats-and-channels).
- Microsoft's native
  [Teams Channel Agent](https://support.microsoft.com/en-us/teams/platform/frequently-asked-questions-about-agents-in-microsoft-teams)
  is a closer substitution baseline than generic chat summarization: it has a
  channel-visible identity, responds to mentions, can use channel/meeting
  context, creates status reports, schedules meetings, and manages tasks. It is
  currently public preview, limited to one agent per channel, unsupported in
  private channels and conversations with external participants, and
  unsupported for Customer Key tenants. Any Teams pilot must compare against it
  rather than assuming a custom colleague is the first agent in the channel.
- Microsoft supports custom-engine agents that bring their own model and
  orchestration; see
  [Agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview).

Generic “summarize my inbox,” “draft a response,” and “summarize this Teams
thread” are therefore weak product differentiation. A custom digital colleague
must earn its existence through persistent shared responsibility, addressable
identity, domain artifacts, governed lifecycle, exact approvals, and durable
outcomes—not by recreating assistant features.

### Build-versus-native rule

The following is proposed architecture policy, not a vendor claim:

> Do not build a custom channel unless the direct or official native path has a
> documented mandatory gap in identity, lifecycle, audit, authorization,
> artifact control, reach, or shared workflow—and a target-user pilot shows
> that closing the gap improves the accepted business outcome enough to justify
> the added operating burden.

For ordinary repository coding in Slack or Linear, the official Codex
integration is the default. A custom adapter is justified only if routing
directly to a Codex cloud task would bypass requirements this product actually
owns—for example, colleague identity, a legal work state machine, tenant
policy, authoritative artifact versions, or an immutable approval receipt.

## Selection gates

No score can compensate for a failed gate. These gates are proposed project
policy and must be applied to each concrete use case, not to a vendor in the
abstract.

| Gate | Required evidence | If it fails |
|---|---|---|
| G1 — Defined job | Named initiator, recipient, action, artifact, latency, sensitivity, and failure cost | Do not score the channel |
| G2 — Observed residency | Work-event data shows the target interaction already happens there, or a pilot demonstrates adoption | Keep it as a hypothesis; do not build production integration |
| G3 — Native substitution | Direct Codex and official vendor/native paths were tested on the same job | Prefer the native path unless a material gap remains |
| G4 — Identity and authority | Stable principal/tenant identity, authenticated event source, least privilege, and action-time authorization | Intake or notification only; no privileged action |
| G5 — Recoverable delivery | Durable receipt before acknowledgment, dedupe, retries, reconciliation/replay, and fault-test evidence | No side-effecting production workflow |
| G6 — Approval integrity | Exact action and artifact version, authenticated approver, current authority, expiry, and single use | Channel may notify; approval moves to a control surface |
| G7 — Governance | Retention, deletion, legal hold, export, audit, DLP/sensitivity, residency, and admin controls are mapped for the actual tenant/plan | No sensitive or regulated content |
| G8 — Accessibility and operability | Keyboard/assistive-technology test, rate-limit behavior, admin-consent path, and support runbook | No broad rollout |

## Job-specific evaluation rubric

Do not assign a repository-wide numeric score before G1 and G2. Each pilot must
pre-register the named job, measurements, risk constraints, and—only if useful
for that decision—weights and acceptance thresholds. The rubric is stable; the
importance of each dimension depends on the job.

| Criterion | Required observed or tested evidence |
|---|---|
| User and workflow fit | Share of real work events resident in the surface; repeat use; abandonment; user-reported friction |
| Initiator and collaboration fit | Actual initiator types, participant boundaries, handoffs, clarification count, and external reach |
| Task, artifact, and context fidelity | Lost context, attachment/version errors, source links, and corrections before acceptance |
| Identity, authorization, and approval | Principal mapping, action-time role checks, exact artifact/action binding, expiry, and replay tests |
| Delivery, recovery, and observability | Duplicate/lost/delayed events, crash recovery, reconciliation, trace completeness, and support diagnosis |
| Governance and auditability | Retention, deletion, legal hold, export, DLP/residency, admin controls, and immutable product audit |
| Native substitution | Outcome difference versus direct Codex and official/native vendor paths on the same jobs |
| Accessibility, cost, and reversibility | Assistive-technology results, admin/engineering time, cost per accepted outcome, and exit effort |

Always report evidence maturity separately from outcome measurements:

| Evidence level | Meaning |
|---|---|
| E0 | Assumption or architecture opinion only |
| E1 | Official documentation confirms capability |
| E2 | Reproducible technical spike in the target tenant/environment |
| E3 | Real-user pilot plus delivery and security fault tests |
| E4 | Measured production behavior |

An attractive architecture at E1 is not production evidence. A production
decision should require no failed gate and at least E3. This note intentionally
does not fabricate a ranked winner without workflow data.

## Provisional capability and evidence comparison

This table contains no fit scores. “Documented” means an official source proves
a platform primitive; it does not prove adoption or end-to-end product fit.
“Conditional” means the colleague platform must add and test the named control.
All target-workflow fit is currently E0 until the work-event census or a pilot
provides evidence.

| Candidate | Documented initiation/collaboration primitive | Exact high-risk approval | Authoritative-state role | Current evidence | Candidate role, pending G1–G8 |
|---|---|---|---|---|---|
| Direct native Codex | Authenticated owner surfaces; coding-focused SDK | Not a documented domain approval ledger | Outside colleague platform unless governed integration is added | E1 platform / E0 target workflow | Comparison baseline for private owner work |
| Governed Codex-native owner client | Not yet implemented | Conditional on product controls | Product store | E0 | Candidate owner channel when colleague semantics are required |
| ChatGPT Workspace Agent | ChatGPT, Slack, schedule, and API triggers | Write-action controls documented; exact domain receipt is conditional | External workflow surface, not product record | E1 platform / E0 target workflow | Buy/native baseline for repeatable general workflows; Codex runtime unverified |
| Teams agent | Chat/channel activities, mentions, cards, proactive messages | Conditional on backend action/version binding | Projection/edge only | E1 platform / E0 target workflow | Internal collaboration and notification |
| Microsoft Teams Channel Agent | Native channel identity, mentions, channel/meeting context, reports, meetings, and tasks | Human review of generated reports is documented; G6 exactness unverified | Microsoft-managed channel agent, not product record | Public preview / E0 target workflow | Mandatory native-substitution baseline for a Teams pilot |
| Exchange shared mailbox | Broad-reach asynchronous mail and attachments | Unsupported by reply alone; authenticated handoff required | Edge only | E1 platform / E0 target workflow | Team-role or generic external intake |
| Slack | Events, threads, mentions, interactive payloads; native Codex coding path | Conditional on backend binding | Projection/edge only | E1 platform / E0 target workflow | Team discussion, clarification, and status |
| Linear | Assignment, comments, webhooks, lifecycle; native Codex coding path | Conditional on backend binding | Projection under ADR-003 | E1 platform; Agent APIs preview / E0 target workflow | Lightweight delegated-work tracking |
| Jira Service Management | Portal/email intake, queues, workflow approval steps, events | Built-in workflow step documented; G6 exactness unverified | Projection/edge unless an ADR changes authority | E1 platform / E0 target workflow | Governed service intake candidate |
| Existing DMS/CLM/e-sign workflow | Product-specific; not evaluated generically | Unknown until named product and tenant are tested | Artifact authority may remain in named system | E0 in this study | First buy/configure baseline for artifact review/approval |
| Custom web workbench | Product-owned UI/API, not yet built | Conditional by design and test | Product store | E0 | Build candidate only after native/buy gaps are proven |
| Direct API/webhook/schedule | Structured service/time initiation | No human approval surface | Ingress only | E1 mechanisms / E0 target workflow | Machine and time initiation |
| Office document comments | Viable inbound event/reply path not established | Unknown | Artifact-system context only | E0 | Research candidate |
| Claw3D/custom immersive UI | Repo concept; user outcome not established | Conditional and untested | Product projection | E0 | Product hypothesis |

The comparison deliberately has no universal winner. It also shows why
“support Teams and Outlook” is not one coherent requirement: the surfaces solve
different initiation and collaboration problems.

## Detailed assessments

### 1. Direct native Codex and a governed Codex-native client

**Suitable for**

- An authenticated owner initiating their own work.
- Repository-backed work, local or cloud development tasks, diffs, and review.
- Private owner-operated work that does not claim the full governed-colleague
  semantics.
- The external comparison baseline every custom human channel must beat.

**Unsuitable or incomplete for**

- Arbitrary external people who cannot access the owner's Codex workspace.
- A shared service identity receiving work independently from many parties.
- A legal artifact approval ledger unless the product adds exact domain
  controls around it.
- Assuming direct Codex automatically emits the platform's canonical work
  state, persistent colleague identity, policy decisions, or immutable audit.
- Assuming that coding-focused SDK semantics automatically prove non-code legal
  workflow fit.

**Decision:** Use direct Codex as the baseline for private owner work, not as
proof of a governed digital-colleague channel. Do not make an owner email or
message their own colleague merely to demonstrate plumbing. If owner-initiated
work must enter the product's identity, state, policy, and audit model, evaluate
a governed Codex-native client as a separate E0 candidate.

### 2. Microsoft Teams

**Official capability evidence**

- The [Microsoft 365 Agents SDK](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)
  normalizes messages into activities, supports multiple channels, and is
  AI-agnostic.
- The [Teams SDK AI guidance](https://learn.microsoft.com/en-us/microsoftteams/platform/teams-sdk/in-depth-guides/ai-integrations/overview)
  supports an independent AI framework/model and describes cards, follow-up
  prompts, citations, and human-in-the-loop patterns.
- Teams supports
  [proactive messages](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/send-proactive-messages),
  but the app must already be installed in the relevant scope, and proactive
  messaging cannot create a new group chat or team channel.
- [Resource-specific consent](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent)
  can scope app access to a particular team, chat, or meeting rather than the
  whole tenant.
- Standard, private, and shared channels have different membership and storage
  semantics; see
  [apps for shared and private channels](https://learn.microsoft.com/en-us/microsoftteams/platform/build-apps-for-shared-private-channels).
- Channel files reside in SharePoint and chat files in OneDrive; see
  [Teams file handling](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/bots-filesv4).
- Teams administrators can allow, block, deploy, and govern apps; see
  [Manage apps in Teams](https://learn.microsoft.com/en-us/microsoftteams/manage-apps)
  and [Manage app consent](https://learn.microsoft.com/en-us/microsoftteams/manage-consent-app-permissions).
- External and guest collaboration has material context and app limitations;
  see [apps for external users](https://learn.microsoft.com/en-us/microsoftteams/apps-external-users),
  [guest access](https://learn.microsoft.com/en-us/microsoftteams/guest-access),
  and [shared channels](https://learn.microsoft.com/en-us/microsoftteams/shared-channels).
- Microsoft also ships a public-preview
  [Teams Channel Agent](https://support.microsoft.com/en-us/teams/platform/frequently-asked-questions-about-agents-in-microsoft-teams)
  with a channel-visible identity, mentions, channel/meeting context, status
  reports, meeting scheduling, and task management. Its documented constraints
  include one per channel, no private-channel or external-participant support,
  and no Customer Key tenant support. The
  [creation guide](https://support.microsoft.com/en-US/Teams/chat-channels/how-to-create-a-channel-agent-for-a-teams-channel)
  confirms it is public preview.

**Suitable for**

- Authenticated employees or managed partners who already coordinate the
  target work in Teams.
- Shared delegation where multiple people need to see the request, discussion,
  decision, and completion status.
- Explicit `@mention` invocation, concise clarification, actionable cards, and
  proactive completion/failure notification.
- Supplying platform tenant/user identifiers to an exact approval flow, if the
  backend maps and reauthorizes the actor and rechecks role, artifact version,
  expiry, and nonce.

**Unsuitable for**

- Arbitrary Internet senders with no tenant relationship.
- Personal question-answering or generic summarization already handled by
  direct Codex or Copilot.
- Storing the canonical task or document state in a chat thread.
- Scraping or polling an employee's personal chats, impersonating the employee,
  or treating all channel types as equivalent authorization contexts.
- A rollout where app installation, Entra consent, and tenant admin support are
  unavailable.

**Implementation boundary**

Use an explicit Teams agent/app identity through Microsoft's supported channel
plumbing. Default to mention-only. Grant resource-specific consent only where
ambient message access is a proven requirement. Preserve tenant, team, channel,
conversation, actor, membership type, and source link for audit and policy
inputs. Do not authorize solely from `membershipType` or `channelType`; verify
the current tenant, user role/membership, and supported capabilities at action
time, as Microsoft's shared/private-channel guidance recommends. Keep file
authority in SharePoint/OneDrive or the actual document system via a source
connector.

Microsoft's broad custom-engine-agent material and its specific limitations
are not fully aligned. The current
[known-issues page](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/known-issues)
says custom-engine agents built with the Agents Toolkit/SDK are not supported
in Outlook, Word, Excel, or PowerPoint, and that the Microsoft 365 Copilot
surface lacks proactive notifications and file attachments for those agents.
Treat the specific limitation as operative and require a target-tenant proof of
concept before promising an Outlook-hosted custom engine. This limitation does
not prohibit a native Teams app with a Codex backend.

**Decision:** Teams is a valid optional internal edge, not a default product
dependency and not evidence that the runtime should be Microsoft Copilot. A
Teams pilot must include the native Channel Agent as a substitution baseline.

### 3. Exchange email/shared mailbox

**Official capability evidence**

- Microsoft describes shared mailboxes for role addresses such as support,
  reception, and company information, with Send As and Send on Behalf
  semantics; see
  [About shared mailboxes](https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes)
  and [recipient permissions](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients).
- Microsoft Graph supports push change notifications, but subscriptions expire
  and lifecycle events can report reauthorization, removal, or missed
  notifications; see
  [change notifications overview](https://learn.microsoft.com/en-us/graph/change-notifications-overview)
  and [lifecycle events](https://learn.microsoft.com/en-us/graph/change-notifications-lifecycle-events).
- Delegated shared-mail scopes do not support subscriptions to shared/delegated
  folders; an application permission such as `Mail.Read` is required for that
  subscription model; see
  [shared and delegated Outlook folders](https://learn.microsoft.com/en-us/graph/outlook-share-messages-folders).
- Message delta queries provide per-folder reconciliation for additions,
  updates, and deletions; see
  [message delta query](https://learn.microsoft.com/en-us/graph/delta-query-messages).
- Graph webhook guidance defines acknowledgment, retry, slow-endpoint, and
  dropped-notification behavior; see
  [webhook delivery](https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks).
- [Exchange Application RBAC](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac)
  can scope application access to specific mailboxes instead of granting
  tenant-wide mail access.
- Microsoft Graph supports outbound mail through
  [`sendMail`](https://learn.microsoft.com/en-us/graph/api/user-sendmail); the
  adapter still owns authorization, idempotency, audit, and response binding.
- SMTP retries and timeout ambiguity can produce duplicate delivery; see
  [RFC 5321](https://datatracker.ietf.org/doc/html/rfc5321). `Message-ID` is a
  useful deduplication signal, not a guaranteed unique idempotency key; it is
  recommended rather than universally mandatory, and generators are expected
  rather than guaranteed to make it unique. See
  [RFC 5322 section 3.6.4](https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.4).
- Microsoft states that email authentication and anti-phishing require layered
  controls; see
  [email authentication](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-about),
  [anti-phishing policies](https://learn.microsoft.com/en-us/defender-office-365/anti-phishing-policies-about),
  and [prompt-injection protection for email](https://learn.microsoft.com/en-us/defender-office-365/step-by-step-guides/prompt-injection-protection-defender-for-office-365).

**Suitable for**

- Customers, vendors, outside counsel, or other external parties who have email
  but no product account or tenant access.
- Asynchronous document intake and outbound notification where minutes of
  latency are acceptable.
- A stable role or per-colleague identity, when that identity model has been
  selected explicitly.
- A bridge to a version-bound authenticated approval capability.

**Unsuitable for**

- An owner emailing themselves instead of using Codex directly.
- Rapid, multi-party conversational collaboration.
- Canonical work state or live artifact versioning.
- Treating the visible sender, SPF, DKIM, or DMARC as proof of the individual's
  current authority to approve a consequential action.
- Performing sensitive actions directly from untrusted message content or
  attachments.

NIST SP 800-63B says email must not be used for out-of-band authentication and
defines stronger authenticator properties such as replay resistance and
authentication intent; see
[NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/).
NIST does not directly define this product's legal-approval policy. The project
inference is: an email reply saying `APPROVE` is insufficient authentication for
a high-impact approval. Email should link the recipient to a capability that
binds the authenticated person, current role, exact artifact version, decision,
and time.

**Email identity variants**

| Variant | Appropriate role | Repository status |
|---|---|---|
| Personal mailbox plus-address | Single-owner edge mechanics and delivery/idempotency reference | Phase 0.5 reference prototype only; not a supported shared-colleague workflow |
| Exchange shared mailbox | Team role address or generic triage/intake inside a Microsoft 365 tenant | Candidate in this study; selecting it as primary identity would narrow or supersede ADR-010 |
| Per-colleague address on a dedicated subdomain | Direct addressability of each persistent colleague | Proposed in [ADR-010](../decisions/ADR-010-email-per-colleague-identity.md), using catch-all SES rather than Exchange mailbox provisioning |

These variants solve different identity problems. “Email is justified” does
not determine which one should be authoritative.

**Implementation boundary**

If the selected variant is an Exchange shared mailbox, do not depend on local
Outlook automation. Scope application permissions to that mailbox with Exchange
Application RBAC. Treat Graph notification as a wake-up signal: persist before
acknowledgment, deduplicate with multiple signals, renew subscriptions, handle
lifecycle events, and reconcile with delta queries. Keep attachments as
source-qualified artifacts or controlled intake copies, not silent canonical
replacements.

**Decision:** Email is a valid external intake/notification edge. Exchange is a
valid implementation for an M365 role mailbox. This research does not silently
replace ADR-010's per-colleague address model; an ADR must select or compose the
identity variants. No email implementation is mandatory until real external
initiators exist.

### 4. Slack

**Official capability evidence**

- OpenAI already provides the
  [native Codex Slack integration](https://developers.openai.com/codex/third-party/slack)
  for repository-backed coding work.
- Slack's [Events API](https://docs.slack.dev/apis/events-api/) uses event IDs,
  requires fast acknowledgment, retries some failed deliveries, and is
  best-effort; durable enqueueing and deduplication are still product duties.
- Slack [interactivity](https://docs.slack.dev/interactivity/) supports buttons,
  modals, shortcuts, and other structured interactions.
- Slack request authenticity can be checked using
  [signed request verification](https://docs.slack.dev/authentication/verifying-requests-from-slack/).

**Suitable for**

- Work that genuinely starts in an engineering or operating team's Slack
  discussion.
- Shared clarification and status projection.
- Repository coding through the official Codex integration.
- A thin authenticated entry point to backend-controlled actions.

**Unsuitable for**

- Rebuilding the native Codex coding integration without a material product
  requirement.
- Owning legal task, artifact, or approval state.
- Assuming a button click alone is an immutable approval receipt.
- External intake when Slack Connect onboarding, licensing, retention, and app
  governance do not match the target parties.

**Decision:** Use the official integration for normal coding. Build a custom
adapter only for colleague semantics that the official Codex cloud-task path
would bypass, and only if observed users actually initiate the work in Slack.

### 5. Linear

**Official capability evidence**

- OpenAI already supports
  [Codex in Linear](https://developers.openai.com/codex/third-party/linear) for
  issue assignment, comments, progress, results, and repository work.
- Linear's [Agent APIs](https://linear.app/developers/agents) support a distinct
  agent identity, mentions, delegation while a human remains the issue owner,
  and agent sessions. These APIs are currently Developer Preview.
- Linear [webhooks](https://linear.app/developers/webhooks) include a delivery
  identifier and HMAC signature and retry failed deliveries.

**Suitable for**

- Durable delegated work with ownership, priority, state, comments, and links.
- A lightweight human-facing work-tracking projection where target users
  already use Linear.
- Human ownership plus a visible delegated agent identity.
- Machine/triage assignment and long-running progress.

**Unsuitable for**

- Arbitrary external public intake.
- Claiming that an issue comment is a formal legal approval without backend
  binding and authority checks.
- Depending deeply on preview Agent APIs without an isolation layer and exit
  path.
- Rebuilding native Codex repository delegation without an unmet requirement.

**Decision:** Linear is a strong lightweight candidate for internal delegated
work tracking, but it must remain replaceable and the product database and
artifact store remain authoritative under ADR-003. Selection still requires
proof that the target legal or operating team actually works there.

### 6. Jira Service Management

**Official capability evidence**

- Jira Service Management supports
  [workflow approval steps](https://support.atlassian.com/jira-service-management-cloud/docs/add-an-approval-to-a-workflow/)
  with configured approvers and approve/decline transitions in the documented
  company-managed service-space configuration.
- It provides controlled
  [portal access](https://support.atlassian.com/jira-service-management-cloud/docs/set-up-and-manage-portal-access/)
  and can
  [receive requests from email](https://support.atlassian.com/jira-service-management-cloud/docs/receive-requests-from-an-email-address/).
- Atlassian Forge supports
  [product events](https://developer.atlassian.com/platform/forge/events-reference/product_events/)
  and [asynchronous queues](https://developer.atlassian.com/platform/forge/runtime-reference/async-events-api/)
  with at-least-once semantics.
- Jira Service Management separately documents
  [queues](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-queues/)
  and [SLAs](https://support.atlassian.com/jira-service-management-cloud/docs/create-an-sla/);
  plan, project/space type, and tenant configuration must be verified rather
  than inferred from the product name alone.

**Suitable for**

- A formal service workflow with external requesters, queues, SLAs, approver
  groups, and governed transitions.
- Organizations already standardized on Jira Service Management.
- Cases where its portal and workflow controls avoid building equivalent
  product infrastructure.

**Unsuitable for**

- A lightweight Phase 0.5 experiment without real service-management needs.
- Teams that do not already use Jira and would bear its administration burden.
- Treating Jira Software alone as if it automatically includes all Jira
  Service Management portal and approval capabilities.

**Decision:** Evaluate against Linear, named document/approval systems, and a
custom-build option when the legal workflow becomes a real service desk. Do not
adopt it merely because it has the largest feature list, and do not assume its
built-in approval step satisfies G6 before a target-tenant test.

### 7. Version-bound authenticated review and approval capability

The requirement is a capability, not a preselected custom web application. It
must support:

- Inspection of the exact contract or artifact, version, diff, citations,
  evidence, and provenance.
- Current RBAC/authority checks and an explicit decision bound to that version.
- Expiry, replay resistance, immutable audit, and exception handling.
- A stable canonical work link that email, Teams, Slack, or a tracker may open.

Candidate implementations include an existing DMS/CLM or e-signature workflow,
SharePoint/Microsoft workflow, Jira Service Management, another governed system
already used by the customer, or a narrowly scoped custom web workbench. Each
named product must pass G1–G8; this study has not established a winner.

If a custom web surface is eventually selected, it must meet at least WCAG 2.2
AA and be tested with keyboard and assistive technology; see
[WCAG 2.2](https://www.w3.org/TR/WCAG22/). Its audit record should capture event
type, time, source, outcome, and associated identity, consistent with the audit
objectives in
[NIST SP 800-53 Rev. 5](https://csrc.nist.gov/Pubs/sp/800/53/r5/upd1/Final).

**Decision:** Run a buy/configure/build comparison. Build only the artifact and
control capabilities that named existing systems cannot safely provide.

### 8. Direct API, webhook, and scheduler

**Suitable for**

- Upstream systems, service principals, scheduled monitoring, and other
  non-human initiators.
- Structured payloads, explicit idempotency, accountable ownership, and
  deterministic routing.
- Avoiding lossy conversion from system events into prose.

**Unsuitable for**

- Human collaboration or approval without a companion surface.
- Calling an HTTP `202` response a completed business outcome.

AWS EventBridge Scheduler, for example, documents one-time, rate, and cron
schedules with retries and dead-letter queues; see
[What is EventBridge Scheduler?](https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html)
and [Manage schedules](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule.html).
Regardless of provider, machine triggers must feed the same canonical work
contract, carry an accountable owner, and project results to a human review
surface.

**Decision:** Preferred for machine/time initiation. It is a trigger path, not
a human channel.

### 9. Office document comments — evidence pending

Artifact-local comments are attractive for legal work because discussion stays
attached to the document. This study did not establish an official,
production-ready event and reply path that turns Word/Office comments into a
Codex-colleague channel with the required identity, delivery, and authorization
semantics. Attraction is not capability evidence.

**Decision:** Keep this candidate at E0 until an official API path and a tenant
spike demonstrate invocation, identity, delivery, threading, and reply behavior.

### 10. Microsoft Agent 365 — preview dependency

Microsoft Agent 365's agent identity—and therefore an agent-owned mailbox—is
associated with its Frontier preview; see
[Agent 365 SDK](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/agent-365-sdk)
and [Frontier](https://learn.microsoft.com/en-us/microsoft-agent-365/frontier).
The SDK separately documents notification capabilities; their production
maturity must be verified rather than inferred from the identity preview.
Combined with current custom-engine limitations in Office surfaces, the
identity/mailbox path is a watch item rather than a production dependency.

**Decision:** Keep source and notification interfaces replaceable. Run a tenant
spike when the relevant capabilities are production-ready; do not base Phase
0.5 on them.

### 11. Claw3D, voice, and SMS

No observed adoption, accessibility, latency, or outcome evidence in this repo
currently establishes Claw3D as a better channel than existing or custom
artifact-review alternatives. It may become a differentiated experience, but
it is E0 until tested with the real job and real users.

Voice and SMS are also poor defaults for artifact-rich legal work. They should
be evaluated only when field use, accessibility, or urgent-notification data
creates a named requirement. Until then, their identity, consent, compliance,
and transcription burdens are unnecessary.

**Decision:** Do not score or ship these surfaces based on imagined novelty.

## Exchange email through Outlook versus a Teams agent

| Question | Exchange email/shared mailbox | Teams agent |
|---|---|---|
| Natural initiator | External or internal sender with an email address | Authenticated employee or managed partner in an installed scope |
| Best interaction | Asynchronous intake, attachments, notification | Shared discussion, mention, clarification, cards, status |
| Broad Internet reach | Strong, but subject to filtering, attachment, and delivery policy | Weak |
| Multi-person conversational context | Weak; forwarding and reply chains fragment | Strong within the governed chat/channel |
| Stable role identity | Shared mailbox is one option; per-colleague address is a separate design | Explicit app/agent identity |
| Identity assurance | Sender/domain signals are not sufficient for high-risk authority | Platform activity supplies tenant/user identifiers; backend mapping and action-time authorization are still required |
| Delivery model | Duplicate/missed-event handling plus Graph reconciliation required | Activity/event delivery still needs durable receipt and idempotency |
| Artifact authority | Attachment is usually an intake copy | Files belong to SharePoint/OneDrive, not the chat transcript |
| High-risk approval | Poor; link to authenticated approval capability | Conditional; card can enter the flow, backend must bind exact action/version |
| Admin friction | Entra app consent, Exchange RBAC, mailbox/security operations | App install, Entra consent, Teams policies, RSC, tenant rollout |
| Existing vendor overlap | Outlook Copilot and OpenAI's ChatGPT Outlook app cover common personal assistance | Teams Copilot and OpenAI's ChatGPT Teams app cover search/common assistance |
| Correct role here | External intake and outbound notification | Internal collaboration and notification |

### When Exchange email is justified

Use it when all of the following are true:

- Real initiators include external parties or people who cannot use the product
  surface.
- Work naturally arrives as asynchronous correspondence or attachments.
- A role or per-colleague email identity has customer value.
- Message content is treated as untrusted input.
- Sensitive actions move to a version-bound authenticated approval capability.
- The adapter uses scoped permissions, durable receipt, idempotency, lifecycle
  renewal, and reconciliation.

### When Teams is justified

Use it when all of the following are true:

- Target users are authenticated employees or governed partners already using
  Teams for this work.
- Shared visibility, discussion, mentions, cards, or proactive updates reduce
  a measured workflow cost.
- The tenant will install and govern the app.
- Channel origin/type is preserved for audit, while current tenant, role,
  membership, and capability are revalidated for authorization.
- Artifacts remain in their authoritative document system and work state
  remains canonical in the product store.
- A pilot beats direct Codex and existing Microsoft capabilities.

### When both are justified

Build both only when two distinct, evidenced flows exist—for example:

```text
outside counsel -> selected email identity -> canonical work item
internal legal team -> Teams thread/card -> same canonical work item
```

They are not justified merely because both belong to Microsoft 365.

## Reference channel portfolio

```text
direct native Codex -----> comparison baseline outside governed flow

                              +---------------------------+
governed Codex client ------->|                           |
Teams / Slack --------------->| canonical intake +       |
email / portal -------------->| colleague control plane  |----> Codex execution
Linear / Jira --------------->|                           |
API / webhook / schedule ---->| identity, policy, state,  |
                              | audit, idempotency        |
                              +-------------+-------------+
                                            |
                              +-------------v-------------+
                              | source connectors         |
                              | SharePoint / DMS / S3     |
                              +-------------+-------------+
                                            |
                              +-------------v-------------+
                              | version-bound review and  |
                              | approval capability       |
                              +---------------------------+
```

No adapter may invoke Codex in a way that bypasses the same identity, policy,
state, audit, and approval rules used by every other adapter. Direct native
Codex remains outside this governed flow unless a defined integration makes it
the governed client shown above.

## Canonical channel envelope

Channel origin must not be reduced to disposable formatting metadata. It is a
trust, audience, retention, and capability boundary. At minimum, the normalized
event should preserve:

- Canonical work ID and tenant ID.
- Channel type, provider tenant/workspace, and adapter version.
- Original event/delivery ID, conversation/thread ID, message ID, and permalink.
- Authenticated actor principal, claimed sender, authentication strength, and
  current mapped product identity.
- Initiator type: owner, teammate, external person, service principal, or time.
- Audience and boundary: direct, group, standard/private/shared channel,
  external/guest membership, or mailbox recipients.
- Requested action, declared sensitivity, and required approval class.
- Source-qualified artifact references, hashes/versions where available, and
  attachment quarantine state.
- Received/provider timestamps, idempotency key, delivery attempts, and
  reconciliation cursor.
- Response binding: where acknowledgment, clarification, progress, and final
  result may safely be projected.

The colleague core may remain channel-independent in business logic, but policy
must remain channel-aware. A request from an external email address and the
same text from an authenticated Teams administrator are not equivalent inputs.

## Approval integrity

A channel interaction may open an approval flow. A valid approval receipt for
a high-impact action should include:

- Authenticated approver identity and tenant.
- Authorization/role checked at decision time.
- Exact work item, action, artifact ID, version or hash, and visible summary.
- Decision, timestamp, expiry, single-use nonce, and request correlation.
- Resulting side effect and immutable audit reference.

If a surface cannot provide and verify those fields, it is a notification or
navigation surface, not the approval authority. This rule applies equally to
email replies, Teams/Slack buttons, and tracker comments.

## Evidence plan

### 1. Work-event census

Collect a representative corpus of real target work events across at least one
complete business cycle before committing to a broad adapter roadmap. Set the
sample and observation window from actual traffic, workflow seasonality, and
failure risk; pre-register the limitation when volume is low. For each event
record:

- Initiator and intended recipient.
- Existing origin channel and participants.
- Artifact type and current system of record.
- Sensitivity and authorization need.
- Expected latency and failure cost.
- Collaboration, review, and approval steps.
- Whether direct Codex or a native vendor feature could complete the job.

### 2. Native baseline

Run representative jobs through direct Codex and applicable official native
integrations before writing a custom adapter. Measure the full accepted outcome,
not merely whether a prompt received an answer.

### 3. Thin spikes

Build only enough per candidate to test:

- Identity and tenant mapping.
- Thread/conversation continuity.
- Attachments and source references.
- Acknowledgment and outbound response.
- Admin consent and least privilege.
- Exact approval handoff.

Keep the colleague core and Codex execution path identical so the channel is
the variable under test.

### 4. Failure and abuse testing

Test duplicate and out-of-order events, crash before/after acknowledgment,
crash before/after a side effect, subscription expiry, permission revocation,
edited/deleted messages, attachment limits, malformed files, prompt injection,
throttling, reply spoofing, and approval replay.

### 5. Real-user pilot across complete workflow cycles

Choose pilot duration from actual workflow frequency and risk. It must be long
enough to include normal recurrence, handoffs, approval, recovery events, and
at least one support/on-call cycle; “four weeks” is not a universal validity
threshold.

Measure:

- Time to accepted artifact or completed business outcome.
- Completion and abandonment rate.
- Number of context corrections and channel handoffs.
- Weekly repeat usage by named users.
- Lost, delayed, and duplicated work.
- Unauthorized or incorrectly approved actions.
- Administration and engineering time per accepted task and per support event.
- Cost per accepted outcome.
- Accessibility failures and support incidents.

### 6. Pre-registered promotion rule

Define comparative thresholds after the native baseline exposes actual outcome
variance, traffic, and failure cost. Do not use a repository-wide “70 points”
or “10-point advantage.” Promotion requires:

- No hard-gate failure and evidence level E3 or higher.
- A material measured advantage over the simpler/native baseline, or a
  demonstrated mandatory reach/control that the baseline cannot provide.
- Confidence bounds or explicit low-volume limitations for comparative metrics.
- Zero lost accepted high-impact work items in the pilot.
- Zero duplicate irreversible effects.
- Valid approval evidence for every high-impact action.
- A documented operating owner, rollback/disable path, and exit criteria.

## AWS Leadership Principles reflection

This architecture review applies the official
[Amazon Leadership Principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)
as decision prompts, not as evidence of product-market fit.

| Principle | Reflection on the channel architecture |
|---|---|
| Customer Obsession | Start with real initiation and completion behavior, not a desire to integrate famous enterprise products. A channel is valuable only when it removes customer work or enables a customer who otherwise cannot participate. |
| Invent and Simplify | One canonical colleague core plus thin edges is simpler than separate Teams, email, Slack, and tracker agents. Removing the personal self-email loop is simplification, not lost ambition. |
| Dive Deep | Vendor feature lists are insufficient. Delivery semantics, permission scopes, channel membership, artifact ownership, retries, and approval evidence determine whether the design works. |
| Are Right, A Lot | Separate verified facts, architectural inference, and pilot evidence. Seek disconfirming data and refuse false precision before E3. |
| Frugality | Use direct Codex and official Slack/Linear integrations where they meet the job. Spend custom-engineering effort only on persistent colleague semantics that native products do not provide. |
| Insist on the Highest Standards | External email is untrusted; delivery can be duplicated, delayed, or missed; handlers are idempotent and reconcile loss where the provider supports it; high-risk approval is exact and replay-resistant; no chat transcript substitutes for an audit ledger. |
| Earn Trust | Use a disclosed colleague/app identity, preserve provenance, never impersonate the owner, and make authority boundaries visible to users. |
| Have Backbone; Disagree and Commit | Reject Teams or Outlook when the only justification is ecosystem familiarity. Once measured evidence selects a channel, commit to the thin, governed implementation and its exit criteria. |
| Bias for Action | Run reversible tenant spikes and a bounded pilot instead of debating a complete omnichannel platform or prematurely hardening every adapter. |
| Deliver Results | Optimize accepted artifacts, resolved work, and safe decisions—not messages sent, prompts handled, or integrations shipped. |

The strongest LP conclusion is: **work backwards from the real work event, not
forwards from Microsoft, Slack, or OpenAI product catalogs.**

## Implications for existing decisions

This research note does not silently rewrite accepted ADRs. It identifies the
following follow-up decisions:

1. **ADR-003 remains the state-authority invariant.** Product Postgres plus the
   authoritative artifact store remain the system of record. Linear, Jira, and
   chat channels are human-facing projections/edges unless a future ADR
   explicitly changes authority and defines conflict handling.
2. **ADR-009 remains directionally correct.** Channel adapters and source
   connectors must stay distinct. Add that channel origin is a trust and
   authorization boundary, not merely presentation metadata.
3. **ADR-017 should be reconsidered through a superseding ADR.** It is Accepted,
   so this note cannot amend it implicitly. “A channel is justified if and only
   if the initiator is not the user” is directionally useful but too absolute:
   a governed owner channel can also be justified when material collaborators
   or context already live there, or when it supplies a required workflow or
   control primitive. The proposed replacement test is:

   > Use direct Codex as the private-work baseline. Build a governed channel
   > only when the initiator is external/machine/time, cannot use direct Codex,
   > material shared context already lives in the channel, or the channel
   > supplies a required identity, delegation, intake, collaboration, or
   > governance primitive.

4. **ADR-010 needs both a trust correction and an identity-variant decision.**
   SPF, DKIM, and DMARC help
   authenticate domain/path alignment and resist spoofing; they do not establish
   that a specific person currently has authority to approve a legal action.
   ADR-010's catch-all SES per-colleague identity also differs materially from
   Phase 0.5 personal plus-addressing and this note's Exchange shared-mailbox
   candidate. A follow-up ADR must retain, narrow, supersede, or deliberately
   compose those three variants.
5. **The Phase 3 channel list should become an evidence-gated portfolio.** A
   listed adapter is a candidate, not a roadmap commitment. Each must name its
   interaction role, native baseline, gates, owner, evidence level, and exit
   criteria.
6. **Claw3D should remain a product hypothesis.** It can be selected after an
   artifact-review pilot, not because it is visually distinctive.

When the work-event census and E3 pilots are complete, distill the resulting
portfolio into an ADR and link it from this note.

## Current recommendation by phase

### Phase 0 / 0.5

- Keep Phase 0.5 as the deliberately unbuilt reference architecture described
  by its current README.
- Use direct Codex as the private-work comparison baseline; do not claim that
  this alone supplies the product's governed colleague semantics.
- Preserve the canonical adapter contract and prototype as reference evidence,
  not a supported personal self-email workflow.
- Do not productionize Teams or Exchange without an observed target workflow.
- Instrument work-event collection and define the legal pilot's exact jobs.

### First internal delegated-work pilot

- If the team already uses Linear, test it as the ADR-003 work-tracking
  projection while product Postgres remains authoritative.
- If the team coordinates this work in Teams, test a mention-only Teams agent
  against direct Codex, native Teams Channel Agent, and Linear.
- Compare named existing approval/document workflows before selecting a custom
  workbench for artifact review and final approval.
- Do not add Slack merely to claim omnichannel coverage.

### First external legal-intake pilot

- When outside counsel, vendors, or customers are real initiators, compare the
  ADR-010 per-colleague address, an Exchange role/shared mailbox, and a service
  portal against the defined identity and intake job.
- Compare it with a structured web form or Jira Service Management portal.
- Treat every incoming message and attachment as untrusted.
- Route final approval to the selected version-bound authenticated capability.

### Production portfolio

Promote only the channels that pass all gates at E3. It is acceptable—and
preferable—for the result to be two or three proven paths rather than a broad
but shallow omnichannel platform.

## Primary-source index

The sources below are grouped for auditability. All vendor capability sources
are first-party; RFC, NIST, and W3C sources are normative or authoritative.

### OpenAI

- [Codex SDK](https://developers.openai.com/codex/codex-sdk)
- [Use Codex in Slack](https://developers.openai.com/codex/third-party/slack)
- [Use Codex in Linear](https://developers.openai.com/codex/third-party/linear)
- [ChatGPT Workspace Agents](https://help.openai.com/en/articles/20001143/)
- [Trigger Workspace Agent runs](https://developers.openai.com/workspace-agents/trigger-runs)
- [Plugins in ChatGPT and Codex](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex)
- [Outlook Email and Calendar app for ChatGPT](https://help.openai.com/en/articles/12512241-outlook-email-and-calendar-app-for-chatgpt)
- [Microsoft Teams app for ChatGPT](https://help.openai.com/en/articles/12552368-microsoft-teams-app-for-chatgpt)

### Microsoft Teams and agents

- [Microsoft 365 Agents SDK overview](https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview)
- [Teams SDK AI integrations](https://learn.microsoft.com/en-us/microsoftteams/platform/teams-sdk/in-depth-guides/ai-integrations/overview)
- [Agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview)
- [Microsoft 365 Copilot extensibility known issues](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/known-issues)
- [Resource-specific consent](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent)
- [Proactive Teams messages](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/send-proactive-messages)
- [Apps for shared and private channels](https://learn.microsoft.com/en-us/microsoftteams/platform/build-apps-for-shared-private-channels)
- [Teams bot file handling](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/bots-filesv4)
- [Manage apps in Teams](https://learn.microsoft.com/en-us/microsoftteams/manage-apps)
- [Manage app consent](https://learn.microsoft.com/en-us/microsoftteams/manage-consent-app-permissions)
- [Teams apps for external users](https://learn.microsoft.com/en-us/microsoftteams/apps-external-users)
- [Teams guest access](https://learn.microsoft.com/en-us/microsoftteams/guest-access)
- [Teams shared channels](https://learn.microsoft.com/en-us/microsoftteams/shared-channels)
- [Copilot in Teams chats and channels](https://support.microsoft.com/en-us/teams/copilot/how-to-use-microsoft-365-copilot-in-teams-chats-and-channels)
- [Teams Channel Agent FAQ](https://support.microsoft.com/en-us/teams/platform/frequently-asked-questions-about-agents-in-microsoft-teams)
- [Create a Teams Channel Agent](https://support.microsoft.com/en-US/Teams/chat-channels/how-to-create-a-channel-agent-for-a-teams-channel)
- [Microsoft Agent 365 SDK](https://learn.microsoft.com/en-us/microsoft-agent-365/developer/agent-365-sdk)
- [Microsoft Agent 365 Frontier](https://learn.microsoft.com/en-us/microsoft-agent-365/frontier)

### Exchange, Microsoft Graph, and email security

- [About shared mailboxes](https://learn.microsoft.com/en-us/microsoft-365/admin/email/about-shared-mailboxes)
- [Exchange recipient permissions](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-permissions-for-recipients)
- [Microsoft Graph change notifications](https://learn.microsoft.com/en-us/graph/change-notifications-overview)
- [Change-notification lifecycle events](https://learn.microsoft.com/en-us/graph/change-notifications-lifecycle-events)
- [Shared and delegated Outlook folders](https://learn.microsoft.com/en-us/graph/outlook-share-messages-folders)
- [Message delta query](https://learn.microsoft.com/en-us/graph/delta-query-messages)
- [Microsoft Graph webhook delivery](https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks)
- [Microsoft Graph sendMail](https://learn.microsoft.com/en-us/graph/api/user-sendmail)
- [Exchange Application RBAC](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac)
- [Microsoft email authentication](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-about)
- [Microsoft anti-phishing policies](https://learn.microsoft.com/en-us/defender-office-365/anti-phishing-policies-about)
- [Email prompt-injection protection](https://learn.microsoft.com/en-us/defender-office-365/step-by-step-guides/prompt-injection-protection-defender-for-office-365)
- [Copilot in Outlook](https://support.microsoft.com/en-US/Outlook/copilot-outlook/chat-with-copilot-in-outlook)

### Slack, Linear, and Atlassian

- [Slack Events API](https://docs.slack.dev/apis/events-api/)
- [Slack interactivity](https://docs.slack.dev/interactivity/)
- [Verify Slack requests](https://docs.slack.dev/authentication/verifying-requests-from-slack/)
- [Linear Agents](https://linear.app/developers/agents)
- [Linear webhooks](https://linear.app/developers/webhooks)
- [Jira Service Management workflow approvals](https://support.atlassian.com/jira-service-management-cloud/docs/add-an-approval-to-a-workflow/)
- [Jira Service Management portal access](https://support.atlassian.com/jira-service-management-cloud/docs/set-up-and-manage-portal-access/)
- [Jira Service Management email intake](https://support.atlassian.com/jira-service-management-cloud/docs/receive-requests-from-an-email-address/)
- [Jira Service Management queues](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-queues/)
- [Jira Service Management SLAs](https://support.atlassian.com/jira-service-management-cloud/docs/create-an-sla/)
- [Atlassian Forge product events](https://developer.atlassian.com/platform/forge/events-reference/product_events/)
- [Atlassian Forge asynchronous events](https://developer.atlassian.com/platform/forge/runtime-reference/async-events-api/)

### Protocol, security, accessibility, and operations

- [RFC 5321 — SMTP](https://datatracker.ietf.org/doc/html/rfc5321)
- [RFC 5322 section 3.6.4 — message identification](https://datatracker.ietf.org/doc/html/rfc5322#section-3.6.4)
- [NIST SP 800-63B authenticators](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/)
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/Pubs/sp/800/53/r5/upd1/Final)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [AWS EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html)
- [AWS EventBridge Scheduler — manage schedules](https://docs.aws.amazon.com/scheduler/latest/UserGuide/managing-schedule.html)
- [Amazon Leadership Principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)
