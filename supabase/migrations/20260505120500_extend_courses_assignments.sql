-- Extend Courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived'));

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_created ON public.courses(created_at);

-- Extend Assignments table
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS max_score DECIMAL(10, 2) DEFAULT 100;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_created ON public.assignments(created_at);

-- Update RLS policies for course status filtering
DROP POLICY IF EXISTS "Anyone can read public courses" ON public.courses;
CREATE POLICY "Anyone can read public courses" ON public.courses FOR SELECT
USING (is_public = true OR instructor_id = auth.uid() OR public.has_permission(auth.uid(), 'courses', 'read'));

DROP POLICY IF EXISTS "Instructors can manage own courses" ON public.courses;
CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL
USING (instructor_id = auth.uid() OR public.has_permission(auth.uid(), 'courses', 'update'));
