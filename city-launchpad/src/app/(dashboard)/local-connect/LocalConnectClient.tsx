'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  X,
  Store,
  Truck,
  GraduationCap,
  Building2,
  Wrench,
  UserCheck,
  Package,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/shared/EmptyState'
import { DemoBanner } from '@/components/shared/DemoBanner'
import type { Contact, ContactCategory, IntroductionRequest, StartupProfile } from '@/types/database'
import { rankContacts } from '@/lib/scoring/localConnectMatching'
import { cancelIntroductionRequest } from '@/lib/actions/introductionRequests'
import { formatDate } from '@/lib/utils'
import { AILocalConnectModal } from '@/components/ai/AILocalConnectModal'

interface LocalConnectClientProps {
  initialContacts: Contact[]
  startupProfile: StartupProfile | null
  initialRequests: IntroductionRequest[]
  isDemo: boolean
  hasProfile: boolean
}

const categoryIcons: Record<ContactCategory, typeof Users> = {
  retailer: Store,
  distributor: Truck,
  mentor: GraduationCap,
  institution: Building2,
  supplier: Wrench,
  'pilot-customer': UserCheck,
  logistics: Package,
  'service-provider': Briefcase,
}

const categoryColors: Record<ContactCategory, string> = {
  retailer: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  distributor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  mentor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  institution: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  supplier: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  'pilot-customer': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  logistics: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'service-provider': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
}

const categoryLabels: Record<ContactCategory, string> = {
  retailer: 'Retailer & Retail Partner',
  distributor: 'Distributor & Wholesaler',
  mentor: 'Industry Mentor',
  institution: 'Incubator & Trade Org',
  supplier: 'Supplier & Manufacturer',
  'pilot-customer': 'Potential Pilot Customer',
  logistics: 'Logistics & Warehousing',
  'service-provider': 'Specialized Service Provider',
}

const statusConfig = {
  pending: { label: 'Pending Response', variant: 'warning' as const, icon: Clock },
  accepted: { label: 'Introduction Accepted', variant: 'success' as const, icon: CheckCircle },
  declined: { label: 'Declined', variant: 'destructive' as const, icon: XCircle },
  cancelled: { label: 'Cancelled by Founder', variant: 'secondary' as const, icon: XCircle },
  withdrawn: { label: 'Withdrawn', variant: 'secondary' as const, icon: XCircle },
  completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle },
}

