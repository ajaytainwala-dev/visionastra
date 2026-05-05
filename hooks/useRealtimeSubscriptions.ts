import { useEffect } from 'react'
import { useAppStore } from '@/lib/stores/app'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeRoles() {
  const { user } = useAppStore()
  let channel: RealtimeChannel | null = null

  useEffect(() => {
    if (!user?.id) return

    const supabase = createClient()
    
    channel = supabase
      .channel(`roles-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roles',
        },
        async (payload) => {
          // Refresh user permissions when roles change
          await useAppStore.getState().fetchUser()
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id])
}

export function useRealtimeSubmissions(courseId?: string) {
  const { user } = useAppStore()
  let channel: RealtimeChannel | null = null

  useEffect(() => {
    if (!user?.id) return

    const supabase = createClient()

    const filter = courseId 
      ? `and.course_id.eq.${courseId}`
      : `and.student_id.eq.${user.id}`

    channel = supabase
      .channel(`submissions-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter,
        },
        async (payload) => {
          // Dispatch submission updates to store or trigger refetch
          console.log('Submission update:', payload)
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id, courseId])
}

export function useRealtimeAttendance(sessionId?: string) {
  const { user } = useAppStore()
  let channel: RealtimeChannel | null = null

  useEffect(() => {
    if (!user?.id) return

    const supabase = createClient()

    const filter = sessionId 
      ? `and.session_id.eq.${sessionId}`
      : ''

    channel = supabase
      .channel(`attendance-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_records',
          filter,
        },
        async (payload) => {
          console.log('Attendance update:', payload)
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id, sessionId])
}

export function useRealtimePermissions() {
  const { user } = useAppStore()
  let channel: RealtimeChannel | null = null

  useEffect(() => {
    if (!user?.id) return

    const supabase = createClient()

    channel = supabase
      .channel(`permissions-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'role_permissions',
        },
        async (payload) => {
          // Refresh user permissions when they change
          await useAppStore.getState().fetchUser()
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id])
}
