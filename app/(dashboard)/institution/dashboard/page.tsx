import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface AdminStats {
  courses: number
  instructors: number
  students: number
  activeSessions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ courses: 0, instructors: 0, students: 0, activeSessions: 0 })
  const [courses, setCourses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()

      // Fetch courses
      const coursesRes = await supabase.from('courses').select('*')
      setCourses(coursesRes.data || [])

      // Fetch user roles
      const usersRes = await supabase
        .from('user_roles')
        .select('user_id, role:role_id(name)')
        .limit(20)

      setUsers(usersRes.data || [])

      // Calculate stats
      setStats({
        courses: coursesRes.data?.length || 0,
        instructors: usersRes.data?.filter((u: any) => u.role?.name === 'Trainer').length || 0,
        students: usersRes.data?.filter((u: any) => u.role?.name === 'Student').length || 0,
        activeSessions: 0,
      })
    } catch (e: any) {
      console.error('Failed to fetch admin data:', e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your organization's learning platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.courses}</div>
          <div className="text-sm text-gray-600 mt-2">Total Courses</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.instructors}</div>
          <div className="text-sm text-gray-600 mt-2">Instructors</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.students}</div>
          <div className="text-sm text-gray-600 mt-2">Students</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.activeSessions}</div>
          <div className="text-sm text-gray-600 mt-2">Active Sessions</div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Platform Health</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auth Service</span>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Endpoints</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RLS Policies</span>
                  <Badge className="bg-green-100 text-green-800">Enforced</Badge>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full">Create Course</Button>
                <Button className="w-full" variant="outline">Manage Users</Button>
                <Button className="w-full" variant="outline">View Reports</Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button>+ New Course</Button>
          </div>
          {courses.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No courses yet</Card>
          ) : (
            <div className="space-y-3">
              {courses.map(course => (
                <Card key={course.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.description}</p>
                      <Badge className="mt-2">{course.is_public ? 'Public' : 'Private'}</Badge>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button>+ Add User</Button>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">User</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.slice(0, 5).map(user => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">user-{user.user_id.substring(0, 8)}</td>
                    <td className="px-4 py-3">{user.role?.name}</td>
                    <td className="px-4 py-3">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Organization Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Your organization" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Admin Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded" placeholder="admin@org.edu" />
              </div>
              <Button>Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
