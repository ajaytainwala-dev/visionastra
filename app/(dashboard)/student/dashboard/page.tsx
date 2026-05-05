import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface StudentStats {
  enrolledCourses: number
  averageGPA: number
  attendanceRate: number
  pendingAssignments: number
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({ enrolledCourses: 0, averageGPA: 0, attendanceRate: 0, pendingAssignments: 0 })
  const [courses, setCourses] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch submitted assignments
      const submissionsRes = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(10)

      setSubmissions(submissionsRes.data || [])

      // Calculate stats
      const graded = submissionsRes.data?.filter(s => s.score !== null) || []
      const avgGrade = graded.length > 0
        ? (graded.reduce((sum: number, s: any) => sum + s.score, 0) / graded.length).toFixed(1)
        : 0

      setStats({
        enrolledCourses: 0,
        averageGPA: parseFloat(avgGrade as string),
        attendanceRate: 0,
        pendingAssignments: submissionsRes.data?.filter(s => s.score === null).length || 0,
      })
    } catch (e: any) {
      console.error('Failed to fetch student data:', e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600">Track your progress and assignments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.enrolledCourses}</div>
          <div className="text-sm text-gray-600 mt-2">Enrolled Courses</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.averageGPA.toFixed(1)}</div>
          <div className="text-sm text-gray-600 mt-2">Average Grade</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.attendanceRate}%</div>
          <div className="text-sm text-gray-600 mt-2">Attendance Rate</div>
        </Card>
        <Card className="p-6 text-center bg-orange-50">
          <div className="text-3xl font-bold text-orange-700">{stats.pendingAssignments}</div>
          <div className="text-sm text-orange-600 mt-2">Pending Review</div>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {submissions.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No submissions yet</Card>
          ) : (
            <div className="space-y-3">
              {submissions.map(sub => (
                <Card key={sub.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">Assignment {sub.assignment_id}</p>
                      <p className="text-sm text-gray-600">Submitted: {format(new Date(sub.submitted_at), 'MMM d, HH:mm')}</p>
                      {sub.notes && <p className="text-sm mt-1">{sub.notes}</p>}
                    </div>
                    <div className="text-right">
                      {sub.score !== null ? (
                        <div>
                          <p className="text-2xl font-bold">{sub.score}</p>
                          <p className="text-xs text-gray-600">out of 100</p>
                        </div>
                      ) : (
                        <Badge variant="outline">Pending Grading</Badge>
                      )}
                    </div>
                  </div>
                  {sub.feedback && (
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <p className="text-blue-900"><strong>Feedback:</strong> {sub.feedback}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Grade Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Grade</span>
                <span className="font-semibold">{stats.averageGPA.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.averageGPA}%` }}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card className="p-8 text-center text-gray-500">
            Loading attendance records...
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
