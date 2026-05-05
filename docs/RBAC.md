# RBAC + ABAC Authorization Guide

## Overview

VisionAstra implements a two-tier authorization system:

1. **RBAC (Role-Based Access Control)** — Role → Permissions
2. **ABAC (Attribute-Based Access Control)** — Runtime condition evaluation

## Role-Based Access Control (RBAC)

### Role Hierarchy

```
User
  └─ Role (multiple)
      ├─ Permission 1 (resource: courses, action: read)
      ├─ Permission 2 (resource: submissions, action: grade)
      └─ Permission 3 (resource: roles, action: manage)
```

### Built-in Roles

| Role | Scope | Key Permissions |
|------|-------|-----------------|
| **Super Admin** | System | Manage all resources, view all data |
| **Admin** | Tenant | Manage courses, users, settings |
| **Trainer** | Courses | Create courses, mark attendance, grade |
| **Student** | Courses | View courses, submit assignments |
| **Recruiter** | System | View leaderboards, assess students |

### Permission Model

```typescript
interface Permission {
  id: string
  name: string
  resource: string      // 'courses', 'submissions', 'attendance', etc.
  action: string        // 'read', 'create', 'update', 'delete'
  conditions?: Condition | ConditionGroup  // ABAC conditions
  created_at: string
}
```

## Attribute-Based Access Control (ABAC)

ABAC enables fine-grained access control based on runtime attributes.

### Condition Types

**Leaf Conditions:**
```typescript
interface Condition {
  field: string          // Attribute name (e.g., 'courseId', 'role')
  operator: Operator     // EQ, NE, GT, GTE, LT, LTE, IN, CONTAINS
  value: any            // Comparison value
}
```

**Condition Groups:**
```typescript
interface ConditionGroup {
  operator: 'AND' | 'OR'
  conditions: (Condition | ConditionGroup)[]
}
```

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| **EQ** | Equals | `{ field: 'role', operator: 'EQ', value: 'trainer' }` |
| **NE** | Not equals | `{ field: 'status', operator: 'NE', value: 'inactive' }` |
| **GT** | Greater than | `{ field: 'score', operator: 'GT', value: 80 }` |
| **GTE** | Greater than or equal | `{ field: 'score', operator: 'GTE', value: 80 }` |
| **LT** | Less than | `{ field: 'score', operator: 'LT', value: 80 }` |
| **LTE** | Less than or equal | `{ field: 'score', operator: 'LTE', value: 80 }` |
| **IN** | Array membership | `{ field: 'role', operator: 'IN', value: ['admin', 'trainer'] }` |
| **CONTAINS** | String contains | `{ field: 'email', operator: 'CONTAINS', value: '@company.com' }` |

### Example Conditions

**Simple Condition:**
```json
{
  "field": "role",
  "operator": "EQ",
  "value": "trainer"
}
```
✅ Allows if user's role is exactly 'trainer'

**AND Group:**
```json
{
  "operator": "AND",
  "conditions": [
    { "field": "role", "operator": "EQ", "value": "trainer" },
    { "field": "courseId", "operator": "EQ", "value": "course-123" }
  ]
}
```
✅ Allows if user is trainer AND teaching course-123

**OR Group:**
```json
{
  "operator": "OR",
  "conditions": [
    { "field": "role", "operator": "EQ", "value": "admin" },
    { "field": "role", "operator": "EQ", "value": "trainer" }
  ]
}
```
✅ Allows if user is admin OR trainer

**Nested Groups:**
```json
{
  "operator": "AND",
  "conditions": [
    { "field": "role", "operator": "EQ", "value": "trainer" },
    {
      "operator": "OR",
      "conditions": [
        { "field": "status", "operator": "EQ", "value": "active" },
        { "field": "status", "operator": "EQ", "value": "on_leave" }
      ]
    }
  ]
}
```
✅ Allows if user is trainer AND (status is active OR on_leave)

## Authorization Flow

### 1. Request Arrives

```
POST /api/courses
Authorization: Bearer jwt_token
Body: { title: "Advanced Python", ... }
```

### 2. Extract User & Context

```typescript
const user = await getAuthUser()
const context = { userId: user.id, role: user.role, courseId: req.body.courseId }
```

### 3. Check Permission

```typescript
const canCreate = await callerHas(user.id, 'courses', 'create')
```

**Under the hood:**
1. Fetch user's roles: `SELECT role_id FROM user_roles WHERE user_id = ?`
2. For each role, fetch permissions: `SELECT * FROM role_permissions WHERE role_id = ? AND resource = 'courses' AND action = 'create'`
3. Evaluate ABAC conditions against context
4. If any permission matches and conditions pass → ✅ Allow
5. Else → ❌ Deny

### 4. Row-Level Security (RLS) Filter

Even if user has permission, database RLS policy ensures isolation:

```sql
-- Example RLS policy on courses table
CREATE POLICY "Users can view courses in their tenant"
  ON courses FOR SELECT
  USING (tenant_id = auth.uid()::uuid);
```

### 5. Response

```json
{
  "success": true,
  "data": { "id": "course-123", "title": "Advanced Python", ... }
}
```

## Permission Management UI

### Creating a Permission

1. **Resource:** Select from enum (courses, submissions, attendance, etc.)
2. **Action:** Select from enum (create, read, update, delete)
3. **Conditions (Optional):**
   - Add leaf conditions (field, operator, value)
   - Combine with AND/OR operators
   - Nest groups for complex rules
4. **Save:** Permission stored in `role_permissions` table

### Condition Builder UX

