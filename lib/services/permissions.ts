import { createClient } from '@/lib/supabase/server'
import type { PermissionCreate, PermissionUpdate } from '@/lib/validation/schemas'
import { writeAudit } from '@/lib/audit'

export async function listPermissions(roleId?: string) {
  const supabase = await createClient()
  let q = supabase.from('role_permissions').select('*')
  if (roleId) q = q.eq('role_id', roleId)
  const { data, error } = await q.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createPermission(userId: string | undefined, payload: PermissionCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('role_permissions').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'permissions.create', resource_type: 'role_permissions', status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'permissions.create', resource_type: 'role_permissions', resource_id: data.id, status: 'success', details: { role_id: data.role_id } })
  return data
}

export async function updatePermission(userId: string | undefined, payload: PermissionUpdate) {
  const supabase = await createClient()
  const { id, ...rest } = payload as any
  const { data, error } = await supabase.from('role_permissions').update(rest).eq('id', id).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'permissions.update', resource_type: 'role_permissions', resource_id: id, status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'permissions.update', resource_type: 'role_permissions', resource_id: id, status: 'success' })
  return data
}

export async function deletePermission(userId: string | undefined, id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('role_permissions').delete().eq('id', id)
  if (error) {
    await writeAudit({ userId: userId || null, action: 'permissions.delete', resource_type: 'role_permissions', resource_id: id, status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'permissions.delete', resource_type: 'role_permissions', resource_id: id, status: 'success' })
  return true
}
