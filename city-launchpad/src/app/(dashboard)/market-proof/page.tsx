import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Activity,
  Beaker,
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  AlertCircle,
  Lightbulb,
  BarChart2,
} from 'lucide-react'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { EmptyState } from '@/components/shared/EmptyState'
import { getMarketProofData } from '@/lib/actions/marketProof'
import type { HypothesisProofView } from '@/lib/actions/marketProof'
import type { HypothesisStatus, ProofEvent } from '@/types/database'

export const metadata: Metadata = {
  title: 'Market Proof — City Launchpad',
  description:
    'Traceable evidence loop connecting City Intelligence assessments, Local Connect activity, and field experiment results to your market hypotheses.',
}

// ─── Status configuration ────────────────────────────────────────

const STATUS_CONFIG: Record<
  HypothesisStatus,
  {
    label: string
    shortLabel: string
    variant: 'success' | 'destructive' | 'warning' | 'secondary'
    icon: typeof CheckCircle2
    ringColor: string
    textColor: string
    bgColor: string
    description: string
  }
> = {
  supported: {
    label: 'Supported',
    shortLabel: 'Supported',
    variant: 'success',
    icon: CheckCircle2,
    ringColor: 'ring-emerald-500/40',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'Evidence meets success criteria',
  },
  challenged: {
    label: 'Challenged',
    shortLabel: 'Challenged',
    variant: 'warning',
    icon: AlertTriangle,
    ringColor: 'ring-amber-500/40',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    description: 'Evidence challenges this hypothesis',
  },
  inconclusive: {
    label: 'Inconclusive',
    shortLabel: 'Inconclusive',
    variant: 'secondary',
    icon: XCircle,
    ringColor: 'ring-slate-500/40',
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    description: 'Evidence insufficient or conflicting',
  },
  testing: {
    label: 'Testing',
    shortLabel: 'Testing',
    variant: 'warning',
    icon: Activity,
    ringColor: 'ring-blue-500/40',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Active experiments in progress',
  },
  untested: {
    label: 'Untested',
    shortLabel: 'Untested',
    variant: 'secondary',
    icon: HelpCircle,
    ringColor: 'ring-slate-700/40',
    textColor: 'text-slate-500',
    bgColor: 'bg-slate-800/50',
    description: 'No evidence collected yet',
  },
}

// ─── Outcome interpretation labels ──────────────────────────────

const OUTCOME_LABELS: Record<string, { label: string; color: string }> = {
  threshold_met: { label: 'Threshold Met', color: 'text-emerald-400' },
  threshold_not_met: { label: 'Threshold Not Met', color: 'text-amber-400' },
  insufficient_sample: { label: 'Insufficient Sample', color: 'text-slate-400' },
  inconclusive: { label: 'Inconclusive', color: 'text-slate-400' },
  not_evaluated: { label: 'Not Evaluated', color: 'text-slate-500' },
}

// ─── Intro request status labels ─────────────────────────────────

const INTRO_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400' },
  accepted: { label: 'Accepted', color: 'text-emerald-400' },
  declined: { label: 'Declined', color: 'text-rose-400' },
  withdrawn: { label: 'Withdrawn', color: 'text-slate-500' },
  cancelled: { label: 'Cancelled', color: 'text-slate-500' },
  completed: { label: 'Completed', color: 'text-emerald-400' },
}

// ─── Helper: format date ─────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Hypothesis Evidence Card ─────────────────────────────────────

