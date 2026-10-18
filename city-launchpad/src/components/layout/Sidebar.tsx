'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileText,
  MapPin,
  Users,
  FlaskConical,
  ShieldCheck,
  Bookmark,
  Bell,
  Crown,
  ArrowRight,
  X,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const primaryNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'My Startup',
    href: '/settings',
    icon: FileText,
  },
  {
    label: 'City Intelligence',
    href: '/city-intelligence',
    icon: MapPin,
  },
  {
    label: 'Local Connect',
    href: '/local-connect',
    icon: Users,
  },
  {
    label: 'Market Validation',
    href: '/market-validation',
    icon: FlaskConical,
  },
  {
    label: 'Market Proof Loop',
    href: '/market-proof',
    icon: ShieldCheck,
  },
]

export const secondaryNavItems = [
  {
    label: 'Saved Items',
    href: '/city-intelligence',
    icon: Bookmark,
  },
  {
    label: 'Notifications',
    href: '/market-validation',
    icon: Bell,
    badge: '3',
  },
]

interface SidebarProps {
  onCloseMobile?: () => void
  isMobile?: boolean
  className?: string
}

export function Sidebar({ onCloseMobile, isMobile = false, className }: SidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile()
    }
  }

  return (
    <aside
      suppressHydrationWarning
      className={cn(
        'flex h-full w-64 flex-col border-r border-[#252729] bg-[#090B0C] text-[#F5F5F2] select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#252729] px-6">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-3 group focus:outline-none rounded-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD27A] to-[#F5B94C] text-[#080A0B] shadow-md shadow-[#F5B94C]/20 transition-transform group-hover:scale-105">
            <Rocket className="h-4 w-4 fill-current" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#F5F5F2]">
            City Launchpad
          </span>
        </Link>

        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-[#858783] hover:bg-[#151719] hover:text-[#F5F5F2] focus:outline-none"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3.5 py-4">
        {/* Main Nav Items */}
        <div className="space-y-6">
          <nav aria-label="Main Navigation" className="space-y-1">
            {primaryNavItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                label === 'Dashboard'
                  ? pathname === '/dashboard'
                  : label === 'My Startup'
                  ? pathname === '/settings' || pathname === '/onboarding'
                  : pathname === href || pathname.startsWith(href + '/')

              return (
                <Link
                  key={label}
                  href={href}
                  suppressHydrationWarning
                  id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={handleLinkClick}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[#151719] text-[#F5B94C] font-semibold border border-[#3A3D40] shadow-sm'
                      : 'text-[#B4B5B2] hover:bg-[#101314] hover:text-[#F5F5F2]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-[#F5B94C]' : 'text-[#858783] group-hover:text-[#B4B5B2]'
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Secondary Items: Saved Items, Notifications */}
          <div className="space-y-1 pt-2 border-t border-[#252729]/60">
            {secondaryNavItems.map(({ label, href, icon: Icon, badge }) => (
              <Link
                key={label}
                href={href}
                onClick={handleLinkClick}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-[#B4B5B2] hover:bg-[#101314] hover:text-[#F5F5F2] transition-colors"
              >
                <Icon className="h-4 w-4 text-[#858783] group-hover:text-[#B4B5B2]" />
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5B94C] text-[10px] font-bold text-[#080A0B]">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade to Pro Card */}
        <div className="pt-4">
          <div className="relative overflow-hidden rounded-2xl border border-[#252729] bg-gradient-to-b from-[#151719] to-[#101314] p-4 text-xs shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5B94C]/15 text-[#F5B94C]">
                <Crown className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm text-[#F5F5F2]">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-[#858783] leading-relaxed mb-3">
              Get deeper insights, more cities and advanced analysis.
            </p>
            <Link href="/city-intelligence/new" onClick={handleLinkClick}>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FFD27A] to-[#F5B94C] py-2 text-xs font-bold text-[#080A0B] hover:brightness-105 transition-all shadow-md shadow-[#F5B94C]/20 active:scale-[0.98] cursor-pointer"
              >
                <span>Upgrade</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
