'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { AvatarWithFallback } from '@/components/shared/AvatarWithFallback'
import { NotificationsDropdown } from '@/components/layout/NotificationsDropdown'
import { GlobalSearch } from '@/components/shared/GlobalSearch'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  user: User
  profile: {
    full_name: string
    email: string
    avatar_url: string | null
    role?: 'admin' | 'member'
  } | null
}

export function Navbar({ user, profile }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Failed to sign out')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="h-16 bg-[#0E0E16] border-b border-white/[0.06] flex items-center justify-between px-6 backdrop-blur-sm">
      <div className="flex items-center flex-1 max-w-2xl">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        <NotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/[0.05] transition-all duration-200 ring-2 ring-transparent hover:ring-[#00BFA5]/30">
            <AvatarWithFallback
              src={profile?.avatar_url}
              alt={profile?.full_name || 'User'}
              fallback={profile?.full_name?.[0] || 'U'}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#16161F] border-white/[0.07]">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#E8E8F0]">{profile?.full_name}</p>
                    {profile?.role && (
                      <span className={`capitalize text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        profile.role === 'admin' 
                          ? 'bg-[#00BFA5]/15 text-[#26D0B8]' 
                          : 'bg-white/[0.05] text-white/50'
                      }`}>
                        {profile.role}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {profile?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/[0.07]" />
            <DropdownMenuItem className="text-white/70 hover:text-[#E8E8F0] hover:bg-white/[0.05]">
              <a href="/settings" className="cursor-pointer flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.07]" />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-[#F87171] hover:text-[#F87171] hover:bg-[#F87171]/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
