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
import type {
  Experiment,
  ExperimentResponse,
  ExperimentStatus,
  ResponseType,
  OutcomeType,
} from '@/types/database'
import {
  FlaskConical,
  ArrowLeft,
  Plus,
  CheckCircle2,
  MapPin,
  FileText,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

const outcomeConfig: Record<
  OutcomeType,
  { label: string; variant: 'success' | 'destructive' | 'secondary' | 'warning' }
> = {
  positive: { label: 'Positive', variant: 'success' },
  negative: { label: 'Negative', variant: 'destructive' },
  neutral: { label: 'Neutral', variant: 'secondary' },
  inconclusive: { label: 'Inconclusive', variant: 'warning' },
}

export default function ExperimentDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const supabase = createClient()

  const [experiment, setExperiment] = useState<Experiment | null>(null)
  const [responses, setResponses] = useState<ExperimentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Log response modal/form state
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    respondent_label: '',
    response_type: 'interview' as ResponseType,
    outcome: 'positive' as OutcomeType,
    notes: '',
    evidence_url: '',
  })

  useEffect(() => {
    if (!id) return

    async function loadData() {
      setLoading(true)
      try {
        const [expRes, respRes] = await Promise.all([
          supabase.from('experiments').select('*').eq('id', id).single(),
          supabase.from('experiment_responses').select('*').eq('experiment_id', id).order('recorded_at', { ascending: false }),
        ])

        if (expRes.error || !expRes.data) {
          setError('Experiment not found.')
        } else {
          setExperiment(expRes.data as Experiment)
          setResponses((respRes.data as ExperimentResponse[]) || [])
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error loading experiment data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, supabase])

  const handleUpdateStatus = async (newStatus: ExperimentStatus) => {
    if (!experiment) return
    try {
      const { error } = await supabase
        .from('experiments')
        .update({ status: newStatus })
        .eq('id', experiment.id)

      if (error) throw error
      setExperiment({ ...experiment, status: newStatus })
    } catch (err: unknown) {
      alert(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.respondent_label.trim()) return

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('experiment_responses')
        .insert({
          experiment_id: id,
          respondent_label: form.respondent_label.trim(),
          response_type: form.response_type,
          outcome: form.outcome,
          notes: form.notes.trim() || null,
          evidence_url: form.evidence_url.trim() || null,
        })
        .select()
        .single()

      if (error) throw error

      setResponses([data as ExperimentResponse, ...responses])
      setForm({
        respondent_label: '',
        response_type: 'interview',
        outcome: 'positive',
        notes: '',
        evidence_url: '',
      })
      setShowForm(false)

      // If experiment was 'planned', auto transition to 'active'
      if (experiment?.status === 'planned') {
        handleUpdateStatus('active')
      }
    } catch (err: unknown) {
      alert(`Error logging response: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading experiment...
        </div>
      </PageShell>
    )
  }

  if (error || !experiment) {
    return (
      <PageShell>
        <div className="p-8 text-center space-y-4">
          <p className="text-rose-400">{error || 'Experiment not found.'}</p>
          <Link href="/market-validation">
            <Button variant="outline">Back to Experiments</Button>
          </Link>
        </div>
      </PageShell>
    )
  }

  const positiveCount = responses.filter((r) => r.outcome === 'positive').length
  const negativeCount = responses.filter((r) => r.outcome === 'negative').length
  const totalResponses = responses.length
  const positiveRate = totalResponses > 0 ? ((positiveCount / totalResponses) * 100).toFixed(0) : 0

  return (
    <PageShell>
      {/* Top Header */}
      <div className="mb-6 space-y-2">
        <Link
          href="/market-validation"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to experiments
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{experiment.title}</h1>
              <Badge
                variant={
                  experiment.status === 'complete'
                    ? 'success'
                    : experiment.status === 'active'
                    ? 'warning'
                    : 'secondary'
                }
                className="capitalize text-xs"
              >
                {experiment.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-blue-400" />
                {experiment.city}
              </span>
              <span>•</span>
              <span className="capitalize">{experiment.method.replace('-', ' ')}</span>
              <span>•</span>
              <span>
                Created{' '}
                {new Date(experiment.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {experiment.status !== 'complete' ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus('complete')}
                className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/30 text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Mark Complete
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateStatus('active')}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
              >
                Reopen Experiment
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => setShowForm(!showForm)}
              id="btn-log-response"
              className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Field Response
            </Button>
          </div>
        </div>
      </div>

      {/* Hypothesis & Metric Banner */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/60 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hypothesis Under Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              &quot;{experiment.hypothesis}&quot;
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target Metric & Threshold
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-xs text-slate-300 font-semibold">{experiment.target_metric}</p>
            <p className="text-xs text-blue-400 font-mono">
              Threshold: {experiment.success_threshold}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Metrics Summary */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-slate-800 bg-slate-900/50 p-4 text-center">
          <span className="text-2xl font-bold text-white">{totalResponses}</span>
          <p className="text-xs text-slate-400 mt-0.5">Recorded Interactions</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 p-4 text-center">
          <span className="text-2xl font-bold text-emerald-400">{positiveCount}</span>
          <p className="text-xs text-slate-400 mt-0.5">Positive Outcomes</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 p-4 text-center">
          <span className="text-2xl font-bold text-rose-400">{negativeCount}</span>
          <p className="text-xs text-slate-400 mt-0.5">Negative / Rejections</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 p-4 text-center">
          <span className="text-2xl font-bold text-blue-400">{positiveRate}%</span>
          <p className="text-xs text-slate-400 mt-0.5">Positive Rate</p>
        </Card>
      </div>

      {/* Log Response Form Modal / Dropdown */}
      {showForm && (
        <Card className="mb-8 border-blue-500/40 bg-slate-900/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">
              Record Customer / Partner Interaction
            </CardTitle>
            <CardDescription className="text-xs">
              Log objective observations and verifiable outcomes. Expressions of interest should
              be noted distinctly from actual commitments or purchases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddResponse} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Respondent / Partner Name *</Label>
                  <Input
                    value={form.respondent_label}
                    onChange={(e) => setForm({ ...form, respondent_label: e.target.value })}
                    placeholder="e.g. Ramesh Traders, Sector 18"
                    required
                    className="bg-slate-950 border-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Interaction Type</Label>
                  <select
                    value={form.response_type}
                    onChange={(e) => setForm({ ...form, response_type: e.target.value as ResponseType })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="interview">Interview</option>
                    <option value="survey-submission">Survey Submission</option>
                    <option value="observation">On-Site Observation</option>
                    <option value="purchase">Paid Purchase / Order</option>
                    <option value="signup">Trial Signup</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Outcome</Label>
                  <select
                    value={form.outcome}
                    onChange={(e) => setForm({ ...form, outcome: e.target.value as OutcomeType })}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="positive">Positive (Agreed / Bought / Confirmed)</option>
                    <option value="negative">Negative (Declined / Disqualified)</option>
                    <option value="neutral">Neutral (Interested but no commitment)</option>
                    <option value="inconclusive">Inconclusive / Incomplete</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Field Notes / Specific Quotes</Label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Owner stated willing to order 2 cases if 48-hour replacement guarantee is provided."
                  className="w-full rounded-md border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Evidence Link (Photo, invoice, or recording URL)</Label>
                <Input
                  value={form.evidence_url}
                  onChange={(e) => setForm({ ...form, evidence_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-slate-950 border-slate-700 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                >
                  {submitting ? 'Saving...' : 'Save Response'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Responses Log Table / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" />
            Field Evidence Log ({responses.length})
          </h2>
          {responses.length > 0 && (
            <Link href="/market-proof">
              <Button size="sm" variant="ghost" className="text-xs text-slate-400 hover:text-white">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-amber-400" />
                View in Market Proof
              </Button>
            </Link>
          )}
        </div>

        {responses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <FlaskConical className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-slate-300">No responses recorded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Click &quot;Log Field Response&quot; to capture data from your customer interviews or partner outreach.
            </p>
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
            >
              Log First Interaction
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((resp) => {
              const outcome = outcomeConfig[resp.outcome]
              return (
                <div
                  key={resp.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {resp.respondent_label}
                        </span>
                        <Badge variant={outcome.variant} className="text-[10px] capitalize">
                          {outcome.label}
                        </Badge>
                        <span className="text-[11px] text-slate-500 capitalize font-mono">
                          ({resp.response_type.replace('-', ' ')})
                        </span>
                      </div>
                      {resp.notes && (
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          &quot;{resp.notes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-500">
                        {new Date(resp.recorded_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {resp.evidence_url && (
                        <div className="mt-1">
                          <a
                            href={resp.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" /> Proof
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}
