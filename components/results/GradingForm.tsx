import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface Submission {
  id: string
  assignment_id: string
  student_id: string
  submitted_at: string
  submission_url?: string
  notes?: string
  score?: number
  feedback?: string
  graded_at?: string
}

interface GradingProps {
  submission: Submission
  onGraded?: () => void
  onCancelled?: () => void
}

export function SubmissionGradingForm({ submission, onGraded, onCancelled }: GradingProps) {
  const [score, setScore] = useState<string>(submission.score?.toString() || '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGrade(e: React.FormEvent) {
    e.preventDefault()
    if (!score) {
      setError('Score is required')
      return
    }

    const scoreNum = parseFloat(score)
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setError('Score must be between 0 and 100')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submission.id,
          score: scoreNum,
          feedback: feedback || undefined,
          graded_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error('Failed to grade submission')
      onGraded?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-2">Submission Info</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Student ID:</span>
            <p className="font-mono text-xs">{submission.student_id}</p>
          </div>
          <div>
            <span className="text-gray-600">Submitted:</span>
            <p>{format(new Date(submission.submitted_at), 'MMM d, HH:mm')}</p>
          </div>
          {submission.submission_url && (
            <div className="col-span-2">
              <span className="text-gray-600">URL:</span>
              <p>
                <a href={submission.submission_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate">
                  {submission.submission_url}
                </a>
              </p>
            </div>
          )}
          {submission.notes && (
            <div className="col-span-2">
              <span className="text-gray-600">Student Notes:</span>
              <p className="text-sm">{submission.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <form onSubmit={handleGrade} className="space-y-4">
        <div>
          <Label htmlFor="score">Score (out of 100) *</Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            step="0.5"
            placeholder="85"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Label htmlFor="feedback">Feedback</Label>
          <textarea
            id="feedback"
            className="w-full p-2 border rounded text-sm"
            placeholder="Provide feedback to the student..."
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancelled} disabled={loading}>Cancel</Button>
          <Button onClick={handleGrade} disabled={loading}>
            {loading ? 'Saving...' : 'Save Grade'}
          </Button>
        </div>
      </form>

      {submission.graded_at && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            Graded on {format(new Date(submission.graded_at), 'MMM d, HH:mm')}
          </p>
        </Card>
      )}
    </div>
  )
}

interface StudentResultsProps {
  courseId?: string
}

export function StudentResults({ courseId }: StudentResultsProps) {
  const [results, setResults] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [courseId])

  async function fetchResults() {
    try {
      const params = new URLSearchParams()
      if (courseId) params.append('course_id', courseId)
      const res = await fetch(`/api/submissions?${params}`)
      if (!res.ok) throw new Error('Failed to fetch results')
      const { data } = await res.json()
      setResults(data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-4">Loading results...</div>
  if (error) return <Alert><AlertDescription>Error: {error}</AlertDescription></Alert>

  const avgScore = results.length > 0
    ? (results.reduce((sum, r) => sum + (r.score || 0), 0) / results.filter(r => r.score).length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {results.length > 0 && (
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Average Score</span>
            <span className="text-2xl font-bold text-blue-700">{avgScore}%</span>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {results.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">No submissions yet</Card>
        ) : (
          results.map(result => (
            <Card key={result.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{result.assignment_id}</p>
                  <p className="text-sm text-gray-600">Submitted: {format(new Date(result.submitted_at), 'MMM d, HH:mm')}</p>
                </div>
                <div className="text-right">
                  {result.score !== null && result.score !== undefined ? (
                    <div>
                      <div className="text-2xl font-bold">{result.score}</div>
                      <p className="text-xs text-gray-600">out of 100</p>
                    </div>
                  ) : (
                    <Badge variant="outline">Pending Grading</Badge>
                  )}
                </div>
              </div>
              {result.feedback && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <p className="text-gray-600"><strong>Feedback:</strong> {result.feedback}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
