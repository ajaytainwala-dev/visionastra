-- Create a profiles table that extends the auth.users table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
-- This trigger will:
-- 1. Create a profile record
-- 2. If it's the first user or matches a specific email, assign the Super Admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role_id UUID;
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');

    -- Get Super Admin role ID
    SELECT id INTO v_role_id FROM public.roles WHERE name = 'Super Admin';

    -- Logic: First user ever signed up becomes Super Admin
    -- OR if email matches a specific admin domain
    IF NOT EXISTS (SELECT 1 FROM public.user_roles) OR new.email = 'admin@visionastraa.com' THEN
        IF v_role_id IS NOT NULL THEN
            INSERT INTO public.user_roles (user_id, role_id)
            VALUES (new.id, v_role_id);
        END IF;
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
