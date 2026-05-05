import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as auditService from '@/lib/services/audit'

async function callerHas(p_user_id: string, resource: string, action: 'create'|'read'|'update'|'delete') {
  const supabase = await createClient()
  const { data } = await supabase.rpc('has_permission', { p_user_id, p_resource: resource, p_action: action })
  return !!data
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'audit_logs', 'read')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || undefined
    const resource_type = url.searchParams.get('resource_type') || undefined
    const status = url.searchParams.get('status') || undefined
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const result = await auditService.listAuditLogs({
      userId: user.id,
      action,
      resource_type,
      status,
      limit,
      offset
    })

    return NextResponse.json({ data: result.data, count: result.count })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
