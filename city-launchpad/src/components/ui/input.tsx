import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#252729] bg-[#151719] px-3.5 py-2 text-sm text-[#F5F5F2] placeholder:text-[#858783]',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F5B94C] focus-visible:border-[#F5B94C]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
