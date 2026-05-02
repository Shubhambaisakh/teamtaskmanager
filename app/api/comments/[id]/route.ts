import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCommentSchema } from '@/lib/validations/comment.schema'

export async function PATCH(
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

    // Verify user is the author
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (comment.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = updateCommentSchema.safeParse(body)

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

    // Update comment
    const { data: updatedComment, error } = await supabase
      .from('comments')
      .update({
        body: validation.data.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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
      console.error('Error updating comment:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Transform comment
    const transformedComment = {
      id: updatedComment.id,
      body: updatedComment.body,
      is_deleted: false,
      created_at: updatedComment.created_at,
      updated_at: updatedComment.updated_at,
      author: {
        id: (updatedComment.profiles as any).id,
        full_name: (updatedComment.profiles as any).full_name,
        email: (updatedComment.profiles as any).email,
        avatar_url: (updatedComment.profiles as any).avatar_url,
      },
    }

    return NextResponse.json(transformedComment)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    // Get comment with task and project info
    const { data: comment } = await supabase
      .from('comments')
      .select(`
        author_id,
        tasks!inner(
          project_id
        )
      `)
      .eq('id', id)
      .single()

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check if user is author or admin
    const isAuthor = comment.author_id === user.id
    
    let isAdmin = false
    if (!isAuthor) {
      const { data: membership } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', (comment.tasks as any).project_id)
        .eq('user_id', user.id)
        .single()

      isAdmin = membership?.role === 'admin'
    }

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only delete your own comments or be an admin' },
        { status: 403 }
      )
    }

    // Soft delete comment
    const { error } = await supabase
      .from('comments')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
