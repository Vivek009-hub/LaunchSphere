import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoBanner } from '@/components/shared/DemoBanner'
import Link from 'next/link'
import {
  User,
  Building2,
  MapPin,
  Globe,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import type { Metadata } from 'next'
import { DEMO_PROFILE, DEMO_USER } from '@/lib/data/demoData'
import type { StartupProfile } from '@/types/database'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  let profile: StartupProfile | null = null
  let user: { id: string; email?: string; app_metadata?: { provider?: string } } | null = null
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user ?? null

    if (user) {
      const { data: dbProfile } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (dbProfile) {
        profile = dbProfile as StartupProfile
      }
    }
  } catch {
    // Fallback if offline
  }

  if (!profile) {
    profile = DEMO_PROFILE
    user = DEMO_USER
    isDemo = true
  }

  const stageLabels: Record<string, string> = {
    idea: 'Idea Stage',
    'pre-seed': 'Pre-Seed',
    seed: 'Seed',
    'series-a': 'Series A',
  }

  // Profile completeness audit
  const profileChecks = [
    { label: 'Startup Name', ok: Boolean(profile?.name) },
    { label: 'Industry & Stage', ok: Boolean(profile?.industry && profile?.stage) },
    { label: 'Business Description', ok: Boolean(profile?.business_description) },
    { label: 'Product Description', ok: Boolean(profile?.product_desc) },
    { label: 'Target Customer', ok: Boolean(profile?.target_customer) },
    { label: 'Current City', ok: Boolean(profile?.current_city) },
    { label: 'Primary Distribution Channel', ok: Boolean(profile?.primary_channel) },
    { label: 'Price Range', ok: profile?.price_min != null || profile?.price_max != null },
    { label: 'Website URL', ok: Boolean(profile?.website_url) },
    { label: 'Candidate Expansion Cities', ok: Boolean(profile?.expansion_cities && profile.expansion_cities.length > 0) },
    { label: 'Traction Summary', ok: Boolean(profile?.traction_summary) },
  ]
  const completedFields = profileChecks.filter((c) => c.ok).length
  const totalFields = profileChecks.length
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <PageShell>
      <PageHeader
        title="Settings & Profile"
        description="Manage your startup profile and target expansion parameters."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">
              Demo Settings
            </Badge>
          ) : undefined
        }
      />

      {isDemo && (
        <DemoBanner
          message="Simulated founder profile settings. Profile attributes are stored in PostgreSQL and used as shared context across City Intelligence, Local Connect, and Market Validation."
        />
      )}

      <div className="max-w-3xl space-y-6">
        {/* Profile Shared Context Callout */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 text-xs text-blue-300 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">Shared Platform Context</span>
            <p className="text-slate-300 leading-relaxed">
              This startup profile configures the recommendation engine across all modules: City
              Intelligence uses your target customer and channel to calibrate Fit Scores; Local
              Connect prioritizes distributors in your candidate cities; and Market Validation links
              hypotheses to your product offering.
            </p>
          </div>
        </div>

        {/* Profile Completeness Card */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-sm">Profile Completeness</CardTitle>
              </div>
              <Badge variant="outline" className="border-slate-700 font-mono text-xs text-slate-300">
                {completedFields} of {totalFields} fields ({completionPercentage}%)
              </Badge>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profileChecks.map((c) => (
                <span
                  key={c.label}
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] ${
                    c.ok
                      ? 'bg-slate-800/80 text-slate-300 font-medium'
                      : 'bg-amber-950/30 text-amber-400 border border-amber-900/40'
                  }`}
                >
                  {c.ok ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-2.5 w-2.5 text-amber-400" />
                  )}
                  {c.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Startup Profile Details */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-base text-white">Startup Profile</CardTitle>
              </div>
              <Link href="/onboarding?returnTo=/settings">
                <Button id="btn-edit-startup-profile" variant="outline" size="sm" className="text-xs">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <dl className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="text-slate-500">Startup Name</dt>
                  <dd className="font-semibold text-white text-sm mt-0.5">{profile.name}</dd>
                </div>

                <div>
                  <dt className="text-slate-500">Stage</dt>
                  <dd className="mt-0.5">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {stageLabels[profile.stage] ?? profile.stage}
                    </Badge>
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Industry / Subcategory</dt>
                  <dd className="text-slate-200 mt-0.5">
                    {profile.industry}
                    {profile.product_category && (
                      <span className="text-slate-400"> ({profile.product_category})</span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Current Hub City</dt>
                  <dd className="text-slate-200 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-400" />
                    {profile.current_city || 'Bengaluru'}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-slate-500">One-Liner Business Pitch</dt>
                  <dd className="text-slate-300 mt-0.5 italic">
                    &quot;{profile.business_description || profile.product_desc}&quot;
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Product / Service Offering</dt>
                  <dd className="text-slate-300 mt-0.5 leading-relaxed">{profile.product_desc}</dd>
                </div>

                <div>
                  <dt className="text-slate-500">Target Customer</dt>
                  <dd className="text-slate-200 mt-0.5">{profile.target_customer}</dd>
                </div>

                <div>
                  <dt className="text-slate-500">Primary Channel</dt>
                  <dd className="text-slate-200 mt-0.5">
                    {profile.primary_channel || 'B2B Direct Field Sales'}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Price Range</dt>
                  <dd className="text-slate-200 mt-0.5 font-mono">
                    {profile.price_min != null || profile.price_max != null
                      ? `₹${profile.price_min ?? 0} – ₹${profile.price_max ?? 'Variable'}`
                      : 'Pre-pricing / Not specified'}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Website</dt>
                  <dd className="text-slate-200 mt-0.5">
                    {profile.website_url ? (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" /> {profile.website_url}
                      </a>
                    ) : (
                      <span className="text-slate-500">Not specified</span>
                    )}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Candidate Expansion Cities</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {profile.expansion_cities && profile.expansion_cities.length > 0 ? (
                      profile.expansion_cities.map((city) => (
                        <Badge key={city} variant="outline" className="border-slate-700 text-slate-300">
                          {city}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">No candidate cities selected yet</span>
                    )}
                  </dd>
                </div>

                {profile.traction_summary && (
                  <div className="sm:col-span-2">
                    <dt className="text-slate-500">Existing Traction</dt>
                    <dd className="text-slate-300 mt-0.5 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                      {profile.traction_summary}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-slate-400">No startup profile created yet.</p>
                <Link href="/onboarding">
                  <Button size="sm" className="bg-blue-600 text-white text-xs">
                    Complete Startup Onboarding
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-base text-white">Account Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <dt className="text-slate-500">Email Address</dt>
                <dd className="text-slate-200 mt-0.5">{user?.email ?? 'founder@kavachagri.in'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Account ID</dt>
                <dd className="font-mono text-[11px] text-slate-500 mt-0.5">
                  {user?.id ?? 'demo-user-001'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
