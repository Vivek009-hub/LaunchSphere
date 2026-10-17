'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { SUPPORTED_CITIES } from '@/lib/data/cityData'
import { experimentSchema } from '@/lib/validations/schemas'
import type { ExperimentMethod } from '@/types/database'
import {
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

const methodOptions: { value: ExperimentMethod; label: string; desc: string }[] = [
  {
    value: 'interview',
    label: 'Customer / Stakeholder Interview',
    desc: 'Structured 1-on-1 interviews with target users or decision-makers.',
  },
  {
    value: 'retailer-outreach',
    label: 'Retailer / Distributor Outreach',
    desc: 'Direct pitch or inquiry visits to retail outlets and distributors.',
  },
  {
    value: 'pilot',
    label: 'Pilot Experiment',
    desc: 'Live deployment or small-scale trial with a partner or pilot cohort.',
  },
  {
    value: 'landing-page',
    label: 'Landing Page Demand Test',
    desc: 'Smoke test measuring intent via ad traffic, waitlist signups, or pre-orders.',
  },
  {
    value: 'survey',
    label: 'Structured Survey',
    desc: 'Quantitative questionnaire distributed to a verified local segment.',
  },
]

export default function NewExperimentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultCity = searchParams.get('city') || 'Bengaluru'

  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    hypothesis: '',
    method: 'retailer-outreach' as ExperimentMethod,
    city: defaultCity,
    target_metric: '',
    success_threshold: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate with Zod
    const result = experimentSchema.safeParse(form)
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Please fill all required fields correctly.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      // 1. Create experiment record
      const { data: exp, error: expError } = await supabase
        .from('experiments')
        .insert({
          user_id: user.id,
          title: form.title.trim(),
          hypothesis: form.hypothesis.trim(),
          method: form.method,
          city: form.city,
          target_metric: form.target_metric.trim(),
          success_threshold: form.success_threshold.trim(),
          status: 'planned',
        })
        .select()
        .single()

      if (expError || !exp) {
        throw new Error(expError?.message || 'Failed to create experiment.')
      }

      // 2. Also register assumption into Market Proof so it can be tracked
      await supabase.from('assumptions').insert({
        user_id: user.id,
        statement: form.hypothesis.trim(),
        source_type: 'manual',
        status: 'untested',
      })

      router.push(`/market-validation/${exp.id}`)
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to create experiment.')
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/market-validation"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to experiments
        </Link>
        <PageHeader
          title="Design Market Validation Experiment"
          description="Formulate a falsifiable hypothesis and define measurable success criteria before collecting field data."
        />
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-800/50 bg-rose-950/30 p-4 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Experiment Setup</CardTitle>
            <CardDescription>
              Specify which city and method will be used to test customer demand.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs text-slate-300">
                Experiment Title *
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 30 Kirana Store Direct Outreach in Indiranagar"
                required
                className="bg-slate-950/70 border-slate-700 text-sm"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs text-slate-300">
                Target City *
              </Label>
              <select
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Method selection */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300">Validation Method *</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {methodOptions.map((opt) => {
                  const isSelected = form.method === opt.value
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setForm({ ...form, method: opt.value })}
                      className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/20'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-200">{opt.label}</span>
                        {isSelected && <CheckCircle className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Hypothesis & Metrics</CardTitle>
            <CardDescription>
              State what must be true for this city to be viable, and what hard evidence will prove it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Hypothesis */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="hypothesis" className="text-xs text-slate-300">
                  Falsifiable Hypothesis *
                </Label>
                <span className="text-[11px] text-slate-400">Be specific and measurable</span>
              </div>
              <textarea
                id="hypothesis"
                rows={3}
                value={form.hypothesis}
                onChange={(e) => setForm({ ...form, hypothesis: e.target.value })}
                placeholder="e.g. At least 25% of visited independent retailers will agree to stock our sample SKU on a 14-day consignment basis."
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Target Metric */}
              <div className="space-y-1.5">
                <Label htmlFor="target_metric" className="text-xs text-slate-300">
                  Target Metric *
                </Label>
                <Input
                  id="target_metric"
                  value={form.target_metric}
                  onChange={(e) => setForm({ ...form, target_metric: e.target.value })}
                  placeholder="e.g. Consignment Agreement Rate"
                  required
                  className="bg-slate-950/70 border-slate-700 text-sm"
                />
              </div>

              {/* Success Threshold */}
              <div className="space-y-1.5">
                <Label htmlFor="success_threshold" className="text-xs text-slate-300">
                  Success Threshold *
                </Label>
                <Input
                  id="success_threshold"
                  value={form.success_threshold}
                  onChange={(e) => setForm({ ...form, success_threshold: e.target.value })}
                  placeholder="e.g. >= 25% (at least 8 of 30 outlets)"
                  required
                  className="bg-slate-950/70 border-slate-700 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/market-validation">
            <Button type="button" variant="ghost" className="text-slate-400">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            id="btn-create-experiment-submit"
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white min-w-40"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FlaskConical className="h-4 w-4" />
                Create Experiment
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
