import { createClient } from '@/lib/supabase/server'
import type { SubmissionCreate, SubmissionGrade } from '@/lib/validation/results-schemas'
import { writeAudit } from '@/lib/audit'

export async function submitAssignment(userId: string | undefined, payload: SubmissionCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('submissions').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'submissions.create', resource_type: 'submissions', status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'submissions.create', resource_type: 'submissions', resource_id: data.id, status: 'success' })
  return data
}

export async function getSubmission(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('submissions').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function listSubmissions(assignmentId?: string, studentId?: string) {
  const supabase = await createClient()
  let query = supabase.from('submissions').select('*')
  if (assignmentId) query = query.eq('assignment_id', assignmentId)
  if (studentId) query = query.eq('student_id', studentId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function gradeSubmission(userId: string | undefined, payload: SubmissionGrade) {
  const supabase = await createClient()
  const { id, ...rest } = payload as any
  const { data, error } = await supabase.from('submissions').update(rest).eq('id', id).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'submissions.grade', resource_type: 'submissions', resource_id: id, status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'submissions.grade', resource_type: 'submissions', resource_id: id, status: 'success' })
  return data
}

export async function getCourseResults(courseId: string) {
  const supabase = await createClient()
  // Get all students, assignments and submissions for a course
  const { data, error } = await supabase.from('submissions')
    .select(`
      *,
      assignment:assignment_id(id, title, max_score),
      student:student_id(id, email)
    `)
    .eq('assignment.course_id', courseId)

  if (error) throw error
  return data || []
}

export async function getStudentResults(studentId: string, courseId?: string) {
  const supabase = await createClient()
  let query = supabase.from('submissions')
    .select(`
      *,
      assignment:assignment_id(id, title, max_score, course_id),
      course:assignment_id.course_id(id, title)
    `)
    .eq('student_id', studentId)

  if (courseId) query = query.eq('assignment.course_id', courseId)

  const { data, error } = await query
  if (error) throw error
  return data || []
}
