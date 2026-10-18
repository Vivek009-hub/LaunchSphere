'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, X, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { summarizeExperimentFindingsAction } from '@/lib/ai/actions'
import type { ExperimentFindingsSummary } from '@/lib/ai/types'

interface AIExperimentFindingsModalProps {
  experimentId: string
  experimentTitle: string
}

export function AIExperimentFindingsModal({
  experimentId,
  experimentTitle,
}: AIExperimentFindingsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<ExperimentFindingsSummary | null>(null)

  const handleFetchSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await summarizeExperimentFindingsAction({ experimentId })
      if (!res.success || !res.data) {
        setError(res.message || 'Failed to summarize experiment findings.')
        return
      }
      setSummary(res.data)
    } catch {
      setError('An error occurred contacting the AI service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setIsOpen(true)
          if (!summary) handleFetchSummary()
        }}
        className="gap-1.5 border-indigo-700/50 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-900/40 text-xs"
      >
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        AI Findings Summary
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Findings Summary: {experimentTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Plain-language synthesis of recorded observation notes and signal tiers. The outcome interpretation below is calculated deterministically by application logic and cannot be altered by the AI.
            </p>

            {loading && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                <p className="text-xs">Analyzing recorded responses and commercial signal tiers...</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-900/50 bg-rose-950/20 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {summary && !loading && (
              <div className="space-y-4 pt-1">
                {/* Deterministic Outcome Lock */}
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">Authoritative Metric Status:</span>
                  </div>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-white uppercase">
                    {summary.deterministicOutcome.replace('_', ' ')}
                  </span>
                </div>

                {/* Narrative Summary */}
                <p className="text-xs leading-relaxed text-slate-200">
                  {summary.narrative}
                </p>

                {/* Threshold Explanation */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-xs space-y-1">
                  <p className="font-semibold text-slate-300">Success Threshold Analysis</p>
                  <p className="text-slate-400">{summary.thresholdComparisonExplanation}</p>
                </div>

                {/* Signal Quality Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md border border-slate-800 bg-emerald-950/20 p-2">
                    <p className="text-sm font-bold text-emerald-400">
                      {summary.signalQualityAssessment.commercialSignalsCount}
                    </p>
                    <p className="text-[10px] text-slate-400">Paid / Commercial</p>
                  </div>
                  <div className="rounded-md border border-slate-800 bg-blue-950/20 p-2">
                    <p className="text-sm font-bold text-blue-400">
                      {summary.signalQualityAssessment.verbalInterestCount}
                    </p>
                    <p className="text-[10px] text-slate-400">Verbal Interest</p>
                  </div>
                  <div className="rounded-md border border-slate-800 bg-amber-950/20 p-2">
                    <p className="text-sm font-bold text-amber-400">
                      {summary.signalQualityAssessment.objectionsCount}
                    </p>
                    <p className="text-[10px] text-slate-400">Objections</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {summary.signalQualityAssessment.analysis}
                </p>

                {/* Key Objections */}
                {summary.keyObjections.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-amber-400">Documented Objections</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                      {summary.keyObjections.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Next Steps */}
                {summary.recommendedNextSteps.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-indigo-400">Recommended Next Steps</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                      {summary.recommendedNextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
