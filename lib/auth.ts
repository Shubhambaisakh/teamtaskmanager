import { createClient } from '@/lib/supabase/server'

export async function getGlobalRole(userId: string) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return profile?.role || 'member'
}

export async function isGlobalAdmin(userId: string) {
  const role = await getGlobalRole(userId)
  return role === 'admin'
}
