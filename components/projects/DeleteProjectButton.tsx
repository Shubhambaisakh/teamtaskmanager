'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== projectName) {
      toast.error('Project name does not match')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete project')
        return
      }

      toast.success('Project deleted successfully')
      router.push('/projects')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Project
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated tasks, comments, and data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm">
                Type <span className="font-bold">{projectName}</span> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={projectName}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText !== projectName || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
