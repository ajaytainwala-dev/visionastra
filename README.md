# VisionAstra

VisionAstra is a production-grade SaaS learning management system built for the VisionAstra EV Academy use case. It combines multi-tenant data isolation, RBAC + ABAC authorization, audit logging, real-time updates, and secure Supabase-backed workflows into one complete platform.

## Hackathon Summary

This project is designed to be easy to demo, easy to evaluate, and difficult to fake. The core value is not just the UI, but the full execution stack behind it:

- Role-aware dashboards for Super Admin, Institution Admin, Trainer, Student, and Recruiter
- Tenant-aware data access across courses, attendance, submissions, permissions, and audit logs
- Server-side authorization with RBAC + ABAC checks before every privileged action
- Supabase Row Level Security as the last line of defense
- Real-time subscriptions so tables and dashboards stay fresh without manual reloads
- Audit trails for mutations so reviewers can inspect what changed and who changed it

## What Makes It Evaluation Ready

- No placeholder flows: the main pages, APIs, and database schema are wired together.
- Security is enforced at multiple layers: UI gating, server checks, and database policies.
- The app supports realistic demo flows for admin setup, course delivery, student work, grading, attendance, and recruiter review.
- The build passes successfully with production type checking and static generation.

## Core Features

- Authentication and role-based routing
- Permission and role management with conditions
- Multi-tenant organization support
- Course, assignment, submission, and results workflows
- Attendance sessions and attendance marking
- Recruiter views for candidate evaluation and ranking
- Audit logs for privileged actions
- Sandbox mode for safe RBAC testing
- Rate limiting for API protection
- Real-time refresh for live operational views

## Routes and Pages

- `/login` - sign in flow
- `/admin/dashboard` - system administration overview
- `/institution/dashboard` - institution operations dashboard
- `/trainer/dashboard` - trainer workspace
- `/student/dashboard` - student workspace
- `/recruiter/dashboard` - recruiter workspace
- `/users` - user provisioning and user management
- `/roles` - role management
- `/permissions` - permission management and conditions
- `/courses` - course management
- `/attendance` - attendance workflow
- `/results` - grading and submission review
- `/audit-logs` - system audit history
- `/debugger` - permission and ABAC inspection tool

## Architecture

| Layer | Stack |
|---|---|
| Frontend | Next.js App Router, React 19, Tailwind CSS |
| UI | Shadcn-style primitives and custom dashboard components |
| State | Zustand |
| Backend | Next.js route handlers and server actions |
| Database | Supabase Postgres |
| Authorization | RBAC + ABAC engine with tenant checks |
| Realtime | Supabase subscriptions |
| Testing | Vitest and Testing Library |

## Security Model

VisionAstra uses defense in depth:

1. The UI hides actions the current role should not use.
2. Server actions and route handlers validate identity, tenant, and permission scope.
3. Supabase RLS policies ensure unauthorized reads and writes are blocked at the database layer.
4. Audit logging records privileged mutations for traceability.
5. API routes validate inputs and return generic error messages to avoid information leakage.

## Demo Flow

If you need a clean hackathon presentation, use this sequence:

1. Start with the admin dashboard and show the system overview.
2. Open roles and permissions to demonstrate RBAC + ABAC control.
3. Create or review a course and assignment as the trainer.
4. Submit work as a student and show the results page.
5. Mark attendance and show the live session view.
6. Open audit logs to prove every sensitive action is tracked.
7. Switch to recruiter view to show candidate ranking and evaluation.
8. Use the debugger page to demonstrate policy checks and sandbox testing.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Production Build

```bash
npm run build
```

The build has been verified successfully in this workspace.

## Docker

```bash
docker compose up -d
```

Expected services:

- App: `http://localhost:3000`
- Supabase Studio: `http://localhost:3001`
- PostgreSQL: `localhost:5432`

## Testing

Run the focused checks before a demo:

```bash
npm run lint
npm run test:unit
npm run test:coverage
```

For a manual walkthrough, follow [docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md).

## Documentation

- [Deployment guide](./DEPLOYMENT.md)
- [RBAC and ABAC design](./docs/RBAC.md)
- [Feature matrix](./docs/FEATURES.md)
- [Manual testing guide](./docs/TESTING_GUIDE.md)

## Suggested Evaluation Points

- Authorization depth: role checks plus conditional ABAC logic
- Tenant isolation: data does not bleed across organizations
- Operational readiness: audit logs, rate limiting, and error sanitization
- Realtime behavior: dashboard updates without page reloads
- Demo completeness: all major LMS workflows are present

## Notes

- Use the Supabase env values from your local `.env.local`.
- Do not expose service-role keys in the browser.
- Keep the database migrations applied before testing end-to-end flows.
