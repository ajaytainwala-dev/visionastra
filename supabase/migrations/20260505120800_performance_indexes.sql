-- Performance optimization migration
-- Add missing indexes for query performance and RLS policy efficiency

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_submissions_graded_at 
  ON submissions(graded_at DESC) WHERE graded_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_student_status 
  ON submissions(student_id, score) WHERE score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_attendance_records_date 
  ON attendance_records(created_at DESC, session_id, student_id);

-- Multi-column indexes for common filter patterns
CREATE INDEX IF NOT EXISTS idx_courses_tenant_status 
  ON courses(tenant_id, is_public, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assignments_course_due 
  ON assignments(course_id, due_date DESC);

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action 
  ON audit_logs(user_id, action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_date 
  ON audit_logs(tenant_id, created_at DESC);

-- Index for role permission lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_resource 
  ON role_permissions(role_id, resource);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_tenant 
  ON user_roles(user_id, role_id);

-- Index for tenant membership
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant_user 
  ON tenant_members(tenant_id, user_id);

-- Analyze tables to update query planner statistics
ANALYZE courses;
ANALYZE assignments;
ANALYZE submissions;
ANALYZE attendance_sessions;
ANALYZE attendance_records;
ANALYZE audit_logs;
ANALYZE roles;
ANALYZE role_permissions;
ANALYZE user_roles;
ANALYZE tenants;
ANALYZE tenant_members;
