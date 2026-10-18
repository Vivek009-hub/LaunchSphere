import React from 'react'
import { cn } from '@/lib/utils'
import { ShieldCheck, ShieldAlert } from 'lucide-react'

interface CoverageBarProps {
  coverage: number // 0-100%
  label?: string
  showPercentage?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function CoverageBar({
  coverage,
  label = 'Evidence Coverage',
  showPercentage = true,
  className,
  size = 'md',
}: CoverageBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(coverage)))

  // Visual cues
  const isHigh = clamped >= 80
  const isMedium = clamped >= 60 && clamped < 80
  const barColor = isHigh
    ? 'bg-[#F5B94C]'
    : isMedium
      ? 'bg-[#9A6B22]'
      : 'bg-amber-600'

  const statusLabel = isHigh
    ? 'High verification'
    : isMedium
      ? 'Moderate coverage'
      : 'Sparse evidence'

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${clamped}%, ${statusLabel}`}
      className={cn('flex flex-col gap-1.5', className)}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-[#858783]">
          {isHigh ? (
            <ShieldCheck className="h-3.5 w-3.5 text-[#F5B94C]" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 text-[#F5B94C]" />
          )}
          {label}
        </span>
        {showPercentage && (
          <span className="font-semibold text-[#F5F5F2] font-mono text-xs">
            {clamped}% <span className="text-[10px] text-[#858783] font-normal">({statusLabel})</span>
          </span>
        )}
      </div>

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-[#151719] border border-[#252729]',
          size === 'sm' ? 'h-1.5' : 'h-2'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