export function LocalConnectClient({
  initialContacts,
  startupProfile,
  initialRequests,
  isDemo,
  hasProfile,
}: LocalConnectClientProps) {
  const [activeTab, setActiveTab] = useState<'directory' | 'requests'>('directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedVerification, setSelectedVerification] = useState<string>('all')
  const [requests, setRequests] = useState<IntroductionRequest[]>(initialRequests)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Rank contacts deterministically against startup profile
  const rankedAllContacts = useMemo(() => {
    return rankContacts(initialContacts, startupProfile)
  }, [initialContacts, startupProfile])

  // Extract unique cities from all contacts and startup expansion cities
  const availableCities = useMemo(() => {
    const set = new Set<string>()
    if (startupProfile?.current_city) set.add(startupProfile.current_city)
    if (startupProfile?.expansion_cities) {
      startupProfile.expansion_cities.forEach((c) => set.add(c))
    }
    initialContacts.forEach((c) => set.add(c.city))
    return Array.from(set).sort()
  }, [initialContacts, startupProfile])

  // Filter contacts based on query, city, category, and verification status
  const filteredContacts = useMemo(() => {
    return rankedAllContacts.filter((contact) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = contact.name.toLowerCase().includes(q)
        const matchOrg = (contact.organization || '').toLowerCase().includes(q)
        const matchRole = (contact.role || '').toLowerCase().includes(q)
        const matchDesc = (contact.description || '').toLowerCase().includes(q)
        const matchCity = contact.city.toLowerCase().includes(q)
        const matchArea = (contact.service_area || '').toLowerCase().includes(q)
        const matchTags = (contact.industry_tags || []).some((t) => t.toLowerCase().includes(q))
        const matchCaps = (contact.capabilities || []).some((c) => c.toLowerCase().includes(q))

        if (
          !matchName &&
          !matchOrg &&
          !matchRole &&
          !matchDesc &&
          !matchCity &&
          !matchArea &&
          !matchTags &&
          !matchCaps
        ) {
          return false
        }
      }

      // 2. City Filter
      if (selectedCity !== 'all' && contact.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false
      }

      // 3. Category Filter
      if (selectedCategory !== 'all' && contact.category !== selectedCategory) {
        return false
      }

      // 4. Verification Status Filter
      if (selectedVerification !== 'all') {
        const status = contact.verification_status || (contact.verified ? 'directly_confirmed' : 'unverified')
        if (status !== selectedVerification) {
          return false
        }
      }

      return true
    })
  }, [rankedAllContacts, searchQuery, selectedCity, selectedCategory, selectedVerification])

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCity !== 'all' ||
    selectedCategory !== 'all' ||
    selectedVerification !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCity('all')
    setSelectedCategory('all')
    setSelectedVerification('all')
  }

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to cancel this introduction request?')) return
    setCancellingId(requestId)
    setFeedbackMessage(null)

    try {
      const result = await cancelIntroductionRequest(requestId)
      if (result.success && result.data) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'cancelled', updated_at: new Date().toISOString() } : r))
        )
        setFeedbackMessage({ type: 'success', text: 'Introduction request has been cancelled.' })
      } else {
        setFeedbackMessage({ type: 'error', text: result.error || 'Failed to cancel introduction request.' })
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Network error while cancelling request.' })
    } finally {
      setCancellingId(null)
    }
  }

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length

  return (
    <PageShell>
      <PageHeader
        title="Local Connect"
        description="Discover vetted local businesses, distributors, mentors, and ecosystem partners across Indian startup hubs."
        badge={
          isDemo ? (
            <Badge variant="demo" className="text-xs">
              Demo Directory
            </Badge>
          ) : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'directory' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('directory')}
              className="text-xs h-8"
              id="tab-directory"
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Explore Resources ({filteredContacts.length})
            </Button>
            <Button
              variant={activeTab === 'requests' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('requests')}
              className="text-xs h-8 relative"
              id="tab-my-requests"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              My Requests ({requests.length})
              {pendingRequestsCount > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                  {pendingRequestsCount}
                </span>
              )}
            </Button>
          </div>
        }
      />

      {isDemo && (
        <DemoBanner message="Simulated ecosystem network contacts. Introduction requests, match explanations, and verification badges reflect real deterministic evaluation." />
      )}

      {/* Startup Profile Context Notice */}
      {!hasProfile && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <Info className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Startup Profile Required for Tailored Matching</p>
              <p className="text-amber-300/80">
                You haven&apos;t set up your startup profile yet. Complete onboarding to enable automated industry and expansion-city relevance ranking.
              </p>
            </div>
          </div>
          <Link href="/onboarding">
            <Button size="sm" variant="outline" className="text-xs flex-shrink-0 border-amber-500/50 text-amber-300 hover:bg-amber-500/20">
              Complete Onboarding <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Active Startup Context Bar */}
      {hasProfile && startupProfile && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">Matching profile for:</span>
            <span className="font-semibold text-slate-200">{startupProfile.name}</span>
            <span className="text-slate-600">·</span>
            <Badge variant="outline" className="text-[11px] border-slate-700 text-slate-300">
              {startupProfile.industry}
            </Badge>
            {startupProfile.current_city && (
              <span className="text-slate-400">Base: {startupProfile.current_city}</span>
            )}
            {startupProfile.expansion_cities && startupProfile.expansion_cities.length > 0 && (
              <span className="text-indigo-400">
                Targeting: {startupProfile.expansion_cities.join(', ')}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-400" /> Deterministic 100-pt Scoring Engine
          </div>
        </div>
      )}

      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          className={`rounded-lg border p-3 text-xs flex items-center justify-between ${
            feedbackMessage.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: EXPLORE RESOURCES DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Discovery Filter Controls */}
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
            <CardContent className="p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search query */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <Input
                    placeholder="Search name, capability, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-slate-950 border-slate-700 text-xs h-9"
                    id="search-input"
                  />
                </div>

                {/* City Filter */}
                <div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-9"
                    id="filter-city"
                  >
                    <option value="all">All Cities</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                        {startupProfile?.expansion_cities?.includes(city) ? ' ★ Target' : ''}
                        {startupProfile?.current_city === city ? ' (Base)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-9"
                    id="filter-category"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(categoryLabels).map(([cat, label]) => (
                      <option key={cat} value={cat}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Verification Status Filter */}
                <div>
                  <select
                    value={selectedVerification}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-9"
                    id="filter-verification"
                  >
                    <option value="all">All Verification States</option>
                    <option value="directly_confirmed">Directly Confirmed</option>
                    <option value="source_checked">Source Checked</option>
                    <option value="unverified">Unverified Listing</option>
                  </select>
                </div>
              </div>

              {/* Status and Clear Filters Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
                <span className="text-slate-400">
                  Showing <strong className="text-white">{filteredContacts.length}</strong> matching local resources
                </span>

                <div className="flex items-center gap-2">
                  <AILocalConnectModal
                    currentCity={selectedCity !== 'all' ? selectedCity : startupProfile?.current_city || 'Pune'}
                    onApplyFilters={(f) => {
                      if (f.category) setSelectedCategory(f.category)
                      if (f.city) setSelectedCity(f.city)
                      if (f.query) setSearchQuery(f.query)
                    }}
                  />
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-xs text-slate-400 hover:text-white h-7 px-2"
                      id="clear-filters-btn"
                    >
                      <X className="h-3 w-3 mr-1" /> Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Grid */}
          {filteredContacts.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No matching local resources"
              description="No directory contacts matched your current filter combinations. Try clearing filters or expanding to other Indian cities."
              action={
                hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs">
                    Clear Filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContacts.map((contact) => {
                const Icon = categoryIcons[contact.category] || Users
                const colorClass = categoryColors[contact.category] || 'text-slate-400 bg-slate-800'
                const status = contact.verification_status || (contact.verified ? 'directly_confirmed' : 'unverified')

                return (
                  <Card
                    key={contact.id}
                    className="flex flex-col justify-between border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700 hover:shadow-lg"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${colorClass}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                              <Link href={`/local-connect/${contact.id}`}>{contact.name}</Link>
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400 line-clamp-1">
                              {contact.role ? `${contact.role} · ` : ''}
                              {contact.organization}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex-shrink-0 text-right">
                          <div
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              contact.matchScore >= 70
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : contact.matchScore >= 40
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                            title={`Relevance score: ${contact.matchScore}/100`}
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            {contact.matchScore}%
                          </div>
                        </div>
                      </div>

                      {/* City & Category Bar */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <Badge variant="outline" className="text-[10px] border-slate-700">
                          {contact.city}
                        </Badge>
                        <Badge variant="secondary" className="capitalize text-[10px]">
                          {contact.category.replace('-', ' ')}
                        </Badge>
                        {status === 'directly_confirmed' && (
                          <Badge variant="success" className="gap-1 text-[10px]">
                            <ShieldCheck className="h-2.5 w-2.5" /> Directly Confirmed
                          </Badge>
                        )}
                        {status === 'source_checked' && (
                          <Badge variant="default" className="gap-1 text-[10px]">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Source Checked
                          </Badge>
                        )}
                        {status === 'unverified' && (
                          <Badge variant="unverified" className="gap-1 text-[10px]">
                            <ShieldAlert className="h-2.5 w-2.5" /> Unverified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        {contact.description && (
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {contact.description}
                          </p>
                        )}

                        {/* Stored Capabilities */}
                        {contact.capabilities && contact.capabilities.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                              Capabilities:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {contact.capabilities.slice(0, 3).map((cap) => (
                                <span
                                  key={cap}
                                  className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700/60"
                                >
                                  {cap}
                                </span>
                              ))}
                              {contact.capabilities.length > 3 && (
                                <span className="text-[10px] text-slate-500">
                                  +{contact.capabilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Match Reasons */}
                        {contact.matchReasons.length > 0 && (
                          <div className="rounded border border-indigo-950/80 bg-indigo-950/20 p-2 space-y-1">
                            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                              Why this matches:
                            </span>
                            <ul className="text-[11px] text-indigo-200/90 space-y-0.5 list-disc list-inside">
                              {contact.matchReasons.slice(0, 2).map((reason, idx) => (
                                <li key={idx} className="line-clamp-1">
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions & Provenance */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[170px]" title={contact.source_name}>
                          Src: {contact.source_name}
                        </div>
                        <Link
                          href={`/local-connect/${contact.id}`}
                          id={`connect-btn-${contact.id}`}
                          className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          Connect <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY INTRODUCTION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Your Submitted Requests ({requests.length})
            </h3>
            <span className="text-xs text-slate-400">
              Requests update when processed by local ecosystem administrators
            </span>
          </div>

          {requests.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No introduction requests submitted yet"
              description="Browse local resources and submit tailored requests with your business context and expansion goals."
              action={
                <Button size="sm" onClick={() => setActiveTab('directory')} className="text-xs">
                  Browse Directory
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const conf = statusConfig[req.status] || statusConfig.pending
                const StatusIcon = conf.icon
                const contact = req.contact

                return (
                  <Card key={req.id} className="border-slate-800 bg-slate-900/60 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {contact?.name || 'Local Partner Contact'}
                          </h4>
                          {contact?.role && (
                            <span className="text-xs text-slate-400">· {contact.role}</span>
                          )}
                          {contact?.organization && (
                            <span className="text-xs text-slate-500">({contact.organization})</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          {contact?.city && (
                            <Badge variant="outline" className="text-[10px] border-slate-700">
                              {contact.city}
                            </Badge>
                          )}
                          {contact?.category && (
                            <Badge variant="secondary" className="capitalize text-[10px]">
                              {contact.category.replace('-', ' ')}
                            </Badge>
                          )}
                          <span>Submitted on {formatDate(req.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Badge variant={conf.variant} className="gap-1 capitalize text-xs">
                          <StatusIcon className="h-3 w-3" />
                          {conf.label}
                        </Badge>

                        {req.status === 'pending' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancellingId === req.id}
                            onClick={() => handleCancelRequest(req.id)}
                            className="text-xs h-7 px-2"
                            id={`cancel-btn-${req.id}`}
                          >
                            {cancellingId === req.id ? 'Cancelling...' : 'Cancel Request'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Stored Context & Purpose */}
                    <div className="grid gap-2 sm:grid-cols-2 text-xs rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
                      <div>
                        <span className="font-semibold text-slate-400">Purpose:</span>
                        <p className="text-slate-200">{req.purpose || 'Exploratory connection'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400">Desired Outcome:</span>
                        <p className="text-slate-200">{req.desired_outcome || 'Introductory review'}</p>
                      </div>
                      {req.business_context && (
                        <div className="sm:col-span-2 pt-1 border-t border-slate-800/60">
                          <span className="font-semibold text-slate-400">Business Context:</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {req.business_context}
                          </p>
                        </div>
                      )}
                      {req.message && (
                        <div className="sm:col-span-2 pt-1 border-t border-slate-800/60">
                          <span className="font-semibold text-slate-400">Message Body:</span>
                          <pre className="text-slate-300 text-[11px] whitespace-pre-wrap font-sans mt-0.5">
                            {req.message}
                          </pre>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
