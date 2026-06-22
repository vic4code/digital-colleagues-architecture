# Phase 4 — Terraform / IaC Deployment

**Status:** ⏳ Planned. Cross-cuts all phases; this folder is for the production-grade artifact.

## Goal

Every piece of infrastructure described in Phases 1–3 expressed as Terraform,
versioned, reviewed, and deployable to multiple environments without manual steps.

## Scope

- **Modular Terraform** — one module per logical component (orchestrator, worker pool, db, queues, secrets, audit, channel adapters)
- **Multi-environment** — dev / staging / prod with the same modules, different inputs
- **Pipeline** — GitHub Actions or equivalent: plan on PR, apply on merge to main
- **Secrets** — managed via Secrets Manager / Parameter Store, never in tfstate
- **State backend** — S3 + DynamoDB lock, encrypted, access-controlled
- **Policy as code** — OPA / Sentinel guardrails (no public buckets, mandatory tags, KMS-encrypted DBs, etc.)
- **DR** — multi-region capable, documented runbook for region failover

## Why this is a separate phase

Phases 1–3 will use Terraform from day one — you don't ship to AWS without it.
But **production-grade IaC** (modules, multi-env, pipelines, policy, DR) is its
own body of work that follows the architecture, not leads it.

The order is: design the architecture → write enough Terraform to ship it → harden
the Terraform once the design is stable. Trying to design perfect modules before
the architecture settles is a classic time sink.

## Layout (planned)

```
terraform/
├── modules/
│   ├── orchestrator/
│   ├── worker-pool/
│   ├── postgres/
│   ├── queues/
│   ├── object-store/
│   ├── secrets/
│   ├── audit-log/
│   └── channel-adapter/
├── envs/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── policies/
```

Code lives in a separate repo (`prjt-digital-office-infra` or similar) — this repo
only documents the structure and decisions.
