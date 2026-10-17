import React from 'react'
import { Info, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DemoBannerProps {
  message?: string
  className?: string
  compact?: boolean
}

export function DemoBanner({
  message = 'Demonstration prototype active. Sourced indicators and simulated experiments are displayed for visual verification.',
  className = '',
  compact = false,
}: DemoBannerProps) {
  if (compact) {
    return (
      <div
        role="status"
        aria-label="Demonstration data notice"
        className={`flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 ${className}`}
      >
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
        <span className="font-medium">Demo data</span>
        <span className="text-amber-400/80">·</span>
        <span className="text-amber-300/90">{message}</span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-label="Demonstration environment notice"
      className={`mb-6 flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="demo">Demo Prototype</Badge>
            <span className="text-xs font-medium text-slate-300">Phase 2: UI Foundation</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-start text-[11px] text-slate-500 sm:self-center">
        <span>Curated Indian startup scenario</span>
      </div>
    </div>
  )
}
