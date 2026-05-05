 'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface TopStudent {
  id: string
  email: string
  score: number
  rank: number
}

export default function RecruiterDashboard() {
  const [leaderboard, setLeaderboard] = useState<TopStudent[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [stats, setStats] = useState({ topPerformers: 0, activeStudents: 0, avgGPA: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()

      // Fetch top performers by average grade
      const { data: topStudents } = await supabase
        .from('submissions')
        .select('student_id, score')
        .not('score', 'is', null)

      // Group by student and calculate average
      const studentScores: { [key: string]: { scores: number[]; email?: string } } = {}
      topStudents?.forEach(sub => {
        if (!studentScores[sub.student_id]) {
          studentScores[sub.student_id] = { scores: [] }
        }
        studentScores[sub.student_id].scores.push(sub.score)
      })

      // Calculate averages and sort
      const leaderboardData: TopStudent[] = Object.entries(studentScores)
        .map(([id, data]) => ({
          id,
          email: `student-${id.substring(0, 8)}@academy.edu`,
          score: Math.round(data.scores.reduce((a, b) => a + b) / data.scores.length),
          rank: 0,
        }))
        .sort((a, b) => b.score - a.score)
        .map((student, idx) => ({ ...student, rank: idx + 1 }))
        .slice(0, 10)

      setLeaderboard(leaderboardData)

      const avgGPA = leaderboardData.length > 0
        ? Math.round(leaderboardData.reduce((sum, s) => sum + s.score, 0) / leaderboardData.length)
        : 0

      setStats({
        topPerformers: leaderboardData.filter(s => s.score >= 85).length,
        activeStudents: leaderboardData.length,
        avgGPA,
      })

      // Fetch candidates (simplified - in real app would fetch from candidates table)
      setCandidates(leaderboardData.slice(0, 5))
    } catch (e: any) {
      console.error('Failed to fetch recruiter data:', e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <p className="text-gray-600">Identify and manage top talent</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.topPerformers}</div>
          <div className="text-sm text-gray-600 mt-2">Top Performers (85%+)</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.activeStudents}</div>
          <div className="text-sm text-gray-600 mt-2">Active Students</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold">{stats.avgGPA}%</div>
          <div className="text-sm text-gray-600 mt-2">Average Score</div>
        </Card>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
          <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Score</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaderboard.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-bold text-lg">#{student.rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-2xl font-bold">{student.score}%</span>
                    </td>
                    <td className="px-4 py-3">
                      {student.score >= 85 ? (
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      ) : student.score >= 75 ? (
                        <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          {candidates.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No candidates yet</Card>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate, idx) => (
                <Card key={candidate.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{candidate.email}</h3>
                      <p className="text-sm text-gray-600">Rank #{candidate.rank} • Score: {candidate.score}%</p>
                      <div className="mt-2 flex gap-2">
                        <Badge className="bg-green-100 text-green-800">Top Performer</Badge>
                      </div>
                    </div>
                    <Button size="sm">View Profile</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Skills in Demand</h3>
            <div className="space-y-3">
              {['Problem Solving', 'Programming', 'Communication', 'Teamwork', 'Leadership'].map(skill => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill}</span>
                    <span className="text-sm text-gray-600">Mastered</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
