'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
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
    <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center flex-1 max-w-2xl">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-4">
        <NotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <AvatarWithFallback
              src={profile?.avatar_url}
              alt={profile?.full_name || 'User'}
              fallback={profile?.full_name?.[0] || 'U'}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.full_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/settings" className="cursor-pointer flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-red-600 dark:text-red-400 cursor-pointer"
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
