import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canAccess } from '@/lib/rbac/engine'
import * as attendanceService from '@/lib/services/attendance'
import { AttendanceSessionCreateSchema } from '@/lib/validation/attendance-schemas'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = AttendanceSessionCreateSchema.parse(body)

    // Check ABAC: only trainers/admins can create sessions, and trainers only for themselves
    const access = await canAccess(user.id, 'create', 'attendance_sessions', {
      trainerId: parsed.trainer_id,
    })
    if (!access.allowed) return NextResponse.json({ error: 'forbidden', reason: access.reason }, { status: 403 })

    const session = await attendanceService.createAttendanceSession(user.id, parsed)
    return NextResponse.json({ data: session })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const access = await canAccess(user.id, 'read', 'attendance_sessions', {})
    if (!access.allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    // Return sessions visible to user (filtered by trainer_id or via RLS)
    const { data, error } = await supabase.from('attendance_sessions').select('*').order('session_date', { ascending: false })
    if (error) throw error

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
