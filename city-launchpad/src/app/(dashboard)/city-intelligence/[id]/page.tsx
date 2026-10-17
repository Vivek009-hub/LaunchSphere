import { createClient } from '@/lib/supabase/server'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataProvenance } from '@/components/shared/DataProvenance'
import Link from 'next/link'
import {
  MapPin,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  Building2,
  ExternalLink,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react'
import type { FitScore, FitScoreCriterion, MarketIndicator, Competitor, StartupProfile } from '@/types/database'
import { fitScoreColor, fitScoreLabel, SCORING_MODEL_VERSION } from '@/lib/scoring/fitScore'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch comparison
  let comparison = null
  try {
    const { data } = await supabase
      .from('city_comparisons')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    comparison = data
  } catch {
    comparison = null
  }

  // Fallback demo comparison if ID not found in dev
  if (!comparison) {
    comparison = {
      id: id,
      user_id: 'demo-user-001',
      startup_id: null,
      title: 'Bengaluru vs Mumbai Market Fit Comparison',
      cities: ['Bengaluru', 'Mumbai'],
      status: 'complete' as const,
      scoring_model_version: SCORING_MODEL_VERSION,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  // 2. Fetch startup profile if linked
  let startupProfile: StartupProfile | null = null
  if (comparison.startup_id) {
    const { data: profile } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('id', comparison.startup_id)
      .maybeSingle()
    if (profile) startupProfile = profile
  }

  // 3. Fetch fit scores
  const { data: fitScores } = await supabase
    .from('fit_scores')
    .select('*')
    .eq('comparison_id', id)

  // 4. Fetch market indicators
  const { data: indicators } = await supabase
    .from('market_indicators')
    .select('*')
    .eq('comparison_id', id)

  // 5. Fetch competitors for these cities
  const cities: string[] = comparison.cities || []
  let competitors: Competitor[] = []
  try {
    const { data: comps } = await supabase
      .from('competitors')
      .select('*')
      .in('city', cities)
    if (comps) competitors = comps
  } catch (err) {
    console.warn('Competitors catalog fetch skipped:', err)
  }

  const scoresMap = new Map<string, FitScore>()
  fitScores?.forEach((fs) => scoresMap.set(fs.city, fs as FitScore))

  // Group indicators by indicator name for side-by-side comparison
  const indicatorNames = Array.from(new Set(indicators?.map((i) => i.indicator) || []))

  // Find the top-ranked city (only consider cities with valid total_score)
  const rankedCities = [...cities].sort((a, b) => {
    const fsA = scoresMap.get(a)
    const fsB = scoresMap.get(b)
    const scoreA = fsA?.insufficient_data ? -1 : (fsA?.total_score ?? -1)
    const scoreB = fsB?.insufficient_data ? -1 : (fsB?.total_score ?? -1)
    return scoreB - scoreA
  })

  const winnerCity = rankedCities[0]
  const winnerFs = scoresMap.get(winnerCity)
  const hasWinnerValidScore = winnerFs && !winnerFs.insufficient_data && (winnerFs.total_score !== null)
  const winnerScore = hasWinnerValidScore ? winnerFs.total_score : 0

  return (
    <PageShell>
      {/* Header & Breadcrumb */}
      <div className="mb-6 space-y-2">
        <Link
          href="/city-intelligence"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to comparisons
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{comparison.title}</h1>
              <Badge variant="success" className="capitalize text-xs">
                {comparison.status}
              </Badge>
              <Badge variant="outline" className="border-blue-500/40 text-blue-300 text-xs font-mono">
                Model: {comparison.scoring_model_version || SCORING_MODEL_VERSION}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Comparing {cities.join(' vs ')} • Assessment computed on{' '}
              {new Date(comparison.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/market-validation/new?city=${encodeURIComponent(winnerCity)}`}>
              <Button size="sm" variant="outline" className="gap-1.5 border-slate-700 text-slate-200">
                <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                Launch Validation Pilot
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Startup Profile Context Header (if linked) */}
      {startupProfile && (
        <Card className="mb-6 border-slate-800 bg-slate-900/40">
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Assessed for Startup:</p>
                <p className="text-sm font-semibold text-white">
                  {startupProfile.name}{' '}
                  <span className="font-normal text-xs text-slate-300">
                    ({startupProfile.industry} • {startupProfile.stage.toUpperCase()})
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div>
                Target: <span className="text-slate-200">{startupProfile.target_customer}</span>
              </div>
              <div>
                Channel: <span className="text-slate-200">{startupProfile.primary_channel || 'Direct'}</span>
              </div>
              {startupProfile.price_min && (
                <div>
                  Price: <span className="text-slate-200">₹{startupProfile.price_min.toLocaleString('en-IN')}{startupProfile.price_max ? `–₹${startupProfile.price_max.toLocaleString('en-IN')}` : ''}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Banner: Winner & Recommendation or Insufficient Data Alert */}
      {hasWinnerValidScore ? (
        <div className="mb-8 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/40 p-5 shadow-lg backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Primary Market Recommendation
                  </span>
                  <Badge variant="outline" className="border-blue-500/50 text-blue-300 text-[10px]">
                    Highest Fit Score
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {winnerCity} leads with a Fit Score of {winnerScore} / 100
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Based on configured criteria weights and sourced market data, {winnerCity} offers the
                  strongest balance of digital infrastructure, distribution access, and consumer
                  adoption readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 backdrop-blur">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-amber-200">
                Insufficient Evidence for Conclusive Score
              </h3>
              <p className="text-xs text-amber-300/80 mt-1 max-w-2xl leading-relaxed">
                One or more selected cities lack verified market indicators across the minimum required criteria (at least 3 criteria and 50% eligible weight). In accordance with City Launchpad principles, we do not fabricate missing data or assign arbitrary zero scores.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fit Scores Overview Cards */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              Fit Score Breakdown by City
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              100% deterministic weighted formula with separate evidence coverage tracking.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
            Model Version: {comparison.scoring_model_version || SCORING_MODEL_VERSION}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cities.map((city) => {
            const fs = scoresMap.get(city)
            const isInsufficient = fs?.insufficient_data ?? false
            const total = fs?.total_score ?? null
            const coverage = fs?.evidence_coverage ?? 0
            const missing = fs?.missing_criteria || []
            const criteriaList = (fs?.criteria as unknown as FitScoreCriterion[]) || []

            return (
              <Card
                key={city}
                className={`border-slate-800 bg-slate-900/70 transition-all ${
                  city === winnerCity && hasWinnerValidScore ? 'border-blue-500/60 shadow-md shadow-blue-500/10' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <CardTitle className="text-base font-semibold text-white">{city}</CardTitle>
                    </div>
                    <Badge variant={city === winnerCity && hasWinnerValidScore ? 'success' : 'outline'} className="text-xs">
                      {fitScoreLabel(total, isInsufficient)}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      {isInsufficient ? (
                        <span className="text-2xl font-bold tracking-tight text-amber-400">
                          Insufficient Data
                        </span>
                      ) : (
                        <>
                          <span className={`text-4xl font-extrabold tracking-tight ${fitScoreColor(total)}`}>
                            {total}
                          </span>
                          <span className="text-xs text-slate-400">/ 100</span>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-mono">Evidence Coverage</span>
                      <p className="text-sm font-semibold text-slate-200">{coverage}%</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Evidence coverage progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Data Verification Coverage</span>
                      <span>{coverage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          coverage >= 80 ? 'bg-emerald-500' : coverage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, coverage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Criteria detail list */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                    {criteriaList.map((crit) => {
                      const isMissing = missing.includes(crit.name)
                      return (
                        <div key={crit.name} className="text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="font-medium text-slate-300 flex items-center gap-1.5">
                              {crit.name}
                              {isMissing && (
                                <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[9px] py-0">
                                  Missing
                                </Badge>
                              )}
                            </span>
                            <span className="font-mono text-slate-400">
                              {isMissing ? 'Excluded' : `${crit.score.toFixed(1)} / 10`} ({crit.weight}%)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 italic leading-snug">
                            {crit.rationale}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Sourced Market Indicators Side-by-Side Table */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Sourced Market Indicators
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified metrics with data provenance, geographic scope, collection date, and confidence ratings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold w-1/4">Indicator</th>
                {cities.map((city) => (
                  <th key={city} className="py-3 px-4 font-semibold">
                    {city}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {indicatorNames.map((indName) => {
                return (
                  <tr key={indName} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {indName}
                    </td>
                    {cities.map((city) => {
                      const match = indicators?.find(
                        (i) => i.city === city && i.indicator === indName
                      )

                      if (!match) {
                        return (
                          <td key={city} className="py-3 px-4 text-slate-400 italic">
                            Data not collected
                          </td>
                        )
                      }

                      return (
                        <td key={city} className="py-3 px-4 space-y-1">
                          <div className="font-semibold text-white text-sm">
                            {match.value}{' '}
                            {match.unit && (
                              <span className="text-xs font-normal text-slate-400">
                                {match.unit}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 pt-0.5">
                            <DataProvenance
                              sourceName={match.source_name}
                              sourceUrl={match.source_url}
                              collectedAt={match.collected_at}
                              confidence={match.confidence}
                              geographicScope={match.geographic_scope}
                              dataPeriod={match.data_period}
                              isSimulated={match.is_simulated}
                              notes={match.notes}
                            />
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local Competitor & Pricing Comparison Table */}
      <div className="mb-10 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-400" />
            Local Competitor & Pricing Benchmarks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sourced local competitors, verified commercial pricing points, and offering profiles in target markets.
          </p>
        </div>

        {competitors.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
            No competitor records registered yet for {cities.join(' or ')}. Competitor mapping will expand as local research progresses.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cities.map((city) => {
              const cityComps = competitors.filter((c) => c.city.toLowerCase() === city.toLowerCase())
              return (
                <Card key={city} className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                        {city} Competitors
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
                        {cityComps.length} tracked
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {cityComps.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No direct benchmark competitors cataloged.</p>
                    ) : (
                      cityComps.map((comp) => (
                        <div key={comp.id} className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-xs">{comp.name}</span>
                                <Badge variant="secondary" className="text-[10px] py-0">
                                  {comp.category}
                                </Badge>
                                {comp.is_simulated && (
                                  <Badge variant="demo" className="text-[9px] py-0 uppercase">
                                    Simulated
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                                {comp.offering}
                              </p>
                            </div>
                            {comp.observed_price !== null && (
                              <div className="text-right shrink-0">
                                <span className="font-mono font-semibold text-emerald-400 text-xs">
                                  ₹{comp.observed_price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {comp.price_unit}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 border-t border-slate-800/60">
                            {comp.source_url && (
                              <a
                                href={comp.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                              >
                                Source Reference <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                            {comp.observed_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5" />
                                {comp.observed_date}
                              </span>
                            )}
                            {comp.notes && (
                              <span className="italic text-slate-400 truncate max-w-[200px]" title={comp.notes}>
                                · {comp.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Evidence Coverage & Data Limitations Callout (Phase 5 Section 6 Requirement) */}
      <div className="mb-10 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Evidence Coverage & Data Limitations</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Important Principle:</strong> Evidence coverage measures the availability, timeliness, and source confidence of relevant indicators for this city pair. <em>It must never be conflated with the Fit Score or interpreted as a statistical probability of startup success.</em>
        </p>
        <div className="grid gap-2 sm:grid-cols-2 text-xs text-slate-400 pt-1">
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1">
            <span className="font-semibold text-slate-200">Excluded Missing Data:</span>
            <p className="text-[11px] leading-snug">
              When a criterion lacks verified indicators, it is excluded from the denominator. We do not assume missing indicators are 0 or average.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 space-y-1">
            <span className="font-semibold text-slate-200">Proxy Indicators:</span>
            <p className="text-[11px] leading-snug">
              Indicators derived from state-level statistics (e.g. state economic surveys) serve as metro proxies until granular ward-level municipal census data is verified.
            </p>
          </div>
        </div>
      </div>

      {/* Assumptions & Next Steps Callout */}
      <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-5 backdrop-blur">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-200 text-sm">
                Validate Untested Assumptions on Ground
              </h4>
              <p className="text-xs text-amber-300/80 mt-1 max-w-2xl leading-relaxed">
                City Intelligence provides high-level macro indicators. Before committing capital,
                validate ground customer demand, distributor willingness, and retail willingness
                through structured experiments in <strong>Market Validation</strong>.
              </p>
            </div>
          </div>
          <Link href={`/market-validation/new?city=${encodeURIComponent(winnerCity)}`}>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5 shrink-0">
              <FlaskConical className="h-3.5 w-3.5" />
              Go to Market Validation
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
