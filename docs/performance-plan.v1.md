# C7.C — Performance Profiling & Optimization Plan (Design-Only)

## Objectives
- Establish a lightweight, repeatable process to identify and address backend performance bottlenecks without changing behavior.
- Focus on high-traffic routes and data-heavy code paths (projection, transactions, budgets, accounts).
- Keep instrumentation minimal and safe for production; no PII in logs.

## Scope (Backend Only)
- Fastify API (routes, plugins).
- Domain services and Prisma data access.
- ProjectionEngine and ProjectionService hot paths.
- Excludes frontend and non-API concerns.

## Guardrails
- No API surface changes (spec is frozen).
- No new error types.
- No envelope changes.
- Instrumentation must be toggleable via env flags where applicable.

## Workstreams
1) **Baseline Metrics & Instrumentation**
   - Add opt-in timing logs around heavy routes (transactions list, projection run, budgets list).
   - Capture request latency buckets (p50/p95/p99) via hosting/APM if available.
   - Ensure Prisma logging is disabled by default; enable query-level logging only in staging.
   - Add minimal counters for error types and slow-query warnings.

2) **Hot Path Profiling**
   - Projection:
     - Measure time spent in `ProjectionService.resolveData`, `ProjectionEngine.generateProjection`, and DB fetches.
     - Track counts of accounts/transactions per request to correlate size vs latency.
   - Transactions:
     - Measure list/query latency vs pagination params.
     - Identify any scans caused by missing filters.
   - Budgets/Accounts/Categories:
     - Measure list endpoints under typical pagination to ensure stable latency.

3) **Query Audit & Guardrails**
   - Verify all Prisma queries are scoped by userId and use appropriate filters.
   - Identify any unbounded findMany calls; plan to add pagination/limits if missing (C9).
   - Document any N+1 patterns for later remediation (C9).

4) **Caching & Reuse (Design-Only)**
   - Consider read-through caching for projection inputs (accounts/transactions) keyed by user + date range.
   - Evaluate ProjectionEngine cache effectiveness; plan eviction/invalidations tied to write operations.
   - Defer implementation to a later batch after profiling confirms benefit.

5) **Resource Limits & Timeouts**
   - Define soft thresholds for request processing (e.g., log warnings >500ms).
   - Rely on hosting timeouts for hard limits; document required settings (e.g., Fastify server timeout, reverse proxy).
   - For long-running queries, prefer pagination and smaller windows in future work.

6) **Testing & Benchmarks**
   - Maintain perf test harnesses under `src/tests/perf/` for projection, transactions, budgets.
   - Run targeted perf tests in staging using representative data volumes (e.g., 1k–5k transactions).
   - Track regression thresholds (latency budgets) and alert on significant deviations.

7) **Observability & Logging Hygiene**
   - Ensure structured logging on error paths includes: operation, errorType, message, and minimal request context (no PII).
   - Add slow-query warnings with elapsed time and operation name only.
   - Standardize log levels: info for start/stop (if used), warn for slow, error for failures.

8) **Rollout & Safety**
   - Keep instrumentation behind env flags (e.g., `ENABLE_PERF_LOGS=true`).
   - Default to off in production until validated.
   - Document rollback steps: disable flags, revert instrumentation commits if needed.

## Deliverables (for future batches)
- Instrumentation hooks (timers/logs) for target routes/services.
- Perf benchmarks results for critical paths.
- Recommendations for C9 optimization sprint (query tuning, pagination enforcement, caching).

## Non-Goals
- No API/contract changes.
- No DB schema changes.
- No caching or query rewrites in this batch.
- No frontend performance work.
