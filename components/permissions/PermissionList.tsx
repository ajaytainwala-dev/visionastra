'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PermissionForm from './PermissionForm'

export default function PermissionList() {
  const [perms, setPerms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function fetchPerms() {
    setLoading(true)
    try {
      const res = await fetch('/api/permissions')
      const payload = await res.json()
      setPerms(payload.data || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { fetchPerms() }, [])

  function openCreate() { setEditing(null); setShowForm(true) }
  function openEdit(p: any) { setEditing(p); setShowForm(true) }

  async function handleDelete(id: string) {
    if (!confirm('Delete permission?')) return
    try {
      const res = await fetch(`/api/permissions?id=${id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Failed')
      setPerms((s) => s.filter(x => x.id !== id))
    } catch (e) { console.error(e) }
  }

  function onSaved() { setShowForm(false); setEditing(null); fetchPerms() }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Permissions</h2>
        <Button onClick={openCreate}>+ New Permission</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perms.map(p => (
          <Card key={p.id}>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{p.resource} · {p.action}</div>
                  <div className="text-sm text-secondary">role: {p.role_id}</div>
                </div>
                <div className="text-sm text-secondary">{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="text-xs font-mono max-h-32 overflow-auto">{JSON.stringify(p.conditions || {}, null, 2)}</pre>
              <div className="flex gap-2 justify-end mt-3">
                <Button variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="p-4 bg-surface-bright border rounded-lg">
          <PermissionForm permission={editing} onSaved={onSaved} onCancelled={() => setShowForm(false)} />
        </div>
      )}
    </div>
  )
}
