'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Contact, ContactCategory, IntroductionRequest, StartupProfile, VerificationStatus } from '@/types/database'
import {
  Users,
  ArrowLeft,
  Building2,
  GraduationCap,
  Store,
  Truck,
  Wrench,
  UserCheck,
  Package,
  Briefcase,
  Send,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  Calendar,
  XCircle,
  AlertCircle,
  Globe,
  Tag,
  Check,
} from 'lucide-react'
import { calculateLocalConnectMatch, type MatchScoreBreakdown } from '@/lib/scoring/localConnectMatching'
import { createIntroductionRequest, cancelIntroductionRequest } from '@/lib/actions/introductionRequests'
import { formatDate } from '@/lib/utils'

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

const statusConfig = {
  pending: { label: 'Pending Response', variant: 'warning' as const, icon: Clock },
  accepted: { label: 'Introduction Accepted', variant: 'success' as const, icon: CheckCircle },
  declined: { label: 'Declined', variant: 'destructive' as const, icon: XCircle },
  cancelled: { label: 'Cancelled by Founder', variant: 'secondary' as const, icon: XCircle },
  withdrawn: { label: 'Withdrawn', variant: 'secondary' as const, icon: XCircle },
  completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle },
}

export default function ContactDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [contact, setContact] = useState<Contact | null>(null)
  const [startupProfile, setStartupProfile] = useState<StartupProfile | null>(null)
  const [existingRequest, setExistingRequest] = useState<IntroductionRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  // Form fields
  const [purpose, setPurpose] = useState('Distribution & Pilot Partnership')
  const [businessContext, setBusinessContext] = useState('')
  const [desiredOutcome, setDesiredOutcome] = useState('Initial 30-minute exploratory discussion and review of pilot terms')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setLoading(true)
      const supabase = createClient()

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Fetch contact and existing request in parallel
        const [cRes, pRes, reqRes] = await Promise.all([
          supabase.from('contacts').select('*').eq('id', id).maybeSingle(),
          user
            ? supabase.from('startup_profiles').select('*').eq('user_id', user.id).maybeSingle()
            : Promise.resolve({ data: null, error: null }),
          user
            ? supabase
                .from('introduction_requests')
                .select('*')
                .eq('contact_id', id)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ])

        let contactData = cRes.data as Contact | null
        if (!contactData) {
          const { DEMO_CONTACTS } = await import('@/lib/data/demoData')
          contactData = DEMO_CONTACTS.find((c) => c.id === id) || null
        }

        let profileData = pRes.data as StartupProfile | null
        if (!profileData) {
          const { DEMO_PROFILE } = await import('@/lib/data/demoData')
          profileData = DEMO_PROFILE
        }

        if (!contactData) {
          setError('Local resource not found in the directory.')
        } else {
          setContact(contactData)
          setStartupProfile(profileData)

          if (reqRes.data) {
            setExistingRequest(reqRes.data as IntroductionRequest)
          }

          // Prepopulate context and message based on startup
          if (profileData) {
            setBusinessContext(
              `${profileData.name} operates in ${profileData.industry}. ${profileData.traction_summary || profileData.product_desc}`
            )
            setMessage(
              `Dear ${contactData.name},\n\nWe are expanding ${profileData.name} into ${contactData.city} and would appreciate connecting regarding your experience with ${contactData.organization || contactData.category}. We are targeting a structured collaboration for ${contactData.city}.\n\nBest regards,\n${profileData.name} Team`
            )
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error loading resource profile.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleSendIntro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!purpose.trim() || !businessContext.trim() || !desiredOutcome.trim() || !contact) return

    setSubmitting(true)
    setError(null)
    setSuccessNotice(null)

    try {
      const matchBreakdown = calculateLocalConnectMatch(startupProfile, contact)
      const primaryReason = matchBreakdown.reasons[0] || `Market entry exploration in ${contact.city}`

      const result = await createIntroductionRequest({
        contact_id: contact.id,
        startup_id: startupProfile?.id,
        purpose: purpose.trim(),
        business_context: businessContext.trim(),
        desired_outcome: desiredOutcome.trim(),
        message: message.trim(),
        match_reason: primaryReason,
      })

      if (result.success && result.data) {
        setExistingRequest(result.data)
        setSuccessNotice('Introduction request submitted successfully! Recorded in database.')
      } else {
        setError(result.error || 'Failed to submit introduction request.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelRequest = async () => {
    if (!existingRequest) return
    if (!confirm('Are you sure you want to cancel this pending introduction request?')) return

    setCancelling(true)
    setError(null)

    try {
      const result = await cancelIntroductionRequest(existingRequest.id)
      if (result.success && result.data) {
        setExistingRequest(result.data)
        setSuccessNotice('Your introduction request has been cancelled.')
      } else {
        setError(result.error || 'Failed to cancel introduction request.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Cancellation failed.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-28 text-slate-400 space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
          <p className="text-sm">Loading verified local resource profile...</p>
        </div>
      </PageShell>
    )
  }

  if (error && !contact) {
    return (
      <PageShell>
        <div className="p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Resource Unavailable</h3>
          <p className="text-xs text-rose-300">{error}</p>
          <Link href="/local-connect">
            <Button variant="outline" size="sm" className="text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Directory
            </Button>
          </Link>
        </div>
      </PageShell>
    )
  }

  if (!contact) return null

  const Icon = categoryIcons[contact.category] || Users
  const colorClass = categoryColors[contact.category] || 'text-slate-400 bg-slate-800'
  const verificationStatus: VerificationStatus =
    contact.verification_status || (contact.verified ? 'directly_confirmed' : 'unverified')
  const matchBreakdown: MatchScoreBreakdown = calculateLocalConnectMatch(startupProfile, contact)

  const reqStatusConf = existingRequest
    ? statusConfig[existingRequest.status] || statusConfig.pending
    : null

  return (
    <PageShell>
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/local-connect"
          className="inline-flex items-center gap-1.5 text-xs text-[#858783] hover:text-[#F5B94C] transition-colors"
          id="back-to-directory"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Local Connect Directory
        </Link>
        {contact.is_demo && (
          <Badge variant="demo" className="text-[10px]">
            Simulated Ecosystem Contact
          </Badge>
        )}
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-[#858783] hover:text-[#F5F5F2] text-xs ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-[#858783] hover:text-[#F5F5F2] text-xs ml-2">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Resource Profile & Verification Provenance */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-[#252729] bg-[#101314]/90 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${colorClass} mb-3`}
              >
                <Icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-[#F5F5F2]">{contact.name}</CardTitle>
              {contact.role && (
                <p className="text-xs text-[#858783] font-medium">{contact.role}</p>
              )}
              {contact.organization && (
                <p className="text-xs text-[#858783]/70">{contact.organization}</p>
              )}

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
                <Badge variant="outline" className="text-xs border-[#252729] bg-[#151719] text-[#858783]">
                  <MapPin className="h-3 w-3 mr-1" /> {contact.city}
                </Badge>
                <Badge variant="secondary" className="capitalize text-xs">
                  {contact.category.replace('-', ' ')}
                </Badge>
                {verificationStatus === 'directly_confirmed' && (
                  <Badge variant="success" className="text-xs gap-1">
                    <ShieldCheck className="h-3 w-3" /> Directly Confirmed
                  </Badge>
                )}
                {verificationStatus === 'source_checked' && (
                  <Badge variant="default" className="text-xs gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Source Checked
                  </Badge>
                )}
                {verificationStatus === 'unverified' && (
                  <Badge variant="unverified" className="text-xs gap-1">
                    <ShieldAlert className="h-3 w-3" /> Unverified Listing
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2 border-t border-[#252729] text-xs">
              {/* Description */}
              {contact.description && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#858783] mb-1 text-[10px]">
                    Background & Overview
                  </h4>
                  <p className="text-[#858783] leading-relaxed">{contact.description}</p>
                </div>
              )}

              {/* Geographic Service Area */}
              {contact.service_area && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#858783] mb-1 text-[10px]">
                    Service Area Coverage
                  </h4>
                  <p className="text-[#F5F5F2]">{contact.service_area}</p>
                </div>
              )}

              {/* Capabilities */}
              {contact.capabilities && contact.capabilities.length > 0 && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#858783] mb-1.5 text-[10px]">
                    Core Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {contact.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="rounded bg-[#151719] px-2 py-0.5 text-[10px] text-[#F5F5F2] font-mono border border-[#252729]"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry Focus Tags */}
              {contact.industry_tags && contact.industry_tags.length > 0 && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#858783] mb-1.5 text-[10px]">
                    Industry Focus Tags
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {contact.industry_tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] border-[#252729] bg-[#151719] text-[#858783]">
                        <Tag className="h-2.5 w-2.5 mr-1" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Public Website */}
              {contact.website_url && (
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#858783] mb-1 text-[10px]">
                    Public Website
                  </h4>
                  <a
                    href={contact.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#F5B94C] hover:text-[#FFD27A] hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">{contact.website_url}</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              )}

              {/* Transparent Data Provenance */}
              <div className="rounded-lg border border-[#252729] bg-[#151719] p-3 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#858783] block">
                  Data Provenance & Verification
                </span>
                <div className="space-y-1 text-[11px] text-[#858783]">
                  <p>
                    <span className="text-[#858783]/70">Source:</span> <strong className="text-[#F5F5F2]">{contact.source_name}</strong>
                  </p>
                  {contact.source_url && (
                    <a
                      href={contact.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#F5B94C] hover:underline text-[11px]"
                    >
                      <ExternalLink className="h-3 w-3" /> Verify Source Record
                    </a>
                  )}
                  {contact.verified_at && (
                    <p className="flex items-center gap-1 text-[#858783] pt-0.5">
                      <Calendar className="h-3 w-3" />
                      Verified on {formatDate(contact.verified_at)}
                    </p>
                  )}
                  {contact.is_demo && (
                    <p className="text-amber-400/90 italic pt-1 text-[10px]">
                      * Demo contact record seeded for local evaluation.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Score & Transparent Explanations */}
          <Card className="border-[#3A3D40] bg-[#101314] backdrop-blur shadow-lg shadow-[#F5B94C]/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#F5F5F2] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#F5B94C]" />
                  Relevance Breakdown
                </CardTitle>
                <div className="rounded-full bg-[#151719] px-2.5 py-0.5 text-xs font-bold text-[#F5B94C] border border-[#3A3D40]">
                  {matchBreakdown.totalScore} / 100
                </div>
              </div>
              <CardDescription className="text-xs text-[#858783]">
                Deterministic matching vs {startupProfile?.name || 'active profile'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="space-y-1.5 border-b border-[#252729] pb-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#858783]">Industry Relevance</span>
                  <span className="font-mono text-[#F5F5F2]">{matchBreakdown.industryScore}/35</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#858783]">Geographic & Expansion Fit</span>
                  <span className="font-mono text-[#F5F5F2]">{matchBreakdown.geoScore}/35</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#858783]">Category & Channel Fit</span>
                  <span className="font-mono text-[#F5F5F2]">{matchBreakdown.categoryScore}/15</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#858783]">Verification Transparency</span>
                  <span className="font-mono text-[#F5F5F2]">{matchBreakdown.verificationScore}/15</span>
                </div>
              </div>

              {matchBreakdown.reasons.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-[#F5B94C] tracking-wider">
                    Ground-Truth Match Reasons:
                  </span>
                  <ul className="space-y-1 text-[11px] text-[#858783]">
                    {matchBreakdown.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#F5B94C] flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Introduction Request Workflow */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#252729] bg-[#101314]/90 backdrop-blur">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#151719] text-[#F5B94C] border border-[#3A3D40]">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-[#F5F5F2]">
                      Introduction Request & Partnership Proposal
                    </CardTitle>
                    <CardDescription className="text-xs text-[#858783]">
                      Submit your business context and desired next step directly to this ecosystem contact.
                    </CardDescription>
                  </div>
                </div>

                {existingRequest && reqStatusConf && (
                  <Badge variant={reqStatusConf.variant} className="gap-1 capitalize text-xs self-start sm:self-auto">
                    <reqStatusConf.icon className="h-3 w-3" />
                    {reqStatusConf.label}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {existingRequest ? (
                /* Existing Request Display */
                <div className="rounded-xl border border-[#252729] bg-[#151719] p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252729] pb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F5F2]">
                      <Clock className="h-4 w-4 text-amber-400" />
                      Status: <span className="capitalize text-[#F5B94C]">{existingRequest.status}</span>
                    </div>
                    <span className="text-[11px] text-[#858783]">
                      Submitted on {formatDate(existingRequest.created_at)}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="text-[#858783] font-semibold block mb-0.5">Purpose:</span>
                      <p className="text-[#F5F5F2] font-medium">{existingRequest.purpose || 'Ecosystem partnership'}</p>
                    </div>
                    <div>
                      <span className="text-[#858783] font-semibold block mb-0.5">Desired Outcome:</span>
                      <p className="text-[#F5F5F2] font-medium">{existingRequest.desired_outcome || 'Introductory review'}</p>
                    </div>
                  </div>

                  {existingRequest.business_context && (
                    <div className="text-xs space-y-1">
                      <span className="text-[#858783] font-semibold block">Business Context:</span>
                      <p className="text-[#858783] leading-relaxed bg-[#101314] p-3 rounded-lg border border-[#252729]">
                        {existingRequest.business_context}
                      </p>
                    </div>
                  )}

                  {existingRequest.message && (
                    <div className="text-xs space-y-1">
                      <span className="text-[#858783] font-semibold block">Pitch Message Body:</span>
                      <pre className="text-[#F5F5F2] font-sans whitespace-pre-wrap bg-[#101314] p-3 rounded-lg border border-[#252729] text-xs">
                        {existingRequest.message}
                      </pre>
                    </div>
                  )}

                  {existingRequest.status === 'pending' && (
                    <div className="pt-2 flex justify-between items-center border-t border-[#252729]">
                      <span className="text-xs text-[#858783]">
                        Pending response from local contact or regional ecosystem administrator.
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={cancelling}
                        onClick={handleCancelRequest}
                        className="text-xs"
                        id="cancel-request-btn"
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Request'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* New Request Submission Form */
                <form onSubmit={handleSendIntro} className="space-y-4">
                  {/* Purpose Selector */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#F5F5F2] font-medium">
                      Introduction Purpose *
                    </Label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full rounded-md border border-[#252729] bg-[#151719] p-2.5 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#F5B94C] focus:ring-1 focus:ring-[#F5B94C]"
                      id="purpose-select"
                      required
                    >
                      <option value="Distribution & Pilot Partnership">Distribution & Pilot Partnership</option>
                      <option value="Commercial Retail Stocking">Commercial Retail Stocking</option>
                      <option value="Cold-Chain / Logistics Contracting">Cold-Chain / Logistics Contracting</option>
                      <option value="Hardware Component / OEM Sourcing">Hardware Component / OEM Sourcing</option>
                      <option value="Mentorship & Regulatory Strategy">Mentorship & Regulatory Strategy</option>
                      <option value="Incubation & Government Subsidy Alignment">Incubation & Government Subsidy Alignment</option>
                      <option value="Customer Discovery & User Testing">Customer Discovery & User Testing</option>
                    </select>
                  </div>

                  {/* Business Context */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-[#F5F5F2] font-medium">
                        Brief Business Context & Readiness *
                      </Label>
                      <span className="text-[10px] text-[#858783]">Min 10 characters</span>
                    </div>
                    <textarea
                      rows={3}
                      value={businessContext}
                      onChange={(e) => setBusinessContext(e.target.value)}
                      placeholder="Outline your startup's core product, active traction, and specific goals for this market."
                      required
                      minLength={10}
                      className="w-full rounded-md border border-[#252729] bg-[#151719] p-3 text-xs text-[#F5F5F2] placeholder-[#858783]/60 focus:outline-none focus:border-[#F5B94C] focus:ring-1 focus:ring-[#F5B94C]"
                      id="business-context-input"
                    />
                  </div>

                  {/* Desired Outcome */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-[#F5F5F2] font-medium">
                        Desired Outcome / Next Step *
                      </Label>
                      <span className="text-[10px] text-[#858783]">Min 5 characters</span>
                    </div>
                    <Input
                      value={desiredOutcome}
                      onChange={(e) => setDesiredOutcome(e.target.value)}
                      placeholder="e.g. Schedule a 30-min call or explore a 30-day paid pilot"
                      required
                      minLength={5}
                      className="bg-[#151719] border-[#252729] text-xs text-[#F5F5F2] placeholder-[#858783]/60 focus:border-[#F5B94C]"
                      id="desired-outcome-input"
                    />
                  </div>

                  {/* Pitch Message Body */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-[#F5F5F2] font-medium">
                        Direct Message to Recipient (Optional)
                      </Label>
                      <span className="text-[10px] text-[#F5B94C] flex items-center gap-1 font-mono">
                        <Sparkles className="h-3 w-3 text-[#F5B94C]" /> Pre-filled pitch template
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-md border border-[#252729] bg-[#151719] p-3 text-xs text-[#F5F5F2] placeholder-[#858783]/60 focus:outline-none focus:border-[#F5B94C] focus:ring-1 focus:ring-[#F5B94C]"
                      id="message-input"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#F5B94C] hover:bg-[#FFD27A] text-[#080A0B] font-semibold gap-2 text-xs shadow-lg shadow-[#F5B94C]/20"
                      id="submit-intro-btn"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Submitting to Supabase...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Submit Introduction Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
