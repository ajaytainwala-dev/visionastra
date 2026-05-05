import { createClient } from '@/lib/supabase/server'
import type { RoleCreate, RoleUpdate } from '@/lib/validation/schemas'
import { writeAudit } from '@/lib/audit'

export async function listRoles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('roles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getRole(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('roles').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createRole(userId: string | undefined, payload: RoleCreate) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('roles').insert(payload).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'roles.create', resource_type: 'roles', status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'roles.create', resource_type: 'roles', resource_id: data.id, status: 'success', details: { name: data.name } })
  return data
}

export async function updateRole(userId: string | undefined, payload: RoleUpdate) {
  const supabase = await createClient()
  const { id, ...rest } = payload as any
  const { data, error } = await supabase.from('roles').update(rest).eq('id', id).select().single()
  if (error) {
    await writeAudit({ userId: userId || null, action: 'roles.update', resource_type: 'roles', resource_id: id, status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'roles.update', resource_type: 'roles', resource_id: id, status: 'success', details: {} })
  return data
}

export async function deleteRole(userId: string | undefined, id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('roles').delete().eq('id', id)
  if (error) {
    await writeAudit({ userId: userId || null, action: 'roles.delete', resource_type: 'roles', resource_id: id, status: 'error', details: { error: error.message } })
    throw error
  }
  await writeAudit({ userId: userId || null, action: 'roles.delete', resource_type: 'roles', resource_id: id, status: 'success' })
  return true
}
