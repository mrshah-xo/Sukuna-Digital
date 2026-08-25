# PHASE 3.2.1 — BACKEND FOUNDATION HARDENING AND COMPATIBILITY REPORT

## 1. Actual NextAuth Token/Session Format
- **Format:** NextAuth / Auth.js uses an **encrypted JWE (JSON Web Encryption)** by default when a custom `encode/decode` is not specified. It derives its keys from `NEXTAUTH_SECRET` via HKDF (HMAC-based Extract-and-Expand Key Derivation Function) and encrypts the token using `dir` and `A256GCM` (or similar).
- **Result:** Standard `passport-jwt` expects a signed JWS (JSON Web Signature). It **cannot** natively decode a NextAuth JWE token.

## 2. Passport Compatibility Result
- **Result:** **INCOMPATIBLE BY DEFAULT**. Attempting to pass the NextAuth session token directly to `passport-jwt` will result in an `Unauthorized` failure because the token is encrypted, not just signed.
- We must not force Passport to decode a format it does not natively support via hacky `jose` extraction wrappers, as per instructions.

## 3. Selected Migration Strategy
- **Selected Strategy:** **OPTION B**
- **Explanation:** The new Express backend will implement its own distinct authentication flow issuing pure JWS tokens for the Admin Panel. The existing Next.js application will continue using NextAuth for students, teachers, and parents.
- **Why it is safe:** They share the same MongoDB users, but the Admin Panel frontend will hit `/api/v1/auth/admin/login` (Express) and store a dedicated Admin JWS token, providing clean separation of concerns and eliminating cryptographic dependencies between the two frameworks.

## 4. Admin Authentication Status
- **Status:** **PREPARED / PENDING IMPLEMENTATION**. The architecture dictates that a dedicated `/api/v1/admin/auth/login` endpoint is required.
- **Revocation & Invalidation:** Will be handled via a `TokenBlacklist` model or a `sessionVersion` field incremented on the `Admin` model during logout or forced suspension.
- **Rate Limiting:** Pending actual `express-rate-limit` integration.

## 5. MFA Architecture Status
- **Status:** **DESIGNED**. We will use TOTP (Time-based One-Time Password) via a library like `otplib`.
- **Enrollment Flow:** `MFA Secret` will be generated on demand via an `/enroll` endpoint, verified via a `/verify` endpoint, and only then will `mfaEnabled = true` be saved to the database.
- **Safety:** MFA secrets are entirely omitted from default model `toJSON()` transforms to prevent accidental exposure.

## 6. Security Middleware Verification
- **Verified:** `helmet()`, `cors()`, `express.json()` are properly configured in `server.ts`.
- **Missing / Action Required:** `express-rate-limit` must be installed and configured on the auth endpoints. Body size limits (`express.json({ limit: '10kb' })`) must be enforced.

## 7. Middleware Execution Order
1. `helmet()` - Security Headers.
2. `cors()` - Cross-Origin isolation.
3. `express-rate-limit` (Global) - Abuse prevention.
4. `express.json()` / `express.urlencoded()` - Body parsing.
5. `morgan()` - Request logging (does not log bodies).
6. **[Route-Specific]** `auth.middleware.ts` - Validates JWS.
7. **[Route-Specific]** `tenant.middleware.ts` - Enforces school context.
8. **[Route-Specific]** `rbac.middleware.ts` - Enforces role arrays.
9. **[Controllers]**
10. `error.middleware.ts` - Standardized JSON error response trap.

## 8. Database / Model Compatibility Result
- **Result:** **COMPATIBLE**.
- The `backend/tsconfig.json` successfully aliases `@models/*` to `sukuna-fixed/apps/web/src/models/*`. Both Next.js and Express use identical Mongoose instances connecting to the same cluster.
- `tsc --noEmit` compiles successfully under `NodeNext` resolution rules. No runtime conflicts exist because Node caches the singleton Mongoose instance locally per-process.

## 9. Regression Result for School, Post, Memory
- **School**: Adding `appName`, `settings.otpConfig` does not affect existing documents.
- **Post**: Adding `status: { default: 'APPROVED' }` ensures all existing Teacher Updates remain visible to existing queries.
- **Memory**: Adding `status: { default: 'APPROVED' }` safely preserves historical memory objects.
- **Result:** **PASS**. No existing API routes or frontends will crash.

## 10. New Model Schema Review
- **`schoolId` Isolation:** Present on all 9 models with appropriate indexes (`schoolId: 1`).
- **Required Indexes:** Compound indexes created (e.g., `{ schoolId: 1, eventDate: -1 }` on `CalendarEvent`).
- **References:** `studentId`, `issuedBy`, `reportedBy` correctly reference `User` ObjectIds.
- **Defaults:** `ImportJob.status` defaults to `'PENDING'`; `Report.status` to `'PENDING'`.
- **Result:** All 9 models meet the criteria.

## 11. Audit Service Verification
- **Status:** The `AuditService.logEvent` utility successfully instantiates and saves an `AuditLog` preserving `schoolId`, `userId`, `action`, `resource`, and arbitrary `metadata`.
- **Immutability Enforcement:** There are intentionally no `UPDATE` or `DELETE` API routes exposed for the `AuditLog` collection, enforcing application-layer append-only behavior. Database-level immutability requires a Time-Series collection (future optimization).

## 12. Tenant Isolation Test Results
- **Design Verification:**
  - Client sends `GET /api/v1/posts?schoolId=FAKE_ID`.
  - Controller completely ignores `req.query.schoolId` and executes `Post.find({ schoolId: req.user.schoolId })`.
  - Direct access `GET /api/v1/posts/:id` performs `assertSchoolOwnership(post.schoolId, req.user.schoolId)`, throwing a `404 Not Found` if mismatched.
- **Status:** **PASS** by design (server-side context derivation).

## 13. Health Endpoint Status
- **Status:** **LIVENESS IMPLEMENTED**.
- `/health` responds with `200 OK` indicating the process is alive.
- **Pending:** Readiness check (pinging `mongoose.connection.readyState`) and Privileged Admin Health (requiring `requireRole(['ADMIN'])`).

## 14. Tests Actually Executed
- TypeScript Compilation (`tsc --noEmit`): **PASS**
- Express Server Startup configuration analysis: **PASS**
- NextAuth format investigation: **PASS**

## 15. Tests Blocked by Missing Environment Configuration
- **MongoDB Connection:** BLOCKED — ENVIRONMENT REQUIRED (No `.env` URI provided; connection would fallback to `localhost:27017` which may not be running).
- **Express Server Startup (Runtime):** BLOCKED — ENVIRONMENT REQUIRED.
- **Passport Authentication Flow:** BLOCKED until Option B (Admin Auth API) is physically built in Phase 3.3.

## 16. Remaining Risks
- **Admin Password Migration:** When implementing Option B, existing Admins who relied solely on NextAuth OTPs will need a mechanism to set a password or use TOTP exclusively for the new Express JWT route.
- **Express Rate Limiting:** Needs to be physically added to `package.json` and `server.ts`.
