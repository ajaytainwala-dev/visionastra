import { z } from 'zod'

export const SubmissionCreateSchema = z.object({
  assignment_id: z.string().uuid(),
  student_id: z.string().uuid(),
  submitted_at: z.string().datetime(),
  submission_url: z.string().url().optional(),
  notes: z.string().optional(),
})

export const SubmissionGradeSchema = z.object({
  id: z.string().uuid(),
  score: z.number().min(0).max(100),
  feedback: z.string().optional(),
  graded_at: z.string().datetime().optional(),
})

export const ResultQuerySchema = z.object({
  student_id: z.string().uuid().optional(),
  course_id: z.string().uuid().optional(),
  assignment_id: z.string().uuid().optional(),
})

export type SubmissionCreate = z.infer<typeof SubmissionCreateSchema>
export type SubmissionGrade = z.infer<typeof SubmissionGradeSchema>
export type ResultQuery = z.infer<typeof ResultQuerySchema>
