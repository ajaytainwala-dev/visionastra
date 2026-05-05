"use client"

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'

export default function AuditLogsList() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ action: '', resource_type: '', status: '' })
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  async function fetchLogs() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit),
        ...(filter.action && { action: filter.action }),
        ...(filter.resource_type && { resource_type: filter.resource_type }),
        ...(filter.status && { status: filter.status }),
      })

      const res = await fetch(`/api/audit-logs?${params}`)
      const payload = await res.json()
      setLogs(payload.data || [])
      setTotal(payload.count || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page, filter])

  function exportCSV() {
    const csv = [
      ['Timestamp', 'User ID', 'Action', 'Resource Type', 'Resource ID', 'Status', 'Details'].join(','),
      ...logs.map(l => [
        new Date(l.created_at).toISOString(),
        l.user_id || 'N/A',
        l.action,
        l.resource_type,
        l.resource_id || 'N/A',
        l.status,
        JSON.stringify(l.details || {}),
      ].map(v => `"${v}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${Date.now()}.csv`
    a.click()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Audit Logs</h2>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Search action..."
            value={filter.action}
            onChange={(e) => {
              setFilter({ ...filter, action: e.target.value })
              setPage(0)
            }}
          />
        </div>
        <Select value={filter.resource_type} onValueChange={(v) => {
          setFilter({ ...filter, resource_type: v })
          setPage(0)
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Resource Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="roles">Roles</SelectItem>
            <SelectItem value="role_permissions">Permissions</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="audit_logs">Audit Logs</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter.status} onValueChange={(v) => {
          setFilter({ ...filter, status: v })
          setPage(0)
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setFilter({ action: '', resource_type: '', status: '' }); setPage(0) }} variant="ghost">
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Timestamp</th>
                <th className="px-6 py-3 text-left font-bold">User</th>
                <th className="px-6 py-3 text-left font-bold">Action</th>
                <th className="px-6 py-3 text-left font-bold">Resource</th>
                <th className="px-6 py-3 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-xs font-mono">
                    {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-3 text-xs">{log.user_id?.slice(0, 8)}...</td>
                  <td className="px-6 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-6 py-3 text-xs">{log.resource_type}</td>
                  <td className="px-6 py-3">
                    <Badge variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {Math.min((page * limit) + 1, total)} to {Math.min((page + 1) * limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
