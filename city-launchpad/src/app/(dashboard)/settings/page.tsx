import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Settings, User, Building2, Database, Key } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('startup_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .maybeSingle()

  const stageLabels: Record<string, string> = {
    idea: 'Idea Stage', 'pre-seed': 'Pre-Seed', seed: 'Seed', 'series-a': 'Series A',
  }

  return (
    <PageShell>
      <PageHeader title="Settings" description="Manage your startup profile and account preferences." />

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
                <Button id="btn-edit-startup-profile" variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Industry', value: profile.industry },
                  { label: 'Stage', value: <Badge variant="secondary">{stageLabels[profile.stage]}</Badge> },
                  { label: 'Target customer', value: profile.target_customer },
                  { label: 'Product', value: profile.product_desc },
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
              <CardTitle className="text-base">Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Email</dt>
                <dd className="text-slate-300">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">User ID</dt>
                <dd className="font-mono text-xs text-slate-600">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Auth provider</dt>
                <dd className="text-slate-300 capitalize">
                  {user?.app_metadata?.provider ?? 'email'}
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
              <CardTitle className="text-base text-slate-400">Environment</CardTitle>
            </div>
            <CardDescription>
              Configuration status for integrations. Server keys are never shown here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Supabase URL', set: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
                { label: 'Supabase Anon Key', set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
              ].map(({ label, set }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-slate-400">{label}</span>
                  <Badge variant={set ? 'success' : 'destructive'}>
                    {set ? 'Configured' : 'Missing'}
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
