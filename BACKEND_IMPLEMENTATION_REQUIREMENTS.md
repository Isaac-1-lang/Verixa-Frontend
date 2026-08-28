# Verixa Backend Implementation Requirements

This handoff defines the backend work required to make the completed frontend lifecycle modules persistent, secure and production-ready. The existing `uat_manager` source was not modified.

## P0: tenancy and access foundation

### Organizations

- Add `Organization`, `OrganizationApplication`, `OrganizationMember` and `OrganizationInvitation` models.
- Organization states: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`, `ACTIVE`.
- Add `organization_id` to users, projects and every project-owned UAT record.
- Provide `GET/POST /api/organizations`, `GET /api/organizations/{id}`, `PATCH /api/organizations/{id}/approval` and invitation/member endpoints.
- Enforce tenant filtering in repositories and services; never trust an organization ID supplied by a client without membership validation.

### Scoped authorization

- Add organization roles and project membership roles independently of global platform roles.
- Centralize access checks for organization, project, run, execution, defect, sign-off and attachment resources.
- Apply checks to reads and downloads as well as mutations.
- Return the current user permissions/scopes from a stable `/api/me` contract.
- Add admin APIs for users, account state, role assignment and permission review.

### Database lifecycle

- Introduce versioned Flyway migrations and disable Hibernate schema mutation in production.
- Add tenant-aware unique constraints, foreign keys, indexes and optimistic locking where concurrent changes are possible.
- Add created/updated actor fields and an immutable security/audit event table.

## P0: complete UAT lifecycle

### Projects

- Add update, archive and safe delete operations.
- Add owner, description, code, status, dates, environment/release metadata and organization relationship.
- Support project membership and project-scoped roles.

### Defects, fixes and retests

- Extend defects with assignee, owner, due date, resolution, root cause, fix version and audit history.
- Add defect comments and status transition rules.
- Add a `DefectFix` record and explicit `RetestCycle`/retest execution linkage.
- Support reopen and verification decisions with reasons.
- Add paginated search/filter endpoints and optimistic concurrency.

### Sign-off

- Support multiple approvers, approval stages, decision history and immutable signed records.
- Define readiness rules before approval and prevent closure when mandatory criteria fail.
- Produce a sign-off evidence package containing test results, open exceptions, attachments and approvals.

### Evidence

- Move attachments to durable object storage with signed downloads.
- Validate owner access, size, MIME type and file signature; add malware scanning, retention and deletion.
- Support evidence metadata and additional owner types needed by training, readiness and handover.

## P1: collaboration and readiness

### Feedback

Required endpoints:

- `GET/POST /api/feedback`
- `GET/PATCH /api/feedback/{id}`
- `PATCH /api/feedback/{id}/status`
- `POST /api/feedback/{id}/comments`
- `POST /api/feedback/{id}/convert-to-defect`

Feedback needs organization/project/run scope, author, source, category, priority, status, assignee, response, comments and attachments.

### Training

Add programs, modules, sessions, trainers/mentors, participants, enrollments, attendance and completion records.

Required endpoint groups:

- `/api/training/programs`
- `/api/training/sessions`
- `/api/training/participants`
- `/api/training/enrollments`
- `/api/training/attendance`
- `/api/training/reports`

### Competencies, assessments and feedback

- Add competency frameworks and role competency requirements.
- Add assessments, questions, attempts, responses, scores and pass/fail rules.
- Add training feedback forms and anonymous/non-anonymous response options.
- Provide project/user readiness summaries with gap explanations.

### Deployment readiness and handover

- Add configurable readiness templates and checklist items.
- Aggregate UAT completion, open defects, sign-off, training completion and user competency into readiness status.
- Add blockers, owners, due dates, approvals and exceptions.
- Add deployment and handover records, artifacts, recipients and acceptance confirmation.

### Reports and notifications

- Create project-scoped UAT, traceability, defect, sign-off, training and readiness reports.
- Support PDF/XLSX export, saved report definitions and schedules.
- Add notification events, user preferences, read status and delivery providers.
- Avoid global analytics; all metrics must honor tenant and project scope.

## P1: commercial platform

### Plans and subscriptions

- Add plans, prices, feature entitlements, usage limits, add-ons, subscriptions, invoices and payments.
- Scope billing to organizations and keep payment/audit records immutable.
- Enforce plan entitlements server-side, not only in the UI.

### pawaPay

- Add payment initiation, provider reference, callback verification, idempotency and reconciliation.
- Verify webhook signatures and store raw callback events safely.
- Model pending, accepted, completed, failed, refunded and expired states.
- Never activate a subscription from an unverified browser response.

### Platform administration

- Add organization approval, tenant suspension, user administration, plan/add-on management and platform audit views.
- Separate platform-admin permissions from organization-admin permissions.
- Protect all administrative endpoints with explicit permissions and audit every action.

## API quality requirements

- Use consistent request/response envelopes and machine-readable validation errors.
- Provide cursor or page-based pagination consistently across all list endpoints.
- Whitelist sort properties and bound page sizes.
- Support filtering through documented fields rather than unrestricted query construction.
- Add idempotency keys to payments, invitations, sign-off and other retry-sensitive operations.
- Publish OpenAPI schemas for every endpoint and keep enum names consistent with the frontend.
- Add rate limiting for authentication, invitations, uploads and payment operations.
- Add password reset, email verification, refresh-token rotation and session revocation.

## Verification required before production

- Repository/service tests proving tenant isolation for every resource type.
- Authorization tests for every role and endpoint, including downloads.
- Lifecycle transition tests for runs, defects, retests, sign-off, training and deployments.
- Migration tests against PostgreSQL.
- Payment webhook/idempotency/reconciliation tests.
- Contract tests against the frontend request and response shapes.
- Performance tests for dashboards, reports, matrix import and large projects.
