"use client"

import React from 'react'
import { Label } from '@/components/ui/label'

type Props = {
  value?: string
  onChange?: (val: string) => void
}

export default function ConditionEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">Conditions (JSON)</Label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder='e.g. { "and": [ { "field": "user.id", "op": "==", "value": "resource.ownerId" } ] }'
        className="w-full h-36 font-mono text-sm p-2 border rounded"
      />
    </div>
  )
}
