import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <div className="min-h-screen flex bg-[#0A0A0F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto bg-[#0A0A0F] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
