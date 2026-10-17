/**
 * Deterministic Fit Score Engine
 *
 * This module computes numeric fit scores from structured market data.
 * NO AI calls are made here. AI may optionally generate text rationale
 * AFTER this function returns — but the numeric result is never AI-derived.
 */

import type { FitScoreCriterion } from '@/types/database'

export interface ScoringInput {
  criteria: FitScoreCriterion[]
}

export interface ScoringResult {
  criteria: FitScoreCriterion[]
  total_score: number
  max_score: number
  percentage: number
}

/**
 * Computes a weighted fit score.
 *
 * Formula: total = Σ(score_i × weight_i) / Σ(weight_i) × 10
 *
 * @param input - Array of criteria, each with a weight (0–100) and score (0–10)
 * @returns Deterministic numeric result — no randomness, no AI.
 */
export function computeFitScore(input: ScoringInput): ScoringResult {
  const { criteria } = input

  if (criteria.length === 0) {
    return { criteria, total_score: 0, max_score: 100, percentage: 0 }
  }

  let weightedSum = 0
  let totalWeight = 0

  for (const c of criteria) {
    const weight = Math.max(0, Math.min(100, c.weight))
    const score = Math.max(0, Math.min(10, c.score))
    weightedSum += score * weight
    totalWeight += weight
  }

  if (totalWeight === 0) {
    return { criteria, total_score: 0, max_score: 100, percentage: 0 }
  }

  // Normalize to 0–100 scale
  const total_score = parseFloat(((weightedSum / totalWeight) * 10).toFixed(2))
  const max_score = 100

  return {
    criteria,
    total_score,
    max_score,
    percentage: parseFloat(((total_score / max_score) * 100).toFixed(1)),
  }
}

/** Default criteria set used for new comparisons */
export const DEFAULT_CRITERIA: Omit<FitScoreCriterion, 'score' | 'rationale'>[] = [
  { name: 'Market Size & Growth', weight: 25 },
  { name: 'Digital Infrastructure', weight: 20 },
  { name: 'Competitive Density', weight: 15 },
  { name: 'Distribution Access', weight: 20 },
  { name: 'Talent Availability', weight: 10 },
  { name: 'Regulatory Environment', weight: 10 },
]

/** Returns a color class based on percentage score */
export function fitScoreColor(percentage: number): string {
  if (percentage >= 75) return 'text-emerald-400'
  if (percentage >= 50) return 'text-amber-400'
  return 'text-rose-400'
}

export function fitScoreLabel(percentage: number): string {
  if (percentage >= 75) return 'Strong Fit'
  if (percentage >= 50) return 'Moderate Fit'
  if (percentage >= 25) return 'Weak Fit'
  return 'Poor Fit'
}
