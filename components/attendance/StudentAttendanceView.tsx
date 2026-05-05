import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface AttendanceRecord {
  id: string
  session_id: string
  student_id: string
  status: 'present' | 'absent' | 'late'
  marked_at: string
  created_at: string
}

interface StudentAttendanceViewProps {
  courseId?: string
}

export function StudentAttendanceView({ courseId }: StudentAttendanceViewProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 })

  useEffect(() => {
    fetchRecords()
  }, [courseId])

  async function fetchRecords() {
    try {
      // This would need to be updated to filter by courseId and current user
      const res = await fetch('/api/attendance/records')
      if (!res.ok) throw new Error('Failed to fetch attendance')
      const { data } = await res.json()
      setRecords(data || [])

      // Calculate stats
      const stats = { present: 0, absent: 0, late: 0 }
      data?.forEach((r: AttendanceRecord) => {
        stats[r.status]++
      })
      setStats(stats)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800',
  }

  if (loading) return <div className="text-center p-4">Loading attendance...</div>
  if (error) return <Alert><AlertDescription>Error: {error}</AlertDescription></Alert>

  const totalSessions = records.length
  const attendance = totalSessions > 0 ? ((stats.present + stats.late) / totalSessions * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{totalSessions}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </Card>
        <Card className="p-4 text-center bg-green-50">
          <div className="text-2xl font-bold text-green-700">{stats.present}</div>
          <div className="text-sm text-green-600">Present</div>
        </Card>
        <Card className="p-4 text-center bg-red-50">
          <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
          <div className="text-sm text-red-600">Absent</div>
        </Card>
        <Card className="p-4 text-center bg-yellow-50">
          <div className="text-2xl font-bold text-yellow-700">{stats.late}</div>
          <div className="text-sm text-yellow-600">Late</div>
        </Card>
      </div>

      {/* Attendance Percentage */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span>Attendance Rate</span>
          <div className="text-2xl font-bold">{attendance}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${attendance}%` }}
          />
        </div>
      </Card>

      {/* Attendance Records Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Session</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Marked At</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  No attendance records yet
                </td>
              </tr>
            ) : (
              records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{record.session_id}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge className={statusColor[record.status]}>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {format(new Date(record.marked_at), 'MMM d, HH:mm')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
