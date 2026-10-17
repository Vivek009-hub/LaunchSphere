import { createClient } from '@/lib/supabase/server'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'lucide-react'
import type { FitScore, FitScoreCriterion } from '@/types/database'
import { fitScoreColor, fitScoreLabel } from '@/lib/scoring/fitScore'

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

  // Demo fallback for Phase 2 prototype
  if (!comparison) {
    comparison = {
      id: id,
      user_id: 'demo-user-001',
      title: 'Western & Southern AgriTech Expansion Cohort',
      cities: ['Pune', 'Bengaluru', 'Ahmedabad', 'Indore'],
      status: 'complete' as const,
      created_at: '2026-10-14T08:00:00Z',
      updated_at: '2026-10-17T11:00:00Z',
    }
  }

  // 2. Fetch fit scores
  const { data: fitScores } = await supabase
    .from('fit_scores')
    .select('*')
    .eq('comparison_id', id)

  // 3. Fetch indicators
  const { data: indicators } = await supabase
    .from('market_indicators')
    .select('*')
    .eq('comparison_id', id)

  const cities: string[] = comparison.cities || []
  const scoresMap = new Map<string, FitScore>()
  fitScores?.forEach((fs) => scoresMap.set(fs.city, fs as FitScore))

  // Group indicators by indicator name for side-by-side comparison
  const indicatorNames = Array.from(new Set(indicators?.map((i) => i.indicator) || []))

  // Find the top-ranked city
  const rankedCities = [...cities].sort((a, b) => {
    const scoreA = scoresMap.get(a)?.total_score || 0
    const scoreB = scoresMap.get(b)?.total_score || 0
    return scoreB - scoreA
  })
  const winnerCity = rankedCities[0]
  const winnerScore = scoresMap.get(winnerCity)?.total_score || 0

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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{comparison.title}</h1>
              <Badge variant="success" className="capitalize text-xs">
                {comparison.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Comparing {cities.join(' vs ')} • Created on{' '}
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

      {/* Top Banner: Winner & Recommendation */}
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
                Based on your criteria weights and sourced market data, {winnerCity} offers the
                strongest balance of digital infrastructure, distribution access, and consumer
                adoption readiness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fit Scores Overview Cards */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            Fit Score Breakdown by City
          </h2>
          <span className="text-xs text-slate-400">
            Computed deterministically from weighted criteria
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => {
            const fs = scoresMap.get(city)
            const total = fs?.total_score || 0
            const percentage = total
            const criteriaList = (fs?.criteria as unknown as FitScoreCriterion[]) || []

            return (
              <Card
                key={city}
                className={`border-slate-800 bg-slate-900/70 transition-all ${
                  city === winnerCity ? 'border-blue-500/60 shadow-md shadow-blue-500/10' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <CardTitle className="text-base font-semibold text-white">{city}</CardTitle>
                    </div>
                    <Badge variant={city === winnerCity ? 'success' : 'outline'} className="text-xs">
                      {fitScoreLabel(percentage)}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className={`text-3xl font-extrabold tracking-tight ${fitScoreColor(percentage)}`}>
                      {total}
                    </span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {criteriaList.map((crit) => (
                      <div key={crit.name} className="text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-medium text-slate-300">{crit.name}</span>
                          <span className="font-mono text-slate-400">
                            {crit.score.toFixed(1)} / 10 ({crit.weight}%)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic leading-snug">
                          {crit.rationale}
                        </p>
                      </div>
                    ))}
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
              Verified metrics with data source provenance, collection date, and confidence ratings.
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
          <Link href="/market-validation">
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
