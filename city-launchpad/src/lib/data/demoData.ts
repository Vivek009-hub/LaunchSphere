import type {
  StartupProfile,
  CityComparison,
  Contact,
  IntroductionStatus,
  ExperimentStatus,
  AssumptionStatus,
} from '@/types/database'

export interface DemoCityAssessment {
  id: string
  cityName: string
  state: string
  tier: string
  fitScore: number
  evidenceCoverage: number // 0-100% separate from fit score
  status: 'recommended' | 'promising' | 'exploratory' | 'challenging'
  keyDriver: string
  topRisk: string
  isBaseCity?: boolean
}

export interface DemoIntroRequest {
  id: string
  contactName: string
  organization: string
  category: 'retailer' | 'distributor' | 'mentor' | 'institution' | 'supplier' | 'pilot-customer'
  city: string
  status: IntroductionStatus
  purpose: string
  requestedAt: string
  notes?: string
}

export interface DemoValidationExperiment {
  id: string
  title: string
  city: string
  method: 'interview' | 'survey' | 'retailer-outreach' | 'landing-page' | 'pilot'
  status: ExperimentStatus
  hypothesis: string
  metricTarget: string
  metricActual?: string
  outcomeSummary?: string
  nextAction: string
  updatedAt: string
}

export interface DemoProofAssumption {
  id: string
  statement: string
  category: 'market-demand' | 'pricing' | 'distribution' | 'regulatory'
  status: AssumptionStatus
  evidenceSummary: string
  confidence: 'high' | 'medium' | 'low' | 'unverified'
  linkedModule: 'city-intelligence' | 'local-connect' | 'market-validation'
}

// ─────────────────────────────────────────────────────────────
// Demo Startup Profile: Kavach AgriTech
// ─────────────────────────────────────────────────────────────
export const DEMO_PROFILE: StartupProfile & {
  operatingCity: string
  expansionCities: string[]
  shortDescription: string
} = {
  id: 'demo-profile-001',
  user_id: 'demo-user-001',
  name: 'Kavach AgriTech',
  industry: 'AgriTech & Cold Chain IoT',
  stage: 'seed',
  target_customer: 'Tier-2/3 Farmer Producer Organisations (FPOs) and fresh produce aggregators',
  product_desc: 'Solar-powered IoT micro-cold storage pods and remote temperature/humidity sensors designed to reduce post-harvest horticultural losses from 35% to under 6%.',
  business_description: 'Decentralized farm-gate cold chain infrastructure for high-value horticulture in India.',
  current_city: 'Pune',
  expansion_cities: ['Bengaluru', 'Mumbai', 'Hyderabad'],
  primary_channel: 'B2B Direct Field Sales & FPO Partnerships',
  price_min: 75000,
  price_max: 250000,
  website_url: 'https://kavachagri.in',
  product_category: 'Cold Chain IoT Hardware & SaaS',
  target_geography: 'Western & Southern India',
  traction_summary: '14 micro-pods deployed with 3 FPOs in Maharashtra, generating ₹42L ARR.',
  expansion_context: 'Scaling into Karnataka and Madhya Pradesh horticulture corridors.',
  operatingCity: 'Pune, Maharashtra',
  expansionCities: ['Bengaluru, Karnataka', 'Ahmedabad, Gujarat', 'Indore, Madhya Pradesh'],
  shortDescription: 'Decentralized farm-gate cold chain infrastructure for high-value horticulture in India.',
  created_at: '2026-08-15T10:00:00Z',
  updated_at: '2026-10-17T14:30:00Z',
}

