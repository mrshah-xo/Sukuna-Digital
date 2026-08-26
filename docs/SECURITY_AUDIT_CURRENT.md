# Current Security Audit

Audit date: 2026-08-25

## Findings

### HIGH: Unauthenticated Transport Route Read

- Affected file: `sukuna-platform/apps/web/app/api/transport/[routeId]/status/route.ts`
- Cause: GET previously loaded `BusRoute.findById(params.routeId)` without `auth()`, role checks, or school scoping.
- Risk: any caller with a route id could read transport status/location.
- Remediation: moved GET onto `apiHandler`, required authenticated roles, validated ObjectId, and queried by `{ _id, schoolId }`.
- Status: fixed.

### HIGH: Cross-School Transport Route Update

- Affected file: `sukuna-platform/apps/web/app/api/transport/[routeId]/status/route.ts`
- Cause: PATCH previously loaded by route id only and allowed any ADMIN/DRIVER session to update it.
- Risk: a driver or admin from one school could update another school's route if they knew the ObjectId.
- Remediation: moved PATCH onto `apiHandler`, required school tenant, scoped query by `schoolId`, and restricted drivers to their assigned route.
- Status: fixed.

### MEDIUM: Plaintext OTP Logging

- Affected file: `sukuna-platform/apps/web/src/services/otp.service.ts`
- Cause: development SMS provider printed the OTP value.
- Risk: OTPs could leak into logs.
- Remediation: provider now logs only that an OTP was requested.
- Status: fixed.

### MEDIUM: Build Ignored TypeScript And ESLint Failures

- Affected file: `sukuna-platform/apps/web/next.config.js`
- Cause: `ignoreDuringBuilds` and `ignoreBuildErrors` were enabled.
- Risk: production builds could ship known type or lint problems.
- Remediation: removed both suppressions.
- Status: fixed.

### MEDIUM: Global Student/Teacher ID Uniqueness Conflicted With Tenant Model

- Affected files: `src/models/student.model.ts`, `src/models/teacher.model.ts`
- Cause: `studentId` and `teacherId` were globally unique even though APIs enforce uniqueness per school.
- Risk: one school could block another school from using the same local ID.
- Remediation: replaced field-level global unique indexes with compound `{ schoolId, studentId }` and `{ schoolId, teacherId }` indexes.
- Status: fixed. Existing databases may need old unique indexes dropped manually.

### HIGH: Experimental Passport Fallback Secret

- Affected file: `backend/src/config/passport.ts`
- Cause: experimental backend contains `fallback_secret`.
- Risk: if this backend is promoted without changes, JWT verification could use a known secret.
- Remediation: not changed in production path because `backend/` is not active. Must be fixed before Express is used.
- Status: remaining risk in experimental code.

### INFORMATIONAL: Payment APIs Not Active

- Affected files: payment models exist, but active payment API routes were not found.
- Risk: payment security cannot be fully verified until real endpoints exist.
- Remediation: enforce admin/principal-only verification, audit logging, server-authoritative amounts, and school-scoped proof access when implemented.
- Status: not applicable to current active API.
