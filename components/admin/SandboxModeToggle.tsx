'use client'

import React from 'react'
import { useAppStore } from '@/lib/stores/app'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'

export function SandboxModeToggle() {
  const { isSandboxMode, sandboxRoleId, enableSandboxMode, disableSandboxMode } = useAppStore()
  const [roles, setRoles] = React.useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    fetchRoles()
  }, [])

  async function fetchRoles() {
    try {
      const res = await fetch('/api/roles')
      const data = await res.json()
      if (data.data) {
        setRoles(data.data.filter((r: any) => r.name !== 'Super Admin'))
      }
    } catch (e) {
      console.error('Failed to fetch roles:', e)
    }
  }

  async function handleEnableSandbox(roleId: string) {
    setLoading(true)
    try {
      await enableSandboxMode(roleId)
    } finally {
      setLoading(false)
    }
  }

  async function handleDisableSandbox() {
    setLoading(false)
    try {
      await disableSandboxMode()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 border-yellow-200 bg-yellow-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900">Sandbox Mode</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Test the platform as a different role without switching accounts.
            </p>
            {isSandboxMode && sandboxRoleId ? (
              <Badge className="mt-3 bg-yellow-600">Testing as Role {sandboxRoleId.substring(0, 8)}</Badge>
            ) : (
              <p className="text-sm text-yellow-700 mt-2">Sandbox mode is disabled.</p>
            )}
          </div>
        </div>
        <div className="text-right">
          {isSandboxMode ? (
            <Button onClick={handleDisableSandbox} disabled={loading} size="sm">
              Exit Sandbox
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              {roles.length > 0 ? (
                roles.map(role => (
                  <Button
                    key={role.id}
                    onClick={() => handleEnableSandbox(role.id)}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    Test as {role.name}
                  </Button>
                ))
              ) : (
                <p className="text-xs text-gray-600">Loading roles...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
