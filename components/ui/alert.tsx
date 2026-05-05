import React from 'react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  className?: string
}

export function Alert({ children, variant = 'default', className = '' }: AlertProps) {
  const variantClasses = {
    default: 'bg-blue-50 border border-blue-200 text-blue-900',
    destructive: 'bg-red-50 border border-red-200 text-red-900',
    success: 'bg-green-50 border border-green-200 text-green-900',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
  }

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

export function AlertDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm ${className}`}>{children}</div>
}
