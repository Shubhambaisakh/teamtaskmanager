'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  read_at: string | null
  created_at: string
  task_id: string | null
  tasks: {
    id: string
    title: string
    project_id: string
  } | null
  projects: {
    id: string
    name: string
  } | null
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (ids: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n => 
          ids.includes(n.id) ? { ...n, read: true, read_at: new Date().toISOString() } : n
        ))
        setUnreadCount(prev => Math.max(0, prev - ids.length))
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ all: true }),
      })

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true, read_at: new Date().toISOString() })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Subscribe to realtime notifications
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchNotifications()
          }
        )
        .subscribe()
    }

    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}
