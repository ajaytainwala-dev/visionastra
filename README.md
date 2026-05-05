# VisionAstra - Enterprise Learning Management System

**A production-ready SaaS LMS platform built with Next.js 14, Supabase, and advanced RBAC+ABAC authorization.**

## Overview

VisionAstra is a comprehensive learning management system designed for enterprises, academies, and educational institutions. It provides role-based access control (RBAC), attribute-based access control (ABAC), multi-tenant support, and real-time collaboration features.

**Key Features:**
- 🔐 Advanced RBAC + ABAC with permission inheritance
- 🏢 Multi-tenant architecture with data isolation
- 📚 Course management with assignments and attendance tracking
- 👥 Student results, grading, and performance analytics
- 🔔 Real-time subscriptions for live updates
- 📊 Role-based dashboards (Admin, Trainer, Student, Recruiter)
- 🛡️ Row-level security (RLS) enforcement
- ♻️ Comprehensive audit logging
- ⚡ Rate limiting and API security

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000

### Using Docker

```bash
# Start with Docker Compose
docker-compose up -d

# Services:
# - App: http://localhost:3000
# - Supabase Studio: http://localhost:3001
# - PostgreSQL: localhost:5432
```

## Architecture

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14, React 18, TailwindCSS |
| **Backend** | Next.js API Routes, Node.js 18 |
| **Database** | Supabase (PostgreSQL 15) |
| **Auth** | Supabase Auth (Email/Password, OAuth) |
| **State** | Zustand |
| **Real-time** | Supabase Realtime (WebSocket) |
| **Testing** | Vitest, Jest |

## User Roles

- **Super Admin** — System-wide access, manage roles, sandbox testing
- **Admin** — Manage courses, instructors, enrollments
- **Trainer** — Create courses, mark attendance, grade submissions
- **Student** — Enroll, submit work, track progress
- **Recruiter** — View leaderboards, assess skills

## Documentation

- 📖 [Full Setup Guide](./DEPLOYMENT.md)
- 🔐 [RBAC/ABAC Documentation](./docs/RBAC.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 📚 [Feature Overview](./docs/FEATURES.md)

## Development

```bash
# Run tests
npm run test:unit
npm run test:integration

# Check types
npx tsc --noEmit

# Lint code
npm run lint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy (Vercel):**
```bash
vercel
```

## License

MIT - See LICENSE for details

## Support

- 📧 Email: support@visionastra.dev
- 💬 Discord: [Community](https://discord.gg/visionastra)
- 📚 Docs: [docs.visionastra.dev](https://docs.visionastra.dev)