function HypothesisCard({ view, index }: { view: HypothesisProofView; index: number }) {
  const { hypothesis, classification, linkedComparison, linkedFitScore, linkedIntroRequests, experiments } = view
  const statusCfg = STATUS_CONFIG[classification.computedStatus] || STATUS_CONFIG.untested
  const StatusIcon = statusCfg.icon

  const activeExperiments = experiments.filter(
    (e) => e.status === 'active' || e.status === 'running'
  )

  return (
    <Card
      id={`hypothesis-card-${hypothesis.id}`}
      className={`relative overflow-hidden ring-1 ${statusCfg.ringColor} transition-all hover:ring-2`}
    >
      {/* Status stripe */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          classification.computedStatus === 'supported'
            ? 'bg-emerald-500'
            : classification.computedStatus === 'challenged'
              ? 'bg-amber-500'
              : classification.computedStatus === 'testing'
                ? 'bg-blue-500'
                : classification.computedStatus === 'inconclusive'
                  ? 'bg-slate-600'
                  : 'bg-slate-800'
        }`}
      />

      <CardHeader className="pb-3 pl-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono">H{index + 1}</span>
            <span>·</span>
            <span>{hypothesis.city}</span>
            {linkedComparison && (
              <>
                <span>·</span>
                <span className="truncate max-w-[120px]" title={linkedComparison.title}>
                  {linkedComparison.title}
                </span>
              </>
            )}
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusCfg.bgColor} ${statusCfg.textColor}`}>
            <StatusIcon className="h-3 w-3" />
            {statusCfg.label}
          </div>
        </div>

        <CardTitle className="pl-0 text-sm font-normal leading-relaxed text-slate-200 mt-2">
          &ldquo;{hypothesis.statement}&rdquo;
        </CardTitle>

        <CardDescription className="mt-2 text-xs leading-relaxed text-slate-500">
          <span className="font-medium text-slate-400">Audience: </span>
          {hypothesis.target_audience}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pl-6">

        {/* Evidence rationale */}
        <div className={`rounded-lg border border-slate-800 p-3 ${statusCfg.bgColor}`}>
          <p className="text-xs font-medium text-slate-300 mb-1">Evidence Rationale</p>
          <p className="text-xs text-slate-400 leading-relaxed">{classification.rationale}</p>
        </div>

        {/* Suggested next action */}
        <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-yellow-400" />
          <div>
            <p className="text-xs font-medium text-slate-300">Suggested Next Action</p>
            <p className="mt-0.5 text-xs text-slate-400">{classification.suggestedNextAction}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Experiments', value: experiments.length, icon: Beaker },
            { label: 'Observations', value: classification.totalValidResponses, icon: BarChart2 },
            { label: 'Intro Requests', value: linkedIntroRequests.length, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-md border border-slate-800 bg-slate-900/40 p-2">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon className="h-3 w-3 text-slate-500" />
              </div>
              <p className="text-base font-bold text-slate-200">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Assessment link */}
        {linkedComparison && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <p className="mb-2 text-xs font-medium text-slate-400">City Intelligence Assessment</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-300">{linkedComparison.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {fmtDate(linkedComparison.created_at)} · v{linkedComparison.scoring_model_version || '1.0'}
                </p>
              </div>
              {linkedFitScore && (
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-200">
                    {linkedFitScore.total_score}
                    <span className="text-[10px] font-normal text-slate-500">/{linkedFitScore.max_score}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">Fit Score</p>
                </div>
              )}
            </div>
            <Link
              href={`/city-intelligence/${linkedComparison.id}`}
              className="mt-2 flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
            >
              View full assessment <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        )}

        {/* Experiments section */}
        {classification.experimentSummaries.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">
              Linked Experiments
              {activeExperiments.length > 0 && (
                <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
                  {activeExperiments.length} active
                </span>
              )}
            </p>
            <div className="space-y-2">
              {classification.experimentSummaries.map((expSummary) => {
                const outcomeInfo = OUTCOME_LABELS[expSummary.outcomeInterpretation] ||
                  OUTCOME_LABELS.not_evaluated
                const exp = experiments.find((e) => e.id === expSummary.experimentId)
                return (
                  <div
                    key={expSummary.experimentId}
                    className="rounded-md border border-slate-800 bg-slate-900/40 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-300">
                          {expSummary.title}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] capitalize text-slate-400">
                            {expSummary.method.replace('-', ' ')}
                          </span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] capitalize text-slate-400">
                            {expSummary.status}
                          </span>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-medium ${outcomeInfo.color}`}>
                        {outcomeInfo.label}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                      <span>{expSummary.validResponses} / {expSummary.sampleTarget} responses</span>
                      {expSummary.strongSignalCount > 0 && (
                        <span className="text-emerald-500">
                          {expSummary.strongSignalCount} commercial signal{expSummary.strongSignalCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {expSummary.conflictingResults && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Conflicting results — positive and negative outcomes closely split
                      </div>
                    )}
                    <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                      {expSummary.interpretationReason}
                    </p>
                    {exp && (
                      <Link
                        href={`/market-validation/${exp.id}`}
                        className="mt-2 flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
                      >
                        View experiment <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Local Connect section */}
        {linkedIntroRequests.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Local Connect Activity</p>
            <div className="space-y-1.5">
              {linkedIntroRequests.map((req) => {
                const statusInfo = INTRO_STATUS[req.status] || { label: req.status, color: 'text-slate-400' }
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-slate-300">
                        {req.contact?.name ?? 'Contact'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {req.contact?.organization ?? ''} · {fmtDate(req.created_at)}
                      </p>
                    </div>
                    <span className={`ml-2 flex-shrink-0 text-[10px] font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                )
              })}
              <p className="text-[10px] text-slate-600 italic">
                Note: A pending or accepted request is not evidence of customer demand.
              </p>
            </div>
          </div>
        )}

        {/* Evidence quality warnings */}
        {!classification.hasCommercialSignal && classification.totalValidResponses > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-amber-900/40 bg-amber-950/30 px-3 py-2">
            <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500" />
            <p className="text-[10px] text-amber-400">
              No commercial signals (paid orders or pilots) recorded. Reported interest is not equivalent to purchase intent.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-600">
          <span>Updated {fmtDate(hypothesis.updated_at)}</span>
          <div className="flex gap-2">
            <Link href="/market-validation/new" className="text-blue-500 hover:text-blue-400">
              + Experiment
            </Link>
            <Link href="/local-connect" className="text-blue-500 hover:text-blue-400">
              + Connect
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Evidence Timeline ───────────────────────────────────────────

function EvidenceTimeline({ events }: { events: ProofEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-center">
        <Clock className="mx-auto mb-2 h-8 w-8 text-slate-700" />
        <p className="text-sm text-slate-500">No recorded events yet.</p>
        <p className="mt-1 text-xs text-slate-600">
          Events appear here when you create assessments, link intro requests, start experiments, or record results.
        </p>
      </div>
    )
  }

  const EVENT_ICONS: Record<string, typeof Activity> = {
    assessment_created: TrendingUp,
    assessment_refreshed: TrendingUp,
    hypothesis_created: Lightbulb,
    hypothesis_status_changed: Activity,
    intro_request_created: Users,
    intro_request_updated: Users,
    experiment_started: Beaker,
    experiment_completed: CheckCircle2,
    response_recorded: BarChart2,
    evidence_linked: ShieldCheck,
  }

  return (
    <div className="space-y-3">
      {events.slice(0, 20).map((event) => {
        const Icon = EVENT_ICONS[event.event_type] || Activity
        return (
          <div key={event.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-800">
              <Icon className="h-3 w-3 text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-300">{event.event_label}</p>
              <p className="text-[10px] text-slate-600">
                {fmtDate(event.occurred_at)}
                {event.city ? ` · ${event.city}` : ''}
              </p>
            </div>
          </div>
        )
      })}
      {events.length > 20 && (
        <p className="text-center text-[10px] text-slate-600">+{events.length - 20} earlier events</p>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────

export default async function MarketProofPage() {
  const { hypotheses, proofEvents, isDemo, error } = await getMarketProofData()

  const totalHypotheses = hypotheses.length
  const supportedCount = hypotheses.filter((v) => v.classification.computedStatus === 'supported').length
  const challengedCount = hypotheses.filter((v) => v.classification.computedStatus === 'challenged').length
  const inconclusiveCount = hypotheses.filter((v) => v.classification.computedStatus === 'inconclusive').length
  const untestedCount = hypotheses.filter((v) => v.classification.computedStatus === 'untested').length
  const testingCount = hypotheses.filter((v) => v.classification.computedStatus === 'testing').length
  const hasCommercialEvidence = hypotheses.some((v) => v.classification.hasCommercialSignal)

  // Group by status for display ordering
  const statusOrder: HypothesisStatus[] = ['supported', 'testing', 'inconclusive', 'challenged', 'untested']
  const sortedViews = [...hypotheses].sort(
    (a, b) =>
      statusOrder.indexOf(a.classification.computedStatus) -
      statusOrder.indexOf(b.classification.computedStatus)
  )

  return (
    <PageShell>
      <PageHeader
        title="Market Proof"
        description="Traceable evidence linking City Intelligence, Local Connect activity, and field experiment results to your market hypotheses."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">Demo Data</Badge>
          ) : undefined
        }
        actions={
          <div className="flex gap-2">
            <Link href="/market-validation/new">
              <Button id="btn-new-experiment" variant="outline" size="sm">
                <Beaker className="h-3.5 w-3.5" />
                New Experiment
              </Button>
            </Link>
            <Link href="/city-intelligence/new">
              <Button id="btn-new-assessment" size="sm">
                <Plus className="h-3.5 w-3.5" />
                New Assessment
              </Button>
            </Link>
          </div>
        }
      />

      {isDemo && (
        <DemoBanner message="Showing demo hypotheses with simulated experiment data. Sign in and configure Supabase to track your own market proof loop." />
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-rose-900/50 bg-rose-950/30 p-4">
          <p className="text-sm text-rose-400">Error loading data: {error}</p>
        </div>
      )}

      {totalHypotheses === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No market hypotheses yet"
          description="The Market Proof Loop connects City Intelligence assessments with Local Connect activity and field experiments. Start by creating a city comparison or a market hypothesis."
          action={
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/city-intelligence/new">
                <Button id="btn-go-city-intel-empty">Start a City Comparison</Button>
              </Link>
              <Link href="/market-validation/new">
                <Button id="btn-go-market-val-empty" variant="outline">Create a Hypothesis</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <div className="space-y-8">

          {/* Overview summary */}
          <section aria-label="Evidence overview">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: 'Total', value: totalHypotheses, color: 'text-slate-300', bg: 'bg-slate-900/60' },
                { label: 'Supported', value: supportedCount, color: 'text-emerald-400', bg: 'bg-emerald-950/40' },
                { label: 'Testing', value: testingCount, color: 'text-blue-400', bg: 'bg-blue-950/40' },
                { label: 'Inconclusive', value: inconclusiveCount, color: 'text-slate-400', bg: 'bg-slate-900/60' },
                { label: 'Challenged', value: challengedCount, color: 'text-amber-400', bg: 'bg-amber-950/40' },
              ].map(({ label, value, color, bg }) => (
                <div
                  key={label}
                  className={`rounded-lg border border-slate-800 ${bg} p-4 text-center`}
                >
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Sparse data warning */}
            {!hasCommercialEvidence && totalHypotheses > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-900/40 bg-amber-950/20 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                <p className="text-xs text-amber-400">
                  <span className="font-medium">No commercial evidence recorded yet.</span>{' '}
                  Reported interest and introductions are not proof of demand. Advance experiments
                  to paid pilots or purchase transactions to strengthen the proof loop.
                </p>
              </div>
            )}

            {untestedCount > 0 && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
                <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                <p className="text-xs text-slate-500">
                  {untestedCount} hypothesis{untestedCount !== 1 ? 'es are' : ' is'} untested.
                  Create and activate experiments in{' '}
                  <Link href="/market-validation" className="text-blue-400 hover:underline">
                    Market Validation
                  </Link>{' '}
                  and link them here.
                </p>
              </div>
            )}
          </section>

          {/* Two-column layout: cards + sidebar */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Hypothesis evidence cards */}
            <section className="lg:col-span-2" aria-label="Hypothesis evidence cards">
              <h2 className="mb-4 text-sm font-semibold text-slate-300">
                Hypothesis Evidence Cards
              </h2>
              <div className="space-y-4">
                {sortedViews.map((view, i) => (
                  <HypothesisCard key={view.hypothesis.id} view={view} index={i} />
                ))}
              </div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Evidence sidebar">

              {/* Evidence timeline */}
              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-300">Evidence Timeline</h2>
                <Card>
                  <CardContent className="pt-4">
                    <EvidenceTimeline events={proofEvents} />
                  </CardContent>
                </Card>
              </section>

              {/* Evidence gaps */}
              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-300">Evidence Gaps</h2>
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    {!hasCommercialEvidence && (
                      <GapItem
                        label="No direct purchase evidence"
                        detail="No paid orders or pilots have been recorded. Interview and survey interest is not commercial validation."
                        action={{ label: 'Run a Paid Pilot', href: '/market-validation/new' }}
                      />
                    )}
                    {untestedCount > 0 && (
                      <GapItem
                        label={`${untestedCount} hypothesis${untestedCount !== 1 ? 'es' : ''} have no experiments`}
                        detail="These hypotheses have no linked experiments. No evidence is available to classify them."
                        action={{ label: 'Create Experiment', href: '/market-validation/new' }}
                      />
                    )}
                    {hypotheses.some((v) => v.classification.hasConflictingResults) && (
                      <GapItem
                        label="Conflicting results detected"
                        detail="At least one hypothesis has experiments with closely split positive and negative outcomes."
                        action={{ label: 'Review Experiments', href: '/market-validation' }}
                      />
                    )}
                    {hypotheses.filter((v) => v.linkedIntroRequests.length === 0).length > 0 && (
                      <GapItem
                        label="No Local Connect activity linked"
                        detail="Some hypotheses have no associated introduction requests. Local ecosystem contacts can surface evidence gaps."
                        action={{ label: 'Find Local Contacts', href: '/local-connect' }}
                      />
                    )}
                    {hypotheses.every(
                      (v) =>
                        v.classification.totalValidResponses > 0 &&
                        v.classification.hasCommercialSignal &&
                        v.linkedIntroRequests.length > 0
                    ) && (
                      <p className="text-xs text-emerald-400">
                        No major evidence gaps detected. Keep collecting real-world evidence.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Quick links */}
              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-300">Navigate Modules</h2>
                <div className="space-y-2">
                  {[
                    { href: '/city-intelligence', label: 'City Intelligence', desc: 'Assessments & Fit Scores' },
                    { href: '/local-connect', label: 'Local Connect', desc: 'Contacts & Intro Requests' },
                    { href: '/market-validation', label: 'Market Validation', desc: 'Experiments & Results' },
                  ].map(({ href, label, desc }) => (
                    <Link key={href} href={href}>
                      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 transition-colors hover:border-slate-700 hover:bg-slate-900/70">
                        <div>
                          <p className="text-xs font-medium text-slate-300">{label}</p>
                          <p className="text-[10px] text-slate-500">{desc}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      )}
    </PageShell>
  )
}

// ─── Gap Item Component ──────────────────────────────────────────

function GapItem({
  label,
  detail,
  action,
}: {
  label: string
  detail: string
  action: { label: string; href: string }
}) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-900/40 p-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-300">{label}</p>
          <p className="mt-0.5 text-[10px] text-slate-500 leading-relaxed">{detail}</p>
          <Link
            href={action.href}
            className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
          >
            {action.label} <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
