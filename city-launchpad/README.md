# City Launchpad

> **Tagline:** From local market intelligence to real-world proof.  
> **Product Overview:** City Launchpad is an AI-assisted platform that helps Indian startups expand into new cities by identifying promising markets, connecting them with relevant local businesses, and validating real customer demand.

---

## 🚀 The Three Core Pillars + Market Proof Loop

1. **City Intelligence & Fit Score**
   - Compare candidate Indian cities using transparent, **100% deterministic scoring** across 5 structured market dimensions.
   - Sourced market indicators with explicit provenance (source name, URL, collection date, confidence rating).
   - Clear distinction between market attractiveness score and evidence coverage (zero fabricated metrics for missing data).

2. **Local Connect**
   - Directory of verified local retailers, distributors, institutional partners, suppliers, logistics providers, and mentors across Indian startup hubs.
   - Transparent verification tiers: `directly_confirmed`, `source_checked`, and `unverified`.
   - Structured introduction requests with audited status lifecycles (`pending` → `accepted` / `declined` / `cancelled` / `completed`).

3. **Local Market Validation**
   - Manage falsifiable market hypotheses and structured field experiments (surveys, retailer interviews, paid pilots, distributor outreach).
   - Pre-registered success thresholds (`>= 50% Willingness to Pay`) and sample targets.
   - Immutable audit trail (`threshold_history`) tracking all criteria modifications with required justification reasons.
   - Granular commercial signal tracking distinguishing paid orders and repeat purchases from casual verbal interest.

4. **Market Proof Loop (Integration Engine)**
   - Unifies city assessments, partner introduction activity, and validation experiment observations into an end-to-end evidence loop.
   - Deterministic 8-rule classification engine categorizes hypothesis validity into `untested`, `testing`, `supported`, `challenged`, or `inconclusive`.
   - Explicitly flags conflicting evidence and recommends pre-registered next steps.

5. **Bounded, Grounded AI Assistance**
   - AI acts strictly as an unprivileged accelerator, never an authority.
   - Supports 5 bounded use cases: evidence summarization, competitor info extraction, filter proposals, experiment drafting, and findings narration.
   - **Zero Hallucinated Citations**: Model citations are strictly verified against pre-authorized database IDs; unverified IDs are purged.
   - PII scrubbing, prompt injection XML boundaries, 15-second timeouts, and 10 req/min sliding-window rate limiting.
   - Clean, non-blocking fallback if `GEMINI_API_KEY` is not configured.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16.4.2](https://nextjs.org/) (Turbopack, App Router, React 19)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL 15+ with Row-Level Security)
- **Authentication**: Supabase Auth (SSR Cookie-based session validation via `@supabase/ssr`)
- **Styling**: TailwindCSS & Radix UI primitives
- **Validation**: [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **AI SDK**: Google Generative AI (`@google/generative-ai` with `gemini-1.5-flash`)

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Vivek009-hub/LaunchSphere.git
cd LaunchSphere/city-launchpad
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

Required variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# Optional: Server-side Gemini AI key (manual workflows remain 100% operational without it)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run Quality Verification Suite
```bash
# Type check TypeScript
npm run type-check

# Run ESLint
npm run lint

# Run all 10 unit and integration test suites (174 tests)
npm test

# Production build
npm run build
```

### 4. Start Local Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📚 Project Documentation

- [docs/DEPLOYMENT.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/DEPLOYMENT.md): Step-by-step production deployment manual for Supabase & Vercel.
- [docs/RELEASE_CHECKLIST.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/RELEASE_CHECKLIST.md): Complete release audit with verified local and manual status checks.
- [docs/AI_INTEGRATION.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/AI_INTEGRATION.md): Architecture, safety controls, PII policies, rate limiting, and provider mocking.
- [docs/ARCHITECTURE.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/ARCHITECTURE.md): High-level system architecture and data flow diagrams.
- [docs/DATABASE_DESIGN.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/DATABASE_DESIGN.md): PostgreSQL schema, RLS policies, indexes, and entity relationships.
- [docs/MARKET_PROOF_LOOP.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/MARKET_PROOF_LOOP.md): Comprehensive classification rules and proof loop mechanics.
- [docs/SECURITY.md](file:///d:/Downloads/CITY%20Launch%20pad/LaunchSphere/city-launchpad/docs/SECURITY.md): Row-level security model, tenant isolation, and credential handling.

---

## 🔒 Security & Privacy

- All user-specific tables enforce PostgreSQL **Row Level Security (RLS)** with `auth.uid() = user_id`.
- Server Actions independently verify authenticated sessions and resource ownership.
- All external inputs to the AI model pass through PII redaction (removing phone numbers and emails) and are wrapped in `<UNTRUSTED_*_DATA>` XML boundary tags.
- Deterministic scoring, thresholds, and evidence metrics are calculated entirely in application code and can never be overridden by AI outputs.

---

## 📄 License

Private / Proprietary. Developed for City Launchpad.
