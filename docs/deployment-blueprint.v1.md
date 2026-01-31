Deployment Blueprint (Render / Vercel)
Objectives

Define a deterministic, reproducible backend deployment strategy.

Eliminate ambiguity around environment variables, health checks, migrations, restart behavior, and logging.

Ensure zero-downtime redeploys and safe rollback paths.

Prepare the system for staging and production (C11–C12).

1. Infrastructure Overview (MVP v1)

Backend: Node 20 Fastify monolith deployed on Render.
Database: The system uses a single PostgreSQL database on Render (Starter plan). The only required DB variable is DATABASE_URL.
Frontend: Next.js on Vercel (not covered here).
CI/CD: GitHub Actions handles lint → build → unit → integration → contract tests. Deploy only on green.

2. Environment Variable Manifest (Authoritative List)
Backend App Vars
Variable	Required	Description
NODE_ENV	Yes	Must be production in Render deployments.
PORT	Yes	Render assigns dynamically; Fastify must bind to it.
DATABASE_URL	Yes	The only required DB variable; Render PostgreSQL connection string (Starter plan).
SUPABASE_JWT_SECRET	Yes	Used for /auth/me token verification.
SUPABASE_JWT_ISSUER	Yes	Supabase issuer string (auth context).
ENABLE_PERF_LOGS	Optional	Enables timing & slow-query logging (default: false).
LOG_LEVEL	Optional	One of info, warn, error, debug. Default: info.
Runtime Behavior Flags (Optional)
Variable	Default	Meaning
ENABLE_SLOW_QUERY_WARNINGS	true	Emits warn logs on operations > 500ms.
ENABLE_HEALTH_PROBES	true	Allows /health route exposure.
ENABLE_REQUEST_LOGS	false	Enable full request logs only for staging.
3. Health, Liveness, Readiness Probes
/health (Fastify route)

Status: 200 OK when:

Process started

Fastify server listening

Prisma client initialized

Does NOT require DB connectivity (DB health is a dependency probe, not a liveness probe).

Payload (example):

{
  "data": {
    "status": "ok",
    "version": "v1",
    "uptime": 123.45
  }
}

Readiness Probe (Render-native)

Render does not have a first-class readiness probe, so readiness must be faked via a startup delay:

Fastify starts → /health responds OK

Prisma connection is tested at startup; if fail → process crash → restart → no deploy success

4. Database Migration Strategy (Prisma)
Guiding Rules

Migrations must run BEFORE serving traffic.

Never run prisma db push in production.

Only deploy generated SQL migrations from Prisma Migrate.

Deployment Flow:

CI: Run full tests on PR → merge to main on green.

Render deploy hook triggers deployment.

Render build step runs:

npm run prisma:generate


Render start command executes:

npx prisma migrate deploy
node dist/server.js


If migrations fail → start fails → deployment does not replace the active instance.

Rollback Plan

To rollback:

Select last successful deployment in Render → redeploy.

If migration compatibility is broken:

Apply reverse migration manually, OR

Restore the Render PostgreSQL database from automatic backup.

5. Zero-Downtime Deployment Strategy (Render)

Render uses a blue–green deployment model:

Build in isolation.

Run migrations.

Start new app instance.

Health check passes → traffic flips.

Requirements to guarantee zero downtime:

/health must return immediately once Fastify is ready.

No long-running startup logic.

All migrations must be idempotent and fast (<1 sec ideally).

ProjectionEngine must not compute at startup (lazy load only).

6. Logging & Metrics Plan (Production-Safe)
Logging Rules

Only structured logs, no stack traces to clients.

Log categories:

startup

projection_run

prisma_failure

auth_context

error_global

slow_query

No PII. No raw tokens.

Render Log Streams

Raw logs accessible via dashboard.

Aggregation minimal.

For alerts → use external APM or Logtail (optional).

7. Deployment Checklist (Human-Executable)

Before each deploy:

main branch green (unit + integration + contract tests).

Migration SQL reviewed.

ENV vars validated in Render dashboard.

Staging deployment tested (C11).

Feature flags confirmed:

ENABLE_PERF_LOGS off for production

ENABLE_SLOW_QUERY_WARNINGS on

ENABLE_REQUEST_LOGS off

After deploy:

Hit /health.

Test /auth/me with valid and invalid token.

Run small projection with known inputs.

Verify logs show no unexpected failures.

8. Risk Model & Mitigation
Risk	Mitigation
Prisma migration failure	Deploy rollback + Render PostgreSQL backup recovery
Cold-boot latency spike	Disable expensive startup logic; lazy-load projection
DB outage	All Prisma errors already mapped to DEPENDENCY_FAILURE
Token validation failures	Auth-context guardrails implemented in C7.B
Envelope crash	Envelope plugin hardened in C7.B
9. Outputs Required for C7.D Completion

This phase produces two artifacts:

A versioned deployment blueprint file in the repo:
backend/docs/deployment-blueprint.v1.md

A Codex summary capturing the exact file creation.
