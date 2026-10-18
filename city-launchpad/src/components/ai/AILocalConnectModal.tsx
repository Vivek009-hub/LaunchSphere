'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, ArrowRight, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { proposeLocalConnectFiltersAction } from '@/lib/ai/actions'
import type { LocalConnectFilterProposal } from '@/lib/ai/types'
import type { ContactCategory } from '@/types/database'

interface AILocalConnectModalProps {
  currentCity?: string
  onApplyFilters: (filters: {
    category?: ContactCategory
    city?: string
    industry?: string
    query?: string
  }) => void
}

export function AILocalConnectModal({ currentCity, onApplyFilters }: AILocalConnectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<LocalConnectFilterProposal | null>(null)

  // Editable fields for review before applying
  const [editCategory, setEditCategory] = useState<ContactCategory | undefined>(undefined)
  const [editCity, setEditCity] = useState('')
  const [editIndustry, setEditIndustry] = useState('')
  const [editQuery, setEditQuery] = useState('')

  const handlePropose = async () => {
    if (!notes.trim() || notes.trim().length < 5) {
      setError('Please provide at least 5 characters describing your partner needs.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await proposeLocalConnectFiltersAction({
        notes: notes.trim(),
        city: currentCity,
      })

      if (!res.success || !res.data) {
        setError(res.message || 'Failed to propose filters.')
        return
      }

      setProposal(res.data)
      setEditCategory(res.data.category)
      setEditCity(res.data.city || currentCity || '')
      setEditIndustry(res.data.industry || '')
      setEditQuery(res.data.query || '')
    } catch {
      setError('An error occurred while contacting the AI provider.')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    onApplyFilters({
      category: editCategory,
      city: editCity || undefined,
      industry: editIndustry || undefined,
      query: editQuery || undefined,
    })
    setIsOpen(false)
    setProposal(null)
    setNotes('')
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
        AI Filter Assistant
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">AI Search Filter Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Describe the type of business, distributor, or mentor you need. AI will translate your notes into typed Local Connect search filters for your review.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Partner Requirements</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Looking for wholesale food and beverage distributors in Pune who can handle packaged FMCG goods with ambient storage..."
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-rose-900/50 bg-rose-950/20 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {!proposal ? (
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handlePropose}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Propose Filters
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg border border-indigo-900/50 bg-indigo-950/20 p-4 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                  <Check className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Proposed Filter Draft (Review & Confirm)</span>
                </div>

                <p className="text-[11px] text-slate-300 italic">{proposal.rationale}</p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400">Category</label>
                    <select
                      value={editCategory || ''}
                      onChange={(e) => setEditCategory((e.target.value as ContactCategory) || undefined)}
                      className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="">All Categories</option>
                      <option value="retailer">Retailer</option>
                      <option value="distributor">Distributor</option>
                      <option value="supplier">Supplier</option>
                      <option value="logistics">Logistics</option>
                      <option value="mentor">Mentor</option>
                      <option value="institution">Institution</option>
                      <option value="pilot-customer">Pilot Customer</option>
                      <option value="service-provider">Service Provider</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Industry</label>
                    <input
                      type="text"
                      value={editIndustry}
                      onChange={(e) => setEditIndustry(e.target.value)}
                      placeholder="e.g. FMCG"
                      className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Keyword Query</label>
                    <input
                      type="text"
                      value={editQuery}
                      onChange={(e) => setEditQuery(e.target.value)}
                      placeholder="e.g. packaged snacks"
                      className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                    />
                  </div>
                </div>

                {proposal.unmatchedCriteria.length > 0 && (
                  <div className="pt-1 text-[11px] text-amber-400/90">
                    <span className="font-semibold">Unmatched criteria (not filterable):</span>{' '}
                    {proposal.unmatchedCriteria.join(', ')}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button variant="ghost" size="sm" onClick={() => setProposal(null)}>
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApply}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1 text-xs"
                  >
                    Apply Filters to Search
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
