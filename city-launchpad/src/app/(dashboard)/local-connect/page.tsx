import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataProvenance } from '@/components/shared/DataProvenance'
import Link from 'next/link'
import { Users, Building2, GraduationCap, Store, Truck, UserCheck } from 'lucide-react'
import type { Metadata } from 'next'
import type { Contact, ContactCategory, ConfidenceLevel } from '@/types/database'

export const metadata: Metadata = { title: 'Local Connect' }

const categoryIcons: Record<ContactCategory, typeof Users> = {
  retailer: Store,
  distributor: Truck,
  mentor: GraduationCap,
  institution: Building2,
  supplier: Truck,
  'pilot-customer': UserCheck,
}

const categoryColors: Record<ContactCategory, string> = {
  retailer: 'text-blue-400',
  distributor: 'text-violet-400',
  mentor: 'text-amber-400',
  institution: 'text-emerald-400',
  supplier: 'text-rose-400',
  'pilot-customer': 'text-cyan-400',
}

export default async function LocalConnectPage() {
  const supabase = await createClient()

  // Contacts are publicly readable (no user filter required by RLS)
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('city')
    .order('category')
    .limit(50)

  if (error) {
    return (
      <PageShell>
        <PageHeader title="Local Connect" />
        <div className="rounded-lg border border-rose-800/50 bg-rose-900/10 p-4 text-sm text-rose-400">
          Failed to load contacts: {error.message}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Local Connect"
        description="Discover retailers, distributors, mentors and ecosystem institutions across Indian cities."
      />

      {(!contacts || contacts.length === 0) ? (
        <EmptyState
          icon={Users}
          title="No contacts available yet"
          description="Run the seed.sql script in Supabase to populate demo contacts, or add contacts via the admin panel."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            {contacts.some((c: Contact) => c.is_demo) && (
              <> · <span className="text-amber-500">includes demo data</span></>
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact: Contact) => {
              const Icon = categoryIcons[contact.category] ?? Users
              const colorClass = categoryColors[contact.category] ?? 'text-slate-400'
              return (
                <Link key={contact.id} href={`/local-connect/${contact.id}`} id={`contact-${contact.id}`}>
                  <Card className="h-full cursor-pointer transition-all hover:border-slate-700 hover:-translate-y-0.5">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800">
                          <Icon className={`h-4 w-4 ${colorClass}`} />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="truncate text-sm">{contact.name}</CardTitle>
                          {contact.organization && (
                            <CardDescription className="truncate text-xs">
                              {contact.organization}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px]">{contact.city}</Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">{contact.category}</Badge>
                        {contact.verified && (
                          <Badge variant="success" className="text-[10px]">Verified</Badge>
                        )}
                      </div>
                      {contact.description && (
                        <p className="line-clamp-2 text-xs text-slate-500">{contact.description}</p>
                      )}
                      <DataProvenance
                        sourceName={contact.source_name}
                        sourceUrl={contact.source_url}
                        confidence={contact.verified ? 'medium' : 'unverified' as ConfidenceLevel}
                        isDemo={contact.is_demo}
                      />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </PageShell>
  )
}
