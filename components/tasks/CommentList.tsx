'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Comment {
  id: string
  body: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
  author: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }
}

interface CommentListProps {
  taskId: string
  currentUserId: string
  isAdmin: boolean
}

export function CommentList({ taskId, currentUserId, isAdmin }: CommentListProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    fetchComments()
  }, [taskId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: newComment }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to add comment')
        return
      }

      const comment = await response.json()
      setComments([...comments, comment])
      setNewComment('')
      toast.success('Comment added')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editBody.trim()) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: editBody }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to update comment')
        return
      }

      const updatedComment = await response.json()
      setComments(comments.map(c => c.id === commentId ? updatedComment : c))
      setEditingId(null)
      setEditBody('')
      toast.success('Comment updated')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete comment')
        return
      }

      // Mark as deleted in UI
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, body: null, is_deleted: true } 
          : c
      ))
      toast.success('Comment deleted')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Comments</h3>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <AvatarWithFallback
                src={comment.author.avatar_url}
                alt={comment.author.full_name}
                fallback={comment.author.full_name[0]}
                className="h-8 w-8 mt-1"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author.full_name}</span>
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {comment.updated_at !== comment.created_at && !comment.is_deleted && (
                    <span className="text-xs text-slate-400">(edited)</span>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(comment.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null)
                          setEditBody('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {comment.is_deleted ? (
                        <span className="italic text-slate-400">This comment was deleted</span>
                      ) : (
                        comment.body
                      )}
                    </p>

                    {!comment.is_deleted && (
                      <div className="flex gap-2 mt-2">
                        {comment.author.id === currentUserId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(comment.id)
                              setEditBody(comment.body || '')
                            }}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                        {(comment.author.id === currentUserId || isAdmin) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-4 border-t">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Comment'
          )}
        </Button>
      </form>
    </div>
  )
}
