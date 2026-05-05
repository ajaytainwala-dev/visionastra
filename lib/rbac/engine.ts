import { createClient } from '@/lib/supabase/server'

export type ActionType = 'create' | 'read' | 'update' | 'delete'

type Primitive = string | number | boolean | null

type ComparisonOp = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'contains'

type ConditionLeaf = {
  field?: string // e.g. 'user.id' or 'resource.ownerId'
  op?: ComparisonOp
  value?: Primitive | string // string may be another field reference
}

type ConditionNode = {
  and?: Condition[]
  or?: Condition[]
}

type Condition = ConditionLeaf | ConditionNode

type CanAccessResult = {
  allowed: boolean
  reason: string[]
}

function resolvePath(path: string, ctx: Record<string, unknown>): unknown {
  // path like 'user.id' or 'resource.ownerId'
  const parts = path.split('.')
  let cur: any = ctx
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

function compare(left: unknown, op: ComparisonOp, right: unknown): boolean {
  if (op === '==') return left == right
  if (op === '!=') return left != right
  if (op === '>') return Number(left as any) > Number(right as any)
  if (op === '>=') return Number(left as any) >= Number(right as any)
  if (op === '<') return Number(left as any) < Number(right as any)
  if (op === '<=') return Number(left as any) <= Number(right as any)
  if (op === 'in') {
    if (Array.isArray(right)) return (right as any[]).includes(left)
    return false
  }
  if (op === 'contains') {
    if (typeof left === 'string' && typeof right === 'string') return left.includes(right)
    if (Array.isArray(left)) return (left as any[]).includes(right)
    return false
  }
  return false
}

function evaluateCondition(condition: Condition, ctx: Record<string, unknown>): boolean {
  // Node: and/or
  if ((condition as ConditionNode).and) {
    const ch = (condition as ConditionNode).and as Condition[]
    return ch.every((c) => evaluateCondition(c, ctx))
  }
  if ((condition as ConditionNode).or) {
    const ch = (condition as ConditionNode).or as Condition[]
    return ch.some((c) => evaluateCondition(c, ctx))
  }

  // Leaf
  const leaf = condition as ConditionLeaf
  if (!leaf.field || !leaf.op) return false

  // left value
  let left = leaf.field
  let leftVal: unknown = undefined
  if (typeof left === 'string' && left.includes('.')) leftVal = resolvePath(left, ctx)
  else leftVal = left as unknown

  // right value
  let rightVal: unknown = leaf.value as unknown
  if (typeof rightVal === 'string' && (rightVal as string).includes('.')) {
    rightVal = resolvePath(rightVal as string, ctx)
  }

  return compare(leftVal, leaf.op as ComparisonOp, rightVal)
}

/**
 * Centralized permission check combining RBAC + ABAC
 * - Fetches user roles
 * - Fetches matching role_permissions
 * - Evaluates conditions (supports AND / OR and simple comparisons)
 */
export async function canAccess(
  userId: string,
  action: ActionType,
  resource: string,
  resourceContext: Record<string, unknown> = {}
): Promise<CanAccessResult> {
  const supabase = await createClient()

  if (!userId) return { allowed: false, reason: ['no-user'] }

  // 1. Load roles for user
  const { data: userRoles, error: urErr } = await supabase
    .from('user_roles')
    .select('role_id, roles(name, is_system)')
    .eq('user_id', userId)

  if (urErr) {
    return { allowed: false, reason: ['failed-to-load-roles', String(urErr.message || urErr)] }
  }

  const roles = Array.isArray(userRoles) ? userRoles : []

  // 2. Super Admin bypass
  for (const r of roles) {
    const roleMeta = (r as any).roles
    if (roleMeta && roleMeta.name === 'Super Admin') return { allowed: true, reason: ['super-admin'] }
  }

  const roleIds = roles.map((r: any) => r.role_id) as string[]
  if (roleIds.length === 0) return { allowed: false, reason: ['no-roles'] }

  // 3. Fetch role_permissions that match resource + action for these roles
  const { data: permsData, error: permsErr } = await supabase
    .from('role_permissions')
    .select('id, role_id, resource, action, conditions')
    .in('role_id', roleIds)
    .eq('resource', resource)
    .eq('action', action)

  if (permsErr) {
    return { allowed: false, reason: ['failed-to-load-permissions', String(permsErr.message || permsErr)] }
  }

  const perms = Array.isArray(permsData) ? permsData : []

  if (perms.length === 0) return { allowed: false, reason: ['no-matching-permissions'] }

  // 4. Evaluate permissions: if any permission grants access (conditions satisfied or empty), allow
  const reasons: string[] = []

  // merged context available to condition evaluator
  const ctx = {
    user: { id: userId },
    resource: resourceContext,
    env: { now: new Date().toISOString() },
  } as Record<string, unknown>

  for (const p of perms) {
    const cond = (p as any).conditions as Condition | undefined
    if (!cond || (typeof cond === 'object' && Object.keys(cond).length === 0)) {
      reasons.push(`role:${(p as any).role_id} -> allow (no-conditions)`)
      return { allowed: true, reason: reasons }
    }

    try {
      const ok = evaluateCondition(cond as Condition, ctx)
      reasons.push(`role:${(p as any).role_id} -> ${ok ? 'allowed' : 'denied'} (conditions)`)
      if (ok) return { allowed: true, reason: reasons }
    } catch (e) {
      reasons.push(`role:${(p as any).role_id} -> error evaluating conditions`)
    }
  }

  return { allowed: false, reason: reasons }
}

export { evaluateCondition }
