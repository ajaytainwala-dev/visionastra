-- Add specific sub-roles requested by the user
INSERT INTO public.roles (name, description, is_system) VALUES 
('Content Creator', 'Responsible for course materials and curriculum', false),
('Staff', 'General administrative staff for support and logistics', false)
ON CONFLICT (name) DO NOTHING;

-- Improve has_permission to handle Super Admin role (System Role with ID logic)
-- We'll look for a role named 'Super Admin' specifically.
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_resource TEXT, p_action action_type)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_access BOOLEAN;
BEGIN
    -- 1. Check if user is a Super Admin (Direct bypass)
    IF EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = p_user_id AND r.name = 'Super Admin'
    ) THEN
        RETURN TRUE;
    END IF;

    -- 2. Regular RBAC check
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

-- Profiles table for user identity
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    email TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile RLS
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Analytics View (Example for Superadmin)
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT 
    (SELECT count(*) FROM auth.users) as total_users,
    (SELECT count(*) FROM public.courses) as total_courses,
    (SELECT count(*) FROM public.audit_logs WHERE status = 'error') as system_errors;

-- RLS for Analytics View
-- In Postgres 15+, views can have RLS, but standard approach is to use a function or table.
-- We'll just ensure policies on underlying tables protect the data.