// ─────────────────────────────────────────────────────────────
// Demo City Assessments (Fit Score + Separate Evidence Coverage)
// ─────────────────────────────────────────────────────────────
export const DEMO_CITY_ASSESSMENTS: DemoCityAssessment[] = [
  {
    id: 'city-pune',
    cityName: 'Pune',
    state: 'Maharashtra',
    tier: 'Tier 1',
    fitScore: 86,
    evidenceCoverage: 92,
    status: 'recommended',
    keyDriver: 'Base headquarters with established FPO network across western Maharashtra grape & onion belt.',
    topRisk: 'Intense regional competition in farm-gate telemetry providers.',
    isBaseCity: true,
  },
  {
    id: 'city-bengaluru',
    cityName: 'Bengaluru',
    state: 'Karnataka',
    tier: 'Tier 1',
    fitScore: 81,
    evidenceCoverage: 84,
    status: 'recommended',
    keyDriver: 'Dense agri-logistics aggregators (WayCool, Ninjacart) and high institutional capital density.',
    topRisk: 'High pilot deployment real estate and talent acquisition overheads.',
  },
  {
    id: 'city-ahmedabad',
    cityName: 'Ahmedabad',
    state: 'Gujarat',
    tier: 'Tier 1',
    fitScore: 74,
    evidenceCoverage: 76,
    status: 'promising',
    keyDriver: 'Extensive co-operative federation cold corridor and proactive dairy/agro-processing clusters.',
    topRisk: 'Cooperative procurement cycles require 90+ day pilot sign-off.',
  },
  {
    id: 'city-indore',
    cityName: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'Tier 2',
    fitScore: 69,
    evidenceCoverage: 62,
    status: 'exploratory',
    keyDriver: 'Hub of Malwa agricultural trade with dense mandis and soybean/potato production.',
    topRisk: 'Variable 3-phase rural power reliability requiring larger battery backups.',
  },
]

// ─────────────────────────────────────────────────────────────
// Demo Local Connect Requests
// ─────────────────────────────────────────────────────────────
export const DEMO_INTRO_REQUESTS: DemoIntroRequest[] = [
  {
    id: 'intro-001',
    contactName: 'Suresh Patil',
    organization: 'Sahyadri Farmers Producer Co.',
    category: 'institution',
    city: 'Pune',
    status: 'accepted',
    purpose: 'Explore 30-day paid pilot for 4 micro-cold storage pods at Nashik-Pune collection center.',
    requestedAt: '2026-10-10T09:15:00Z',
    notes: 'Pilot agreement signed. Initial sensor calibration scheduled.',
  },
  {
    id: 'intro-002',
    contactName: 'Ananya Raghavan',
    organization: 'WayCool Agritech Logistics',
    category: 'distributor',
    city: 'Bengaluru',
    status: 'pending',
    purpose: 'Understand third-party telemetry integration standards for Kolar vegetable corridor.',
    requestedAt: '2026-10-14T11:45:00Z',
    notes: 'Introduction forwarded to VP of Supply Chain Ops.',
  },
  {
    id: 'intro-003',
    contactName: 'Dr. Bhavesh Shah',
    organization: 'Gujarat Agro Industries Corp (GAIC)',
    category: 'institution',
    city: 'Ahmedabad',
    status: 'pending',
    purpose: 'Application for state cold-chain subsidy alignment and empanelment under PMKSY.',
    requestedAt: '2026-10-15T16:20:00Z',
    notes: 'Documentation submitted for technical committee review.',
  },
  {
    id: 'intro-004',
    contactName: 'Col. Rajesh Verma (Retd.)',
    organization: 'Malwa Agri Mentors Circle',
    category: 'mentor',
    city: 'Indore',
    status: 'accepted',
    purpose: 'Guidance on navigating Mandi board regulations and APMC market access in MP.',
    requestedAt: '2026-10-08T14:00:00Z',
    notes: 'Completed advisory call. Recommended 2 pilot contacts in Ujjain mandi.',
  },
]

