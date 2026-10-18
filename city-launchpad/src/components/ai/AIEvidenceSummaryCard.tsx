'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { summarizeMarketEvidenceAction, type SummarizeEvidenceResult } from '@/lib/ai/actions'
import type { AIResult } from '@/lib/ai/types'

interface AIEvidenceSummaryCardProps {
  initialCity?: string
  availableCities?: string[]
}

export function AIEvidenceSummaryCard({
  initialCity = 'Pune',
  availableCities = ['Pune', 'Bengaluru', 'Indore', 'Ahmedabad'],
}: AIEvidenceSummaryCardProps) {
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResult<SummarizeEvidenceResult> | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await summarizeMarketEvidenceAction({ city: selectedCity })
      setResult(res)
    } catch {
      setResult({
        success: false,
        error: 'AI_PROVIDER_ERROR',
        message: 'Failed to contact AI service.',
      })
    } finally {
      setLoading(false)
    }
  }

  const summaryData = result?.data?.summaryData
  const sources = result?.data?.sourceReferences || []

  return (
    <Card className="border-indigo-900/40 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/20 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">
                AI Evidence Synthesis
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Grounded summary derived strictly from stored market indicators & hypotheses
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setResult(null)
              }}
              className="rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  {result ? 'Refresh Summary' : 'Generate Summary'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Not Configured State */}
        {result && !result.success && result.error === 'AI_NOT_CONFIGURED' && (
          <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="text-xs font-medium text-amber-300">AI Integration Not Configured</p>
                <p className="mt-1 text-xs text-amber-400/80">
                  To enable live market evidence synthesis, add <code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-200">GEMINI_API_KEY</code> to your server environment variables. Manual deterministic validation workflows remain fully active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error */}
        {result && !result.success && result.error !== 'AI_NOT_CONFIGURED' && (
          <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <div>
                <p className="text-xs font-medium text-rose-300">Synthesis Unavailable</p>
                <p className="mt-1 text-xs text-rose-400/80">{result.message || 'An error occurred while contacting the AI provider.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Initial Prompt State */}
        {!result && !loading && (
          <p className="text-xs text-slate-500 italic">
            Click &quot;Generate Summary&quot; to synthesize recorded market indicators, competitive signals, and hypothesis progress for {selectedCity}.
          </p>
        )}

        {/* Successful Summary View */}
        {summaryData && (
          <div className="space-y-4">
            {/* Disclaimer Banner */}
            <div className="flex items-start gap-2 rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-[11px] text-slate-400">
              <span className="font-semibold text-indigo-400">AI-Assisted Derivative:</span>
              <span>This synthesis is derived strictly from stored sources and is not an independent source of market truth.</span>
            </div>

            {/* Narrative Summary */}
            <p className="text-xs leading-relaxed text-slate-200">
              {summaryData.summary}
            </p>

            {/* Key Findings with Grounded Citations */}
            {summaryData.keyFindings.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300">Key Evidence Points</p>
                <div className="space-y-1.5">
                  {summaryData.keyFindings.map((kf, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md border border-slate-800/80 bg-slate-900/40 p-2.5 text-xs"
                    >
                      {kf.direction === 'supporting' ? (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      ) : kf.direction === 'challenging' ? (
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      ) : (
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-200">{kf.point}</span>
                        {kf.sourceIds.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {kf.sourceIds.map((srcId) => {
                              const ref = sources.find((s) => s.sourceId === srcId)
                              return (
                                <span
                                  key={srcId}
                                  className="inline-flex items-center gap-1 rounded bg-indigo-950/60 border border-indigo-800/40 px-1.5 py-0.5 text-[10px] text-indigo-300"
                                >
                                  {ref ? ref.title : srcId}
                                  {ref?.sourceUrl && (
                                    <a
                                      href={ref.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-400 hover:text-indigo-200"
                                    >
                                      <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                  )}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Limitations & Missing Evidence */}
            {summaryData.limitations.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-amber-400/90">Gaps & Limitations</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                  {summaryData.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Suggestions */}
            {summaryData.suggestions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-300">Suggested Next Experiments</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                  {summaryData.suggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
