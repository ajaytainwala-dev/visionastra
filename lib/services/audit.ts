import { createClient } from '@/lib/supabase/server'

export async function listAuditLogs(opts?: {
  userId?: string
  action?: string
  resource_type?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  let q = supabase.from('audit_logs').select('*', { count: 'exact' })
  
  if (opts?.userId) q = q.eq('user_id', opts.userId)
  if (opts?.action) q = q.like('action', `%${opts.action}%`)
  if (opts?.resource_type) q = q.eq('resource_type', opts.resource_type)
  if (opts?.status) q = q.eq('status', opts.status)
  
  q = q.order('created_at', { ascending: false })
  
  if (opts?.limit) q = q.limit(opts.limit)
  if (opts?.offset) q = q.range(opts.offset, opts.offset + (opts.limit || 50) - 1)
  
  const { data, error, count } = await q
  if (error) throw error
  
  return { data, count }
}
