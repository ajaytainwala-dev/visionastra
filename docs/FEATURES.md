# VisionAstra Features Guide

## Feature Matrix by Role

### Super Admin
- ✅ System-wide user and role management
- ✅ Create/manage/delete all roles and permissions
- ✅ View comprehensive audit logs
- ✅ System health monitoring
- ✅ Sandbox mode (test as any role)
- ✅ Manage all tenants
- ✅ Reset passwords for any user

### Institution Admin
- ✅ Manage institution courses
- ✅ Invite/manage instructors and staff
- ✅ View institution dashboard and analytics
- ✅ Manage student enrollments
- ✅ Organization settings
- ✅ View audit logs for your organization
- ❌ Cannot access other organizations
- ❌ Cannot modify system roles

### Trainer/Instructor
- ✅ Create and manage courses
- ✅ Add assignments with due dates
- ✅ Mark student attendance
- ✅ Grade student submissions
- ✅ View class dashboard and statistics
- ✅ Export attendance/grades reports
- ✅ Message students
- ❌ Cannot delete courses (soft-delete only)
- ❌ Cannot modify system settings

### Student
- ✅ View enrolled courses
- ✅ Download course materials
- ✅ Submit assignments before deadline
- ✅ View grades and feedback
- ✅ Track attendance record
- ✅ Calculate GPA from grades
- ✅ Download certificates
- ❌ Cannot view other students' work
- ❌ Cannot modify submissions after deadline

### Recruiter
- ✅ View leaderboard of top students
- ✅ Filter students by score range
- ✅ View detailed student profiles
- ✅ Export top performers list
- ✅ Assess skills per course
- ✅ Mark students as "interested"
- ❌ Cannot modify student data
- ❌ Cannot view incomplete submissions

## Core Modules

### 1. Role & Permission Management

**Create Custom Roles**
```
Super Admin → Roles → Create
├─ Name: "Course Coordinator"
├─ Permissions:
│  ├─ courses:create
│  ├─ courses:read
│  ├─ courses:update
│  ├─ assignments:create
│  └─ students:read (same course only)
└─ Save
```

**Permission Inheritance**
- Roles can be cloned
- Inherit all permissions from template
- Modify specific permissions
- Test with Debugger before applying

**Condition Builder**
- Visual AND/OR logic builder
- Support for 8+ operator types
- Nested conditions support
- JSON import/export
- Real-time validation

### 2. Course Management

**Create Course**
- Title, description, code
- Instructor assignment
- Public/Private visibility
- Max students limit
- Prerequisites

**Add Assignments**
- Title, description
- Due date/time
- Max score (points)
- Rubric (optional)
- Attachment support

**Enroll Students**
- Manual enrollment
- Bulk CSV import
- Self-enrollment (if public)
- Waitlist management

**Archive Courses**
- Soft-delete (data preserved)
- Export course data
- Restore from archive

### 3. Attendance Tracking

**Mark Attendance**
- Trainer creates session
- Session date/time/location
- Marks present/absent/late per student
- Notes field for exceptions
- Bulk mark options

**View Attendance**
- Student sees own attendance %
- Trainer sees class attendance stats
- Calendar view of sessions
- Late/absence breakdown
- Attendance trends

**Reports**
- Export attendance as CSV
- Monthly attendance report
- Compliance reporting (>80% required)

### 4. Assignment & Submissions

**Student Submission**
- Upload file or paste code
- Add notes/comments
- See due date countdown
- Preview submission before submit
- Can resubmit if allowed

**Grading Interface**
- Rubric-based scoring
- Point allocation
- Feedback comments
- Attachment upload
- Release date (hold grade)
- Batch grading (multiple students)

**Student View Grades**
- Final score display
- Rubric breakdown
- Instructor feedback
- Resubmission allowed indicator

### 5. Dashboards & Analytics

**Super Admin Dashboard**
- System metrics (users, roles, tenants)
- Activity heatmap
- Recent audit events
- System health status
- Performance graphs

**Institution Admin Dashboard**
- Organization overview
- Courses and enrollment stats
- Instructor/student counts
- Top performers
- Recent activity

**Trainer Dashboard**
- My courses list
- Student enrollment trends
- Attendance sessions overview
- Pending grades queue
- Class performance graph

