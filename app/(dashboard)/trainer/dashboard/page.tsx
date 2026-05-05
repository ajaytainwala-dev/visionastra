import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface TrainerStats {
  courses: number
  students: number
  assignments: number
  pendingGrades: number
}

export default function TrainerDashboard() {
  const [stats, setStats] = useState<TrainerStats>({ courses: 0, students: 0, assignments: 0, pendingGrades: 0 })
  const [courses, setCourses] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch courses
      const coursesRes = await supabase.from('courses').select('*').eq('instructor_id', user.id)
      setCourses(coursesRes.data || [])

      // Fetch attendance sessions
      const sessionsRes = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('trainer_id', user.id)
        .order('session_date', { ascending: false })
        .limit(5)
      setSessions(sessionsRes.data || [])

      // Calculate stats
      setStats({
        courses: coursesRes.data?.length || 0,
        students: coursesRes.data?.length || 0, // Simplified - should join with enrollments
        assignments: 0, // To be calculated
        pendingGrades: 0, // To be calculated
      })
    } catch (e: any) {
      console.error('Failed to fetch trainer data:', e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <p className="text-gray-600">Manage your courses and student progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.courses}</div>
          <div className="text-sm text-gray-600 mt-2">Courses</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.students}</div>
          <div className="text-sm text-gray-600 mt-2">Students</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.assignments}</div>
          <div className="text-sm text-gray-600 mt-2">Assignments</div>
        </Card>
        <Card className="p-6 text-center bg-orange-50">
          <div className="text-3xl font-bold text-orange-700">{stats.pendingGrades}</div>
          <div className="text-sm text-orange-600 mt-2">Pending Grades</div>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grading">Grading Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
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
                    </div>
                    <Button size="sm">View Course</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          {sessions.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No recent sessions</Card>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <Card key={session.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{format(new Date(session.session_date), 'MMM d, yyyy HH:mm')}</p>
                      <p className="text-sm text-gray-600">{session.course_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{session.status}</Badge>
                      <Button size="sm" variant="outline">Mark</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="grading" className="space-y-4">
          <Card className="p-8 text-center text-gray-500">
            No pending grades at this time
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
