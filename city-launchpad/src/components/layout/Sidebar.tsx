'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  Users,
  FlaskConical,
  ShieldCheck,
  Settings,
  Rocket,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: undefined,
  },
  {
    label: 'City Intelligence',
    href: '/city-intelligence',
    icon: MapPin,
    badge: undefined,
  },
  {
    label: 'Local Connect',
    href: '/local-connect',
    icon: Users,
    badge: undefined,
  },
  {
    label: 'Market Validation',
    href: '/market-validation',
    icon: FlaskConical,
    badge: undefined,
  },
  {
    label: 'Market Proof',
    href: '/market-proof',
    icon: ShieldCheck,
    badge: 'Loop',
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
      className={cn(
        'flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30 transition-transform group-hover:scale-105">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">
              City Launchpad
            </span>
            <span className="text-[10px] font-medium text-indigo-400">
              India Market Entry
            </span>
          </div>
        </Link>

        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main Navigation" className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="mb-2 px-3 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Platform Modules
          </p>
        </div>

        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={handleLinkClick}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 font-semibold shadow-sm border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                  {badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="h-3 w-3 text-indigo-400 opacity-80" aria-hidden="true" />
              )}
            </Link>
          )
        })}

        <div className="my-3 h-px bg-slate-800/80" />

        <div className="mb-1 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Account
          </p>
        </div>

        <Link
          href="/settings"
          id="nav-settings"
          onClick={handleLinkClick}
          aria-current={pathname === '/settings' ? 'page' : undefined}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            pathname === '/settings'
              ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          )}
        >
          <Settings
            className={cn(
              'h-4 w-4 flex-shrink-0',
              pathname === '/settings' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
            )}
            aria-hidden="true"
          />
          <span className="flex-1">Settings</span>
        </Link>
      </nav>

      {/* Footer Prototype Tag */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/60">
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-300 text-[11px]">Phase 2 Foundation</span>
            <span className="text-[10px] text-slate-500">B2B SaaS Prototype</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
