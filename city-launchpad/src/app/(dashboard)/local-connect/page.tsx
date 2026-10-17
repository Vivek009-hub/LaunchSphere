import { createClient } from '@/lib/supabase/server'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataProvenance } from '@/components/shared/DataProvenance'
import { DemoBanner } from '@/components/shared/DemoBanner'
import Link from 'next/link'
import { Users, Building2, GraduationCap, Store, Truck, UserCheck } from 'lucide-react'
import type { Metadata } from 'next'
import type { Contact, ContactCategory } from '@/types/database'
import { DEMO_CONTACTS } from '@/lib/data/demoData'

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
  let contacts: Contact[] = []
  let isDemo = false

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('city')
      .order('category')
      .limit(50)

    if (data && data.length > 0) {
      contacts = data
    }
  } catch {
    // Supabase unconfigured or offline
  }

  // Fallback to demo contacts for Phase 2 UI prototype
  if (contacts.length === 0) {
    contacts = DEMO_CONTACTS
    isDemo = true
  }

  return (
    <PageShell>
      <PageHeader
        title="Local Connect"
        description="Discover retailers, distributors, mentors and ecosystem institutions across Indian cities."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">
              Demo Directory
            </Badge>
          ) : undefined
        }
      />

      {isDemo && (
        <DemoBanner
          message="Simulated ecosystem network contacts. In Phase 6, live directory search, contact details, and introduction request dispatching are activated."
        />
      )}

      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts available"
          description="Local contacts for Indian startup hubs will appear here once seeded."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => {
            const Icon = categoryIcons[contact.category] ?? Users
            const color = categoryColors[contact.category] ?? 'text-slate-400'

            return (
              <Card key={contact.id} className="flex flex-col justify-between transition-all hover:border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{contact.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {contact.role ? `${contact.role} · ` : ''}{contact.organization}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0 capitalize text-[10px]">
                      {contact.category.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{contact.city}</span>
                    {contact.industry_tags && contact.industry_tags.length > 0 && (
                      <span className="text-slate-600">· {contact.industry_tags.join(', ')}</span>
                    )}
                  </div>

                  {contact.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{contact.description}</p>
                  )}

                  <div className="border-t border-slate-800 pt-2">
                    <DataProvenance
                      sourceName={contact.source_name}
                      sourceUrl={contact.source_url}
                      confidence={contact.verified ? 'high' : 'medium'}
                      isDemo={isDemo}
                    />
                  </div>

                  <div className="pt-1">
                    <Link href={`/local-connect/${contact.id}`} id={`contact-${contact.id}`}>
                      <span className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                        Request Introduction →
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
