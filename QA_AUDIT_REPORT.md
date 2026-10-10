# Campus 360 Functional Testing & Audit

Date: 2026-09-27  
Environment: Windows, local development server on `http://localhost:3000`

## 1. Overall Status

The application is runnable and several core API workflows work, but it is not production-ready. The backend uses a custom JSON-backed session model alongside Firebase, while the browser Firestore listeners currently fail with permission errors. Security controls also need remediation before deployment.

| Result | Count | Meaning |
| --- | ---: | --- |
| PASS | 18 | Verified end to end or directly through the API |
| PARTIAL | 15 | Main path works, but persistence, authorization, validation, or refresh has a gap |
| FAIL | 7 | Confirmed broken or unsafe behavior |
| UI ONLY | 1 | Screen exists without a verified working backend path |
| NOT TESTABLE | 9 | Required configuration or a safe test path was unavailable |

Counts are feature/test areas, not individual assertions.

## 2. Project Health

| Check | Status | Evidence |
| --- | --- | --- |
| Dependencies | FAIL | Clean `npm install` fails with a Vite 8.3.1 peer conflict: installed/requested esbuild range is incompatible with Vite's required range. Existing `node_modules` allowed commands to run. |
| TypeScript | PASS | `npm run lint` completed successfully. |
| Production build | PARTIAL | `npm run build` succeeds; Vite reports the `__dirname` native-config warning and a JavaScript chunk larger than 500 kB. |
| Server startup | PASS | Express/Vite server started on port 3000 and served the application. |
| Firebase Admin | PASS | Server logged successful Admin initialization and Firestore seed completion. |
| Browser Firestore | FAIL | Browser console showed `Missing or insufficient permissions` for requests, notices, notifications, complaints, gate_passes, attendance, mess_feedback, audit_logs, and fee settings. |
| Routing | PASS | Protected route renders an Access Denied view for a Student visiting `/admin/dashboard`. |
| Database | PARTIAL | Server JSON persistence works; Firestore browser synchronization is not working. |

## 3. Feature Matrix

| Module / feature | Role | Status | Evidence / issue |
| --- | --- | --- | --- |
| Login with valid credentials | All five roles | PASS | API login and `/auth/me` returned 200 for Student, Faculty, Admin, Warden, and Staff. |
| Invalid password | All | PASS | API returned 401. |
| Empty login fields | All | PASS | API returned 400. |
| Refresh/session restore | Student | PASS | Existing authenticated session restored after opening a protected route. |
| Logout invalidation | All | FAIL | Logout records an audit event but does not revoke the bearer token; the same token remains accepted. |
| Student route protection | Student | PASS | `/admin/dashboard` displayed RBAC Access Denied. |
| Backend role protection | Student/Warden/Staff | PASS | `/api/users` returned 403 for these roles; Student gate-pass review returned 403. |
| Admin user access | Admin/Faculty | PARTIAL | Both are allowed by the route; verify whether Faculty should have user-management access. |
| Student dashboard | Student | PASS | Dashboard rendered profile, attendance, notices, complaints, requests, gate pass, fees, and timetable widgets. |
| Gate pass create | Student | PASS | Real API create returned 201 and saved a new record. |
| Gate pass Warden queue | Warden | PASS | Warden API saw the newly created pending record. |
| Gate pass approval | Warden | PASS | Approval returned 200; student read-back showed Approved and QR payload. |
| Gate pass database persistence | Student/Warden | PASS | Record remained in `campus-360-db.json` after the workflow. |
| Gate pass validation | Student | PARTIAL | Missing required fields returned 400; duplicate and time-format validation are absent. |
| Gate pass QR verification | Gate scanner | PARTIAL | Endpoint and UI exist; invalid/expired cases and full scanner lifecycle were not fully tested. |
| Complaints create | Student | PASS | Required-field validation returned 400; create path writes JSON and returns 201. |
| Complaint status update | Staff/Admin/Warden | PARTIAL | API route and notification creation exist; ownership/assignment and refresh across Firebase were not fully verified. |
| Complaint confirmation | Student | FAIL | Any Student can submit confirmation for an arbitrary complaint ID; ownership is not checked. |
| Certificate request | Student | PARTIAL | Create and review routes exist; full browser request-to-download flow was not completed. |
| Certificate approval | Admin/Faculty | PARTIAL | API generates a verification code; Faculty authorization and certificate download need product confirmation. |
| Notices publish | Admin/Faculty/Warden | PARTIAL | Publish route works in source and writes JSON; audience filtering is not implemented in the GET route. |
| Notices read state | All | PARTIAL | Read endpoint exists, but it stores one global `isRead` flag rather than per-user state. |
| Attendance | Faculty/Admin/Student | PARTIAL | Marking route exists; it updates aggregate records and does not identify a student or prevent duplicate/date errors. |
| Timetable cancellation | Faculty/Admin | PARTIAL | Route persists cancellation and notifies students; full faculty/student refresh verification was not completed. |
| Mess feedback | Student/Admin | PARTIAL | Create route exists; rating and meal validation are weak. |
| Fees | Student/Admin | UI ONLY | UI shows mock checkout language; API increments JSON balances, but no real payment provider or sandbox was verified. |
| Hostel | Warden/Student | PARTIAL | Hostel data renders and endpoint exists; allocation CRUD was not verified. |
| Notifications | All | PARTIAL | Backend creates notifications, but browser Firestore notification listener fails and read state is not fully user-scoped. |
| Profile/password | All | FAIL | Password change accepts an incorrect old password because `oldPassword` is never checked. |
| Responsive layouts | Desktop/tablet/mobile | NOT TESTABLE | Device controls exist, but a complete visual sweep and screenshot comparison for every module was not completed. |
| Search | All | NOT TESTABLE | Search UI exists; permission-filtered search behavior was not fully exercised. |

