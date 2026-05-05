"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import RoleForm from './RoleForm'

type Role = {
  id: string
  name: string
  description?: string
  is_system?: boolean
}

export default function RoleList() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function fetchRoles() {
    setLoading(true)
    try {
      const res = await fetch('/api/roles')
      const payload = await res.json()
      setRoles(payload.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRoles() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete role? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/roles?id=${id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Failed')
      setRoles((r) => r.filter(x => x.id !== id))
    } catch (e) { console.error(e) }
  }

  function openCreate() { setEditing(null); setShowForm(true) }

  function openEdit(r: Role) { setEditing(r); setShowForm(true) }

  function onSaved(role: any) {
    // refresh list
    fetchRoles()
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Roles</h2>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>+ New Role</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(r => (
          <Card key={r.id} className="p-0">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center justify-between">
                <span>{r.name}</span>
                <div className="text-sm text-secondary">{r.is_system ? 'System' : 'Custom'}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="mb-4 text-sm text-secondary">{r.description}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(r.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="p-4 bg-surface-bright border rounded-lg">
          <RoleForm role={editing} onSaved={onSaved} onCancelled={() => setShowForm(false)} />
        </div>
      )}
    </div>
  )
}
