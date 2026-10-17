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
import type { Contact, IntroductionRequest } from '@/types/database'
import {
  Users,
  ArrowLeft,
  Building2,
  GraduationCap,
  Store,
  Truck,
  UserCheck,
  Send,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react'

const categoryIcons = {
  retailer: Store,
  distributor: Truck,
  mentor: GraduationCap,
  institution: Building2,
  supplier: Truck,
  'pilot-customer': UserCheck,
}

export default function ContactDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const supabase = createClient()

  const [contact, setContact] = useState<Contact | null>(null)
  const [existingRequest, setExistingRequest] = useState<IntroductionRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [matchReason, setMatchReason] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setLoading(true)

      try {
        const { data: { user } } = await supabase.auth.getUser()

        const [cRes, reqRes] = await Promise.all([
          supabase.from('contacts').select('*').eq('id', id).single(),
          user
            ? supabase
                .from('introduction_requests')
                .select('*')
                .eq('contact_id', id)
                .eq('user_id', user.id)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ])

        let contactData = cRes.data as Contact | null
        if (!contactData) {
          const { DEMO_CONTACTS } = await import('@/lib/data/demoData')
          contactData = DEMO_CONTACTS.find((c) => c.id === id) ?? DEMO_CONTACTS[0]
        }

        if (!contactData) {
          setError('Contact not found.')
        } else {
          setContact(contactData)
          if (reqRes.data) {
            setExistingRequest(reqRes.data as IntroductionRequest)
          }

          // Generate default personalized pitch template
          setMatchReason(`Market entry exploration in ${contactData.city} for ${contactData.category} partnership`)
          setMessage(
            `Hi ${contactData.name},\n\nWe are expanding our startup presence to ${contactData.city} and noticed your strong experience with ${contactData.organization || contactData.category}. We would love to explore synergy and share details about our pilot offering.\n\nBest regards,`
          )
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error loading contact.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, supabase])

  const handleSendIntro = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!matchReason.trim() || !message.trim()) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please sign in to send an introduction request.')
        return
      }

      const { data, error } = await supabase
        .from('introduction_requests')
        .insert({
          user_id: user.id,
          contact_id: id,
          match_reason: matchReason.trim(),
          message: message.trim(),
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      setExistingRequest(data as IntroductionRequest)
    } catch (err: unknown) {
      alert(`Error submitting request: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading contact profile...
        </div>
      </PageShell>
    )
  }

  if (error || !contact) {
    return (
      <PageShell>
        <div className="p-8 text-center space-y-4">
          <p className="text-rose-400">{error || 'Contact not found.'}</p>
          <Link href="/local-connect">
            <Button variant="outline">Back to Local Connect</Button>
          </Link>
        </div>
      </PageShell>
    )
  }

  const Icon = categoryIcons[contact.category] || Users

  return (
    <PageShell>
      {/* Breadcrumb */}
      <div className="mb-6 space-y-2">
        <Link
          href="/local-connect"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Local Connect
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Overview Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-3">
                <Icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-white">{contact.name}</CardTitle>
              {contact.role && (
                <p className="text-xs text-slate-300 font-medium">{contact.role}</p>
              )}
              {contact.organization && (
                <p className="text-xs text-slate-400">{contact.organization}</p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
                <Badge variant="outline" className="text-xs border-slate-700">
                  {contact.city}
                </Badge>
                <Badge variant="secondary" className="capitalize text-xs">
                  {contact.category.replace('-', ' ')}
                </Badge>
                {contact.verified ? (
                  <Badge variant="success" className="text-xs gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-amber-400 border-amber-800/60 gap-1">
                    <ShieldAlert className="h-3 w-3" /> Unverified
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2 border-t border-slate-800/80">
              {contact.description && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Background
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {contact.description}
                  </p>
                </div>
              )}

              {contact.industry_tags && contact.industry_tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Industry Focus
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {contact.industry_tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Provenance Box */}
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Data Provenance & Source
                </span>
                <p className="text-xs text-slate-300">
                  Collected via <strong>{contact.source_name}</strong>
                </p>
                {contact.source_url && (
                  <a
                    href={contact.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Source URL
                  </a>
                )}
                {contact.is_demo && (
                  <p className="text-[10px] text-amber-400/90 italic pt-1">
                    * Demo contact profile seeded for hackathon evaluation.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Introduction Request Form / Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">
                      Request Introduction & Pilot Pitch
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Send a tailored proposal to connect with this local partner.
                    </CardDescription>
                  </div>
                </div>

                {existingRequest && (
                  <Badge
                    variant={
                      existingRequest.status === 'accepted'
                        ? 'success'
                        : existingRequest.status === 'pending'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="capitalize text-xs gap-1"
                  >
                    <Clock className="h-3 w-3" /> {existingRequest.status}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {existingRequest ? (
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <CheckCircle className="h-4 w-4" /> Introduction Request Submitted
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Match Reason:</span>
                    <p className="text-xs text-slate-200 font-medium">
                      {existingRequest.match_reason}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Message Body:</span>
                    <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap bg-slate-900/80 p-3 rounded border border-slate-800">
                      {existingRequest.message}
                    </pre>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Submitted on{' '}
                    {new Date(existingRequest.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendIntro} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">
                      Why is this contact a strong fit? (Match Reason) *
                    </Label>
                    <Input
                      value={matchReason}
                      onChange={(e) => setMatchReason(e.target.value)}
                      placeholder="e.g. Seeking distributor partner with direct kirana accounts in South Bengaluru"
                      required
                      className="bg-slate-950 border-slate-700 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-300">
                        Introduction Pitch Message *
                      </Label>
                      <span className="text-[10px] text-blue-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Pre-filled template
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-500 text-white gap-2 text-xs"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Send Introduction Request
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
