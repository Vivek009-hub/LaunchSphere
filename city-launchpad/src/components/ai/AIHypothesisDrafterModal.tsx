'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { suggestHypothesesAndExperimentsAction } from '@/lib/ai/actions'
import type { HypothesisExperimentDrafts, DraftHypothesis, DraftExperiment } from '@/lib/ai/types'

interface AIHypothesisDrafterModalProps {
  city: string
  onSelectHypothesis?: (draft: DraftHypothesis) => void
  onSelectExperiment?: (draft: DraftExperiment) => void
}

export function AIHypothesisDrafterModal({
  city,
  onSelectHypothesis,
  onSelectExperiment,
}: AIHypothesisDrafterModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<HypothesisExperimentDrafts | null>(null)

  const handleFetchDrafts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await suggestHypothesesAndExperimentsAction({ city })
      if (!res.success || !res.data) {
        setError(res.message || 'Failed to suggest hypotheses.')
        return
      }
      setDrafts(res.data)
    } catch {
      setError('An error occurred contacting the AI service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setIsOpen(true)
          if (!drafts) handleFetchDrafts()
        }}
        className="gap-1.5 border-indigo-700/50 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-900/40 text-xs"
      >
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        AI Drafter
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  AI Validation Drafter — {city}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Review AI-suggested testable hypotheses and structured field validation experiments tailored to {city}. Drafts must be explicitly approved and saved by you before becoming part of your proof loop.
            </p>

            {loading && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                <p className="text-xs">Formulating falsifiable hypotheses and experiment protocols...</p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-900/50 bg-rose-950/20 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {drafts && !loading && (
              <div className="space-y-6 pt-2">
                {/* Draft Hypotheses */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Draft Hypotheses
                  </h4>
                  {drafts.hypotheses.map((h, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs"
                    >
                      <p className="font-semibold text-slate-200">{h.statement}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span className="text-slate-500">Target Audience:</span> {h.target_audience}
                        </div>
                        <div>
                          <span className="text-slate-500">Gap Addressed:</span> {h.gap_addressed}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        <span className="text-slate-500">Problem:</span> {h.problem_statement}
                      </p>
                      {onSelectHypothesis && (
                        <div className="pt-2 flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              onSelectHypothesis(h)
                              setIsOpen(false)
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Use This Hypothesis
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Draft Experiments */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Structured Experiment Protocol
                  </h4>
                  {drafts.experiments.map((e, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-200">{e.title}</p>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 uppercase">
                          {e.method}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{e.hypothesis_statement}</p>
                      <div className="rounded border border-indigo-950 bg-indigo-950/20 p-2 text-[11px] space-y-1">
                        <p className="text-indigo-300 font-medium">Pre-registered Success Threshold:</p>
                        <p className="text-slate-300">{e.success_threshold}</p>
                        <p className="text-slate-500 text-[10px]">
                          Metric: {e.threshold_metric} {e.threshold_operator} {e.threshold_target}{e.threshold_unit} (Min sample: {e.threshold_min_sample})
                        </p>
                      </div>
                      {onSelectExperiment && (
                        <div className="pt-2 flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              onSelectExperiment(e)
                              setIsOpen(false)
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Use This Experiment
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Field Discovery Questions */}
                {drafts.discovery_questions.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-xs">
                    <p className="font-semibold text-slate-300">Suggested Field Interview Questions:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {drafts.discovery_questions.map((q, i) => (
                        <li key={i}>{q}</li>
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
