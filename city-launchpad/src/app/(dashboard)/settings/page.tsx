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
        <div className="rounded-xl border border-[#252729] bg-[#151719]/40 p-4 text-xs text-[#B4B5B2] flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-[#F5B94C] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#F5F5F2]">Shared Platform Context</span>
            <p className="text-[#858783] leading-relaxed">
              This startup profile configures the recommendation engine across all modules: City
              Intelligence uses your target customer and channel to calibrate Fit Scores; Local
              Connect prioritizes distributors in your candidate cities; and Market Validation links
              hypotheses to your product offering.
            </p>
          </div>
        </div>

        {/* Profile Completeness Card */}
        <Card className="border-[#252729] bg-[#101314]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#F5B94C]" />
                <CardTitle className="text-sm text-[#F5F5F2]">Profile Completeness</CardTitle>
              </div>
              <Badge variant="outline" className="border-[#252729] font-mono text-xs text-[#F5B94C] bg-[#151719]">
                {completedFields} of {totalFields} fields ({completionPercentage}%)
              </Badge>
            </div>
            <div className="h-1.5 w-full bg-[#151719] rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-[#F5B94C] transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5 pt-2">
              {profileChecks.map((c) => (
                <span
                  key={c.label}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] border ${
                    c.ok
                      ? 'border-[#252729] bg-[#151719]/50 text-[#B4B5B2]'
                      : 'border-[#4E3516] bg-[#2A1D0B]/40 text-[#FBBF24]'
                  }`}
                >
                  {c.ok ? (
                    <CheckCircle2 className="h-3 w-3 text-[#F5B94C]" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-[#FBBF24]" />
                  )}
                  {c.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Startup Profile Details */}
        <Card className="border-[#252729] bg-[#101314]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#F5B94C]" />
                <CardTitle className="text-base text-[#F5F5F2]">Startup Profile</CardTitle>
              </div>
              <Link href="/onboarding?returnTo=/settings">
                <Button id="btn-edit-startup-profile" variant="outline" size="sm" className="text-xs border-[#252729] hover:border-[#F5B94C] hover:text-[#F5B94C]">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <dl className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="text-[#858783]">Startup Name</dt>
                  <dd className="font-semibold text-[#F5F5F2] text-sm mt-0.5">{profile.name}</dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Stage</dt>
                  <dd className="mt-0.5">
                    <Badge variant="secondary" className="capitalize text-xs border-[#252729] bg-[#151719] text-[#F5B94C]">
                      {stageLabels[profile.stage] ?? profile.stage}
                    </Badge>
                  </dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Industry / Subcategory</dt>
                  <dd className="text-[#F5F5F2] mt-0.5 font-medium">
                    {profile.industry}
                    {profile.product_category && (
                      <span className="text-[#858783]"> ({profile.product_category})</span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Current Hub City</dt>
                  <dd className="text-[#F5F5F2] mt-0.5 flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#F5B94C]" />
                    {profile.current_city || 'Bengaluru'}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-[#858783]">One-Liner Business Pitch</dt>
                  <dd className="text-[#B4B5B2] mt-1 italic leading-relaxed">
                    &quot;{profile.business_description || profile.product_desc}&quot;
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-[#858783]">Product / Service Offering</dt>
                  <dd className="text-[#B4B5B2] mt-1 leading-relaxed">{profile.product_desc}</dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Target Customer</dt>
                  <dd className="text-[#F5F5F2] mt-0.5 font-medium">{profile.target_customer}</dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Primary Channel</dt>
                  <dd className="text-[#F5F5F2] mt-0.5 font-medium">
                    {profile.primary_channel || 'B2B Direct Field Sales'}
                  </dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Price Range</dt>
                  <dd className="text-[#F5B94C] mt-0.5 font-mono font-medium">
                    {profile.price_min != null || profile.price_max != null
                      ? `₹${profile.price_min ?? 0} – ₹${profile.price_max ?? 'Variable'}`
                      : 'Pre-pricing / Not specified'}
                  </dd>
                </div>

                <div>
                  <dt className="text-[#858783]">Website</dt>
                  <dd className="text-[#F5F5F2] mt-0.5">
                    {profile.website_url ? (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F5B94C] hover:text-[#FFD27A] hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        <Globe className="h-3 w-3" /> {profile.website_url}
                      </a>
                    ) : (
                      <span className="text-[#858783]">Not specified</span>
                    )}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-[#858783]">Candidate Expansion Cities</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {profile.expansion_cities && profile.expansion_cities.length > 0 ? (
                      profile.expansion_cities.map((city) => (
                        <Badge key={city} variant="outline" className="border-[#252729] bg-[#151719] text-[#F5B94C]">
                          {city}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[#858783] text-xs">No candidate cities selected yet</span>
                    )}
                  </dd>
                </div>

                {profile.traction_summary && (
                  <div className="sm:col-span-2">
                    <dt className="text-[#858783]">Existing Traction</dt>
                    <dd className="text-[#B4B5B2] mt-1.5 bg-[#151719] p-3 rounded-lg border border-[#252729] leading-relaxed">
                      {profile.traction_summary}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-[#858783]">No startup profile created yet.</p>
                <Link href="/onboarding">
                  <Button size="sm" className="bg-[#F5B94C] hover:bg-[#FFD27A] text-[#080A0B] font-semibold text-xs shadow-lg shadow-[#F5B94C]/20">
                    Complete Startup Onboarding
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="border-[#252729] bg-[#101314]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#F5B94C]" />
              <CardTitle className="text-base text-[#F5F5F2]">Account Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <dt className="text-[#858783]">Email Address</dt>
                <dd className="text-[#F5F5F2] mt-0.5 font-medium">{user?.email ?? 'founder@kavachagri.in'}</dd>
              </div>
              <div>
                <dt className="text-[#858783]">Account ID</dt>
                <dd className="font-mono text-[11px] text-[#858783] mt-0.5">
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
