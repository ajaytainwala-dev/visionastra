"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { RoleCreateSchema, RoleUpdateSchema } from '@/lib/validation/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { writeAudit } from '@/lib/audit'

type Role = {
  id?: string
  name: string
  description?: string
  is_system?: boolean
}

type Props = {
  role?: Role | null
  onSaved?: (role: Role) => void
  onCancelled?: () => void
}

const CreateSchema = RoleCreateSchema
const UpdateSchema = RoleUpdateSchema

export default function RoleForm({ role, onSaved, onCancelled }: Props) {
  const isEdit = !!role?.id

  const schema = isEdit ? UpdateSchema : CreateSchema

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues: role || { name: '', description: '', is_system: false }
  })

  async function onSubmit(values: any) {
    try {
      const url = '/api/roles'
      const method = isEdit ? 'PUT' : 'POST'
      const body = isEdit ? { id: role?.id, ...values } : values
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || 'Failed')
      onSaved?.(payload.data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Role Name</Label>
        <Input {...register('name')} placeholder="e.g. Trainer" />
        {errors?.name && <p className="text-red-600 text-sm">{(errors.name?.message as string) || 'Invalid'}</p>}
      </div>

      <div>
        <Label>Description</Label>
        <Input {...register('description')} placeholder="Optional description" />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => onCancelled?.()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isEdit ? 'Save Role' : 'Create Role'}</Button>
      </div>
    </form>
  )
}
