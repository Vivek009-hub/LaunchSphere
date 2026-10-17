import { z } from 'zod'

// ─── Startup Profile ──────────────────────────────────────────
export const startupProfileSchema = z.object({
  name: z.string().min(2, 'Startup name must be at least 2 characters').max(100),
  industry: z.string().min(2, 'Industry is required').max(100),
  stage: z.enum(['idea', 'pre-seed', 'seed', 'series-a']),
  target_customer: z
    .string()
    .min(10, 'Describe your target customer (at least 10 characters)')
    .max(500),
  product_desc: z
    .string()
    .min(20, 'Describe your product (at least 20 characters)')
    .max(2000),
})
export type StartupProfileInput = z.infer<typeof startupProfileSchema>

// ─── City Comparison ─────────────────────────────────────────
export const cityComparisonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  cities: z
    .array(z.string().min(1))
    .min(2, 'Select at least 2 cities')
    .max(5, 'Maximum 5 cities per comparison'),
})
export type CityComparisonInput = z.infer<typeof cityComparisonSchema>

// ─── Market Indicator ────────────────────────────────────────
export const marketIndicatorSchema = z.object({
  city: z.string().min(1, 'City is required'),
  indicator: z.string().min(2, 'Indicator name required').max(100),
  value: z.string().min(1, 'Value is required').max(200),
  unit: z.string().max(50).optional(),
  source_name: z.string().min(2, 'Source name required').max(200),
  source_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  collected_at: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low', 'unverified']),
  notes: z.string().max(1000).optional(),
})
export type MarketIndicatorInput = z.infer<typeof marketIndicatorSchema>

// ─── Introduction Request ────────────────────────────────────
export const introductionRequestSchema = z.object({
  contact_id: z.string().uuid('Invalid contact ID'),
  message: z
    .string()
    .min(20, 'Please write at least 20 characters explaining why you want to connect')
    .max(1000),
  match_reason: z.string().min(1).max(500),
})
export type IntroductionRequestInput = z.infer<typeof introductionRequestSchema>

// ─── Experiment ──────────────────────────────────────────────
export const experimentSchema = z.object({
  title: z.string().min(3).max(200),
  hypothesis: z
    .string()
    .min(20, 'Hypothesis must be at least 20 characters')
    .max(1000),
  method: z.enum(['interview', 'survey', 'retailer-outreach', 'landing-page', 'pilot']),
  city: z.string().min(1, 'City is required'),
  target_metric: z.string().min(5, 'Describe the metric you will measure').max(200),
  success_threshold: z
    .string()
    .min(5, 'Define a measurable success threshold')
    .max(200),
  comparison_id: z.string().uuid().optional().nullable(),
})
export type ExperimentInput = z.infer<typeof experimentSchema>

// ─── Experiment Response ──────────────────────────────────────
export const experimentResponseSchema = z.object({
  respondent_label: z
    .string()
    .min(1, 'Label required')
    .max(100)
    .describe('Anonymised label, e.g. "Retailer A" or "Respondent 3"'),
  response_type: z.enum([
    'interview',
    'survey-submission',
    'observation',
    'purchase',
    'signup',
  ]),
  outcome: z.enum(['positive', 'negative', 'neutral', 'inconclusive']),
  notes: z.string().max(2000).optional(),
  evidence_url: z.string().url().optional().or(z.literal('')),
})
export type ExperimentResponseInput = z.infer<typeof experimentResponseSchema>

// ─── Assumption ───────────────────────────────────────────────
export const assumptionSchema = z.object({
  statement: z.string().min(10, 'State your assumption clearly').max(500),
  source_type: z.enum(['city-intelligence', 'manual', 'llm-synthesis']),
  comparison_id: z.string().uuid().optional().nullable(),
})
export type AssumptionInput = z.infer<typeof assumptionSchema>