**Student Dashboard**
- My courses and progress
- Assignment deadlines
- Current grades
- GPA calculation
- Attendance percentage
- Recommended courses

**Recruiter Dashboard**
- Student leaderboard (sortable)
- Top performers (85%+)
- Skills assessment by course
- Export top candidates

### 6. Audit & Security

**Audit Logging**
- All CRUD operations logged
- Permission checks logged
- Login/logout recorded
- Failed access attempts
- Role changes tracked
- Timestamp, user, action, resource

**Audit Log Viewer**
- Filter by user, action, resource
- Date range filter
- Search by details
- Export as CSV/JSON
- Real-time new events

**Activity Timeline**
- Recent changes visualization
- System event notifications
- Security alerts
- Anomaly detection (future)

### 7. Multi-Tenant Support

**Create Organization**
- Organization name, slug
- Admin email
- Plan selection
- Branding (logo, colors)

**Invite Members**
- Email invitation
- Bulk upload users
- Assign roles on invite
- Pending invitation tracking

**Member Management**
- View all members
- Update roles
- Deactivate/remove
- Export members list

**Tenant Settings**
- Customization options
- SSO configuration
- Data export/import
- Backup schedule

### 8. Real-Time Features

**Live Updates**
- Role/permission changes
- New submissions
- Attendance marks
- Grade releases
- Message notifications

**Collaborations**
- Multi-admin editing
- Conflict resolution
- Activity presence (who's online)
- Live notifications

### 9. Reports & Export

**Available Reports**
- Attendance report (CSV)
- Grade book (Excel)
- Student transcript
- Class analytics (PDF)
- Audit log (JSON)

**Export Formats**
- CSV (spreadsheet compatible)
- Excel (xlsx)
- PDF (formatted)
- JSON (raw data)

**Scheduling**
- Generate on-demand
- Schedule automatic exports
- Email delivery
- Archive old reports

### 10. Mobile & Accessibility

**Responsive Design**
- Mobile-first layout
- Touch-friendly buttons
- Optimized for tablets
- Dark mode support

**Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- ARIA labels

## Advanced Features

### Permission Debugger
- Test permission before granting
- See exact condition evaluation
- Step through logic
- View matched permissions
- Export test results

### Sandbox Mode
- Admin: test as any role
- Isolated testing environment
- Does not affect real data
- Role-switch banner
- Audit: all sandbox actions logged separately

### Condition Builder
- Visual rule editor
- AND/OR logic trees
- 8 operator types
- Nested conditions
- Real-time JSON preview
- Validation feedback

### Student Analytics
- Grade trends over time
- Attendance correlation with grades
- Submission velocity (early/late)
- Course performance comparison
- Projected GPA calculator

### Trainer Analytics
- Class average trend
- Grade distribution graph
- Attendance patterns
- Submission statistics
- Student engagement index

## Integration Points

### Supabase Integration
- Real-time subscriptions
- Row-level security
- Auth provider integration
- Vector search ready

### Third-party Ready
- LTI 1.3 support (planned)
- Google Classroom sync
- Zapier/Make integration
- Email notifications
- Calendar sync (iCal)

## Limitations & Known Issues

### Current Limitations
- Max 100 students per course (configurable)
- Max 10 custom roles per tenant
- File upload max 100MB
- Real-time updates ~2-3 second latency

### Future Enhancements
- AI-powered course recommendations
- Advanced plagiarism detection
- Mobile app (iOS/Android)
- Video streaming integration
- Certificate generation
- Proctored exams
- Discussion forums
- Live video classroom

## Getting Started

### First Steps as Super Admin
1. ✅ Create custom roles (if needed)
2. ✅ Create institution/tenant
3. ✅ Invite institution admins
4. ✅ Enable SSO (optional)
5. ✅ Set organization branding

### First Steps as Institution Admin
1. ✅ Create first course
2. ✅ Invite instructors
3. ✅ Create assignments
4. ✅ Invite students
5. ✅ Monitor dashboard

### First Steps as Trainer
1. ✅ View course roster
2. ✅ Create assignment
3. ✅ Create attendance session
4. ✅ Mark attendance
5. ✅ Grade submissions

### First Steps as Student
1. ✅ View enrolled courses
2. ✅ Download materials
3. ✅ Submit assignment
4. ✅ Check grades
5. ✅ View transcript
