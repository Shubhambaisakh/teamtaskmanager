import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCommentSchema } from '@/lib/validations/comment.schema'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to this task's project
    const { data: task } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', id)
      .single()

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { data: membership } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch comments with author profiles
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        body,
        created_at,
        updated_at,
        deleted_at,
        author_id,
        profiles!comments_author_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('task_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Transform comments to hide soft-deleted bodies
    const transformedComments = (comments || []).map((comment: any) => ({
      id: comment.id,
      body: comment.deleted_at ? null : comment.body,
      is_deleted: !!comment.deleted_at,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      author: {
        id: comment.profiles.id,
        full_name: comment.profiles.full_name,
        email: comment.profiles.email,
        avatar_url: comment.profiles.avatar_url,
      },
    }))

    return NextResponse.json(transformedComments)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to this task's project
    const { data: task } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('id', id)
      .single()

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { data: membership } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', task.project_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const validation = createCommentSchema.safeParse(body)

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

    // Create comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        task_id: id,
        author_id: user.id,
        body: validation.data.body,
      })
      .select(`
        id,
        body,
        created_at,
        updated_at,
        deleted_at,
        author_id,
        profiles!comments_author_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Transform comment
    const transformedComment = {
      id: comment.id,
      body: comment.body,
      is_deleted: false,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      author: {
        id: (comment.profiles as any).id,
        full_name: (comment.profiles as any).full_name,
        email: (comment.profiles as any).email,
        avatar_url: (comment.profiles as any).avatar_url,
      },
    }

    return NextResponse.json(transformedComment, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
