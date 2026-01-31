# C12 — FORTUNETELL BACKEND SPEC (CONSOLIDATED, V10 + ADDENDUM 10.1 COMPLIANT)
Final v1 Backend Reference / Implementation-First Document  
Covers: API Contract, Envelopes, Projection Taxonomy, DB Runbook, Env Vars, Build/Test/Run/Migrate, Ops Notes  
Scope: MVP backend (Fastify + Prisma + Render PostgreSQL v18)  
Status: Authoritative

--------------------------------------------
# 1. REST API v1 CONTRACT (UNIFIED, STABLE, FROZEN)

## 1.1 Global Response Envelopes

### Success
{
  "data": <payload>
}

### Error
{
  "error": {
    "type": STRING_CONSTANT,
    "message": HUMAN_READABLE,
    "details": OBJECT | null
  }
}

Rules:  
• Top-level keys: data OR error, never both.  
• Errors never throw raw exceptions; always ApiError → reply.error.  
• Dates: ISO 8601 UTC.  
• Numbers: native JSON numbers (no strings).  
• IDs: integers.  
• Nullables must be explicit null.

---

## 1.2 Authentication

### POST /auth/login  
Input: { email, password }  
Output: { token, user }  
Errors: AUTH_INVALID_CREDENTIALS, AUTH_INACTIVE_ACCOUNT  

### POST /auth/register  
Input: { email, password }  
Output: { user }  
Errors: AUTH_EMAIL_EXISTS  

Token rules:  
• Signed with SUPABASE_JWT_SECRET  
• Required on all protected routes via Authorization: Bearer <token>

---

## 1.3 Accounts

### GET /accounts  
Returns all accounts for the authenticated user.

### POST /accounts  
Input: { name, startBalance, includeInProjection }  
Output: created account.

### PATCH /accounts/:id  
Input: partial update.  
Output: updated account.

### DELETE /accounts/:id  
Errors: ACCOUNT_NOT_FOUND, ACCOUNT_INVALID_REQUEST.

---

## 1.4 Transactions

### GET /transactions  
Returns all user transactions.

### POST /transactions  
Required: date, amount, direction (credit|debit), transType, optional recurrence.

### PATCH /transactions/:id  
Implements V10 recurrence semantics (edit-single vs edit-future).

### DELETE /transactions/:id  
Errors: TRANSACTION_NOT_FOUND, TRANSACTION_INVALID_REQUEST, RECURRENCE_CONFLICT.

---

## 1.5 Budgets

### GET /budgets  
Returns all budgets.

### POST /budgets  
Fields: name, startDate, optional endDate, categories, allocations.

### PATCH /budgets/:id  
Must preserve deterministic projection compatibility.

### DELETE /budgets/:id  
Errors: BUDGET_NOT_FOUND, BUDGET_INVALID_RANGE.

---

## 1.6 Projection

### POST /projection/run  
Input: accounts[], transactions[], startDate, endDate, threshold  
Output: deterministic daily ledger per V10.

Errors: PROJECTION_INVALID_REQUEST, PROJECTION_ENGINE_ERROR.

Rules:  
• Deterministic (same input → same output).  
• All dates normalized to JS Date before engine entry.  
• Engine never mutates inputs.

--------------------------------------------
# 2. ERROR ENVELOPE & ERROR MODEL

## 2.1 ApiError Invariants
• All errors become reply.error(ApiError).  
• ApiError fields: type, message, details (optional).  
• No raw Fastify errors to client.

## 2.2 Error Types (v1 contract)
AUTH_INVALID_CREDENTIALS  
AUTH_EMAIL_EXISTS  
ACCOUNT_NOT_FOUND  
ACCOUNT_INVALID_REQUEST  
TRANSACTION_NOT_FOUND  
TRANSACTION_INVALID_REQUEST  
RECURRENCE_CONFLICT  
BUDGET_NOT_FOUND  
BUDGET_INVALID_RANGE  
PROJECTION_INVALID_REQUEST  
PROJECTION_ENGINE_ERROR  
INTERNAL_SERVER_ERROR  

Error types are frozen for v1.

--------------------------------------------
# 3. PROJECTION ERROR TAXONOMY (V10 + ADDENDUM)

## 3.1 PROJECTION_INVALID_REQUEST  
Caused by:  
• startDate > endDate  
• missing accounts  
• invalid fields  
• invalid recurrence  
• invalid number formats  
• non-ISO dates  
• schema violations  

Envelope:
{
  "error": {
    "type": "PROJECTION_INVALID_REQUEST",
    "message": "...",
    "details": { field issues }
  }
}

---

## 3.2 PROJECTION_ENGINE_ERROR  
Caused by:  
• impossible negative spans  
• recurrence expansion failure  
• invariant violation  

Envelope:
{
  "error": {
    "type": "PROJECTION_ENGINE_ERROR",
    "message": "Engine failure",
    "details": null
  }
}

--------------------------------------------
# 4. DATABASE SCHEMA RUNBOOK (POSTGRES v18 on Render)

## 4.1 Requirements
• Database: fortunetell_db  
• Provider: PostgreSQL v18  
• Managed by Prisma migrations  
• Render Starter Plan (~$7/month)  

## 4.2 Migration Workflow

Local:
npm run prisma:generate  
npx prisma migrate deploy  
npx prisma db pull  

Render:
• Uses internal DB URL  
• prisma:generate runs during deploy  
• No auto-migration triggered by app logic

## 4.3 Backups
• Render automatic backups daily  
• No custom backup logic needed for MVP

--------------------------------------------
# 5. ENVIRONMENT VARIABLES (AUTHORITATIVE)

## 5.1 Required
DATABASE_URL  
SUPABASE_JWT_SECRET  
SUPABASE_JWT_ISSUER  
JWT_SECRET  
NODE_ENV  
PORT (Render-managed)

## 5.2 Optional  
None for MVP.

Rules:  
• Only one DB variable exists: DATABASE_URL  
• JWT vars remain valid and required  
• No Supabase DB vars remain

--------------------------------------------
# 6. BUILD / TEST / RUN / MIGRATE WORKFLOW

## 6.1 Build
npm run build  

## 6.2 Dev Run
npm run dev  

## 6.3 Production Run
npm run start (Render)

## 6.4 Tests
npm test  
• Unit + integration  
• Postgres-only test environment  
• resetTestDb truncates tables

## 6.5 Migrations
Local:
npx prisma migrate deploy  

Render:
Handled via deploy pipeline

--------------------------------------------
# 7. OPERATIONAL NOTES & CONSTRAINTS

## 7.1 Projection Engine
• Deterministic  
• Pure computation  
• No mutation  
• Dates normalized beforehand

## 7.2 Authentication
• JWT-only  
• Stateless  
• No refresh tokens  
• No social login

## 7.3 Deployment Notes
• Starter plan may have momentary cold starts  
• Internal DB URL only reachable from Render backend  
• External DB URL only for local dev & migrations

## 7.4 Logs
• Render retains rolling logs  
• No background workers in MVP

## 7.5 MVP Scope Lock
• No webhooks  
• No multi-currency  
• No advanced recurrence editing  
• No roles  
• No account linking  
• v1 API contract frozen as defined above
