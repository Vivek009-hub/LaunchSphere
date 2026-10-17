import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoBanner } from '@/components/shared/DemoBanner'
import Link from 'next/link'
import { MapPin, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { DEMO_COMPARISONS } from '@/lib/data/demoData'
import type { CityComparison } from '@/types/database'

export const metadata: Metadata = { title: 'City Intelligence' }

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, icon: Clock },
  analyzing: { label: 'Analyzing', variant: 'warning' as const, icon: Clock },
  complete: { label: 'Complete', variant: 'success' as const, icon: CheckCircle },
  error: { label: 'Error', variant: 'destructive' as const, icon: AlertCircle },
}

export default async function CityIntelligencePage() {
  let comparisons: CityComparison[] = []
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('city_comparisons')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        comparisons = data
      }
    }
  } catch {
    // Supabase offline / unconfigured
  }

  // Fallback to demo comparisons for Phase 2 UI prototype
  if (comparisons.length === 0) {
    comparisons = DEMO_COMPARISONS
    isDemo = true
  }

  return (
    <PageShell>
      <PageHeader
        title="City Intelligence"
        description="Compare Indian cities using sourced market indicators and generate transparent Fit Scores."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">
              Demo Cohorts
            </Badge>
          ) : undefined
        }
        actions={
          <Link href="/city-intelligence/new">
            <Button id="btn-new-comparison">
              <Plus className="h-4 w-4" />
              New Comparison
            </Button>
          </Link>
        }
      />

      {isDemo && (
        <DemoBanner
          message="Simulated city comparisons. In Phase 3 and Phase 5, newly configured comparisons will be saved to your Supabase project."
        />
      )}

      {comparisons.length === 0 ? (
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
            const status = statusConfig[c.status as keyof typeof statusConfig] ?? statusConfig.complete
            const StatusIcon = status.icon
            return (
              <Link key={c.id} href={`/city-intelligence/${c.id}`} id={`comparison-${c.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:border-slate-700 hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm leading-snug">{c.title}</CardTitle>
                      <Badge variant={status.variant} className="flex-shrink-0 gap-1 text-[10px]">
                        <StatusIcon className="h-2.5 w-2.5" />
                        {status.label}
                      </Badge>
                    </div>
                    <CardDescription>
                      {c.cities.join(' vs ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {new Date(c.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {c.scoring_model_version && (
                        <Badge variant="outline" className="border-slate-800 text-slate-400 text-[10px] font-mono">
                          {c.scoring_model_version}
                        </Badge>
                      )}
                    </div>
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
