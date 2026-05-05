-- Create submissions table for student assignment submissions
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMPTZ NOT NULL,
    submission_url TEXT,
    notes TEXT,
    score DECIMAL(5, 2),
    feedback TEXT,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted ON public.submissions(submitted_at);

-- RLS Policies
DROP POLICY IF EXISTS "Students can read own submissions" ON public.submissions;
CREATE POLICY "Students can read own submissions" ON public.submissions FOR SELECT
USING (student_id = auth.uid() OR public.has_permission(auth.uid(), 'submissions', 'read'));

DROP POLICY IF EXISTS "Students can submit assignments" ON public.submissions;
CREATE POLICY "Students can submit assignments" ON public.submissions FOR INSERT
WITH CHECK (student_id = auth.uid() OR public.has_permission(auth.uid(), 'submissions', 'create'));

DROP POLICY IF EXISTS "Instructors can grade submissions" ON public.submissions;
CREATE POLICY "Instructors can grade submissions" ON public.submissions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.courses c ON a.course_id = c.id
    WHERE a.id = assignment_id AND c.instructor_id = auth.uid()
  ) OR public.has_permission(auth.uid(), 'submissions', 'update')
);

-- Seed initial submission-related permissions
INSERT INTO public.role_permissions (role_id, resource, action, conditions)
SELECT r.id, 'submissions', 'create'::action_type, '{"and": [{"field": "user.id", "op": "==", "value": "studentId"}]}'::jsonb
FROM public.roles r WHERE r.name = 'Student'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, resource, action, conditions)
SELECT r.id, 'submissions', 'read'::action_type, '{"and": [{"field": "user.id", "op": "==", "value": "studentId"}]}'::jsonb
FROM public.roles r WHERE r.name = 'Student'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, resource, action, conditions)
SELECT r.id, 'submissions', 'update'::action_type, '{"and": [{"field": "user.id", "op": "==", "value": "instructorId"}]}'::jsonb
FROM public.roles r WHERE r.name = 'Trainer'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_id, resource, action, conditions)
SELECT r.id, 'submissions', 'read'::action_type, '{"and": []}'::jsonb
FROM public.roles r WHERE r.name = 'Trainer'
ON CONFLICT DO NOTHING;