```
┌─────────────────────────────────────────┐
│ Condition Builder                       │
├─────────────────────────────────────────┤
│ [AND ▼]                                 │
│  ├─ [Role] [EQ] [trainer]      [✕]    │
│  ├─ [Status] [NE] [inactive]   [✕]    │
│  └─ [+ Add Condition]                  │
│                                         │
│ [JSON View]   [Visual Editor]          │
│                                         │
│ Parsed JSON:                            │
│ {                                       │
│   "operator": "AND",                   │
│   "conditions": [                      │
│     { "field": "role", ... },         │
│     { "field": "status", ... }        │
│   ]                                     │
│ }                                       │
├─────────────────────────────────────────┤
│ [Cancel] [Save Permission]             │
└─────────────────────────────────────────┘
```

## Permission Debugger

The debugger helps test if a user has access:

1. **Select User:** Dropdown of all users
2. **Select Resource:** Enum (courses, submissions, attendance, roles)
3. **Select Action:** Enum (read, create, update, delete)
4. **Result:** 
   - ✅ Access Granted
   - ❌ Access Denied
   - 📋 Show matched permission
   - 📊 Show condition evaluation details

## Multi-Tenant Isolation

### Tenant-Level Access Control

Every user belongs to tenant(s):

```sql
SELECT * FROM tenant_members
WHERE user_id = 'user-123' AND tenant_id = 'tenant-456'
```

### Data Isolation

All domain tables have `tenant_id`:

```sql
-- Only users in this tenant can see courses
SELECT * FROM courses
WHERE tenant_id = (
  SELECT tenant_id FROM tenant_members
  WHERE user_id = 'user-123'
)
```

### RLS Policy Example

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation"
  ON courses FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members
      WHERE user_id = auth.uid()
    )
  );
```

## Best Practices

### 1. Principle of Least Privilege
- Grant only necessary permissions
- Use conditions to further restrict
- Regularly audit unused permissions

### 2. Role Design
- Keep roles focused (don't create "SuperTrainer")
- Use permissions for fine-grained control
- Document each role's purpose

### 3. Condition Complexity
- ✅ Keep AND/OR nesting to 2-3 levels
- ✅ Use IN for membership checks (not multiple OR)
- ❌ Avoid deeply nested conditions (performance)

### 4. Audit & Monitoring
- Review `audit_logs` for permission denials
- Monitor failed access attempts
- Alert on privilege escalation attempts

## Examples

### Example 1: Trainer Marking Attendance

**Permission:**
```json
{
  "resource": "attendance",
  "action": "mark",
  "conditions": {
    "operator": "AND",
    "conditions": [
      { "field": "role", "operator": "EQ", "value": "trainer" },
      { "field": "courseId", "operator": "EQ", "value": "{contextCourseId}" }
    ]
  }
}
```

**Request:**
```
POST /api/attendance/records
Body: { sessionId: "session-123", studentId: "student-456", status: "present" }
```

**Authorization Check:**
1. User has "trainer" role? ✅
2. User teaching course from session? ✅
3. Result: ✅ Allowed

### Example 2: Student Viewing Own Grade

**Permission:**
```json
{
  "resource": "submission",
  "action": "read",
  "conditions": {
    "field": "studentId",
    "operator": "EQ",
    "value": "{contextUserId}"
  }
}
```

**Request:**
```
GET /api/submissions/submission-789
```

**Authorization Check:**
1. Submission belongs to current user? ✅
2. Result: ✅ Allowed

### Example 3: Recruiter Viewing Leaderboard

**Permission:**
```json
{
  "resource": "leaderboard",
  "action": "read",
  "conditions": {
    "field": "role",
    "operator": "EQ",
    "value": "recruiter"
  }
}
```

**Request:**
```
GET /api/leaderboard
```

**Authorization Check:**
1. User is recruiter? ✅
2. Result: ✅ Allowed

## API Reference

### Check Permission

```typescript
import { hasPermission } from '@/lib/rbac/engine'

const canGrade = await hasPermission(
  userId,
  'submission',
  'grade',
  {
    courseId: 'course-123',
    studentId: 'student-456'
  }
)
```

### Evaluate Condition

```typescript
import { evaluateConditions } from '@/lib/rbac/engine'

const allowed = evaluateConditions(
  {
    operator: 'AND',
    conditions: [
      { field: 'role', operator: 'EQ', value: 'trainer' },
      { field: 'courseId', operator: 'EQ', value: 'course-123' }
    ]
  },
  {
    role: 'trainer',
    courseId: 'course-123'
  }
)
```

## Troubleshooting

### User blocked from resource they should access

1. Check user's roles: `SELECT * FROM user_roles WHERE user_id = ?`
2. Check role's permissions: `SELECT * FROM role_permissions WHERE role_id = ?`
3. Evaluate conditions: Test with Permission Debugger
4. Check RLS policies: `SELECT definition FROM pg_policies WHERE tablename = ?`

### Permission takes too long to apply

1. Add index on `role_permissions(role_id, resource)`
2. Cache user permissions in Zustand store
3. Monitor query performance: Supabase Query Monitor

### Condition always fails

1. Check field names match context object
2. Verify operator logic (AND vs OR)
3. Use Debugger to test condition evaluation
4. Check data types (string vs number)

## Security Considerations

- ✅ **Never trust client** — Always check permissions server-side
- ✅ **RLS + API** — Use both layers (defense in depth)
- ✅ **Audit** — Log all permission grants/denials
- ✅ **Conditions** — Evaluated securely server-side
- ✅ **Tokens** — JWT expires, use refresh tokens
