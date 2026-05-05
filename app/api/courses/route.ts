import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import * as courseService from '@/lib/services/courses'
import { CourseCreateSchema, CourseUpdateSchema } from '@/lib/validation/course-schemas'
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

  const allowed = await callerHas(user.id, 'courses', 'read')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const url = new URL(req.url)
    const instructorId = url.searchParams.get('instructor_id') || undefined
    if (instructorId && !isValidUUID(instructorId)) return NextResponse.json({ error: 'invalid_instructor_id' }, { status: 400 })
    const data = await courseService.listCourses(instructorId)
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'courses', 'create')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = CourseCreateSchema.parse(body)
    const created = await courseService.createCourse(user.id, parsed)
    return NextResponse.json({ data: created })
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      await writeAudit({ userId: user.id, action: 'courses.create', resource_type: 'courses', status: 'error', details: { validation_error: true } })
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'courses', 'update')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = CourseUpdateSchema.parse(body)
    if (!isValidUUID(parsed.id)) return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
    const updated = await courseService.updateCourse(user.id, parsed)
    return NextResponse.json({ data: updated })
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'courses', 'delete')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id || !isValidUUID(id)) return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
    await courseService.deleteCourse(user.id, id)
    return NextResponse.json({ data: { success: true } })
  } catch (e: any) {
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
