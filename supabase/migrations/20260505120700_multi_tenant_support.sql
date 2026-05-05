-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tenant_members table for multi-user tenants
CREATE TABLE IF NOT EXISTS public.tenant_members (
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, user_id)
);

-- Add tenant_id to main tables
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.attendance_sessions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
DROP POLICY IF EXISTS "Users can read own tenants" ON public.tenants;
CREATE POLICY "Users can read own tenants" ON public.tenants FOR SELECT
USING (created_by = auth.uid() OR EXISTS (
  SELECT 1 FROM public.tenant_members tm
  WHERE tm.tenant_id = id AND tm.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
CREATE POLICY "Users can create tenants" ON public.tenants FOR INSERT
WITH CHECK (created_by = auth.uid());

-- RLS Policies for tenant_members
DROP POLICY IF EXISTS "Tenant members can read members" ON public.tenant_members;
CREATE POLICY "Tenant members can read members" ON public.tenant_members FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.tenant_members tm
  WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Tenant owners can manage members" ON public.tenant_members;
CREATE POLICY "Tenant owners can manage members" ON public.tenant_members FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.tenant_members tm
  WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
));

-- Add indexes for tenant queries
CREATE INDEX IF NOT EXISTS idx_courses_tenant ON public.courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_assignments_tenant ON public.assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_tenant ON public.attendance_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_tenant ON public.attendance_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_submissions_tenant ON public.submissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON public.tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON public.tenant_members(user_id);

-- Update RLS policies for courses to include tenant_id
DROP POLICY IF EXISTS "Anyone can read public courses" ON public.courses;
CREATE POLICY "Anyone can read public courses" ON public.courses FOR SELECT
USING (
  (is_public = true AND EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid()
  )) OR
  instructor_id = auth.uid() OR
  public.has_permission(auth.uid(), 'courses', 'read')
);

DROP POLICY IF EXISTS "Instructors can manage own courses" ON public.courses;
CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL
USING (
  (instructor_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid()
  )) OR
  public.has_permission(auth.uid(), 'courses', 'update')
);

-- Update RLS for attendance to include tenant filtering
DROP POLICY IF EXISTS "Trainers can read own sessions" ON public.attendance_sessions;
CREATE POLICY "Trainers can read own sessions" ON public.attendance_sessions FOR SELECT
USING (
  (trainer_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.tenant_members tm
    WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid()
  )) OR
  public.has_permission(auth.uid(), 'attendance_sessions', 'read')
);
