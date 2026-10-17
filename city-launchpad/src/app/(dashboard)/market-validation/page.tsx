import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoBanner } from '@/components/shared/DemoBanner'
import Link from 'next/link'
import { FlaskConical, Plus, PlayCircle, CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import type { Experiment, ExperimentStatus } from '@/types/database'

export const metadata: Metadata = { title: 'Market Validation' }

const statusConfig: Record<
  ExperimentStatus,
  { label: string; variant: 'secondary' | 'warning' | 'success' | 'destructive'; icon: typeof Clock }
> = {
  planned: { label: 'Planned', variant: 'secondary', icon: Clock },
  active: { label: 'Active', variant: 'warning', icon: PlayCircle },
  complete: { label: 'Complete', variant: 'success', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
}

const methodLabels: Record<string, string> = {
  interview: 'Customer Interview',
  survey: 'Survey',
  'retailer-outreach': 'Retailer Outreach',
  'landing-page': 'Landing Page Test',
  pilot: 'Pilot Experiment',
}

const FALLBACK_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-001',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    title: 'Pune & Nashik FPO Willingness-to-Pay Survey',
    hypothesis: 'FPO directors will commit ₹450/month per storage pod for mobile temperature alert dashboard.',
    method: 'survey',
    city: 'Pune',
    target_metric: 'Willingness to pay',
    success_threshold: '≥ 50% positive willingness to pay (n=30)',
    status: 'complete',
    started_at: '2026-10-01T10:00:00Z',
    completed_at: '2026-10-12T16:00:00Z',
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-12T16:00:00Z',
  },
  {
    id: 'exp-002',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    title: 'Bengaluru Fresh Greens Retailer Outreach',
    hypothesis: 'Premium organic grocery chains will prioritize suppliers with certified temperature-controlled transit logs.',
    method: 'retailer-outreach',
    city: 'Bengaluru',
    target_metric: 'Retailer procurement interest',
    success_threshold: '8 out of 12 retailers request sample temperature telemetry log',
    status: 'active',
    started_at: '2026-10-10T09:00:00Z',
    completed_at: null,
    created_at: '2026-10-10T09:00:00Z',
    updated_at: '2026-10-16T10:30:00Z',
  },
  {
    id: 'exp-003',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    title: 'Indore APMC Mandi Power Reliability Observation',
    hypothesis: 'Rural mandi grid sheds power under 4 hours daily during peak daytime auction hours.',
    method: 'pilot',
    city: 'Indore',
    target_metric: 'Daily grid uptime',
    success_threshold: '> 20h uptime without generator fallback',
    status: 'planned',
    started_at: null,
    completed_at: null,
    created_at: '2026-10-17T09:00:00Z',
    updated_at: '2026-10-17T09:00:00Z',
  },
]

export default async function MarketValidationPage() {
  let experiments: Experiment[] = []
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('experiments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        experiments = data
      }
    }
  } catch {
    // Supabase unconfigured or offline
  }

  // Demo fallback for Phase 2 UI prototype
  if (experiments.length === 0) {
    experiments = FALLBACK_EXPERIMENTS
    isDemo = true
  }

  return (
    <PageShell>
      <PageHeader
        title="Market Validation"
        description="Define hypotheses, run experiments, and record real-world evidence. Expressions of interest ≠ purchases."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">
              Demo Experiments
            </Badge>
          ) : undefined
        }
        actions={
          <Link href="/market-validation/new">
            <Button id="btn-new-experiment">
              <Plus className="h-4 w-4" />
              New Experiment
            </Button>
          </Link>
        }
      />

      {isDemo && (
        <DemoBanner
          message="Simulated validation experiments. In Phase 7, live hypothesis creation, response tracking, and outcome scoring are activated."
        />
      )}

      {experiments.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No experiments yet"
          description="Define your first market hypothesis and the experiment you'll run to test it."
          action={
            <Link href="/market-validation/new">
              <Button id="btn-new-experiment-empty">
                <Plus className="h-4 w-4" />
                Define an Experiment
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp: Experiment) => {
            const status = statusConfig[exp.status] ?? statusConfig.planned
            const StatusIcon = status.icon
            return (
              <Link key={exp.id} href={`/market-validation/${exp.id}`} id={`experiment-${exp.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:border-slate-700 hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm leading-snug">{exp.title}</CardTitle>
                      <Badge variant={status.variant} className="flex-shrink-0 gap-1 text-[10px]">
                        <StatusIcon className="h-2.5 w-2.5" />
                        {status.label}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs">{exp.hypothesis}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px]">{exp.city}</Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {methodLabels[exp.method] ?? exp.method}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Target: {exp.success_threshold}
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
