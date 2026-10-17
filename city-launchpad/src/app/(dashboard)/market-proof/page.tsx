import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoBanner } from '@/components/shared/DemoBanner'
import Link from 'next/link'
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react'
import type { Metadata } from 'next'
import type { Assumption, AssumptionStatus } from '@/types/database'

export const metadata: Metadata = { title: 'Market Proof' }

const statusConfig: Record<
  AssumptionStatus,
  {
    label: string
    variant: 'success' | 'destructive' | 'warning' | 'secondary'
    icon: typeof CheckCircle2
    description: string
  }
> = {
  supported: { label: 'Supported', variant: 'success', icon: CheckCircle2, description: 'Evidence supports this assumption' },
  challenged: { label: 'Challenged', variant: 'warning', icon: AlertTriangle, description: 'Evidence challenges this assumption' },
  invalidated: { label: 'Invalidated', variant: 'destructive', icon: XCircle, description: 'Evidence invalidates this assumption' },
  untested: { label: 'Untested', variant: 'secondary', icon: HelpCircle, description: 'No evidence collected yet' },
}

const FALLBACK_ASSUMPTIONS: Assumption[] = [
  {
    id: 'assump-001',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    statement: 'FPOs will pay ₹450/month per unit for real-time mobile temperature & spoilage alerts.',
    source_type: 'manual',
    status: 'supported',
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-12T16:00:00Z',
  },
  {
    id: 'assump-002',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    statement: 'Tier-2 Mandis in Indore provide reliable 3-phase grid power for farm-gate cold units.',
    source_type: 'city-intelligence',
    status: 'challenged',
    created_at: '2026-10-05T11:00:00Z',
    updated_at: '2026-10-14T09:30:00Z',
  },
  {
    id: 'assump-003',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    statement: 'Organized retailers in Bengaluru demand API integration with existing ERP / POS software.',
    source_type: 'manual',
    status: 'untested',
    created_at: '2026-10-10T14:20:00Z',
    updated_at: '2026-10-10T14:20:00Z',
  },
  {
    id: 'assump-004',
    user_id: 'demo-user-001',
    comparison_id: 'comp-001',
    statement: 'Distributor margin expectation for smart cold units is under 15% of hardware MSRP.',
    source_type: 'city-intelligence',
    status: 'supported',
    created_at: '2026-10-08T16:00:00Z',
    updated_at: '2026-10-15T11:00:00Z',
  },
]

export default async function MarketProofPage() {
  let assumptions: Assumption[] = []
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('assumptions')
        .select('*')
        .eq('user_id', user.id)
        .order('status')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        assumptions = data
      }
    }
  } catch {
    // Supabase offline / unconfigured
  }

  // Demo fallback for Phase 2 UI prototype
  if (assumptions.length === 0) {
    assumptions = FALLBACK_ASSUMPTIONS
    isDemo = true
  }

  const statusGroups = Object.entries(statusConfig).map(([status, config]) => ({
    status: status as AssumptionStatus,
    config,
    items: assumptions.filter((a: Assumption) => a.status === status),
  }))

  const totalCount = assumptions.length
  const supportedCount = assumptions.filter((a: Assumption) => a.status === 'supported').length
  const untestedCount = assumptions.filter((a: Assumption) => a.status === 'untested').length

  return (
    <PageShell>
      <PageHeader
        title="Market Proof"
        description="Track which assumptions from City Intelligence are backed by real evidence from Market Validation."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">
              Demo Matrix
            </Badge>
          ) : undefined
        }
        actions={
          <Link href="/market-proof/new">
            <Button id="btn-new-assumption" variant="outline">
              <Plus className="h-4 w-4" />
              Add Assumption
            </Button>
          </Link>
        }
      />

      {isDemo && (
        <DemoBanner
          message="Simulated assumption tracking. In Phase 8, the complete Market Proof Loop correlates city indicators, local contacts, and validation observations into audit-ready evidence."
        />
      )}

      {totalCount === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No assumptions tracked yet"
          description="Assumptions are generated when you complete a City Intelligence comparison. You can also add them manually."
          action={
            <div className="flex gap-2">
              <Link href="/city-intelligence/new">
                <Button id="btn-go-city-intel">Start a City Comparison</Button>
              </Link>
              <Link href="/market-proof/new">
                <Button id="btn-add-assumption-empty" variant="outline">Add Manually</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          {/* Summary bar */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total', value: totalCount, color: 'text-slate-300' },
              { label: 'Supported', value: supportedCount, color: 'text-emerald-400' },
              {
                label: 'Challenged / Invalidated',
                value: assumptions.filter((a: Assumption) => a.status === 'challenged' || a.status === 'invalidated').length,
                color: 'text-amber-400',
              },
              { label: 'Untested', value: untestedCount, color: 'text-slate-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Assumption groups */}
          <div className="space-y-6">
            {statusGroups.filter((g) => g.items.length > 0).map(({ status, config, items }) => {
              const StatusIcon = config.icon
              return (
                <div key={status}>
                  <div className="mb-3 flex items-center gap-2">
                    <StatusIcon
                      className={`h-4 w-4 ${
                        status === 'supported'
                          ? 'text-emerald-400'
                          : status === 'challenged'
                            ? 'text-amber-400'
                            : status === 'invalidated'
                              ? 'text-rose-400'
                              : 'text-slate-500'
                      }`}
                    />
                    <h3 className="text-sm font-semibold text-slate-300">{config.label}</h3>
                    <Badge variant={config.variant} className="text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((assumption: Assumption) => (
                      <Card key={assumption.id} className="h-full transition-all hover:border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-normal leading-relaxed text-slate-300">
                            &ldquo;{assumption.statement}&rdquo;
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {assumption.source_type.replace(/-/g, ' ')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </PageShell>
  )
}
