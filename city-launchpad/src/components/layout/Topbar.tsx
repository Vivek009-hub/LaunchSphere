'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { getInitials } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/city-intelligence': 'City Intelligence',
  '/local-connect': 'Local Connect',
  '/market-validation': 'Market Validation',
  '/market-proof': 'Market Proof',
  '/settings': 'Settings',
  '/onboarding': 'Setup your profile',
}

interface TopbarProps {
  user: SupabaseUser | null
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Find best matching title
  const title =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ??
    'City Launchpad'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const displayName = user?.user_metadata?.name ?? user?.email ?? 'User'
  const initials = getInitials(displayName)

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell (non-functional placeholder — labelled) */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications (coming soon)"
          title="Notifications — coming in a future phase"
          disabled
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User info */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {initials}
          </div>
          <span className="max-w-[120px] truncate text-sm text-slate-300">
            {user?.email ?? 'User'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          aria-label="Sign out"
          id="btn-sign-out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
