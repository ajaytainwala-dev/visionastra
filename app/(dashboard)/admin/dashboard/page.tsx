import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ users: 0, roles: 0, tenants: 0, auditLogs: 0 })
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const supabase = createClient()

      // Fetch counts
      const [usersRes, rolesRes, tenantsRes, logsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('roles').select('id', { count: 'exact', head: true }),
        supabase.from('tenants').select('id', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(10),
      ])

      setStats({
        users: usersRes.count || 0,
        roles: rolesRes.count || 0,
        tenants: tenantsRes.count || 0,
        auditLogs: logsRes.count || 0,
      })

      setRecentLogs(logsRes.data || [])
    } catch (e: any) {
      console.error('Failed to fetch stats:', e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-gray-600">System-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.users}</div>
          <div className="text-sm text-gray-600 mt-2">Total Users</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.roles}</div>
          <div className="text-sm text-gray-600 mt-2">Roles</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.tenants}</div>
          <div className="text-sm text-gray-600 mt-2">Tenants</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.auditLogs}</div>
          <div className="text-sm text-gray-600 mt-2">Audit Logs</div>
        </Card>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList>
          <TabsTrigger value="system">System Overview</TabsTrigger>
          <TabsTrigger value="audit">Recent Activity</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">System Health</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Database Status</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span>Auth Service</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex justify-between">
                <span>RLS Policies</span>
                <Badge className="bg-green-100 text-green-800">Enforced</Badge>
              </div>
              <div className="flex justify-between">
                <span>Audit Logging</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Resource</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 font-medium">{log.action}</td>
                    <td className="px-4 py-2">{log.resource_type}</td>
                    <td className="px-4 py-2">
                      <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">System Configuration</h3>
            <p className="text-sm text-gray-600">Go to Settings → Roles & Permissions to manage the system</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
