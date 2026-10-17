import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  MapPin,
  Users,
  FlaskConical,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Lightbulb,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch summary counts in parallel
  const [
    { count: comparisonsCount },
    { count: contactsCount },
    { count: experimentsCount },
    { count: assumptionsCount },
    { data: profile },
  ] = await Promise.all([
    supabase.from('city_comparisons').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('introduction_requests').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('experiments').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('assumptions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('startup_profiles').select('name, industry, stage').eq('user_id', user!.id).maybeSingle(),
  ])

  const stageLabels: Record<string, string> = {
    idea: 'Idea Stage',
    'pre-seed': 'Pre-Seed',
    seed: 'Seed',
    'series-a': 'Series A',
  }

  const modules = [
    {
      id: 'module-city-intelligence',
      title: 'City Intelligence',
      description: 'Compare cities and generate Fit Scores from sourced market indicators.',
      href: '/city-intelligence',
      icon: MapPin,
      count: comparisonsCount ?? 0,
      countLabel: 'comparison',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'module-local-connect',
      title: 'Local Connect',
      description: 'Discover retailers, distributors, mentors and ecosystem institutions.',
      href: '/local-connect',
      icon: Users,
      count: contactsCount ?? 0,
      countLabel: 'introduction',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      id: 'module-market-validation',
      title: 'Market Validation',
      description: 'Define experiments, record responses and measure real outcomes.',
      href: '/market-validation',
      icon: FlaskConical,
      count: experimentsCount ?? 0,
      countLabel: 'experiment',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'module-market-proof',
      title: 'Market Proof',
      description: 'See which assumptions are supported, challenged or still untested.',
      href: '/market-proof',
      icon: ShieldCheck,
      count: assumptionsCount ?? 0,
      countLabel: 'assumption',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title={`Welcome back${profile?.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋`}
        description="Your market-entry command centre."
      />

      {/* Profile banner */}
      {profile && (
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20">
            <Lightbulb className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">{profile.name}</p>
            <p className="text-xs text-slate-500">{profile.industry}</p>
          </div>
          <Badge variant="secondary">{stageLabels[profile.stage] ?? profile.stage}</Badge>
          <Link href="/settings">
            <Button variant="ghost" size="sm" id="btn-edit-profile" aria-label="Edit startup profile">
              Edit profile
            </Button>
          </Link>
        </div>
      )}

      {/* Module cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map(({ id, title, description, href, icon: Icon, count, countLabel, color, bg }) => (
          <Link key={href} href={href} id={id} className="group block">
            <Card className="h-full transition-all duration-200 hover:border-slate-700 hover:shadow-xl hover:shadow-slate-900/50 group-hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
                </div>
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`h-3.5 w-3.5 ${color}`} />
                  <span className="text-xs text-slate-500">
                    {count} {countLabel}{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Market Proof Loop diagram */}
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-600">
          Market Proof Loop
        </h3>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-stretch">
          {[
            { step: '1', label: 'City Intelligence', sub: 'Identifies opportunity & records assumptions', color: 'border-blue-800 bg-blue-900/10' },
            { step: '→', label: '', sub: '', color: 'border-0 bg-transparent' },
            { step: '2', label: 'Local Connect', sub: 'Finds contacts to investigate the opportunity', color: 'border-violet-800 bg-violet-900/10' },
            { step: '→', label: '', sub: '', color: 'border-0 bg-transparent' },
            { step: '3', label: 'Market Validation', sub: 'Records real-world observations & outcomes', color: 'border-emerald-800 bg-emerald-900/10' },
            { step: '→', label: '', sub: '', color: 'border-0 bg-transparent' },
            { step: '4', label: 'Market Proof', sub: 'Shows which assumptions are supported or challenged', color: 'border-amber-800 bg-amber-900/10' },
          ].map((item, i) =>
            item.label === '' ? (
              <div key={i} className="flex items-center justify-center text-slate-700 sm:px-1">
                <ArrowRight className="h-5 w-5" />
              </div>
            ) : (
              <div
                key={i}
                className={`flex flex-1 flex-col gap-1 rounded-lg border p-4 ${item.color}`}
              >
                <span className="text-xs font-bold text-slate-500">Step {item.step}</span>
                <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                <span className="text-xs text-slate-500 leading-relaxed">{item.sub}</span>
              </div>
            )
          )}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Every conclusion is traceable to a source or recorded experiment. No fabricated data.
        </p>
      </div>
    </PageShell>
  )
}
