import React from 'react'
import { Info, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DemoBannerProps {
  message?: string
  className?: string
  compact?: boolean
}

export function DemoBanner({
  message = 'Demonstration prototype active. Sourced indicators and simulated benchmarks are displayed for verification.',
  className = '',
  compact = false,
}: DemoBannerProps) {
  if (compact) {
    return (
      <div
        role="status"
        aria-label="Demonstration data notice"
        className={`flex items-center gap-2 rounded-lg border border-[#F5B94C]/30 bg-[#F5B94C]/10 px-3 py-1.5 text-xs text-[#FFD27A] ${className}`}
      >
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-[#F5B94C]" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">Simulation</span>
        <span className="text-[#9A6B22]">·</span>
        <span className="text-[#F5F5F2] text-xs">{message}</span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-label="Demonstration environment notice"
      className={`mb-6 flex flex-col gap-2 rounded-2xl border border-[#252729] bg-[#101314] p-4 sm:flex-row sm:items-center sm:justify-between shadow-md ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#151719] border border-[#252729] text-[#F5B94C]">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="demo">Curated Benchmark Data</Badge>
            <span className="text-xs font-medium text-[#F5F5F2]">Simulation Mode</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#858783]">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-start text-[11px] font-mono text-[#858783] sm:self-center">
        <span>Verified Sources & Benchmarks</span>
      </div>
    </div>
  )
}
