'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { getInitials } from '@/lib/utils'

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Founder Dashboard', subtitle: 'Market-entry overview & progress' },
  '/city-intelligence': { title: 'City Intelligence', subtitle: 'Sourced metrics & fit scoring' },
  '/local-connect': { title: 'Local Connect', subtitle: 'Ecosystem partners & introductions' },
  '/market-validation': { title: 'Market Validation', subtitle: 'Experiments & measurable outcomes' },
  '/market-proof': { title: 'Market Proof Loop', subtitle: 'Assumption tracking & evidence link' },
  '/settings': { title: 'Account Settings', subtitle: 'Profile & preferences' },
  '/onboarding': { title: 'Setup Profile', subtitle: 'Configure your startup profile' },
}

interface TopbarProps {
  user?: SupabaseUser | null
  onOpenMobileMenu?: () => void
  isDemo?: boolean
  startupName?: string
}

export function Topbar({
  user,
  onOpenMobileMenu,
  isDemo = true,
  startupName = 'Kavach AgriTech',
}: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Match title
  const matched =
    Object.entries(PAGE_TITLES).find(([key]) =>
      pathname === key || pathname.startsWith(key + '/')
    )?.[1] ?? { title: 'City Launchpad', subtitle: 'Market Entry Platform' }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // In demo mode or if offline
    }
    router.push('/login')
    router.refresh()
  }

  const displayName = user?.user_metadata?.name ?? (isDemo ? 'Vivek Sharma' : 'Founder')
  const email = user?.email ?? (isDemo ? 'founder@kavachagri.in' : 'user@startup.com')
  const initials = getInitials(displayName)

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 md:px-6 backdrop-blur-md sticky top-0 z-20">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Open mobile navigation menu"
            id="btn-open-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold tracking-tight text-white">
              {matched.title}
            </h1>
            {isDemo && (
              <Badge variant="demo" className="hidden sm:inline-flex text-[10px] py-0 px-2">
                Demo Mode
              </Badge>
            )}
          </div>
          {matched.subtitle && (
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {matched.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Notifications, Profile, Sign Out */}
      <div className="flex items-center gap-2">
        {/* Notification bell (disabled placeholder) */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications (coming in later phase)"
          title="Notifications will be enabled in a future phase"
          className="text-slate-400 hover:text-slate-200"
          disabled
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* Demo profile / avatar card */}
        <div
          role="group"
          aria-label="Current user profile"
          title={email}
          className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 px-2.5 shadow-sm"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-inner">
            {initials}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-200 leading-tight">
                {displayName}
              </span>
              {isDemo && (
                <Sparkles className="h-3 w-3 text-amber-400" aria-label="Simulated profile" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
              {startupName}
            </span>
          </div>
        </div>

        {/* Sign Out / Exit demo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          aria-label={isDemo ? 'Exit demo view / sign out' : 'Sign out'}
          id="btn-sign-out"
          title={isDemo ? 'Exit demo view' : 'Sign out'}
          className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