## 4. Critical Bugs

### High: Password change bypasses old-password verification

- Location: `server.ts`, `/api/auth/change-password`
- Reproduction: Authenticate, send any incorrect `oldPassword` with a six-character `newPassword`.
- Expected: 401/400 and no update.
- Actual: API returned 200. The handler validates only new-password length and ignores `oldPassword`.
- Impact: A stolen active session can change the account password without knowing the current password.

### High: Unauthenticated Firebase seed endpoint

- Location: `server.ts`, `POST /api/firebase/seed`
- Reproduction: POST to the endpoint without an Authorization header.
- Expected: 401/403 for an administrative operation.
- Actual: 200 and seed logic executes.
- Impact: Public administrative data-write operation.

### High: Plaintext/default passwords and permissive password bypasses

- Locations: `server.ts`, `src/components/auth/LoginPage.tsx`, `src/data/mockUsers.ts`, `campus-360-db.json`
- Actual: Source and JSON contain demo passwords; backend accepts a list of role-wide fallback passwords in addition to the stored password.
- Impact: Credentials are exposed and account separation is weakened.

### High: Firebase service-account credential present in project workspace

- Location: `firebase-service-account.json`
- The file is present locally and is ignored by `.gitignore`, but it is a high-risk secret if copied, uploaded, or accidentally committed. It must be rotated if it has ever been exposed outside the trusted machine.

### Medium: Student can close another student's complaint

- Location: `server.ts`, `POST /api/complaints/:id/confirm`
- Actual: Route requires only the Student role and checks that the ID exists; it does not verify ownership.

### Medium: Gate-pass contract mismatch was fixed during this audit

- Location: `src/context/CampusDataContext.tsx` and `server.ts`
- The frontend sent `expectedReturnTime` while the server required `returnTime`, causing submitted requests not to reach the Warden queue. The client now sends the compatibility field and the server accepts/resolves both names.

## 5. Security Findings

