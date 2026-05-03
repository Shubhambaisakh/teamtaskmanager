import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { PasswordChangeForm } from '@/components/settings/PasswordChangeForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSettings profile={profile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">User ID</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>
    </div>
  )
}
