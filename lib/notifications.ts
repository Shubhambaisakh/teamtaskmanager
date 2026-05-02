import { createClient } from '@/lib/supabase/server'

type NotificationType = 'task_assigned' | 'task_updated' | 'comment_added'

export async function createNotification(
  userId: string,
  type: NotificationType,
  taskId: string
) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        task_id: taskId,
        read: false,
      })

    if (error) {
      console.error('Error creating notification:', error)
    }
  } catch (error) {
    console.error('Unexpected error creating notification:', error)
  }
}
