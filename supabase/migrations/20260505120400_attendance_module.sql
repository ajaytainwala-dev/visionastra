-- Create attendance_sessions table
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    session_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- Enable RLS
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance_sessions
DROP POLICY IF EXISTS "Trainers can read own sessions" ON public.attendance_sessions;
CREATE POLICY "Trainers can read own sessions" ON public.attendance_sessions FOR SELECT
USING (trainer_id = auth.uid() OR public.has_permission(auth.uid(), 'attendance_sessions', 'read'));

DROP POLICY IF EXISTS "Trainers can create sessions" ON public.attendance_sessions;
CREATE POLICY "Trainers can create sessions" ON public.attendance_sessions FOR INSERT
WITH CHECK (public.has_permission(auth.uid(), 'attendance_sessions', 'create'));

DROP POLICY IF EXISTS "Trainers can update own sessions" ON public.attendance_sessions;
CREATE POLICY "Trainers can update own sessions" ON public.attendance_sessions FOR UPDATE
USING (trainer_id = auth.uid() OR public.has_permission(auth.uid(), 'attendance_sessions', 'update'));

-- RLS Policies for attendance_records
DROP POLICY IF EXISTS "Students can read own attendance" ON public.attendance_records;
CREATE POLICY "Students can read own attendance" ON public.attendance_records FOR SELECT
USING (student_id = auth.uid() OR public.has_permission(auth.uid(), 'attendance_records', 'read'));

DROP POLICY IF EXISTS "Trainers can mark attendance" ON public.attendance_records;
CREATE POLICY "Trainers can mark attendance" ON public.attendance_records FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.attendance_sessions s
    WHERE s.id = session_id AND s.trainer_id = auth.uid()
  ) OR public.has_permission(auth.uid(), 'attendance_records', 'create')
);

DROP POLICY IF EXISTS "Trainers can update attendance within window" ON public.attendance_records;
CREATE POLICY "Trainers can update attendance within window" ON public.attendance_records FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.attendance_sessions s
    WHERE s.id = session_id AND s.trainer_id = auth.uid()
  ) OR public.has_permission(auth.uid(), 'attendance_records', 'update')
);

-- Seed initial attendance-related permissions
INSERT INTO public.role_permissions (role_id, resource, action, conditions) 
SELECT r.id, 'attendance_sessions', 'create'::action_type, '{"and": [{"field": "user.id", "op": "==", "value": "trainerId"}]}'::jsonb
FROM public.roles r WHERE r.name = 'Trainer'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, resource, action, conditions)
SELECT r.id, 'attendance_records', 'create'::action_type, '{"and": [{"field": "user.id", "op": "==", "value": "trainerId"}]}'::jsonb
FROM public.roles r WHERE r.name = 'Trainer'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, resource, action, conditions)
SELECT r.id, 'attendance_records', 'read'::action_type, '{"and": [{"field": "user.id", "op": "==", "value": "studentId"}]}'::jsonb
FROM public.roles r WHERE r.name = 'Student'
ON CONFLICT DO NOTHING;
