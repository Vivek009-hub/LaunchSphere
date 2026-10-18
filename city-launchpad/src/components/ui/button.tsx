import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B94C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A0B] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#F5B94C] text-[#080A0B] font-semibold hover:bg-[#FFD27A] shadow-md shadow-[#F5B94C]/20 active:scale-[0.98]',
        goldGradient:
          'bg-gradient-to-b from-[#FFD27A] to-[#F5B94C] text-[#080A0B] font-semibold hover:brightness-105 shadow-md shadow-[#F5B94C]/25 active:scale-[0.98]',
        destructive:
          'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 shadow-sm active:scale-[0.98]',
        outline:
          'border border-[#252729] bg-[#101314] text-[#B4B5B2] hover:bg-[#151719] hover:text-[#F5F5F2] hover:border-[#3A3D40] active:scale-[0.98]',
        secondary:
          'bg-[#151719] text-[#F5F5F2] border border-[#252729] hover:bg-[#1A1D20] hover:border-[#3A3D40] active:scale-[0.98]',
        ghost:
          'text-[#B4B5B2] hover:bg-[#151719] hover:text-[#F5F5F2]',
        link:
          'text-[#F5B94C] underline-offset-4 hover:underline hover:text-[#FFD27A] p-0 h-auto',
        success:
          'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 shadow-sm active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-sm font-semibold',
        xl: 'h-13 rounded-xl px-8 text-base font-semibold',
        icon: 'h-9 w-9 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
