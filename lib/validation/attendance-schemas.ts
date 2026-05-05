import { z } from 'zod'

export const AttendanceSessionCreateSchema = z.object({
  batch_id: z.string().uuid(),
  trainer_id: z.string().uuid(),
  course_id: z.string().uuid(),
  session_date: z.string().datetime(),
  status: z.enum(['scheduled', 'in_progress', 'completed']).default('scheduled'),
})

export const AttendanceRecordCreateSchema = z.object({
  session_id: z.string().uuid(),
  student_id: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late']),
  marked_by: z.string().uuid(),
  marked_at: z.string().datetime().optional(),
})

export const AttendanceRecordUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late']).optional(),
})

export type AttendanceSessionCreate = z.infer<typeof AttendanceSessionCreateSchema>
export type AttendanceRecordCreate = z.infer<typeof AttendanceRecordCreateSchema>
export type AttendanceRecordUpdate = z.infer<typeof AttendanceRecordUpdateSchema>
