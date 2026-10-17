import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'City Intelligence' }

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, icon: Clock },
  analyzing: { label: 'Analyzing', variant: 'warning' as const, icon: Clock },
  complete: { label: 'Complete', variant: 'success' as const, icon: CheckCircle },
  error: { label: 'Error', variant: 'destructive' as const, icon: AlertCircle },
}

export default async function CityIntelligencePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: comparisons, error } = await supabase
    .from('city_comparisons')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <PageShell>
        <PageHeader title="City Intelligence" />
        <div className="rounded-lg border border-rose-800/50 bg-rose-900/10 p-4 text-sm text-rose-400">
          Failed to load comparisons: {error.message}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="City Intelligence"
        description="Compare Indian cities using sourced market indicators and generate transparent Fit Scores."
        actions={
          <Link href="/city-intelligence/new">
            <Button id="btn-new-comparison">
              <Plus className="h-4 w-4" />
              New Comparison
            </Button>
          </Link>
        }
      />

      {(!comparisons || comparisons.length === 0) ? (
        <EmptyState
          icon={MapPin}
          title="No city comparisons yet"
          description="Create your first comparison to evaluate which city best fits your startup's product and target customer."
          action={
            <Link href="/city-intelligence/new">
              <Button id="btn-new-comparison-empty">
                <Plus className="h-4 w-4" />
                Start a Comparison
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((c) => {
            const status = statusConfig[c.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            return (
              <Link key={c.id} href={`/city-intelligence/${c.id}`} id={`comparison-${c.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:border-slate-700 hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm leading-snug">{c.title}</CardTitle>
                      <Badge variant={status.variant} className="flex-shrink-0 gap-1">
                        <StatusIcon className="h-2.5 w-2.5" />
                        {status.label}
                      </Badge>
                    </div>
                    <CardDescription>
                      {c.cities.join(' vs ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-600">
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
