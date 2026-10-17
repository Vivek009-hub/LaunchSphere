import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  id?: string
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  badge?: string
  isDemo?: boolean
  className?: string
  onClick?: () => void
}

export function StatCard({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10',
  trend,
  badge,
  isDemo = false,
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card
      id={id}
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:border-slate-700 hover:shadow-lg',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {title}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center text-xs font-medium',
                    trend.direction === 'up' && 'text-emerald-400',
                    trend.direction === 'down' && 'text-rose-400',
                    trend.direction === 'neutral' && 'text-slate-400'
                  )}
                >
                  {trend.direction === 'up' && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
                  {trend.direction === 'down' && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                  {trend.direction === 'neutral' && <Minus className="mr-0.5 h-3 w-3" />}
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
            {badge && (
              <Badge variant="secondary" className="text-[10px]">
                {badge}
              </Badge>
            )}
            {isDemo && (
              <Badge variant="demo" className="text-[9px]">
                Demo
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
