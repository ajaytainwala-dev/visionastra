import { createClient } from '@/lib/supabase/server'

export async function writeAudit(opts: {
  userId?: string | null
  action: string
  resource_type: string
  resource_id?: string | null
  status: 'success' | 'error' | 'info'
  details?: Record<string, unknown>
}) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('audit_logs').insert({
      user_id: opts.userId || null,
      action: opts.action,
      resource_type: opts.resource_type,
      resource_id: opts.resource_id || null,
      status: opts.status,
      details: opts.details || {},
    })

    if (error) {
      console.error('Failed to write audit log', error)
    }
  } catch (e) {
    console.error('Audit write failed', e)
  }
}
