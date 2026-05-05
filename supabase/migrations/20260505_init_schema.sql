-- Create enum for actions
CREATE TYPE action_type AS ENUM ('create', 'read', 'update', 'delete');

-- 1. Roles Table
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Roles Table
CREATE TABLE public.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 3. Role Permissions (RBAC + ABAC Conditions)
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    resource TEXT NOT NULL,
    action action_type NOT NULL,
    conditions JSONB DEFAULT '{}'::jsonb, -- Store ABAC conditions here
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, resource, action)
);

-- 4. Audit Logs Table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    status TEXT NOT NULL,
    ip_address TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Courses Table (Demo Resource)
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Assignments Table (Demo Resource)
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check User Has Permission
-- This function checks if a user has the basic RBAC permission for a resource and action.
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_resource TEXT, p_action action_type)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_access BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role_id = rp.role_id
        WHERE ur.user_id = p_user_id
          AND rp.resource = p_resource
          AND rp.action = p_action
    ) INTO v_has_access;
    
    RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Roles: Anyone can read, only Super Admin can write
CREATE POLICY "Anyone can read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Only Super Admins can insert roles" ON public.roles FOR INSERT 
WITH CHECK (public.has_permission(auth.uid(), 'roles', 'create'));
CREATE POLICY "Only Super Admins can update roles" ON public.roles FOR UPDATE 
USING (public.has_permission(auth.uid(), 'roles', 'update'));
CREATE POLICY "Only Super Admins can delete roles" ON public.roles FOR DELETE 
USING (public.has_permission(auth.uid(), 'roles', 'delete'));

-- User Roles: Users can read their own, Admins can manage all
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT 
USING (user_id = auth.uid() OR public.has_permission(auth.uid(), 'users', 'read'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL 
USING (public.has_permission(auth.uid(), 'users', 'update'));

-- Role Permissions: Read-only for most, write for Super Admin
CREATE POLICY "Anyone can read role permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions FOR ALL 
USING (public.has_permission(auth.uid(), 'permissions', 'update'));

-- Courses Policy (Includes ABAC check)
-- ABAC Example: Can read if course is public OR user has read permission
CREATE POLICY "Can read courses" ON public.courses FOR SELECT 
USING (is_public = true OR public.has_permission(auth.uid(), 'courses', 'read'));

-- ABAC Example: Can update only if user is the instructor OR user is Super Admin
CREATE POLICY "Can update courses" ON public.courses FOR UPDATE 
USING (
    instructor_id = auth.uid() 
    OR public.has_permission(auth.uid(), 'courses', 'update')
);

CREATE POLICY "Can insert courses" ON public.courses FOR INSERT 
WITH CHECK (public.has_permission(auth.uid(), 'courses', 'create'));

CREATE POLICY "Can delete courses" ON public.courses FOR DELETE 
USING (public.has_permission(auth.uid(), 'courses', 'delete'));

-- Assignments Policy
CREATE POLICY "Can read assignments if can read course" ON public.assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id AND (c.is_public = true OR public.has_permission(auth.uid(), 'courses', 'read'))
    )
);

CREATE POLICY "Can manage assignments if instructor or admin" ON public.assignments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id AND (c.instructor_id = auth.uid() OR public.has_permission(auth.uid(), 'assignments', 'update'))
    )
);

-- Seed Initial Data
INSERT INTO public.roles (name, description, is_system) VALUES 
('Super Admin', 'Full access to all system features', true),
('Admin', 'Administrative access', true),
('Trainer', 'Access to courses and grading', false),
('Student', 'Access to learning materials', true)
ON CONFLICT (name) DO NOTHING;