// ─────────────────────────────────────────────────────────────
// Demo Market Validation Experiments
// ─────────────────────────────────────────────────────────────
export const DEMO_EXPERIMENTS: DemoValidationExperiment[] = [
  {
    id: 'exp-001',
    title: 'Pune & Nashik FPO Willingness-to-Pay Survey',
    city: 'Pune',
    method: 'survey',
    status: 'complete',
    hypothesis: 'FPO directors will commit ₹450/month per storage pod for mobile temperature alert dashboard.',
    metricTarget: '≥ 50% positive willingness to pay (n=30)',
    metricActual: '68% positive willingness to pay (26 of 38 FPOs surveyed)',
    outcomeSummary: 'Strong validation among horticulture FPOs; low willingness among grain producers.',
    nextAction: 'Finalize standard SaaS agreement terms and deploy hardware kits to 2 pilot sites.',
    updatedAt: '2026-10-12T16:00:00Z',
  },
  {
    id: 'exp-002',
    title: 'Bengaluru Fresh Greens Retailer Outreach',
    city: 'Bengaluru',
    method: 'retailer-outreach',
    status: 'active',
    hypothesis: 'Premium organic grocery chains will prioritize suppliers with certified temperature-controlled transit logs.',
    metricTarget: '8 out of 12 retailers request sample temperature telemetry log',
    metricActual: '5 of 8 completed interviews expressed strong procurement preference',
    outcomeSummary: 'Retailers confirm ₹2-4/kg premium for cold-tracked leafy greens.',
    nextAction: 'Complete remaining 4 retailer interviews in Indiranagar and Koramangala.',
    updatedAt: '2026-10-16T10:30:00Z',
  },
  {
    id: 'exp-003',
    title: 'Indore APMC Mandi Power Reliability Observation',
    city: 'Indore',
    method: 'pilot',
    status: 'planned',
    hypothesis: 'Rural mandi grid sheds power under 4 hours daily during peak daytime auction hours.',
    metricTarget: '7-day continuous power logging showing > 20h uptime without generator fallback',
    outcomeSummary: 'Experiment planned for next field visit; telemetry data logger ready for deployment.',
    nextAction: 'Install demo battery telemetry logger at Sanwer road collection hub.',
    updatedAt: '2026-10-17T09:00:00Z',
  },
]

// ─────────────────────────────────────────────────────────────
// Demo Market Proof Loop Assumptions
// ─────────────────────────────────────────────────────────────
export const DEMO_ASSUMPTIONS: DemoProofAssumption[] = [
  {
    id: 'assump-001',
    statement: 'FPOs will pay ₹450/month per unit for real-time mobile temperature & spoilage alerts.',
    category: 'pricing',
    status: 'supported',
    evidenceSummary: 'Validated by 26/38 FPO directors in Pune/Nashik survey (Exp #001) and 2 signed pilot letters.',
    confidence: 'high',
    linkedModule: 'market-validation',
  },
  {
    id: 'assump-002',
    statement: 'Tier-2 Mandis in Indore provide reliable 3-phase grid power for farm-gate cold units.',
    category: 'distribution',
    status: 'challenged',
    evidenceSummary: 'Initial mentor report and regional DISCOM schedules show 4–6 hour daily outages in summer.',
    confidence: 'medium',
    linkedModule: 'local-connect',
  },
  {
    id: 'assump-003',
    statement: 'Organized retailers in Bengaluru demand API integration with existing ERP / POS software.',
    category: 'market-demand',
    status: 'untested',
    evidenceSummary: 'Pending conclusion of retailer outreach interviews (Exp #002). 5 interviews logged so far.',
    confidence: 'unverified',
    linkedModule: 'market-validation',
  },
  {
    id: 'assump-004',
    statement: 'Distributor margin expectation for smart cold units is under 15% of hardware MSRP.',
    category: 'distribution',
    status: 'supported',
    evidenceSummary: 'Confirmed in introductory alignment meeting with Sahyadri Farmers Producer Co.',
    confidence: 'medium',
    linkedModule: 'local-connect',
  },
]

// ─────────────────────────────────────────────────────────────
// Demo Comparison Object (for City Intelligence)
// ─────────────────────────────────────────────────────────────
export const DEMO_COMPARISONS: CityComparison[] = [
  {
    id: 'comp-001',
    user_id: 'demo-user-001',
    title: 'Western & Southern AgriTech Expansion Cohort',
    cities: ['Pune', 'Bengaluru', 'Ahmedabad', 'Indore'],
    status: 'complete',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-17T11:00:00Z',
  },
  {
    id: 'comp-002',
    user_id: 'demo-user-001',
    title: 'Northern Horticulture Corridor Evaluation',
    cities: ['Delhi-NCR', 'Chandigarh', 'Jaipur'],
    status: 'draft',
    created_at: '2026-10-16T15:20:00Z',
    updated_at: '2026-10-16T15:20:00Z',
  },
]

