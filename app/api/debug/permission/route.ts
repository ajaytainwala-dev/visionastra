import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canAccess } from '@/lib/rbac/engine'

type DebugRequest = {
  targetUserId: string
  action: 'create' | 'read' | 'update' | 'delete'
  resource: string
  resourceContext?: Record<string, unknown>
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json() as DebugRequest

  // Only allow users who have permission to read permissions to use the debugger
  const rpc = await supabase.rpc('has_permission', {
    p_user_id: user.id,
    p_resource: 'permissions',
    p_action: 'read',
  })

  // rpc returns a scalar boolean in .data typically
  const allowedToDebug = !!(rpc.data)
  if (!allowedToDebug) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const result = await canAccess(body.targetUserId, body.action, body.resource, body.resourceContext || {})

  return NextResponse.json({ result })
}
