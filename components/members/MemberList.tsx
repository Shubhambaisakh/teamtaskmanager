'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface Member {
  id: string
  role: 'admin' | 'member'
  joined_at: string
  user_id: string
  profiles: {
    full_name: string
    email: string
    avatar_url: string | null
  }
}

interface MemberListProps {
  members: Member[]
  projectId: string
  currentUserId: string
  isAdmin: boolean
  adminCount: number
}

export function MemberList({
  members,
  projectId,
  currentUserId,
  isAdmin,
  adminCount,
}: MemberListProps) {
  const router = useRouter()
  const [removingMember, setRemovingMember] = useState<string | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null)

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to update role')
        return
      }

      toast.success('Member role updated successfully')
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return

    setRemovingMember(memberToRemove.id)
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: memberToRemove.user_id }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Failed to remove member')
        return
      }

      toast.success('Member removed successfully')
      setMemberToRemove(null)
      router.refresh()
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setRemovingMember(null)
    }
  }

  const canRemoveMember = (member: Member) => {
    if (!isAdmin) return false
    if (member.user_id === currentUserId && adminCount === 1) return false
    return true
  }

  const canChangeRole = (member: Member) => {
    if (!isAdmin) return false
    if (member.user_id === currentUserId && adminCount === 1 && member.role === 'admin') {
      return false
    }
    return true
  }

  return (
    <>
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-4">
              <AvatarWithFallback
                src={member.profiles.avatar_url}
                alt={member.profiles.full_name}
                fallback={member.profiles.full_name[0]}
                className="h-10 w-10"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {member.profiles.full_name}
                  {member.user_id === currentUserId && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                      (You)
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {member.profiles.email}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Joined {format(new Date(member.joined_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && canChangeRole(member) ? (
                <Select
                  value={member.role}
                  onValueChange={(value) => handleRoleChange(member.id, value as 'admin' | 'member')}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                  {member.role}
                </Badge>
              )}

              {canRemoveMember(member) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMemberToRemove(member)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToRemove?.profiles.full_name} from this
              project? They will lose access to all project tasks and data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
              disabled={!!removingMember}
            >
              {removingMember ? 'Removing...' : 'Remove Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
