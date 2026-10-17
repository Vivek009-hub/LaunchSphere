'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Users,
  FlaskConical,
  ShieldCheck,
  Building2,
  ArrowRight,
  Target,
  Clock,
  Eye,
} from 'lucide-react'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/StatCard'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { CoverageBar } from '@/components/shared/CoverageBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { DemoBanner } from '@/components/shared/DemoBanner'
import {
  DEMO_PROFILE,
  DEMO_CITY_ASSESSMENTS,
  DEMO_INTRO_REQUESTS,
  DEMO_EXPERIMENTS,
  DEMO_ASSUMPTIONS,
} from '@/lib/data/demoData'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  // State for toggling between demo data and empty state preview (requested in spec)
  const [showEmptyState, setShowEmptyState] = useState(false)

  const profile = DEMO_PROFILE
  const cityAssessments = DEMO_CITY_ASSESSMENTS
  const introRequests = DEMO_INTRO_REQUESTS
  const experiments = DEMO_EXPERIMENTS
  const assumptions = DEMO_ASSUMPTIONS

  // Stage mapping
  const stageLabels: Record<string, string> = {
    idea: 'Idea Stage',
    'pre-seed': 'Pre-Seed',
    seed: 'Seed Stage',
    'series-a': 'Series A',
  }

  // Count stats
  const supportedAssumptions = assumptions.filter((a) => a.status === 'supported').length
  const challengedAssumptions = assumptions.filter((a) => a.status === 'challenged').length
  const untestedAssumptions = assumptions.filter((a) => a.status === 'untested').length

  return (
    <PageShell>
      {/* Page Header with State Toggle */}
      <PageHeader
        title="Founder Dashboard"
        description="Market-entry command center: evaluate target cities, build ecosystem relationships, and validate real-world customer demand."
        badge={
          <Badge variant="demo" className="text-xs">
            {showEmptyState ? 'Empty State Preview' : 'Interactive Prototype'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="text-xs border-slate-700 hover:border-slate-600 text-slate-300"
              id="btn-toggle-demo-empty"
              aria-label="Toggle between demo scenario and empty states"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              {showEmptyState ? 'View Demo Data' : 'Preview Empty States'}
            </Button>
            <Link href="/city-intelligence">
              <Button size="sm" id="btn-header-new-comparison">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                Explore Cities
              </Button>
            </Link>
          </div>
        }
      />

      {/* Demo Status Banner */}
      <DemoBanner
        message="Displaying curated Indian market-entry data for Kavach AgriTech (Pune base + 3 expansion cities). All Fit Scores and metrics are labelled visual simulations."
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION A: STARTUP OVERVIEW
         ───────────────────────────────────────────────────────────── */}
      {showEmptyState ? (
        <Card className="border-dashed border-slate-800 bg-slate-900/40">
          <CardContent className="p-8">
            <EmptyState
              icon={Building2}
              title="No startup profile configured"
              description="Complete your onboarding profile to calibrate Fit Scores and industry benchmarks for your product."
              action={
                <Link href="/settings">
                  <Button size="sm" id="btn-empty-setup-profile">
                    Configure Profile
                  </Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 shadow-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Profile details */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-inner">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">{profile.name}</h3>
                      <Badge variant="demo" className="text-[10px]">
                        Demo Profile
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {stageLabels[profile.stage]}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{profile.industry}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {profile.shortDescription}
                </p>

                {/* Operating & Expansion Cities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-950/50 p-2.5">
                    <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Operating Base City
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {profile.operatingCity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-950/50 p-2.5">
                    <Target className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Expansion Target Hubs
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {profile.expansionCities.join(' · ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Customer Pill & Edit */}
              <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 lg:w-80 flex-shrink-0">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Target Customer Persona
                  </span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-medium">
                    {profile.target_customer}
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Profile calibration</span>
                  <Link href="/settings">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-400 hover:text-indigo-300">
                      Edit Profile →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─────────────────────────────────────────────────────────────
          HIGH-LEVEL METRIC STAT CARDS
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-top-fit-city"
          title="Top Fit Assessment"
          value={showEmptyState ? '—' : 'Pune (86/100)'}
          subtitle={showEmptyState ? 'No cities evaluated' : 'Western Maharashtra Base'}
          icon={MapPin}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          badge={showEmptyState ? undefined : 'Base City'}
          isDemo={!showEmptyState}
        />
        <StatCard
          id="stat-expansion-cities"
          title="Target Cohort"
          value={showEmptyState ? 0 : 3}
          subtitle={showEmptyState ? 'Add target cities' : 'Bengaluru, Ahmedabad, Indore'}
          icon={Target}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          trend={showEmptyState ? undefined : { value: '+2 from Q2', direction: 'up' }}
          isDemo={!showEmptyState}
        />
        <StatCard
          id="stat-intro-requests"
          title="Local Introductions"
          value={showEmptyState ? 0 : 4}
          subtitle={showEmptyState ? 'No introductions' : '2 Accepted · 2 Pending'}
          icon={Users}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          isDemo={!showEmptyState}
        />
        <StatCard
          id="stat-validated-assumptions"
          title="Market Proof Status"
          value={showEmptyState ? '0 / 0' : `${supportedAssumptions} / ${assumptions.length}`}
          subtitle={showEmptyState ? 'No assumptions logged' : `${challengedAssumptions} challenged · ${untestedAssumptions} untested`}
          icon={ShieldCheck}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          isDemo={!showEmptyState}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: CITY ASSESSMENT SUMMARY
         ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="heading-city-assessment" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="heading-city-assessment" className="text-base sm:text-lg font-bold text-white">
                City Assessment Summary
              </h3>
              <Badge variant="demo" className="text-[10px]">
                Simulated Fit Scores
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Evaluated Indian hubs based on logistics density, target customer presence, and infrastructure overhead.
            </p>
          </div>
          <Link href="/city-intelligence">
            <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300">
              View All City Comparisons
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {showEmptyState ? (
          <EmptyState
            icon={MapPin}
            title="No city assessments created"
            description="Run your first multi-city comparison to calculate objective Fit Scores from verifiable Indian market indicators."
            action={
              <Link href="/city-intelligence">
                <Button size="sm">Create Comparison</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityAssessments.map((city) => (
              <Card
                key={city.id}
                className="flex flex-col justify-between border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700 hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CardTitle className="text-base font-bold text-white">{city.cityName}</CardTitle>
                        {city.isBaseCity && (
                          <Badge variant="success" className="text-[9px] px-1.5 py-0">
                            Base
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-400">
                        {city.state} · {city.tier}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        city.status === 'recommended'
                          ? 'success'
                          : city.status === 'promising'
                            ? 'default'
                            : 'warning'
                      }
                      className="text-[10px] capitalize"
                    >
                      {city.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Visual Fit Score Gauge */}
                  <div className="flex items-center justify-center py-1">
                    <ScoreGauge
                      score={city.fitScore}
                      size="sm"
                      label="Simulated Fit"
                      showRating
                      accessibleLabel={`${city.cityName} Fit Score: ${city.fitScore} out of 100`}
                    />
                  </div>

                  {/* Evidence Coverage Indicator (Explicitly separate from Fit Score) */}
                  <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5">
                    <CoverageBar
                      coverage={city.evidenceCoverage}
                      label="Evidence Coverage"
                      size="sm"
                    />
                  </div>

                  {/* Qualitative Drivers & Risks */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-400">Primary Advantage:</span>
                      <p className="text-slate-300 mt-0.5 leading-snug">{city.keyDriver}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-rose-400/90">Critical Risk:</span>
                      <p className="text-slate-400 mt-0.5 leading-snug">{city.topRisk}</p>
                    </div>
                  </div>

                  {/* Footnote */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Demo indicators</span>
                    <Link
                      href={`/city-intelligence`}
                      className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      Inspect →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TWO-COLUMN SECTION: LOCAL CONNECT (C) & MARKET VALIDATION (D)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── SECTION C: LOCAL CONNECT ACTIVITY ─── */}
        <section aria-labelledby="heading-local-connect" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 id="heading-local-connect" className="text-base font-bold text-white">
                  Local Connect Activity
                </h3>
                <Badge variant="demo" className="text-[10px]">
                  Simulated Contacts
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Recent introduction requests with distributors, retailers, and mentors.
              </p>
            </div>
            <Link href="/local-connect">
              <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
                View Network →
              </Button>
            </Link>
          </div>

          {showEmptyState ? (
            <EmptyState
              icon={Users}
              title="No introductions requested"
              description="Discover vetted mentors, retail distributors, and ecosystem partners across target cities."
              action={
                <Link href="/local-connect">
                  <Button size="sm">Browse Directory</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {introRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">{req.contactName}</span>
                        <Badge
                          variant={req.status === 'accepted' ? 'success' : 'warning'}
                          className="text-[10px] capitalize"
                        >
                          {req.status} (Demo)
                        </Badge>
                      </div>
                      <p className="text-xs text-indigo-400 font-medium">
                        {req.organization} · <span className="text-slate-400">{req.city}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {formatDate(req.requestedAt)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="font-semibold text-slate-400">Objective: </span>
                    {req.purpose}
                  </p>

                  {req.notes && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3 text-slate-500 flex-shrink-0" />
                      <span>{req.notes}</span>
                    </div>
                  )}
                </div>
              ))}
              <p className="text-[11px] text-slate-500 italic text-center">
                Simulated demonstration requests — no actual emails or introductions are dispatched.
              </p>
            </div>
          )}
        </section>

        {/* ─── SECTION D: MARKET VALIDATION PROGRESS ─── */}
        <section aria-labelledby="heading-market-validation" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 id="heading-market-validation" className="text-base font-bold text-white">
                  Market Validation Progress
                </h3>
                <Badge variant="demo" className="text-[10px]">
                  Sample Experiments
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Ground-truth customer interviews, surveys, and pilot tests.
              </p>
            </div>
            <Link href="/market-validation">
              <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300">
                View Experiments →
              </Button>
            </Link>
          </div>

          {showEmptyState ? (
            <EmptyState
              icon={FlaskConical}
              title="No experiments configured"
              description="Define structured field experiments to test willingness-to-pay and procurement hurdles."
              action={
                <Link href="/market-validation">
                  <Button size="sm">New Experiment</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">{exp.title}</span>
                        <Badge
                          variant={
                            exp.status === 'complete'
                              ? 'success'
                              : exp.status === 'active'
                                ? 'warning'
                                : 'secondary'
                          }
                          className="text-[10px] capitalize"
                        >
                          {exp.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        {exp.city} · <span className="capitalize">{exp.method.replace('-', ' ')}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {formatDate(exp.updatedAt)}
                    </span>
                  </div>

                  {/* Hypothesis & Metric */}
                  <div className="mt-2.5 space-y-1.5 text-xs">
                    <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="font-semibold text-slate-400">Hypothesis: </span>
                      <span className="text-slate-300">{exp.hypothesis}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-500">Target: </span>
                        <span className="text-slate-300">{exp.metricTarget}</span>
                      </div>
                      {exp.metricActual && (
                        <div className="font-medium text-emerald-400">
                          <span>Result: </span>
                          <span>{exp.metricActual}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Next Action:</span>
                      <span className="text-slate-300 text-right truncate max-w-[280px]">
                        {exp.nextAction}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-slate-500 italic text-center">
                Simulated experiments for prototype evaluation — no real database updates applied.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION E: MARKET PROOF PREVIEW
         ───────────────────────────────────────────────────────────── */}
      <section aria-labelledby="heading-market-proof" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="heading-market-proof" className="text-base sm:text-lg font-bold text-white">
                Market Proof Loop Preview
              </h3>
              <Badge variant="demo" className="text-[10px]">
                Signature Differentiator
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Traces whether early city assessments are supported or challenged by real-world field outcomes.
            </p>
          </div>
          <Link href="/market-proof">
            <Button variant="outline" size="sm" className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
              Open Market Proof Matrix
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {showEmptyState ? (
          <EmptyState
            icon={ShieldCheck}
            title="No market proof records"
            description="Link city scores to real customer validation experiments to see which assumptions hold true."
            action={
              <Link href="/market-proof">
                <Button size="sm">Initialize Proof Loop</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {/* Assumption Matrix Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {assumptions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {item.category.replace('-', ' ')}
                      </span>
                      <Badge
                        variant={
                          item.status === 'supported'
                            ? 'success'
                            : item.status === 'challenged'
                              ? 'warning'
                              : 'secondary'
                        }
                        className="text-[10px] capitalize"
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      &ldquo;{item.statement}&rdquo;
                    </p>

                    <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/50 p-2 rounded border border-slate-800/80">
                      {item.evidenceSummary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="capitalize">Source: {item.linkedModule.replace('-', ' ')}</span>
                    <span className="text-indigo-400 font-medium">Traceable</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Proof Workflow Architecture Diagram */}
            <Card className="border-slate-800 bg-slate-900/40">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Traceability Architecture
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Verifiable data integrity · Zero synthetic fabrication
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                    <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 p-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400">STEP 1</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">City Intelligence</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Evaluates census, logistics, and demographic indicators; records baseline expansion assumptions.
                        </p>
                      </div>
                      <span className="mt-2 text-[10px] text-blue-400 font-medium">Sourced Data</span>
                    </div>

                    <div className="rounded-lg border border-violet-900/40 bg-violet-950/20 p-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-violet-400">STEP 2</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">Local Connect</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Locates verified mentors, pilot customers, and retail distributors to interrogate assumptions.
                        </p>
                      </div>
                      <span className="mt-2 text-[10px] text-violet-400 font-medium">Ecosystem Network</span>
                    </div>

                    <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400">STEP 3</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">Market Validation</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Executes interviews and surveys to record measurable real-world outcomes.
                        </p>
                      </div>
                      <span className="mt-2 text-[10px] text-emerald-400 font-medium">Empirical Evidence</span>
                    </div>

                    <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400">STEP 4</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">Market Proof</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Correlates recorded evidence directly back to the original expansion hypothesis.
                        </p>
                      </div>
                      <span className="mt-2 text-[10px] text-amber-400 font-medium">Traceable Loop</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </PageShell>
  )
}
