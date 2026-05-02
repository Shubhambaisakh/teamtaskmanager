import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const markReadSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  all: z.boolean().optional(),
}).refine((data) => data.ids || data.all, {
  message: 'Either ids or all must be provided',
})

export async function GET() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get last 20 notifications with task and project info
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`
        *,
        tasks(
          id,
          title,
          projects(id, name)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = markReadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 422 }
      )
    }

    let query = supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)

    if (validation.data.ids) {
      query = query.in('id', validation.data.ids)
    }

    const { error } = await query

    if (error) {
      console.error('Error marking notifications as read:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
