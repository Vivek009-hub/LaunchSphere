'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, Menu, Search, Sun, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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
}: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // In demo mode or if offline
    }
    router.push('/login')
    router.refresh()
  }

  const displayName = user?.user_metadata?.name ?? (isDemo ? 'Shaurya Verma' : 'Founder')
  const email = user?.email ?? (isDemo ? 'founder@citylaunchpad.in' : 'user@startup.com')

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#252729] bg-[#080A0B] px-4 md:px-8 sticky top-0 z-20">
      {/* Left: Mobile hamburger & Global Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[#252729] bg-[#101314] text-[#B4B5B2] hover:text-[#F5F5F2] hover:bg-[#151719]"
            aria-label="Open mobile navigation menu"
            id="btn-open-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Global Search Input */}
        <div className="flex items-center gap-2.5 rounded-xl border border-[#252729] bg-[#101314] px-3.5 py-2 text-xs text-[#858783] w-full max-w-md focus-within:border-[#F5B94C]/60 focus-within:ring-1 focus-within:ring-[#F5B94C]/40 transition-all">
          <Search className="h-4 w-4 text-[#858783] shrink-0" />
          <input
            type="text"
            placeholder="Search cities, resources, partners, or anything..."
            className="w-full bg-transparent text-xs text-[#F5F5F2] placeholder-[#858783] focus:outline-none"
          />
          <kbd className="ml-auto flex items-center gap-0.5 rounded border border-[#252729] bg-[#151719] px-1.5 py-0.5 text-[10px] font-mono text-[#858783] shrink-0">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications, Profile, Sign Out */}
      <div className="flex items-center gap-3">
        {/* Theme toggle icon */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#858783] hover:text-[#F5F5F2] hover:bg-[#151719] transition-colors"
          title="Toggle theme"
        >
          <Sun className="h-4 w-4" />
        </button>

        {/* Notification bell with dot */}
        <div className="relative">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#858783] hover:text-[#F5F5F2] hover:bg-[#151719] transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#F5B94C] ring-2 ring-[#080A0B]" />
        </div>

        {/* User profile avatar chip */}
        <Link
          href="/settings"
          title={email}
          className="flex items-center gap-2.5 rounded-xl border border-[#252729] bg-[#101314] p-1.5 pr-3 hover:border-[#3A3D40] transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD27A] to-[#F5B94C] text-xs font-bold text-[#080A0B] shadow-sm">
            S
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#F5F5F2] leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-[#858783] leading-tight">
              Startup Founder
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-[#858783] hidden sm:block ml-1" />
        </Link>

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          aria-label={isDemo ? 'Exit demo view / sign out' : 'Sign out'}
          id="btn-sign-out"
          title={isDemo ? 'Exit demo view' : 'Sign out'}
          className="text-[#858783] hover:text-rose-400 hover:bg-rose-950/20 h-9 w-9 rounded-xl"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
