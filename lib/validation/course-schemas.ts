import { z } from 'zod'

export const CourseCreateSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  instructor_id: z.string().uuid(),
  is_public: z.boolean().default(false),
})

export const CourseUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
})

export const AssignmentCreateSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  due_date: z.string().datetime(),
  max_score: z.number().int().positive(),
})

export const AssignmentUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  due_date: z.string().datetime().optional(),
  max_score: z.number().int().positive().optional(),
})

export type CourseCreate = z.infer<typeof CourseCreateSchema>
export type CourseUpdate = z.infer<typeof CourseUpdateSchema>
export type AssignmentCreate = z.infer<typeof AssignmentCreateSchema>
export type AssignmentUpdate = z.infer<typeof AssignmentUpdateSchema>
