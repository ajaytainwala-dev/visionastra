import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface Assignment {
  id: string
  title: string
  description?: string
  due_date: string
  max_score: number
}

interface SubmissionFormProps {
  assignment: Assignment
  onSubmitted?: () => void
  onCancelled?: () => void
}

export function SubmissionForm({ assignment, onSubmitted, onCancelled }: SubmissionFormProps) {
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOverdue = new Date(assignment.due_date) < new Date()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!submissionUrl.trim()) {
      setError('Submission URL is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: assignment.id,
          submission_url: submissionUrl,
          notes: notes || undefined,
          submitted_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error('Failed to submit assignment')
      setSubmissionUrl('')
      setNotes('')
      onSubmitted?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{assignment.title}</h3>
        {assignment.description && <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>}
        <div className="flex gap-4 mt-2 text-sm">
          <span>Due: {format(new Date(assignment.due_date), 'MMM d, yyyy HH:mm')}</span>
          <span>Max Score: {assignment.max_score}</span>
          {isOverdue && <span className="text-red-600 font-semibold">OVERDUE</span>}
        </div>
      </div>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="url">Submission URL *</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://github.com/... or https://..."
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <textarea
            id="notes"
            className="w-full p-2 border rounded text-sm"
            placeholder="Add any notes about your submission..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancelled} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
