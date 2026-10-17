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
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
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
    label: 'Market Proof',
    href: '/market-proof',
    icon: ShieldCheck,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
          <Rocket className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          City Launchpad
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="mb-2 px-3 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Modules
          </p>
        </div>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 text-indigo-500 opacity-70" />
              )}
            </Link>
          )
        })}

        <div className="my-2 h-px bg-slate-800" />

        <Link
          href="/settings"
          id="nav-settings"
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
            pathname === '/settings'
              ? 'bg-indigo-600/15 text-indigo-400'
              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
          )}
        >
          <Settings
            className={cn(
              'h-4 w-4 flex-shrink-0',
              pathname === '/settings' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
            )}
          />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Footer hint */}
      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-600">
          Phase 2 · Hackathon build
        </p>
      </div>
    </aside>
  )
}
