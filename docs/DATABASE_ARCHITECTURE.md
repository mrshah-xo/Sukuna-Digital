# Database Architecture

Audit date: 2026-08-25

## Database

MongoDB via Mongoose. The active connection helper is `sukuna-fixed/apps/web/src/lib/mongodb.ts`.

## Tenant Boundary

Most product collections include `schoolId`. API routes must derive the school id from the authenticated session and query through that trusted value.

## Active Models

- `School`: school identity, branding, OTP settings, notification settings.
- `User`: shared account record for all roles; owns phone, role, status, preferences, and school.
- `Student`: student profile linked to `User`; school-scoped student id, grade, section, bus route, parent.
- `Teacher`: teacher profile linked to `User`; school-scoped teacher id, subjects, assigned classes.
- `Admin`: admin/principal profile linked to `User`; permissions.
- `Parent`: parent profile and children relationships.
- `Attendance`: student attendance records scoped by school/date/student.
- `Assignment`: assignments scoped by school.
- `Notice`: notices scoped by school.
- `Post`: Sukuna Book/social posts scoped by school.
- `Notification`: in-app/external notification records scoped by school and user.
- `AuditLog`: security/administrative activity log scoped by school.
- `Memory`: school memory/gallery content.
- `LiveSession`: live teacher/session records.
- `BusRoute`: transport route, assigned driver, stops, assigned students, tracking status.
- `Otp`: hashed OTP records with expiry, use state, and attempts.
- `Exam` and `ExamResult`: assessment/result structure.
- `Payment` and `PaymentConfig`: fee/payment configuration and records.
- `ImportJob`: import tracking.
- `CalendarEvent`: school calendar entries.
- `LibraryResource` and `LibraryLoan`: library catalog and loans.
- `Report`: moderation/user reports.
- `ResearchProject`: research hub content.
- `FAQ`: frequently asked questions.

## Important Indexes

- `User.phone`: unique lookup for OTP login.
- `Student`: `{ schoolId: 1, studentId: 1 }` unique; `{ schoolId: 1, grade: 1, section: 1 }`.
- `Teacher`: `{ schoolId: 1, teacherId: 1 }` unique.
- `BusRoute`: `{ schoolId: 1, status: 1 }`.
- Other models generally include school/date/status indexes where defined in their schema files.

## Operational Note

If a database already contains old global unique indexes for `studentId` or `teacherId`, drop those indexes before relying on the new compound tenant-scoped uniqueness.

