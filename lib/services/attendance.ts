import { createClient } from '@/lib/supabase/server'
import type { AttendanceSessionCreate, AttendanceRecordCreate, AttendanceRecordUpdate } from '@/lib/validation/attendance-schemas'
import { writeAudit } from '@/lib/audit'

export async function createAttendanceSession(userId: string | undefined, payload: AttendanceSessionCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('attendance_sessions').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'attendance_sessions.create', resource_type: 'attendance_sessions', status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'attendance_sessions.create', resource_type: 'attendance_sessions', resource_id: data.id, status: 'success' })
  return data
}

export async function getAttendanceSession(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('attendance_sessions').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function listAttendanceRecords(sessionId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('attendance_records').select('*').eq('session_id', sessionId)
  if (error) throw error
  return data
}

export async function markAttendance(userId: string | undefined, payload: AttendanceRecordCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('attendance_records').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'attendance.mark', resource_type: 'attendance_records', status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'attendance.mark', resource_type: 'attendance_records', resource_id: data.id, status: 'success' })
  return data
}

export async function updateAttendanceRecord(userId: string | undefined, payload: AttendanceRecordUpdate) {
  const supabase = await createClient()
  const { id, ...rest } = payload as any
  const { data, error } = await supabase.from('attendance_records').update(rest).eq('id', id).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'attendance.update', resource_type: 'attendance_records', resource_id: id, status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'attendance.update', resource_type: 'attendance_records', resource_id: id, status: 'success' })
  return data
}
