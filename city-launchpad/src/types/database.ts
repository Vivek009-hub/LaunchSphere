// ─────────────────────────────────────────────────────────────
// Database row types — mirrors the Supabase schema exactly.
// Keep in sync with supabase/migrations/0001_initial_schema.sql
// ─────────────────────────────────────────────────────────────

export type StartupStage = 'idea' | 'pre-seed' | 'seed' | 'series-a'
export type ComparisonStatus = 'draft' | 'analyzing' | 'complete' | 'error'
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified'
export type ContactCategory =
  | 'retailer'
  | 'distributor'
  | 'mentor'
  | 'institution'
  | 'supplier'
  | 'pilot-customer'
export type IntroductionStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn'
export type ExperimentMethod =
  | 'interview'
  | 'survey'
  | 'retailer-outreach'
  | 'landing-page'
  | 'pilot'
export type ExperimentStatus = 'planned' | 'active' | 'complete' | 'cancelled'
export type ResponseType =
  | 'interview'
  | 'survey-submission'
  | 'observation'
  | 'purchase'
  | 'signup'
export type OutcomeType = 'positive' | 'negative' | 'neutral' | 'inconclusive'
export type AssumptionSourceType = 'city-intelligence' | 'manual' | 'llm-synthesis'
export type AssumptionStatus = 'untested' | 'supported' | 'challenged' | 'invalidated'
export type EvidenceDirection = 'supports' | 'challenges' | 'neutral'

// ─── Tables ───────────────────────────────────────────────────

export type StartupProfile = {
  id: string
  user_id: string
  name: string
  industry: string
  stage: StartupStage
  target_customer: string
  product_desc: string
  created_at: string
  updated_at: string
}

export type CityComparison = {
  id: string
  user_id: string
  title: string
  cities: string[]
  status: ComparisonStatus
  created_at: string
  updated_at: string
}

export type MarketIndicator = {
  id: string
  comparison_id: string
  city: string
  indicator: string
  value: string
  unit: string | null
  source_name: string
  source_url: string | null
  collected_at: string | null
  confidence: ConfidenceLevel
  notes: string | null
  created_at: string
}

export type FitScoreCriterion = {
  name: string
  weight: number
  score: number
  rationale: string
}

export type FitScore = {
  id: string
  comparison_id: string
  city: string
  criteria: FitScoreCriterion[]
  total_score: number
  max_score: number
  computed_at: string
}

export type Contact = {
  id: string
  city: string
  name: string
  organization: string | null
  role: string | null
  category: ContactCategory
  industry_tags: string[]
  description: string | null
  source_name: string
  source_url: string | null
  verified: boolean
  verified_at: string | null
  is_demo: boolean
  created_at: string
}

export type IntroductionRequest = {
  id: string
  user_id: string
  contact_id: string
  message: string
  status: IntroductionStatus
  match_reason: string
  created_at: string
  updated_at: string
  contact?: Contact
}

export type Experiment = {
  id: string
  user_id: string
  comparison_id: string | null
  title: string
  hypothesis: string
  method: ExperimentMethod
  city: string
  target_metric: string
  success_threshold: string
  status: ExperimentStatus
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type ExperimentResponse = {
  id: string
  experiment_id: string
  respondent_label: string
  response_type: ResponseType
  outcome: OutcomeType
  notes: string | null
  evidence_url: string | null
  recorded_at: string
}

export type Assumption = {
  id: string
  user_id: string
  comparison_id: string | null
  statement: string
  source_type: AssumptionSourceType
  status: AssumptionStatus
  created_at: string
  updated_at: string
}

export type AssumptionEvidence = {
  id: string
  assumption_id: string
  experiment_id: string | null
  indicator_id: string | null
  direction: EvidenceDirection
  notes: string | null
  linked_at: string
}

// ─── Supabase Database type ───────────────────────────────────
// Defined as type alias so all Row types satisfy Record<string, unknown>
export type Database = {
  public: {
    Tables: {
      startup_profiles: {
        Row: StartupProfile
        Insert: Omit<StartupProfile, 'id' | 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<StartupProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      city_comparisons: {
        Row: CityComparison
        Insert: Omit<CityComparison, 'id' | 'created_at' | 'updated_at'> & {
          status?: ComparisonStatus
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<CityComparison, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      market_indicators: {
        Row: MarketIndicator
        Insert: Omit<MarketIndicator, 'id' | 'created_at' | 'unit' | 'source_url' | 'collected_at' | 'notes'> & {
          unit?: string | null
          source_url?: string | null
          collected_at?: string | null
          confidence?: ConfidenceLevel
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Omit<MarketIndicator, 'id' | 'created_at'>>
        Relationships: []
      }
      fit_scores: {
        Row: FitScore
        Insert: Omit<FitScore, 'id' | 'computed_at'> & {
          computed_at?: string
        }
        Update: Partial<Omit<FitScore, 'id'>>
        Relationships: []
      }
      contacts: {
        Row: Contact
        Insert: Omit<Contact, 'id' | 'created_at' | 'organization' | 'role' | 'description' | 'source_url' | 'verified_at'> & {
          organization?: string | null
          role?: string | null
          description?: string | null
          source_url?: string | null
          verified?: boolean
          verified_at?: string | null
          is_demo?: boolean
          created_at?: string
        }
        Update: Partial<Omit<Contact, 'id' | 'created_at'>>
        Relationships: []
      }
      introduction_requests: {
        Row: IntroductionRequest
        Insert: Omit<IntroductionRequest, 'id' | 'created_at' | 'updated_at' | 'contact' | 'status'> & {
          status?: IntroductionStatus
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<IntroductionRequest, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'contact'>>
        Relationships: []
      }
      experiments: {
        Row: Experiment
        Insert: Omit<Experiment, 'id' | 'created_at' | 'updated_at' | 'comparison_id' | 'started_at' | 'completed_at' | 'status'> & {
          comparison_id?: string | null
          status?: ExperimentStatus
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Experiment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      experiment_responses: {
        Row: ExperimentResponse
        Insert: Omit<ExperimentResponse, 'id' | 'recorded_at' | 'notes' | 'evidence_url'> & {
          notes?: string | null
          evidence_url?: string | null
          recorded_at?: string
        }
        Update: Partial<Omit<ExperimentResponse, 'id'>>
        Relationships: []
      }
      assumptions: {
        Row: Assumption
        Insert: Omit<Assumption, 'id' | 'created_at' | 'updated_at' | 'comparison_id' | 'status' | 'source_type'> & {
          comparison_id?: string | null
          source_type?: AssumptionSourceType
          status?: AssumptionStatus
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Assumption, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      assumption_evidence: {
        Row: AssumptionEvidence
        Insert: Omit<AssumptionEvidence, 'id' | 'linked_at' | 'experiment_id' | 'indicator_id' | 'notes'> & {
          experiment_id?: string | null
          indicator_id?: string | null
          notes?: string | null
          linked_at?: string
        }
        Update: Partial<Omit<AssumptionEvidence, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
