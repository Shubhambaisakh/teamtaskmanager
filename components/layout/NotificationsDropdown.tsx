'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

export function NotificationsDropdown() {
  const router = useRouter()
  const { notifications, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const handleNotificationClick = async (notificationId: string, taskId: string | null, projectId: string | null) => {
    await markAsRead([notificationId])
    if (taskId && projectId) {
      router.push(`/projects/${projectId}/board`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              No notifications yet
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-3 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
                    !notification.read && 'bg-blue-50 dark:bg-blue-950'
                  )}
                  onClick={() => handleNotificationClick(
                    notification.id,
                    notification.task_id,
                    notification.tasks?.project_id || notification.projects?.id || null
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {notification.message}
                      </p>
                      {notification.tasks && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Task: {notification.tasks.title}
                        </p>
                      )}
                      {notification.projects && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Project: {notification.projects.name}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

