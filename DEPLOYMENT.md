# VisionAstra Setup & Deployment Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ (for local development)
- Supabase account (for production)
- Git

## Local Development

### Option 1: Direct Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Start development server
npm run dev
```

Visit http://localhost:3000

### Option 2: Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL, Supabase Studio, Next.js)
docker-compose up -d

# View logs
docker-compose logs -f nextjs

# Stop services
docker-compose down
```

Services:
- App: http://localhost:3000
- Supabase Studio: http://localhost:3001
- PostgreSQL: localhost:5432

## Supabase Setup

### 1. Create Project

```bash
# Create new Supabase project (or use existing)
# Copy project URL and keys to .env.local
```

### 2. Run Migrations

```bash
# Automatic migrations on `npm run dev`
# OR manually:
npx supabase migration up
```

### 3. Set Auth Provider (Google)

In Supabase Console:
1. Authentication → Providers
2. Enable Google with OAuth credentials
3. Add redirect URL: `http://localhost:3000/auth/callback`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up

# Set environment variables
railway variables set NEXT_PUBLIC_SUPABASE_URL=...
```

### Self-Hosted (Docker)

```bash
# Build image
docker build -t visionastra:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY \
  -e SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY \
  visionastra:latest
```

## Environment Variables

```
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests (requires database)
npm run test:integration

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

## Database Migrations

```bash
# Create new migration
npx supabase migration new feature_name

# Run pending migrations
npx supabase migration up

# Rollback last migration
npx supabase migration down
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database connection error
```bash
# Check Supabase credentials in .env.local
# Verify database is running (if local)
# Check network connectivity
```

### Auth not working
- Verify Google OAuth credentials
- Check redirect URLs match your domain
- Ensure cookies are enabled in browser

## Performance Tips

1. **Database queries**: Use indexes from migration `20260505120800_performance_indexes.sql`
2. **RLS policies**: Check query performance with Supabase Query Monitor
3. **API rate limiting**: Configured at `100 requests/min per user`
4. **Caching**: Zustand store caches user profile and permissions

## Security Checklist

- [ ] Enable row-level security on all tables
- [ ] Rotate JWT secrets regularly
- [ ] Enable API rate limiting
- [ ] Set strong database password
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
