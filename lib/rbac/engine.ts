import { createClient } from '@/lib/supabase/server';

export type ActionType = 'create' | 'read' | 'update' | 'delete';

export async function hasPermission(resource: string, action: ActionType): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  // We call the Supabase RPC function we created in the migration
  const { data: hasAccess, error } = await supabase
    .rpc('has_permission', {
      p_user_id: user.id,
      p_resource: resource,
      p_action: action
    });

  if (error) {
    console.error('RBAC Engine Error:', error);
    return false;
  }

  return !!hasAccess;
}

export async function checkAbacAccess(resourceType: string, action: ActionType, resourceContext: any): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  // 1. First verify basic RBAC permission
  const hasRbac = await hasPermission(resourceType, action);
  if (!hasRbac) return false;

  // 2. Fetch specific role permissions for ABAC conditions evaluation
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role_id, roles(is_system)')
    .eq('user_id', user.id)
    .single();

  const isSystem = Array.isArray(roleData?.roles) ? roleData?.roles[0]?.is_system : (roleData?.roles as any)?.is_system;
  if (isSystem && roleData?.role_id /* is Super Admin */) {
      // Simplification: assume Super Admin has full access
      return true;
  }

  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('conditions')
    .eq('role_id', roleData?.role_id)
    .eq('resource', resourceType)
    .eq('action', action)
    .single();

  if (!permissions) return false;

  // 3. Evaluate ABAC Context locally (JSON logic)
  const conditions = permissions.conditions || {};
  
  if (Object.keys(conditions).length === 0) {
    return true; // No special ABAC conditions, pure RBAC allows it
  }

  // Example ABAC evaluation based on the requested examples
  // user.id == resource.ownerId
  if (conditions.owner_only === true) {
    if (resourceContext.ownerId !== user.id) {
      return false;
    }
  }

  // score > 90
  if (conditions.min_score !== undefined) {
    if (resourceContext.score < conditions.min_score) {
      return false;
    }
  }

  return true;
}
