 'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AttendanceSession {
  id: string
  course_id: string
  trainer_id: string
  session_date: string
  status: 'scheduled' | 'in_progress' | 'completed'
  created_at: string
}

interface StudentWithAttendance {
  student_id: string
  student_name?: string
  status: 'present' | 'absent' | 'late'
  marked_at: string
}

interface AttendanceMarkFormProps {
  session: AttendanceSession
  onSaved?: () => void
  onCancelled?: () => void
}

export function AttendanceMarkForm({ session, onSaved, onCancelled }: AttendanceMarkFormProps) {
  const [records, setRecords] = useState<StudentWithAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRecords()
  }, [session.id])

  async function fetchRecords() {
    try {
      const res = await fetch(`/api/attendance/records?session_id=${session.id}`)
      if (!res.ok) throw new Error('Failed to fetch records')
      const { data } = await res.json()
      setRecords(data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateRecord(studentId: string, newStatus: 'present' | 'absent' | 'late') {
    setSaving(true)
    try {
      const recordId = records.find(r => r.student_id === studentId)?.student_id
      if (!recordId) return

      const res = await fetch('/api/attendance/records', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: recordId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update attendance')

      setRecords(records.map(r => r.student_id === studentId ? { ...r, status: newStatus, marked_at: new Date().toISOString() } : r))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center p-4">Loading records...</div>
  if (error) return <Alert><AlertDescription>Error: {error}</AlertDescription></Alert>

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Mark Attendance for {session.session_date}</h3>
        <p className="text-sm text-gray-600">Status: <Badge>{session.status}</Badge></p>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {records.length === 0 ? (
          <p className="text-gray-500">No student records for this session</p>
        ) : (
          records.map(record => (
            <div key={record.student_id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <span className="text-sm font-medium">{record.student_name || record.student_id}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={record.status === 'present' ? 'default' : 'outline'}
                  onClick={() => updateRecord(record.student_id, 'present')}
                  disabled={saving}
                >
                  Present
                </Button>
                <Button
                  size="sm"
                  variant={record.status === 'late' ? 'default' : 'outline'}
                  onClick={() => updateRecord(record.student_id, 'late')}
                  disabled={saving}
                >
                  Late
                </Button>
                <Button
                  size="sm"
                  variant={record.status === 'absent' ? 'default' : 'outline'}
                  onClick={() => updateRecord(record.student_id, 'absent')}
                  disabled={saving}
                >
                  Absent
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancelled}>Cancel</Button>
        <Button onClick={onSaved}>Done</Button>
      </div>
    </div>
  )
}
