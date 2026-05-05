# VisionAstra Manual Testing Guide

This guide is written for hackathon evaluation and local verification. It is organized by page and workflow so you can test the platform from login through role-specific actions.

## Before You Start

1. Ensure `.env.local` is configured with valid Supabase values.
2. Run database migrations so roles, permissions, tenants, and sample data exist.
3. Start the app with `npm run dev`.
4. Sign in with a user that has the role you want to test.

## Quick Route Map

- `/login` - authentication entry point
- `/admin/dashboard` - super admin overview
- `/institution/dashboard` - institution admin view
- `/trainer/dashboard` - trainer workspace
- `/student/dashboard` - student workspace
- `/recruiter/dashboard` - recruiter workspace
- `/users` - user provisioning
- `/roles` - role management
- `/permissions` - permission and condition management
- `/courses` - course management
- `/attendance` - session and attendance workflow
- `/results` - grading and submissions
- `/audit-logs` - audit history
- `/debugger` - permission and ABAC debugger

## 1. Login Flow

1. Open `/login`.
2. Sign in with a valid Supabase account.
3. Confirm you are redirected to the correct role dashboard.
4. Refresh the page and confirm the session persists.

Expected result:
- The app keeps you authenticated.
- The dashboard matches the assigned role.

## 2. Super Admin Dashboard

1. Open `/admin/dashboard`.
2. Review the overview cards and system metrics.
3. Open the role and permission management pages from the navigation.
4. Confirm the page shows administrative controls, not student or trainer content.

Expected result:
- You can see system-wide data.
- Administrative actions are available only to the correct role.

## 3. User Provisioning

1. Open `/users` as an admin role.
2. Click Provision User.
3. Enter a name, email, password, and role.
4. Submit the form.
5. Confirm the new user appears in the user list.

Expected result:
- The user is created successfully.
- The selected role is shown in the table.
- Audit logs capture the provisioning action.

## 4. Roles Page

1. Open `/roles`.
2. Review the existing roles.
3. Create or edit a role if the UI allows it.
4. Confirm role changes are reflected immediately or after refresh.

Expected result:
- Roles render correctly.
- Changes are validated and persisted.

## 5. Permissions Page

1. Open `/permissions`.
2. Review the permission table.
3. Add or edit a permission.
4. If conditions are supported, open the condition builder and create a simple rule.
5. Save and reload the page.

Expected result:
- Permission records are stored.
- Condition logic remains visible and editable.
- Invalid values are rejected.

## 6. Permission Debugger

1. Open `/debugger`.
2. Set a principal context.
3. Set a resource context.
4. Choose an action to test.
5. Run the check.

Expected result:
- The debugger explains why access is allowed or denied.
- This should help verify ABAC rules without editing live data.

## 7. Courses Workflow

1. Open `/courses`.
2. Create a course with realistic metadata.
3. Save and confirm it appears in the table.
4. Edit the course and verify changes persist.
5. Delete a test course if the action is available.

Expected result:
- Course CRUD works for authorized users.
- Data stays within the current tenant.

## 8. Trainer Dashboard

1. Open `/trainer/dashboard`.
2. Review assigned courses and upcoming work.
3. Open the attendance and results pages from the dashboard.
4. Confirm trainer-specific widgets are visible.

Expected result:
- The page is tailored to trainers.
- Trainer actions are linked to the correct workflows.

## 9. Attendance Workflow

1. Open `/attendance`.
2. Create or open a session.
3. Mark attendance for one or more students.
4. Save the record.
5. Refresh the page and confirm the data persists.

Expected result:
- Attendance records are stored correctly.
- Real-time or refreshed state matches the database.
- Audit logs record the mutation.

## 10. Student Dashboard

1. Open `/student/dashboard`.
2. Review assignments, grades, attendance, and progress widgets.
3. Open `/results` to inspect submissions and outcomes.

Expected result:
- The page shows only student-relevant information.
- No admin controls should be visible.

## 11. Submission Flow

1. Open the submission area from `/results` or the relevant student page.
2. Submit work for an assignment.
3. Confirm the submission appears in the list.
4. Reopen the page to verify persistence.

Expected result:
- Student submissions are saved successfully.
- The UI shows submission state clearly.

## 12. Grading Flow

1. Open `/results` as a trainer.
2. Select a submission.
3. Enter a score and feedback.
4. Save the grade.
5. Verify the result is visible to the student role.

Expected result:
- Grading updates the record.
- The grade is visible in student-facing views.
- The operation is logged.

## 13. Recruiter Dashboard

1. Open `/recruiter/dashboard`.
2. Review the leaderboard and candidate ranking widgets.
3. Confirm the page highlights skills and performance data.

Expected result:
- Recruiter metrics are visible.
- The page does not expose privileged admin tools.

## 14. Audit Logs

1. Open `/audit-logs` as an authorized admin.
2. Perform a known mutation, such as creating a role or submission.
3. Return to the logs page and refresh.
4. Find the latest event.

Expected result:
- The log records action, actor, status, and timestamp.
- The audit entry appears shortly after the event.

## 15. Sandbox Mode

1. Open the sandbox toggle if it is exposed in the UI.
2. Enable sandbox mode.
3. Repeat a few permission checks or admin flows.
4. Disable sandbox mode and confirm the normal access rules return.

Expected result:
- Sandbox mode safely simulates access behavior.
- Production data remains protected.

## 16. Realtime Verification

1. Open a page that uses live data, such as roles, attendance, or submissions.
2. Make a change in another tab or session.
3. Return to the first tab and wait briefly.

Expected result:
- The updated data appears without a manual reload, or after a minimal refresh cycle.

## 17. Error and Security Checks

1. Try opening an admin-only page with a student account.
2. Try submitting an invalid form value.
3. Try using a malformed identifier in a URL or form field.

Expected result:
- Unauthorized access is blocked.
- Validation errors are handled cleanly.
- Internal implementation details are not exposed.

## Recommended Demo Order

1. `/login`
2. `/admin/dashboard`
3. `/roles` and `/permissions`
4. `/courses`
5. `/attendance`
6. `/results`
7. `/audit-logs`
8. `/recruiter/dashboard`
9. `/debugger`

## Troubleshooting

- If a page is blank, confirm you are signed in with the right role.
- If data does not load, verify Supabase env variables and migration status.
- If a permission check fails unexpectedly, inspect the debugger page and audit logs.
- If a mutation fails, check that the user has the correct tenant and role scope.
- If real-time updates are not appearing, reload once to confirm the base query works, then check subscriptions.

## Evaluation Checklist

- Authorization is enforced on the server.
- Tenant boundaries are preserved.
- Audit logs are generated for sensitive actions.
- Realtime views update as expected.
- Each role sees a distinct and relevant dashboard.
- The app builds successfully before demo day.
