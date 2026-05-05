import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canAccess } from '@/lib/rbac/engine'
import * as attendanceService from '@/lib/services/attendance'
import { AttendanceRecordCreateSchema, AttendanceRecordUpdateSchema } from '@/lib/validation/attendance-schemas'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const url = new URL(req.url)
    const sessionId = url.searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 })

    // Check if user can read attendance for this session
    const access = await canAccess(user.id, 'read', 'attendance', { sessionId })
    if (!access.allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const records = await attendanceService.listAttendanceRecords(sessionId)
    return NextResponse.json({ data: records })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = AttendanceRecordCreateSchema.parse(body)

    // Get session to check if user is trainer
    const session = await attendanceService.getAttendanceSession(parsed.session_id)

    // Check ABAC: trainer can only mark for their sessions, students/admins have different rules
    const access = await canAccess(user.id, 'create', 'attendance', {
      sessionId: parsed.session_id,
      trainerId: session.trainer_id,
      studentId: parsed.student_id,
    })
    if (!access.allowed) return NextResponse.json({ error: 'forbidden', reason: access.reason }, { status: 403 })

    const record = await attendanceService.markAttendance(user.id, parsed)
    return NextResponse.json({ data: record })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = AttendanceRecordUpdateSchema.parse(body)

    // Check ABAC: can only edit within time window or if admin
    const access = await canAccess(user.id, 'update', 'attendance', { recordId: parsed.id })
    if (!access.allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const record = await attendanceService.updateAttendanceRecord(user.id, parsed)
    return NextResponse.json({ data: record })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
