import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as permService from '@/lib/services/permissions'
import { PermissionCreateSchema, PermissionUpdateSchema } from '@/lib/validation/schemas'

async function callerHas(p_user_id: string, resource: string, action: 'create'|'read'|'update'|'delete') {
  const supabase = await createClient()
  const { data } = await supabase.rpc('has_permission', { p_user_id, p_resource: resource, p_action: action })
  return !!data
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'permissions', 'read')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const url = new URL(req.url)
    const roleId = url.searchParams.get('role_id') || undefined
    const data = await permService.listPermissions(roleId)
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'permissions', 'create')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = PermissionCreateSchema.parse(body)
    const created = await permService.createPermission(user.id, parsed)
    return NextResponse.json({ data: created })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'permissions', 'update')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = PermissionUpdateSchema.parse(body)
    const updated = await permService.updatePermission(user.id, parsed)
    return NextResponse.json({ data: updated })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const allowed = await callerHas(user.id, 'permissions', 'delete')
  if (!allowed) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })
    await permService.deletePermission(user.id, id)
    return NextResponse.json({ data: { success: true } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 })
  }
}
