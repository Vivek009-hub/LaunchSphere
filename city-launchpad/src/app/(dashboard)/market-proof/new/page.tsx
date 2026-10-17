'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageShell, PageHeader } from '@/components/layout/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { assumptionSchema } from '@/lib/validations/schemas'
import type { AssumptionStatus, AssumptionSourceType } from '@/types/database'
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react'

export default function NewAssumptionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [statement, setStatement] = useState('')
  const [sourceType, setSourceType] = useState<AssumptionSourceType>('manual')
  const [status, setStatus] = useState<AssumptionStatus>('untested')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload = {
      statement: statement.trim(),
      source_type: sourceType,
      status,
    }

    const result = assumptionSchema.safeParse(payload)
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Please provide a valid statement.')
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

      const { error: insError } = await supabase.from('assumptions').insert({
        user_id: user.id,
        statement: payload.statement,
        source_type: payload.source_type,
        status: payload.status,
      })

      if (insError) throw insError

      router.push('/market-proof')
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Failed to save assumption.')
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/market-proof"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Market Proof
        </Link>
        <PageHeader
          title="Track New Market Assumption"
          description="Log key commercial or customer behavior assumptions to test through field validation."
        />
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-800/50 bg-rose-950/30 p-4 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Assumption Details</CardTitle>
            <CardDescription className="text-xs">
              What belief about your market, customer, or distribution channel needs to be proven?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="statement" className="text-xs text-slate-300">
                Assumption Statement *
              </Label>
              <textarea
                id="statement"
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="e.g. Retailers in South Bengaluru prefer weekly credit settlements over upfront instant UPI discounts."
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="source_type" className="text-xs text-slate-300">
                  Origin Source
                </Label>
                <select
                  id="source_type"
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as AssumptionSourceType)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200"
                >
                  <option value="manual">Manual Founder Assumption</option>
                  <option value="city-intelligence">Synthesized from City Intelligence</option>
                  <option value="llm-synthesis">Market Research Synthesis</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs text-slate-300">
                  Initial Status
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssumptionStatus)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200"
                >
                  <option value="untested">Untested (No evidence yet)</option>
                  <option value="supported">Supported (Prior proof exists)</option>
                  <option value="challenged">Challenged (Mixed initial signals)</option>
                  <option value="invalidated">Invalidated (Refuted)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <Link href="/market-proof">
            <Button type="button" variant="ghost" className="text-slate-400">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white gap-2 text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                Save Assumption
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
