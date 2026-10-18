import React from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-[#252729] bg-[#101314] px-6 py-16 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#151719] border border-[#252729]">
          <Icon className="h-6 w-6 text-[#858783]" />
        </div>
      )}
      <h3 className="mb-1 text-base font-semibold text-[#F5F5F2]">{title}</h3>
      {description && (
        <p className="mb-5 max-w-sm text-xs text-[#858783] leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
