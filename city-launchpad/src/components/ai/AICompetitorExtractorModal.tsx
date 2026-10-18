'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractCompetitorInfoAction } from '@/lib/ai/actions'
import type { CompetitorExtractionData } from '@/lib/ai/types'

interface AICompetitorExtractorModalProps {
  city: string
  onSaveCompetitor?: (data: CompetitorExtractionData) => void
}

export function AICompetitorExtractorModal({
  city,
  onSaveCompetitor,
}: AICompetitorExtractorModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sourceText, setSourceText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<CompetitorExtractionData | null>(null)

  const handleExtract = async () => {
    if (!sourceText.trim() || sourceText.trim().length < 10) {
      setError('Please provide at least 10 characters of source text.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await extractCompetitorInfoAction({
        sourceText: sourceText.trim(),
        city,
      })

      if (!res.success || !res.data) {
        setError(res.message || 'Failed to extract competitor.')
        return
      }

      setExtracted(res.data)
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
        onClick={() => setIsOpen(true)}
        className="gap-1.5 border-indigo-700/50 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-900/40 text-xs"
      >
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        Extract Competitor
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Extract Competitor from Source — {city}
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
              Paste a news excerpt, pricing page snippet, or market report paragraph. AI will extract observable competitor fields strictly from the supplied text.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Source Content Snippet</label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste news article, press release, or website snippet here..."
                rows={4}
                className="w-full rounded-md border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-900/50 bg-rose-950/20 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {!extracted ? (
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleExtract}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Extract Structured Competitor
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{extracted.name}</span>
                  <span className="rounded bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 text-[10px] text-amber-300 uppercase">
                    {extracted.confidence} Draft
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500">Category:</span> {extracted.category}
                  </div>
                  <div>
                    <span className="text-slate-500">Observed Price:</span>{' '}
                    {extracted.observed_price ? `${extracted.currency} ${extracted.observed_price} ${extracted.price_unit || ''}` : 'Unknown'}
                  </div>
                  <div>
                    <span className="text-slate-500">Scope:</span> {extracted.geographic_scope || 'Unknown'}
                  </div>
                  <div>
                    <span className="text-slate-500">Target Audience:</span> {extracted.target_audience || 'Unknown'}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Offering:</span>
                  <p className="text-slate-300 mt-0.5">{extracted.offering}</p>
                </div>

                {extracted.differentiation_claims.length > 0 && (
                  <div>
                    <span className="text-slate-500">Differentiation Claims:</span>
                    <ul className="list-disc list-inside text-slate-400 mt-0.5">
                      {extracted.differentiation_claims.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded border border-slate-800 bg-slate-900/60 p-2 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Supporting Excerpt:</span> &quot;{extracted.supporting_excerpt}&quot;
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button variant="ghost" size="sm" onClick={() => setExtracted(null)}>
                    Reset
                  </Button>
                  {onSaveCompetitor && (
                    <Button
                      size="sm"
                      onClick={() => {
                        onSaveCompetitor(extracted)
                        setIsOpen(false)
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1 text-xs"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Save as Draft Competitor
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
