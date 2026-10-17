import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoBanner } from '@/components/shared/DemoBanner'
import Link from 'next/link'
import { User, Building2, Key } from 'lucide-react'
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
        profile = dbProfile
      }
    }
  } catch {
    // Offline or unconfigured
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

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="Manage your startup profile and account preferences."
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
          message="Simulated founder profile settings. In Phase 3 and 4, changes to your profile and stage calibration are persisted directly to PostgreSQL."
        />
      )}

      <div className="max-w-2xl space-y-6">
        {/* Startup Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-400" />
                <CardTitle className="text-base">Startup Profile</CardTitle>
              </div>
              <Link href="/onboarding">
                <Button id="btn-edit-startup-profile" variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Industry', value: profile.industry },
                  {
                    label: 'Stage',
                    value: (
                      <Badge variant="secondary">
                        {stageLabels[profile.stage] ?? profile.stage}
                      </Badge>
                    ),
                  },
                  { label: 'Target customer', value: profile.target_customer },
                  { label: 'Product description', value: profile.product_desc },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-slate-300">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-slate-500">No profile found.</p>
            )}
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-base">Account Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd className="text-slate-300">{user?.email ?? 'founder@kavachagri.in'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">User ID</dt>
                <dd className="font-mono text-xs text-slate-500">{user?.id ?? 'demo-user-001'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Auth provider</dt>
                <dd className="text-slate-300 capitalize">
                  {user?.app_metadata?.provider ?? 'Demo Preview'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Environment info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-base text-slate-300">Environment Integration</CardTitle>
            </div>
            <CardDescription>
              Configuration status for external services. Server credentials are never exposed in the browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Supabase Project URL', set: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
                { label: 'Supabase Anon Public Key', set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
              ].map(({ label, set }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-400">{label}</span>
                  <Badge variant={set ? 'success' : 'secondary'} className="text-[10px]">
                    {set ? 'Configured' : 'Demo Prototype Mode'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
