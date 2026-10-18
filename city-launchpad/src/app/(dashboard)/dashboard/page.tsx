'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Users,
  FlaskConical,
  ShieldCheck,
  Building2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Play,
  CheckCircle2,
  Edit,
  Clock,
  Sparkles,
  ExternalLink,
  Target,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MarketOpportunityMap } from '@/components/dashboard/MarketOpportunityMap'
import { ValidationProgressGauge } from '@/components/dashboard/ValidationProgressGauge'
import { DEMO_PROFILE } from '@/lib/data/demoData'

export default function DashboardPage() {
  const profile = DEMO_PROFILE

  return (
    <PageShell className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP ROW: HERO BANNER + YOUR STARTUP SUMMARY CARD
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Hero Banner */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl border border-[#252729] bg-[#101314] p-7 md:p-9 shadow-xl flex flex-col justify-between min-h-[290px]">
          {/* Background Image with Golden Dark Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-city.jpg"
              alt="Golden Metropolis Skyline"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover object-center opacity-35 select-none sepia-[0.35] brightness-90 contrast-125"
            />
            {/* Dark vignette layers for crisp text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080A0B] via-[#080A0B]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101314] via-transparent to-transparent" />
            {/* Subtle warm golden ambient glow */}
            <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[#F5B94C]/10 blur-3xl pointer-events-none" />
          </div>

          {/* Hero Top Tag & Quote */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B94C]">
              EXPLORE · VALIDATE · EXPAND
            </span>
            <span className="text-[11px] text-[#B4B5B2] italic hidden sm:block">
              &ldquo;Better decisions today, bigger opportunities tomorrow.&rdquo;
            </span>
          </div>

          {/* Hero Headline & Subtitle */}
          <div className="relative z-10 my-4 space-y-2.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F5F5F2] leading-tight">
              Find the right city for your{' '}
              <span className="text-[#FFD27A] drop-shadow-[0_0_12px_rgba(245,185,76,0.3)]">
                next big move.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#B4B5B2] leading-relaxed max-w-lg">
              Data-driven insights, local connections and real market validation to help your startup grow with confidence.
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-1">
            <Link href="/city-intelligence/new">
              <Button
                size="default"
                className="bg-gradient-to-r from-[#FFD27A] to-[#F5B94C] text-[#080A0B] font-bold hover:brightness-105 shadow-lg shadow-[#F5B94C]/25 text-xs px-5 h-9 rounded-xl gap-1.5"
              >
                <span>Analyze a City</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link href="/market-validation">
              <Button
                variant="outline"
                size="default"
                className="border-[#252729] bg-[#151719]/90 text-[#F5F5F2] hover:bg-[#1A1D20] hover:border-[#3A3D40] text-xs px-4 h-9 rounded-xl gap-2 backdrop-blur"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5B94C]/20 text-[#F5B94C]">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Your Startup Card */}
        <div className="lg:col-span-4 rounded-2xl border border-[#252729] bg-[#101314] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B4B5B2]">
                Your Startup
              </span>
              <Link
                href="/settings"
                className="text-xs text-[#F5B94C] hover:text-[#FFD27A] inline-flex items-center gap-1 font-medium transition-colors"
              >
                <span>Edit</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Startup Brand Pill */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151719] border border-[#252729]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD27A] to-[#F5B94C] text-[#080A0B] font-black text-base shadow-sm">
                S
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-[#F5F5F2] truncate">
                  Shaurya&apos;s Startup
                </h2>
                <p className="text-[11px] text-[#858783] truncate">
                  D2C | Consumer Goods
                </p>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#858783]">Profile Completion</span>
                <span className="font-mono font-bold text-[#F5B94C]">80%</span>
              </div>
              <div className="h-1.5 w-full bg-[#151719] rounded-full overflow-hidden border border-[#252729]">
                <div
                  className="h-full bg-gradient-to-r from-[#F5B94C] to-[#FFD27A] rounded-full"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          </div>

          {/* Target Cities Selection */}
          <div className="pt-5 border-t border-[#252729]/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#858783]">Target Cities</span>
              <Link
                href="/onboarding?returnTo=/dashboard"
                className="text-[11px] text-[#F5B94C] hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Bangalore', 'Delhi NCR', 'Mumbai'].map((city) => (
                <span
                  key={city}
                  className="rounded-lg border border-[#252729] bg-[#151719] px-2.5 py-1 text-xs text-[#F5F5F2] font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECOND ROW: 4 SUMMARY METRIC CARDS WITH SPARKLINES
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cities Analyzed */}
        <Card className="border-[#252729] bg-[#101314] p-4 flex flex-col justify-between hover:border-[#3A3D40] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#151719] border border-[#252729] text-[#F5B94C]">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-xs text-[#858783]">Cities Analyzed</span>
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold font-mono text-[#F5F5F2]">12</p>
              <p className="text-[10px] text-[#F5B94C] font-medium mt-0.5">
                ↑ 3 this month
              </p>
            </div>
            {/* Golden Sparkline Line */}
            <svg width="70" height="28" className="overflow-visible stroke-[#F5B94C] fill-none">
              <path
                d="M 0 22 Q 15 18, 30 14 T 50 10 T 70 4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="70" cy="4" r="2.5" fill="#F5B94C" />
            </svg>
          </div>
        </Card>

        {/* Metric 2: Local Resources */}
        <Card className="border-[#252729] bg-[#101314] p-4 flex flex-col justify-between hover:border-[#3A3D40] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#151719] border border-[#252729] text-[#F5B94C]">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-xs text-[#858783]">Local Resources</span>
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold font-mono text-[#F5F5F2]">248</p>
              <p className="text-[10px] text-[#F5B94C] font-medium mt-0.5">
                ↑ 28 this month
              </p>
            </div>
            {/* Golden Bar Sparkline */}
            <div className="flex items-end gap-1 h-7">
              <span className="w-1.5 h-3 bg-[#9A6B22] rounded-sm" />
              <span className="w-1.5 h-4 bg-[#9A6B22] rounded-sm" />
              <span className="w-1.5 h-5 bg-[#F5B94C] rounded-sm" />
              <span className="w-1.5 h-3 bg-[#9A6B22] rounded-sm" />
              <span className="w-1.5 h-6 bg-[#FFD27A] rounded-sm" />
            </div>
          </div>
        </Card>

        {/* Metric 3: Experiments Run */}
        <Card className="border-[#252729] bg-[#101314] p-4 flex flex-col justify-between hover:border-[#3A3D40] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#151719] border border-[#252729] text-[#F5B94C]">
                <FlaskConical className="h-4 w-4" />
              </div>
              <span className="text-xs text-[#858783]">Experiments Run</span>
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold font-mono text-[#F5F5F2]">18</p>
              <p className="text-[10px] text-[#F5B94C] font-medium mt-0.5">
                ↑ 6 this month
              </p>
            </div>
            {/* Golden Bar Sparkline */}
            <div className="flex items-end gap-1 h-7">
              <span className="w-1.5 h-2 bg-[#9A6B22] rounded-sm" />
              <span className="w-1.5 h-4 bg-[#9A6B22] rounded-sm" />
              <span className="w-1.5 h-5 bg-[#F5B94C] rounded-sm" />
              <span className="w-1.5 h-6 bg-[#FFD27A] rounded-sm" />
            </div>
          </div>
        </Card>

        {/* Metric 4: Avg. Fit Score */}
        <Card className="border-[#252729] bg-[#101314] p-4 flex flex-col justify-between hover:border-[#3A3D40] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#151719] border border-[#252729] text-[#F5B94C]">
                <Target className="h-4 w-4" />
              </div>
              <span className="text-xs text-[#858783]">Avg. Fit Score</span>
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold font-mono text-[#F5F5F2]">
                72<span className="text-xs font-normal text-[#858783]"> /100</span>
              </p>
              <p className="text-[10px] text-[#F5B94C] font-medium mt-0.5">
                ↑ 8% vs last month
              </p>
            </div>
            {/* Golden Sparkline Line */}
            <svg width="70" height="28" className="overflow-visible stroke-[#F5B94C] fill-none">
              <path
                d="M 0 20 Q 20 22, 35 15 T 55 12 T 70 5"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="70" cy="5" r="2.5" fill="#F5B94C" />
            </svg>
          </div>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. THIRD ROW: TOP RECOMMENDED CITIES + MARKET OPPORTUNITY MAP
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Top Recommended Cities */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F5F5F2]">
                Top Recommended Cities
              </h2>
              <p className="text-xs text-[#858783]">
                Based on market fit, opportunity, and data coverage.
              </p>
            </div>
            <Link
              href="/city-intelligence"
              className="text-xs text-[#F5B94C] hover:text-[#FFD27A] flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Card 1: Bangalore */}
            <Card className="overflow-hidden border-[#252729] bg-[#101314] hover:border-[#3A3D40] transition-all flex flex-col justify-between">
              <div>
                {/* City Photo Header */}
                <div className="relative h-28 w-full bg-[#151719] overflow-hidden">
                  <Image
                    src="/images/hero-city.jpg"
                    alt="Bangalore Skyline"
                    fill
                    className="object-cover opacity-60 sepia-[0.3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101314] via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#080A0B]/80 border border-[#252729] text-[11px] font-mono font-bold text-[#F5B94C] backdrop-blur">
                    #1
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F5F2]">Bangalore</h3>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      High Opportunity
                    </span>
                  </div>

                  {/* Fit Score & Gauge */}
                  <div>
                    <div className="flex items-baseline justify-between text-xs mb-1">
                      <span className="text-[11px] text-[#858783]">Fit Score</span>
                      <span className="font-mono font-bold text-sm text-[#F5F5F2]">
                        82<span className="text-[10px] text-[#858783]">/100</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#151719] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F5B94C] to-[#FFD27A] rounded-full"
                        style={{ width: '82%' }}
                      />
                    </div>
                  </div>

                  {/* 4 Criteria Sub-scores */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Market Size</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">85</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Competition</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">70</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Talent Availability</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">90</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Cost of Operations</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">65</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link href="/city-intelligence/comp-001">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-[#252729] bg-[#151719] text-[#F5F5F2] hover:bg-[#1A1D20] hover:border-[#F5B94C]/40 hover:text-[#F5B94C] rounded-xl"
                  >
                    <span>View Full Analysis</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* City Card 2: Delhi NCR */}
            <Card className="overflow-hidden border-[#252729] bg-[#101314] hover:border-[#3A3D40] transition-all flex flex-col justify-between">
              <div>
                {/* City Photo Header */}
                <div className="relative h-28 w-full bg-[#151719] overflow-hidden">
                  <Image
                    src="/images/hero-city.jpg"
                    alt="Delhi NCR"
                    fill
                    className="object-cover opacity-60 sepia-[0.3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101314] via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#080A0B]/80 border border-[#252729] text-[11px] font-mono font-bold text-[#F5B94C] backdrop-blur">
                    #2
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F5F2]">Delhi NCR</h3>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      High Opportunity
                    </span>
                  </div>

                  {/* Fit Score & Gauge */}
                  <div>
                    <div className="flex items-baseline justify-between text-xs mb-1">
                      <span className="text-[11px] text-[#858783]">Fit Score</span>
                      <span className="font-mono font-bold text-sm text-[#F5F5F2]">
                        76<span className="text-[10px] text-[#858783]">/100</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#151719] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F5B94C] to-[#FFD27A] rounded-full"
                        style={{ width: '76%' }}
                      />
                    </div>
                  </div>

                  {/* 4 Criteria Sub-scores */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Market Size</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">80</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Competition</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">65</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Talent Availability</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">75</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Cost of Operations</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">70</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link href="/city-intelligence/comp-001">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-[#252729] bg-[#151719] text-[#F5F5F2] hover:bg-[#1A1D20] hover:border-[#F5B94C]/40 hover:text-[#F5B94C] rounded-xl"
                  >
                    <span>View Full Analysis</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* City Card 3: Mumbai */}
            <Card className="overflow-hidden border-[#252729] bg-[#101314] hover:border-[#3A3D40] transition-all flex flex-col justify-between">
              <div>
                {/* City Photo Header */}
                <div className="relative h-28 w-full bg-[#151719] overflow-hidden">
                  <Image
                    src="/images/hero-city.jpg"
                    alt="Mumbai Sea Link"
                    fill
                    className="object-cover opacity-60 sepia-[0.3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101314] via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#080A0B]/80 border border-[#252729] text-[11px] font-mono font-bold text-[#F5B94C] backdrop-blur">
                    #3
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#F5F5F2]">Mumbai</h3>
                    <span className="rounded-full border border-[#9A6B22]/40 bg-[#9A6B22]/20 px-2 py-0.5 text-[10px] font-semibold text-[#FFD27A]">
                      Medium Opportunity
                    </span>
                  </div>

                  {/* Fit Score & Gauge */}
                  <div>
                    <div className="flex items-baseline justify-between text-xs mb-1">
                      <span className="text-[11px] text-[#858783]">Fit Score</span>
                      <span className="font-mono font-bold text-sm text-[#F5F5F2]">
                        74<span className="text-[10px] text-[#858783]">/100</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#151719] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F5B94C] to-[#FFD27A] rounded-full"
                        style={{ width: '74%' }}
                      />
                    </div>
                  </div>

                  {/* 4 Criteria Sub-scores */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Market Size</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">78</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Competition</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">72</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Talent Availability</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">70</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#858783]">Cost of Operations</span>
                      <span className="font-mono font-medium text-[#F5F5F2]">68</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link href="/city-intelligence/comp-001">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-[#252729] bg-[#151719] text-[#F5F5F2] hover:bg-[#1A1D20] hover:border-[#F5B94C]/40 hover:text-[#F5B94C] rounded-xl"
                  >
                    <span>View Full Analysis</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column (4 cols): Market Opportunity Map */}
        <div className="lg:col-span-4">
          <MarketOpportunityMap />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM ROW: VALIDATION PROGRESS + RECENT ACTIVITY + QUICK ACTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Market Validation Progress (4 cols) */}
        <div className="lg:col-span-4">
          <ValidationProgressGauge />
        </div>

        {/* Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="border-[#252729] bg-[#101314] shadow-xl h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#F5F5F2]">
                  Recent Activity
                </CardTitle>
                <Link
                  href="/market-proof"
                  className="text-xs text-[#F5B94C] hover:text-[#FFD27A] flex items-center gap-1 font-medium"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              {[
                {
                  title: 'Market analysis completed',
                  desc: 'Bangalore — E-commerce (D2C)',
                  time: '2h ago',
                  icon: Target,
                  color: 'text-[#F5B94C]',
                  bg: 'bg-[#F5B94C]/10',
                },
                {
                  title: 'New resource added',
                  desc: 'Retailer — Koramangala, Bangalore',
                  time: '5h ago',
                  icon: Users,
                  color: 'text-[#FFD27A]',
                  bg: 'bg-[#FFD27A]/10',
                },
                {
                  title: 'Experiment result updated',
                  desc: 'Customer interviews — 12 responses',
                  time: '1d ago',
                  icon: FlaskConical,
                  color: 'text-[#F5B94C]',
                  bg: 'bg-[#F5B94C]/10',
                },
                {
                  title: 'Startup profile updated',
                  desc: 'Product & target market defined',
                  time: '2d ago',
                  icon: Building2,
                  color: 'text-[#B4B5B2]',
                  bg: 'bg-[#151719]',
                },
              ].map((act, i) => {
                const Icon = act.icon
                return (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-xl border border-[#252729]/60 bg-[#151719]/40 hover:border-[#3A3D40] transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${act.bg} ${act.color} shrink-0 mt-0.5`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#F5F5F2] truncate">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-[#858783] truncate">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#858783] whitespace-nowrap font-mono">
                      {act.time}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid (3 cols) */}
        <div className="lg:col-span-3">
          <Card className="border-[#252729] bg-[#101314] shadow-xl h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#F5F5F2]">
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-2.5 pt-1">
              <Link href="/city-intelligence/new" className="block">
                <div className="flex flex-col items-center text-center p-3 rounded-xl border border-[#252729] bg-[#151719] hover:border-[#F5B94C]/40 hover:bg-[#1A1D20] transition-all cursor-pointer h-full justify-center group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5B94C]/10 text-[#F5B94C] mb-1.5 group-hover:scale-105 transition-transform">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#F5F5F2] line-clamp-1">
                    Analyze a City
                  </span>
                  <span className="text-[10px] text-[#858783] mt-0.5">
                    Get market insights
                  </span>
                </div>
              </Link>

              <Link href="/local-connect" className="block">
                <div className="flex flex-col items-center text-center p-3 rounded-xl border border-[#252729] bg-[#151719] hover:border-[#F5B94C]/40 hover:bg-[#1A1D20] transition-all cursor-pointer h-full justify-center group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD27A]/10 text-[#FFD27A] mb-1.5 group-hover:scale-105 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#F5F5F2] line-clamp-1">
                    Find Resources
                  </span>
                  <span className="text-[10px] text-[#858783] mt-0.5">
                    Connect with partners
                  </span>
                </div>
              </Link>

              <Link href="/market-validation/new" className="block">
                <div className="flex flex-col items-center text-center p-3 rounded-xl border border-[#252729] bg-[#151719] hover:border-[#F5B94C]/40 hover:bg-[#1A1D20] transition-all cursor-pointer h-full justify-center group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5B94C]/10 text-[#F5B94C] mb-1.5 group-hover:scale-105 transition-transform">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#F5F5F2] line-clamp-1">
                    Create Experiment
                  </span>
                  <span className="text-[10px] text-[#858783] mt-0.5">
                    Validate your idea
                  </span>
                </div>
              </Link>

              <Link href="/market-proof" className="block">
                <div className="flex flex-col items-center text-center p-3 rounded-xl border border-[#252729] bg-[#151719] hover:border-[#F5B94C]/40 hover:bg-[#1A1D20] transition-all cursor-pointer h-full justify-center group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD27A]/10 text-[#FFD27A] mb-1.5 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#F5F5F2] line-clamp-1">
                    View Proof Loop
                  </span>
                  <span className="text-[10px] text-[#858783] mt-0.5">
                    See complete analysis
                  </span>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
