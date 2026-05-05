"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PermissionCreateSchema, PermissionUpdateSchema } from '@/lib/validation/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ConditionBuilder from './ConditionBuilder'

type Props = {
  permission?: any | null
  onSaved?: (p: any) => void
  onCancelled?: () => void
}

export default function PermissionForm({ permission, onSaved, onCancelled }: Props) {
  const isEdit = !!permission?.id
  const [roles, setRoles] = useState<any[]>([])
  const [condObj, setCondObj] = useState<any>(permission?.conditions ? permission.conditions : { id: 'root', type: 'and', items: [] })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<any>({
    resolver: zodResolver(isEdit ? PermissionUpdateSchema as any : PermissionCreateSchema as any),
    defaultValues: permission || { role_id: '', resource: '', action: 'read' }
  })

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    try {
      const res = await fetch('/api/roles')
      const payload = await res.json()
      setRoles(payload.data || [])
    } catch (e) { console.error(e) }
  }

  async function onSubmit(values: any) {
    try {
      const body = { ...values, conditions: condObj || {} }
      const res = await fetch('/api/permissions', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(isEdit ? { id: permission.id, ...body } : body) })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Failed')
      onSaved?.(payload.data)
      reset()
    } catch (e) {
      console.error(e)
      alert(String(e))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Role</Label>
        <select {...register('role_id')} className="w-full p-2 rounded border">
          <option value="">Select role</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <div>
        <Label>Resource</Label>
        <Input {...register('resource')} placeholder="e.g. courses, assignments, users" />
      </div>

      <div>
        <Label>Action</Label>
        <select {...register('action')} className="w-full p-2 rounded border">
          <option value="create">create</option>
          <option value="read">read</option>
          <option value="update">update</option>
          <option value="delete">delete</option>
        </select>
      </div>

      <ConditionBuilder value={condObj} onChange={(v) => setCondObj(v)} />

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => onCancelled?.()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isEdit ? 'Save' : 'Create'}</Button>
      </div>
    </form>
  )
}
