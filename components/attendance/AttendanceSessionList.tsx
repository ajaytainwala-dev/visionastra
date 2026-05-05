import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface AttendanceSession {
  id: string
  batch_id: string
  trainer_id: string
  course_id: string
  session_date: string
  status: 'scheduled' | 'in_progress' | 'completed'
  created_at: string
}

interface AttendanceSessionListProps {
  courseId?: string
  onSessionSelect?: (session: AttendanceSession) => void
  onSessionAction?: (session: AttendanceSession, action: 'mark' | 'view' | 'edit') => void
}

export function AttendanceSessionList({ courseId, onSessionAction }: AttendanceSessionListProps) {
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [courseId])

  async function fetchSessions() {
    try {
      const res = await fetch('/api/attendance/sessions')
      if (!res.ok) throw new Error('Failed to fetch sessions')
      const { data } = await res.json()
      setSessions(data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  }

  const statusLabel = {
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
  }

  if (loading) return <div className="text-center p-4">Loading sessions...</div>
  if (error) return <Alert><AlertDescription>Error: {error}</AlertDescription></Alert>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Attendance Sessions</h2>
        <Button>+ New Session</Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No attendance sessions yet
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <Card key={session.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{format(new Date(session.session_date), 'MMM d, yyyy HH:mm')}</h3>
                    <Badge className={statusColor[session.status]}>
                      {statusLabel[session.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Course: <span className="font-medium">{session.course_id}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Trainer: <span className="font-medium">{session.trainer_id}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {session.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => onSessionAction?.(session, 'mark')}
                    >
                      Mark Attendance
                    </Button>
                  )}
                  {session.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSessionAction?.(session, 'view')}
                    >
                      View Records
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
