import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5B94C]',
  {
    variants: {
      variant: {
        default: 'border-[#9A6B22]/40 bg-[#F5B94C]/10 text-[#FFD27A]',
        gold: 'border-[#F5B94C]/40 bg-[#F5B94C]/15 text-[#F5B94C] font-semibold',
        secondary: 'border-[#252729] bg-[#151719] text-[#B4B5B2]',
        success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
        warning: 'border-[#9A6B22]/40 bg-[#9A6B22]/20 text-[#FFD27A]',
        destructive: 'border-rose-500/30 bg-rose-950/40 text-rose-300',
        outline: 'border-[#252729] text-[#858783]',
        demo: 'border-[#F5B94C]/30 bg-[#F5B94C]/10 text-[#FFD27A] font-mono text-[10px]',
        unverified: 'border-[#252729] bg-[#151719] text-[#858783]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