- Authentication is mixed: Firebase client authentication is attempted, then local mock users and the custom Express API are used as fallbacks.
- Bearer tokens are predictable email identifiers rather than expiring, revocable sessions. Query-string tokens are also accepted by middleware.
- Passwords and mock password hashes are present in frontend source/data. Passwords are not returned in normal API user responses, but they remain exposed in the shipped source bundle/data.
- `oldPassword` is not validated during password changes.
- `/api/firebase/seed` is unauthenticated.
- Browser Firestore rules/configuration do not permit the authenticated client listeners used by the app.
- Role checks exist on many write APIs, but object ownership checks are missing for complaint confirmation and likely need review for other record-specific mutations.
- No `dangerouslySetInnerHTML` or direct `innerHTML` use was found in the scanned source.

## 6. Database Findings

- Server writes to `campus-360-db.json` persisted during the Gate Pass end-to-end test.
- Server mutations also call Firestore sync, but most errors are swallowed with `.catch(() => {})`; a failed cloud write can look successful to the user.
- Browser Firestore reads/listeners fail with permission errors, so client Firestore persistence and real-time updates are not PASS.
- LocalStorage caches complaints, requests, gate passes, notices, notifications, attendance, fees, mess, and audit data. This is a cache/fallback, not a reliable multi-user database.
- The audit added one QA Gate Pass record and its approval to the local JSON database; it was not deleted because the supplied test rules prohibit deleting test data.

## 7. Authentication and Authorization

Authentication is **mixed custom backend + Firebase + client fallback/demo authentication**. The custom backend validates a user and returns a token, but the token is a stable email value and is not expired or revoked. The UI also contains mock-user fallback logic.

Verified API access:

| Role | Login | `/api/users` | Expected interpretation |
| --- | --- | --- | --- |
| Student | 200 | 403 | Correctly blocked from user management |
| Faculty | 200 | 200 | Allowed by current implementation; confirm intended policy |
| Admin | 200 | 200 | Correct for admin |
| Warden | 200 | 403 | Correctly blocked from user management |
| Staff | 200 | 403 | Correctly blocked from user management |

## 8. Production Readiness Checklist

| Area | Status |
| --- | --- |
| Authentication | FAIL |
| Authorization | PARTIAL |
| Database consistency | PARTIAL |
| API validation | PARTIAL |
| Error handling | PARTIAL |
| Security | FAIL |
| Responsive UI | NOT TESTABLE |
| Accessibility | NOT TESTABLE |
| Notifications | PARTIAL |
| Core Gate Pass E2E | PASS after contract fix |
| Performance | PARTIAL: large JS chunk warning |
| Deployment readiness | FAIL |

## 9. Final Result

### Working Features

Project build/typecheck, server startup, role login, invalid/empty login validation, protected API checks, Student route denial, Gate Pass create-to-approve workflow, JSON persistence, and basic complaint creation validation.

### Partially Working Features

Firestore synchronization, notifications, complaints lifecycle, certificates, notices, attendance, timetable cancellation, mess feedback, hostel data, QR verification, and API validation generally work only on the custom JSON/API path or lack complete ownership/date/duplicate validation.

### Broken Features

Old-password verification, unauthenticated Firebase seed protection, browser Firestore listeners, password security model, complaint ownership enforcement, and logout token invalidation.

### UI-Only Features

Fees payment is presented as a mock checkout and has no verified payment integration.

### Not Tested

Complete mobile/tablet visual audit, every CRUD screen for every role, real payment sandbox, expired QR behavior, session expiration timing, full certificate download, full notice targeting, and production deployment configuration.

### Recommended Fix Order

1. Remove/rotate exposed credentials, remove frontend password fallbacks, and replace stable tokens with expiring revocable sessions.
2. Validate current passwords, protect seed/admin endpoints, and add ownership checks to every record mutation.
3. Fix Firestore client authentication/rules or make the server API the single source of truth with explicit error reporting.
4. Resolve the Vite/esbuild dependency lock conflict and add automated API/E2E tests for each role workflow.
5. Add field validation for dates, duplicates, ratings, payments, and attendance identity/date semantics.
6. Complete responsive, accessibility, performance, QR edge-case, and deployment testing.