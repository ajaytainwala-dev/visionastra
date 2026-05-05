import { z } from 'zod'

export const RoleCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  is_system: z.boolean().optional().default(false),
})

export const RoleUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  is_system: z.boolean().optional(),
})

export const PermissionCreateSchema = z.object({
  role_id: z.string().uuid(),
  resource: z.string(),
  action: z.enum(['create','read','update','delete']),
  conditions: z.any().optional(),
})

export const PermissionUpdateSchema = z.object({
  id: z.string().uuid(),
  resource: z.string().optional(),
  action: z.enum(['create','read','update','delete']).optional(),
  conditions: z.any().optional(),
})

export type RoleCreate = z.infer<typeof RoleCreateSchema>
export type RoleUpdate = z.infer<typeof RoleUpdateSchema>
export type PermissionCreate = z.infer<typeof PermissionCreateSchema>
export type PermissionUpdate = z.infer<typeof PermissionUpdateSchema>
