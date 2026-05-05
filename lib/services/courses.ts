import { createClient } from '@/lib/supabase/server'
import type { CourseCreate, CourseUpdate, AssignmentCreate, AssignmentUpdate } from '@/lib/validation/course-schemas'
import { writeAudit } from '@/lib/audit'

export async function createCourse(userId: string | undefined, payload: CourseCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('courses').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'courses.create', resource_type: 'courses', status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'courses.create', resource_type: 'courses', resource_id: data.id, status: 'success' })
  return data
}

export async function getCourse(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function listCourses(instructorId?: string) {
  const supabase = await createClient()
  let query = supabase.from('courses').select('*')
  if (instructorId) query = query.eq('instructor_id', instructorId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateCourse(userId: string | undefined, payload: CourseUpdate) {
  const supabase = await createClient()
  const { id, ...rest } = payload as any
  const { data, error } = await supabase.from('courses').update(rest).eq('id', id).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'courses.update', resource_type: 'courses', resource_id: id, status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'courses.update', resource_type: 'courses', resource_id: id, status: 'success' })
  return data
}

export async function deleteCourse(userId: string | undefined, id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) {
    await writeAudit({ userId: userId || null, action: 'courses.delete', resource_type: 'courses', resource_id: id, status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'courses.delete', resource_type: 'courses', resource_id: id, status: 'success' })
}

export async function createAssignment(userId: string | undefined, payload: AssignmentCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('assignments').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'assignments.create', resource_type: 'assignments', status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'assignments.create', resource_type: 'assignments', resource_id: data.id, status: 'success' })
  return data
}

export async function getAssignment(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('assignments').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function listAssignmentsByCourse(courseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('assignments').select('*').eq('course_id', courseId)
  if (error) throw error
  return data || []
}

export async function updateAssignment(userId: string | undefined, payload: AssignmentUpdate) {
  const supabase = await createClient()
  const { id, ...rest } = payload as any
  const { data, error } = await supabase.from('assignments').update(rest).eq('id', id).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'assignments.update', resource_type: 'assignments', resource_id: id, status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'assignments.update', resource_type: 'assignments', resource_id: id, status: 'success' })
  return data
}

export async function deleteAssignment(userId: string | undefined, id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('assignments').delete().eq('id', id)
  if (error) {
    await writeAudit({ userId: userId || null, action: 'assignments.delete', resource_type: 'assignments', resource_id: id, status: 'error' })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'assignments.delete', resource_type: 'assignments', resource_id: id, status: 'success' })
}
