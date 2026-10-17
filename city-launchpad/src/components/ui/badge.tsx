import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-600/20 text-indigo-300',
        secondary: 'border-transparent bg-slate-700 text-slate-300',
        success: 'border-transparent bg-emerald-600/20 text-emerald-300',
        warning: 'border-transparent bg-amber-600/20 text-amber-300',
        destructive: 'border-transparent bg-rose-600/20 text-rose-300',
        outline: 'border-slate-700 text-slate-400',
        demo: 'border-amber-600/50 bg-amber-600/10 text-amber-400',
        unverified: 'border-slate-600 bg-slate-800 text-slate-500',
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
