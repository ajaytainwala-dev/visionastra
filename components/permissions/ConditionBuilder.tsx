"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

type Leaf = { id: string; field: string; op: string; value: string }
type Group = { id: string; type: 'and' | 'or'; items: Array<Group | Leaf> }

function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2, 9) }

function isGroup(item: any): item is Group { return item && (item.type === 'and' || item.type === 'or') }

export default function ConditionBuilder({
  value,
  onChange,
}: {
  value?: any
  onChange?: (v: any) => void
}) {
  const [root, setRoot] = useState<Group>(() => value && value.type ? value as Group : { id: uid('g_'), type: 'and', items: [] })

  useEffect(() => {
    if (value) setRoot(value)
  }, [value])

  useEffect(() => {
    onChange?.(root)
  }, [root, onChange])

  const addCondition = useCallback((groupId: string) => {
    setRoot((r) => {
      const copy = JSON.parse(JSON.stringify(r)) as Group
      function walk(g: Group) {
        if (g.id === groupId) {
          g.items.push({ id: uid('c_'), field: 'user.id', op: '==', value: 'resource.ownerId' })
          return true
        }
        for (const it of g.items) if (isGroup(it) && walk(it)) return true
        return false
      }
      walk(copy)
      return copy
    })
  }, [])

  const addGroup = useCallback((groupId: string, type: 'and' | 'or') => {
    setRoot((r) => {
      const copy = JSON.parse(JSON.stringify(r)) as Group
      function walk(g: Group) {
        if (g.id === groupId) {
          g.items.push({ id: uid('g_'), type, items: [] })
          return true
        }
        for (const it of g.items) if (isGroup(it) && walk(it)) return true
        return false
      }
      walk(copy)
      return copy
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setRoot((r) => {
      const copy = JSON.parse(JSON.stringify(r)) as Group
      function walk(g: Group) {
        g.items = g.items.filter(it => it.id !== id)
        for (const it of g.items) if (isGroup(it)) walk(it)
      }
      walk(copy)
      return copy
    })
  }, [])

  const updateLeaf = useCallback((id: string, patch: Partial<Leaf>) => {
    setRoot((r) => {
      const copy = JSON.parse(JSON.stringify(r)) as Group
      function walk(g: Group) {
        for (const it of g.items) {
          if (!isGroup(it) && it.id === id) Object.assign(it, patch)
          if (isGroup(it)) walk(it)
        }
      }
      walk(copy)
      return copy
    })
  }, [])

  function renderGroup(g: Group, depth = 0) {
    return (
      <div key={g.id} className="pl-4 border-l border-outline-variant ml-2 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-xs font-bold uppercase">{g.type.toUpperCase()}</Label>
          <div className="flex-1" />
          <Button size="sm" variant="ghost" onClick={() => addCondition(g.id)}><Plus className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => addGroup(g.id, g.type === 'and' ? 'or' : 'and')}>Add Group</Button>
        </div>

        <div className="space-y-2">
          {g.items.map(it => isGroup(it) ? renderGroup(it as Group, depth+1) : renderLeaf(it as Leaf))}
        </div>
      </div>
    )
  }

  function renderLeaf(leaf: Leaf) {
    return (
      <div key={leaf.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-outline-variant">
        <Input value={leaf.field} onChange={(e) => updateLeaf(leaf.id, { field: e.target.value })} className="w-64" />
        <Select value={leaf.op} onValueChange={(v) => updateLeaf(leaf.id, { op: v || undefined })}>
          <SelectTrigger className="h-9 w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="==">==</SelectItem>
            <SelectItem value="!=">!=</SelectItem>
            <SelectItem value=">">&gt;</SelectItem>
            <SelectItem value=">=">&gt;=</SelectItem>
            <SelectItem value="<">&lt;</SelectItem>
            <SelectItem value="<=">&lt;=</SelectItem>
            <SelectItem value="in">in</SelectItem>
            <SelectItem value="contains">contains</SelectItem>
          </SelectContent>
        </Select>
        <Input value={leaf.value} onChange={(e) => updateLeaf(leaf.id, { value: e.target.value })} className="flex-1" />
        <Button variant="ghost" onClick={() => removeItem(leaf.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )
  }

  return (
    <div>
      {renderGroup(root)}
    </div>
  )
}
