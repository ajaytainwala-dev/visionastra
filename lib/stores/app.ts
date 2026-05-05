import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

export interface UserProfile {
  id: string
  email: string
  role_names: string[]
  permissions: Array<{ resource: string; action: string }>
}

export interface AppStore {
  // User state
  user: UserProfile | null
  loading: boolean
  error: string | null

  // Tenant state
  tenantId: string | null
  tenants: Array<{ id: string; name: string }> | null

  // Sandbox mode
  sandboxRoleId: string | null
  isSandboxMode: boolean

  // Methods
  fetchUser: () => Promise<void>
  fetchTenants: () => Promise<void>
  setTenant: (tenantId: string) => void
  enableSandboxMode: (roleId: string) => void
  disableSandboxMode: () => void
  logout: () => Promise<void>
  clearError: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  tenantId: null,
  tenants: null,
  sandboxRoleId: null,
  isSandboxMode: false,

  fetchUser: async () => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        set({ user: null, loading: false })
        return
      }

      // Fetch user profile with roles and permissions
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role:role_id(name)')
        .eq('user_id', authUser.id)

      const { data: permissions } = await supabase
        .from('role_permissions')
        .select('resource, action')
        .in('role_id', userRoles?.map((ur: any) => ur.role_id) || [])

      const user: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        role_names: userRoles?.map((ur: any) => ur.role?.name).filter(Boolean) || [],
        permissions: permissions || [],
      }

      set({ user, loading: false })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  fetchTenants: async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: tenants } = await supabase
        .from('tenants')
        .select('id, name')
        .eq('created_by', user.id)

      set({ tenants: tenants || [] })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  setTenant: (tenantId: string) => {
    set({ tenantId })
    localStorage.setItem('selectedTenantId', tenantId)
  },

  enableSandboxMode: (roleId: string) => {
    set({ sandboxRoleId: roleId, isSandboxMode: true })
  },

  disableSandboxMode: () => {
    set({ sandboxRoleId: null, isSandboxMode: false })
  },

  logout: async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      set({ user: null, tenantId: null, sandboxRoleId: null, isSandboxMode: false })
    } catch (e: any) {
      set({ error: e.message })
    }
  },

  clearError: () => set({ error: null }),
}))
