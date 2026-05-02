import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { MemberList } from '@/components/members/MemberList'
import { InviteMemberForm } from '@/components/members/InviteMemberForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProjectMembersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch project members
  const { data: membersData, error } = await supabase
    .from('project_members')
    .select(`
      id,
      role,
      joined_at,
      user_id,
      profiles!inner(full_name, email, avatar_url)
    `)
    .eq('project_id', id)
    .order('joined_at', { ascending: true })

  if (error) {
    notFound()
  }

  // Transform the data to match the expected type
  const members = membersData?.map((member: any) => ({
    id: member.id,
    role: member.role,
    joined_at: member.joined_at,
    user_id: member.user_id,
    profiles: Array.isArray(member.profiles) ? member.profiles[0] : member.profiles,
  })) || []

  // Get current user's role
  const currentUserMember = members?.find(m => m.user_id === user.id)
  const isAdmin = currentUserMember?.role === 'admin'

  // Count admins
  const adminCount = members?.filter(m => m.role === 'admin').length || 0

  return (
    <div className="space-y-6">
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Team Member</CardTitle>
            <CardDescription>
              Add a new member to this project by entering their email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteMemberForm projectId={id} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {members?.length || 0} {members?.length === 1 ? 'member' : 'members'} in this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MemberList
            members={members || []}
            projectId={id}
            currentUserId={user.id}
            isAdmin={isAdmin}
            adminCount={adminCount}
          />
        </CardContent>
      </Card>
    </div>
  )
}
