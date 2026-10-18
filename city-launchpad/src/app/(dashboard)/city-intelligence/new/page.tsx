'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { SUPPORTED_CITIES, BENCHMARK_INDICATORS } from '@/lib/data/cityData'
import {
  DEFAULT_CRITERIA,
  computeFitScore,
  evaluateCityCriteria,
  SCORING_MODEL_VERSION,
} from '@/lib/scoring/fitScore'
import type { StartupProfile, CityRecord, Competitor, MarketIndicator } from '@/types/database'
import {
  MapPin,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  ShieldCheck,
  Info,
} from 'lucide-react'

export default function NewComparisonPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [availableCities, setAvailableCities] = useState<{ name: string; state: string; tier: string }[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>(['Bengaluru', 'Mumbai'])
  const [title, setTitle] = useState('Bengaluru vs Mumbai Market Fit Comparison')
  const [profile, setProfile] = useState<StartupProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const [criteria, setCriteria] = useState(
    DEFAULT_CRITERIA.map((c) => ({
      name: c.name,
      weight: c.weight,
      description: c.description,
    }))
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Load active profile & supported cities from database
  useEffect(() => {
    async function loadInitialData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch startup profile
          const { data: profileData } = await supabase
            .from('startup_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

          if (profileData) {
            setProfile(profileData)
            // Pre-select expansion cities if defined
            if (profileData.expansion_cities && profileData.expansion_cities.length >= 2) {
              const preselected = profileData.expansion_cities.slice(0, 2)
              setSelectedCities(preselected)
              setTitle(`${preselected.join(' vs ')} Market Fit Comparison`)
            }
          }

          // Fetch supported cities from catalog
          const { data: dbCities } = await supabase
            .from('cities')
            .select('*')
            .eq('is_active', true)
            .order('name')

          if (dbCities && dbCities.length > 0) {
            setAvailableCities(dbCities.map((c: CityRecord) => ({ name: c.name, state: c.state, tier: c.tier })))
          } else {
            setAvailableCities(SUPPORTED_CITIES.map((c) => ({ name: c.name, state: c.state, tier: c.tier })))
          }
        }
      } catch (err) {
        console.error('Error loading initial comparison data:', err)
        setAvailableCities(SUPPORTED_CITIES.map((c) => ({ name: c.name, state: c.state, tier: c.tier })))
      } finally {
        setProfileLoading(false)
      }
    }

    loadInitialData()
  }, [supabase])

  const toggleCity = (cityName: string) => {
    let next: string[]
    if (selectedCities.includes(cityName)) {
      if (selectedCities.length <= 2) {
        setError('At least 2 cities must be selected for a side-by-side comparison.')
        return
      }
      next = selectedCities.filter((c) => c !== cityName)
    } else {
      if (selectedCities.length >= 2) {
        // Swap second city if already 2 selected for crisp 2-city comparison
        next = [selectedCities[0], cityName]
      } else {
        next = [...selectedCities, cityName]
      }
    }
    setError(null)
    setSelectedCities(next)
    setTitle(`${next.join(' vs ')} Market Fit Comparison`)
  }

  const handleWeightChange = (index: number, val: number) => {
    const updated = [...criteria]
    updated[index].weight = Math.max(0, Math.min(100, val))
    setCriteria(updated)
  }

  const resetWeights = () => {
    setCriteria(
      DEFAULT_CRITERIA.map((c) => ({
        name: c.name,
        weight: c.weight,
        description: c.description,
      }))
    )
  }

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedCities.length < 2) {
      setError('Please select at least 2 cities to compare.')
      return
    }

    if (!title.trim()) {
      setError('Please provide a title for this comparison.')
      return
    }

    if (totalWeight === 0) {
      setError('Total weight must be greater than 0.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      // 1. Create city_comparison record with startup link and scoring model version
      const { data: comparison, error: compError } = await supabase
        .from('city_comparisons')
        .insert({
          user_id: user.id,
          startup_id: profile?.id || null,
          title: title.trim(),
          cities: selectedCities,
          status: 'complete',
          scoring_model_version: SCORING_MODEL_VERSION,
        })
        .select()
        .single()

      if (compError || !comparison) {
        throw new Error(compError?.message || 'Failed to create comparison record.')
      }

      // 2. Fetch or prepare benchmark indicators with enhanced provenance
      const indicatorsToInsert = BENCHMARK_INDICATORS.filter((ind) =>
        selectedCities.includes(ind.city)
      ).map((ind) => ({
        comparison_id: comparison.id,
        city: ind.city,
        indicator: ind.indicator,
        value: ind.value,
        unit: ind.unit,
        source_name: ind.source_name,
        source_url: ind.source_url,
        collected_at: ind.collected_at,
        confidence: ind.confidence,
        notes: ind.notes,
        geographic_scope: 'metro',
        data_period: '2023-2024',
        is_simulated: false,
      }))

      if (indicatorsToInsert.length > 0) {
        const { error: indError } = await supabase
          .from('market_indicators')
          .insert(indicatorsToInsert)
        if (indError) console.error('Error inserting indicators:', indError)
      }

      // 3. Fetch competitors for selected cities
      let dbCompetitors: Competitor[] = []
      try {
        const { data: comps } = await supabase
          .from('competitors')
          .select('*')
          .in('city', selectedCities)
        if (comps) dbCompetitors = comps
      } catch (err) {
        console.warn('Competitors catalog fetch skipped:', err)
      }

      // Build weights map
      const weightsMap: Record<string, number> = {}
      criteria.forEach((c) => {
        weightsMap[c.name] = c.weight
      })

      // 4. Compute and insert Fit Scores for each city deterministically
      const cityScoresToInsert = selectedCities.map((cityName) => {
        // Transform city market indicators and competitors to criterion scores
        const evaluatedCriteria = evaluateCityCriteria(
          cityName,
          indicatorsToInsert as unknown as MarketIndicator[],
          dbCompetitors,
          weightsMap
        )

        // Run deterministic scoring engine v1.0.0
        const scoringResult = computeFitScore({
          criteria: evaluatedCriteria,
          startupContext: profile ? {
            industry: profile.industry,
            stage: profile.stage,
            primary_channel: profile.primary_channel,
            target_customer: profile.target_customer,
            price_min: profile.price_min,
            price_max: profile.price_max,
          } : undefined,
        })

        return {
          comparison_id: comparison.id,
          city: cityName,
          criteria: scoringResult.criteria,
          total_score: scoringResult.total_score || 0,
          max_score: 100,
          scoring_model_version: scoringResult.scoring_model_version,
          evidence_coverage: scoringResult.evidence_coverage,
          missing_criteria: scoringResult.missing_criteria,
          insufficient_data: scoringResult.insufficient_data,
        }
      })

      const { error: scoreError } = await supabase
        .from('fit_scores')
        .insert(cityScoresToInsert)

      if (scoreError) {
        console.error('Error inserting fit scores:', scoreError)
      }

      router.push(`/city-intelligence/${comparison.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while generating the comparison.'
      setError(message)
      setLoading(false)
    }
  }

  const citiesList = availableCities.length > 0 ? availableCities : SUPPORTED_CITIES

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/city-intelligence"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to comparisons
        </Link>
        <PageHeader
          title="New City Comparison"
          description="Evaluate target Indian expansion cities side-by-side using verifiable market indicators, competitive benchmarks, and deterministic scoring."
          badge={
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs gap-1">
              <ShieldCheck className="h-3 w-3" />
              Scoring Model {SCORING_MODEL_VERSION}
            </Badge>
          }
        />
      </div>

      {/* Startup Profile Context Banner */}
      {!profileLoading && (
        profile ? (
          <Card className="mb-6 border-[#252729] bg-[#101314]">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#151719] text-[#F5B94C] border border-[#3A3D40]">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F5B94C]">
                      Active Startup Profile
                    </span>
                    <Badge variant="outline" className="border-[#3A3D40] text-[#F5B94C] text-[10px] uppercase font-mono">
                      {profile.stage}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F5F5F2] mt-0.5">
                    {profile.name} <span className="font-normal text-[#858783]">({profile.industry})</span>
                  </h4>
                  <p className="text-xs text-[#B4B5B2] mt-0.5">
                    Target: <span className="text-[#F5F5F2]">{profile.target_customer}</span> • Channel: <span className="text-[#F5F5F2]">{profile.primary_channel || 'Direct'}</span>
                    {profile.price_min && (
                      <> • Price: <span className="text-[#F5F5F2]">₹{profile.price_min.toLocaleString('en-IN')}{profile.price_max ? `–₹${profile.price_max.toLocaleString('en-IN')}` : ''}</span></>
                    )}
                  </p>
                </div>
              </div>
              <Link href="/settings">
                <Button size="sm" variant="outline" className="shrink-0 border-[#252729] text-[#B4B5B2] hover:text-[#F5F5F2] hover:bg-[#151719] text-xs">
                  Change Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-amber-500/30 bg-amber-950/20">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F5F5F2]">No Startup Profile Configured</h4>
                  <p className="text-xs text-[#B4B5B2] mt-0.5">
                    Complete onboarding to customize Fit Score weights according to your product category, pricing model, and distribution channels.
                  </p>
                </div>
              </div>
              <Link href="/onboarding">
                <Button size="sm" className="shrink-0 bg-[#F5B94C] hover:bg-[#FFD27A] text-[#080A0B] font-semibold text-xs">
                  Complete Onboarding
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-950/20 px-4 py-3 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-8">
        {/* Step 1: Comparison Title */}
        <Card className="border-[#252729] bg-[#101314]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#151719] text-[#F5B94C] border border-[#3A3D40] text-xs font-bold font-mono">
                1
              </span>
              Comparison Title
            </CardTitle>
            <CardDescription className="text-xs text-[#858783]">
              Give this expansion assessment a memorable title for your team and investment records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs">Assessment Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bengaluru vs Mumbai Market Fit Comparison"
                className="max-w-xl"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Choose 2 Supported Cities */}
        <Card className="border-[#252729] bg-[#101314]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#151719] text-[#F5B94C] border border-[#3A3D40] text-xs font-bold font-mono">
                    2
                  </span>
                  Select Target Expansion Cities (Pick 2)
                </CardTitle>
                <CardDescription className="text-xs text-[#858783]">
                  Choose two supported Indian cities from the catalog to evaluate side-by-side.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">
                {selectedCities.length} selected
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {citiesList.map((city) => {
                const isSelected = selectedCities.includes(city.name)
                return (
                  <div
                    key={city.name}
                    onClick={() => toggleCity(city.name)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-[#F5B94C] bg-[#151719] ring-1 ring-[#F5B94C]/40 shadow-sm shadow-[#F5B94C]/10'
                        : 'border-[#252729] bg-[#151719] hover:border-[#3A3D40] hover:bg-[#151719]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className={`h-4 w-4 ${isSelected ? 'text-[#F5B94C]' : 'text-[#858783]'}`} />
                        <div>
                          <p className="text-sm font-semibold text-[#F5F5F2]">{city.name}</p>
                          <p className="text-xs text-[#858783]">{city.state}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] text-[#858783] border-[#252729]">
                          {city.tier}
                        </Badge>
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isSelected
                              ? 'border-[#F5B94C] bg-[#F5B94C] text-[#080A0B]'
                              : 'border-[#252729] bg-transparent text-transparent'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Fit Score Weight Configuration */}
        <Card className="border-[#252729] bg-[#101314]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#151719] text-[#F5B94C] border border-[#3A3D40] text-xs font-bold font-mono">
                    3
                  </span>
                  Transparent Fit Score Weight Configuration
                </CardTitle>
                <CardDescription className="text-xs text-[#858783]">
                  Weights determine the relative importance of each dimension in the deterministic 0–100 Fit Score formula.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={totalWeight === 100 ? 'success' : 'warning'}
                  className="text-xs font-mono"
                >
                  Total Weight: {totalWeight}%
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={resetWeights}
                  className="text-xs text-[#858783] hover:text-[#F5F5F2]"
                >
                  Reset Defaults
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-[#252729] bg-[#080A0B] p-3 text-xs text-[#858783] flex items-start gap-2">
              <Info className="h-4 w-4 text-[#F5B94C] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F2]">Deterministic Calculation:</strong> Scores are calculated strictly from verifiable market indicators and active profile parameters. Missing indicators are excluded from the weight denominator rather than silently assumed zero.
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {criteria.map((c, idx) => (
                <div key={c.name} className="rounded-lg border border-[#252729] bg-[#151719] p-4 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold text-[#F5F5F2] flex items-center gap-2">
                        {c.name}
                        <span className="text-xs font-normal text-[#858783] font-mono">
                          ({c.weight}%)
                        </span>
                      </Label>
                      <p className="text-xs text-[#858783] leading-relaxed max-w-xl">
                        {c.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={c.weight}
                        onChange={(e) => handleWeightChange(idx, parseInt(e.target.value) || 0)}
                        className="w-20 text-center font-mono text-sm bg-[#101314] border-[#252729]"
                      />
                      <span className="text-xs text-[#858783] font-mono">%</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#080A0B] border border-[#252729] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#F5B94C] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (c.weight / (totalWeight || 100)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/city-intelligence">
            <Button type="button" variant="ghost" disabled={loading} className="text-[#858783] hover:text-[#F5F5F2]">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || selectedCities.length < 2}
            className="gap-2 bg-[#F5B94C] text-[#080A0B] hover:bg-[#FFD27A] font-semibold min-w-[200px]"
            id="btn-run-comparison"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#080A0B]" />
                Calculating Deterministic Fit...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Run Fit Assessment
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