// ─────────────────────────────────────────────────────────────
// Demo Contacts (for Local Connect)
// ─────────────────────────────────────────────────────────────
export const DEMO_CONTACTS: Contact[] = [
  {
    id: 'contact-001',
    name: 'Suresh Patil',
    organization: 'Sahyadri Farmers Producer Co.',
    role: 'Chairman & Managing Director',
    category: 'institution',
    city: 'Pune',
    industry_tags: ['AgriTech', 'Cold Storage', 'FPO', 'Horticulture'],
    capabilities: ['FPO Aggregation', 'Farm-gate Infrastructure', 'Export Packing', 'Farmer Outreach'],
    service_area: 'Pune & Nashik Corridor',
    website_url: 'https://sahyadrifarms.com',
    description: 'Largest horticulture FPO network in India (18,000+ farmer members) managing cold storage nodes.',
    source_name: 'Sahyadri Farms Annual Report & ROC',
    source_url: 'https://sahyadrifarms.com',
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-09-01T10:00:00Z',
    is_demo: true,
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'contact-002',
    name: 'Ananya Raghavan',
    organization: 'WayCool Agritech Logistics',
    role: 'Head of Cold Chain Procurement',
    category: 'distributor',
    city: 'Bengaluru',
    industry_tags: ['Logistics', 'Supply Chain', 'B2B Retail', 'AgriTech'],
    capabilities: ['Bulk Farm Procurement', 'Kirana Store Replenishment', 'Cross-docking', 'Quality Grading'],
    service_area: 'Bengaluru Urban & Rural',
    website_url: 'https://waycool.in',
    description: 'Handles 400+ tons/day of fresh produce across South India with direct tie-ups to 12,000 retail endpoints.',
    source_name: 'AgriLogistics Summit 2026 Directory',
    source_url: 'https://waycool.in',
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-09-05T11:30:00Z',
    is_demo: true,
    created_at: '2026-09-05T11:30:00Z',
  },
  {
    id: 'contact-003',
    name: 'Dr. Bhavesh Shah',
    organization: 'Gujarat Agro Industries Corp (GAIC)',
    role: 'Chief General Manager',
    category: 'institution',
    city: 'Ahmedabad',
    industry_tags: ['Govt Nodal Agency', 'Subsidies', 'PMKSY', 'AgriTech'],
    capabilities: ['Cold Storage Subsidies', 'Terminal Market Access', 'Govt Grant Facilitation'],
    service_area: 'State of Gujarat',
    website_url: 'https://gaic.gujarat.gov.in',
    description: 'Nodal agency for cold storage capital subsidies in Gujarat and modernization loans.',
    source_name: 'Govt of Gujarat Portal',
    source_url: 'https://gaic.gujarat.gov.in',
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-09-10T14:00:00Z',
    is_demo: true,
    created_at: '2026-09-10T14:00:00Z',
  },
  {
    id: 'contact-004',
    name: 'Col. Rajesh Verma (Retd.)',
    organization: 'Malwa Agri Mentors Circle',
    role: 'Founder & Senior Advisor',
    category: 'mentor',
    city: 'Indore',
    industry_tags: ['Mandi Regulations', 'APMC', 'Agri Mentorship', 'Logistics'],
    capabilities: ['Mandi Board Compliance', 'APMC License Guidance', 'Distributor Introductions'],
    service_area: 'Malwa & Central India',
    website_url: null,
    description: '20+ years leading agri-supply chains; advisor to 6 central India FPOs on post-harvest handling.',
    source_name: 'TIE MP Charter Member Roster',
    source_url: null,
    verified: false,
    verification_status: 'unverified',
    verified_at: null,
    is_demo: true,
    created_at: '2026-09-15T09:00:00Z',
  },
  {
    id: 'contact-005',
    name: 'Kavita Menon',
    organization: 'Nature Basket Supermarkets',
    role: 'Regional Category Manager - Fresh',
    category: 'retailer',
    city: 'Bengaluru',
    industry_tags: ['Premium Retail', 'Organic Produce', 'D2C', 'Consumer Goods'],
    capabilities: ['Vendor Onboarding', 'Shelf-space Allocation', 'D2C Pilot Shelves', 'Weekly SKU Reconciliation'],
    service_area: 'Central & East Bengaluru (Indiranagar, Koramangala, Whitefield)',
    website_url: 'https://naturesbasket.co.in',
    description: 'Sourcing organic and export-grade vegetables for 32 retail stores in prime tech corridors.',
    source_name: 'LinkedIn Verified Recruiter',
    source_url: null,
    verified: true,
    verification_status: 'source_checked',
    verified_at: '2026-09-20T16:00:00Z',
    is_demo: true,
    created_at: '2026-09-20T16:00:00Z',
  },
  {
    id: 'contact-006',
    name: 'Ramesh Sundaram',
    organization: 'Deccan Express Cold Chains',
    role: 'Director of Operations',
    category: 'logistics',
    city: 'Bengaluru',
    industry_tags: ['AgriTech', 'Cold Storage', 'Logistics', 'Supply Chain'],
    capabilities: ['Multi-temperature Fleet', 'Dark Store Warehousing', 'Real-time Telemetry API', 'Last-Mile Courier'],
    service_area: 'Bengaluru & Karnataka Hubs',
    website_url: 'https://deccancoldchains.example.in',
    description: 'Refrigerated transport fleet with real-time temperature logs for pharmaceuticals and fresh horticultural produce.',
    source_name: 'Karnataka Cold Storage Association Registry 2026',
    source_url: 'https://karnatakacoldchains.org/members',
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-09-12T10:00:00Z',
    is_demo: true,
    created_at: '2026-09-12T10:00:00Z',
  },
  {
    id: 'contact-007',
    name: 'Deepak Deshmukh',
    organization: 'Maharashtra Precision Components',
    role: 'VP Supply Chain',
    category: 'supplier',
    city: 'Pune',
    industry_tags: ['Hardware', 'Manufacturing', 'IoT', 'AgriTech'],
    capabilities: ['Sheet Metal Enclosures', 'IP67 Waterproof Casings', 'Rapid Prototyping', 'ISO 9001 Batch Assembly'],
    service_area: 'Bhosari & Chakan Industrial Belt, Pune',
    website_url: 'https://mahaprecision.example.com',
    description: 'OEM metal fabrication and hardware chassis provider for harsh outdoor industrial and agricultural IoT sensors.',
    source_name: 'Chakan MIDC Industrial Directory 2026',
    source_url: 'https://chakanmidc.org/directory',
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-08-25T14:30:00Z',
    is_demo: true,
    created_at: '2026-08-25T14:30:00Z',
  },
  {
    id: 'contact-008',
    name: 'Adv. Neha Kulkarni',
    organization: 'Apex Legal & Regulatory Advisors',
    role: 'Managing Partner',
    category: 'service-provider',
    city: 'Pune',
    industry_tags: ['Legal', 'Regulatory', 'AgriTech', 'Compliance'],
    capabilities: ['APMC Mandi Licensing', 'FSSAI Approvals', 'Vendor Contract Drafting', 'IP Protection'],
    service_area: 'Pan-Maharashtra',
    website_url: 'https://apexlegalpune.example.com',
    description: 'Advises early and growth stage B2B startups on state agricultural marketing laws, mandi cesses, and supplier contracts.',
    source_name: 'Bar Council of Maharashtra Registry',
    source_url: null,
    verified: true,
    verification_status: 'source_checked',
    verified_at: '2026-09-18T09:00:00Z',
    is_demo: true,
    created_at: '2026-09-18T09:00:00Z',
  },
  {
    id: 'contact-009',
    name: 'Vikram Singhania',
    organization: 'Apex B2B Mart & Wholesalers',
    role: 'General Manager',
    category: 'distributor',
    city: 'Mumbai',
    industry_tags: ['FMCG', 'Consumer Goods', 'Retail', 'B2B'],
    capabilities: ['Kirana Network Distribution', 'Wholesale Credit Financing', 'Cash-and-Carry Distribution'],
    service_area: 'Mumbai Metropolitan Region & Navi Mumbai',
    website_url: 'https://apexb2bmart.example.com',
    description: 'Wholesale aggregator supplying 2,500+ general trade grocery outlets with weekly replenishment routes.',
    source_name: 'Trade Directory MMR 2026',
    source_url: null,
    verified: false,
    verification_status: 'unverified',
    verified_at: null,
    is_demo: true,
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'contact-010',
    name: 'K. Tarun Reddy',
    organization: 'T-Hub Ecosystem Partnerships',
    role: 'Director of Corporate Innovation',
    category: 'institution',
    city: 'Hyderabad',
    industry_tags: ['General', 'DeepTech', 'B2B', 'SaaS', 'AgriTech'],
    capabilities: ['Corporate Pilot Brokering', 'State Govt Sandbox Access', 'Investor Showcases', 'Mentor Matching'],
    service_area: 'Telangana & Pan-South India',
    website_url: 'https://t-hub.co',
    description: 'Connects startups with enterprise pilots, state procurement sandboxes, and corporate testing facilities.',
    source_name: 'T-Hub Official Website',
    source_url: 'https://t-hub.co',
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-09-02T15:00:00Z',
    is_demo: true,
    created_at: '2026-09-02T15:00:00Z',
  },
  {
    id: 'contact-011',
    name: 'Dr. Aruna Shenoy',
    organization: 'Metro Mumbai Healthcare Collective',
    role: 'Chief Procurement Officer',
    category: 'pilot-customer',
    city: 'Mumbai',
    industry_tags: ['HealthTech', 'Diagnostics', 'Biotech', 'Hospitality'],
    capabilities: ['Hospital Pilot Trials', 'Bulk Diagnostic Supply Procurement', 'Clinical Evidence Evaluation'],
    service_area: 'Greater Mumbai & Thane',
    website_url: 'https://mumbaihealthcarecol.example.org',
    description: 'Consortium of 14 hospitals and diagnostics centres piloting innovative health and supply chain monitoring tools.',
    source_name: 'Public Hospital Consortium Listing',
    source_url: 'https://mumbaihealthcarecol.example.org',
    verified: true,
    verification_status: 'source_checked',
    verified_at: '2026-09-28T11:00:00Z',
    is_demo: true,
    created_at: '2026-09-28T11:00:00Z',
  },
  {
    id: 'contact-012',
    name: 'Gaurav Bhasin',
    organization: 'NCR Angels & Enterprise Mentors',
    role: 'Venture Partner',
    category: 'mentor',
    city: 'Delhi-NCR',
    industry_tags: ['B2B', 'SaaS', 'Enterprise Sales', 'Fintech'],
    capabilities: ['Enterprise Deal Structuring', 'Procurement Navigating', 'Pricing Strategy', 'Series-A Advisory'],
    service_area: 'Gurugram & South Delhi',
    website_url: 'https://ncrangels.example.com',
    description: 'Advises early-stage founders on navigating corporate procurement cycles, enterprise pilot pricing, and SaaS contracts.',
    source_name: 'NCR Angels Network',
    source_url: null,
    verified: true,
    verification_status: 'directly_confirmed',
    verified_at: '2026-09-10T12:00:00Z',
    is_demo: true,
    created_at: '2026-09-10T12:00:00Z',
  },
]

// ─────────────────────────────────────────────────────────────
// Demo User Object (for Topbar & Auth fallback)
// ─────────────────────────────────────────────────────────────
export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'founder@kavachagri.in',
  user_metadata: {
    name: 'Vivek Sharma',
    startup_name: 'Kavach AgriTech',
    role: 'Founder & CEO',
  },
}

