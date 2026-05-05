import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import * as resultsService from '@/lib/services/results'
import { SubmissionCreateSchema, SubmissionGradeSchema } from '@/lib/validation/results-schemas'
import { writeAudit } from '@/lib/audit'

async function callerHas(p_user_id: string, resource: string, action: 'create'|'read'|'update'|'delete') {
  const supabase = await createClient()
  const { data } = await supabase.rpc('has_permission', { p_user_id, p_resource: resource, p_action: action })
  return !!data
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'submissions', 'read')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const url = new URL(req.url)
    const assignmentId = url.searchParams.get('assignment_id') || undefined
    const studentId = url.searchParams.get('student_id') || undefined
    const courseId = url.searchParams.get('course_id') || undefined

    if (assignmentId && !isValidUUID(assignmentId)) return NextResponse.json({ error: 'invalid_assignment_id' }, { status: 400 })
    if (studentId && !isValidUUID(studentId)) return NextResponse.json({ error: 'invalid_student_id' }, { status: 400 })
    if (courseId && !isValidUUID(courseId)) return NextResponse.json({ error: 'invalid_course_id' }, { status: 400 })

    let data
    if (courseId) {
      data = await resultsService.getCourseResults(courseId)
    } else if (studentId) {
      data = await resultsService.getStudentResults(studentId)
    } else if (assignmentId) {
      data = await resultsService.listSubmissions(assignmentId)
    } else {
      data = await resultsService.listSubmissions()
    }

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'submissions', 'create')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = SubmissionCreateSchema.parse(body)
    const created = await resultsService.submitAssignment(user.id, parsed)
    return NextResponse.json({ data: created })
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      await writeAudit({ userId: user.id, action: 'submissions.create', resource_type: 'submissions', status: 'error', details: { validation_error: true } })
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'submissions', 'update')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = SubmissionGradeSchema.parse(body)
    if (!isValidUUID(parsed.id)) return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
    const updated = await resultsService.gradeSubmission(user.id, parsed)
    return NextResponse.json({ data: updated })
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
