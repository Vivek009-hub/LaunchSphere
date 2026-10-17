# City Launchpad — Phase 1: Architecture and Repository Setup

## Objective

Establish a stable technical foundation for City Launchpad before implementing its product features.

**Do not build the entire application in this phase.** Inspect the repository, document the architecture, agree on the database model and security approach, and initialize or verify the project setup.

## Product context

City Launchpad is an AI-assisted platform that helps Indian startups:

1. **City Intelligence & Fit Score** — compare expansion cities using sourced market indicators, competitor information, pricing and distribution opportunities.
2. **Local Connect** — discover relevant local businesses and ecosystem contacts, and manage introduction requests.
3. **Local Market Validation** — create experiments, record feedback and measure real-world outcomes.

### Signature differentiator: Market Proof Loop

The Market Proof Loop connects all three modules. It links a city's initial assessment to relevant local contacts and recorded market experiments, then shows which assumptions are supported, challenged or still untested.

Every factual claim must be traceable to a source or recorded experiment. Never invent market statistics, businesses, citations, contact verification or experiment outcomes. Clearly label simulated demonstration data.

## Recommended technology stack

- Next.js App Router
- React
- TypeScript with strict mode
- Tailwind CSS
- shadcn/ui
- Supabase PostgreSQL
- Supabase Auth
- Zod for input validation
- Recharts for charts
- Optional Leaflet + OpenStreetMap for maps
- Optional LLM API for research synthesis and experiment assistance
- Vercel for deployment

Use Next.js route handlers and server-side functions for the initial backend. Do not add a separate Express server or microservices unless you identify a concrete requirement and explain the trade-off.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer and technical architect. We are building a hackathon-ready web application called City Launchpad.

This is Phase 1 only: Architecture and Repository Setup.

## 1. First inspect the repository

Before editing anything:
- Inspect the current folder structure, package.json, framework configuration, source files and existing scripts.
- Identify whether the repository is empty, partially implemented or already functional.
- Identify existing libraries and working features that must be preserved.
- Do not overwrite files blindly, delete existing work, or recreate the project unnecessarily.

If you do not have direct repository access, tell me exactly which files or command outputs you need. Do not pretend to have inspected files you cannot access.

## 2. Product requirements

City Launchpad has exactly three core modules:

### A. City Intelligence & Fit Score
- Compare supported cities for a startup's product and target customer.
- Display sourced market indicators, competitor information, price comparisons and relevant distribution opportunities.
- Calculate a transparent Fit Score using documented criteria and configurable weights.
- Show source URLs, source and collection dates, assumptions, evidence coverage and missing information.
- Keep market attractiveness separate from evidence completeness.
- Never present invented or simulated data as verified facts.

### B. Local Connect
- Discover relevant local retailers, distributors, suppliers, service providers, potential pilot customers, mentors and ecosystem institutions.
- Filter by city, industry, service category and capabilities.
- Explain why each result matches the founder's needs.
- Support introduction requests and status tracking.
- Show source and verification status for each listing.
- Protect private contact information and enforce authorization.

### C. Local Market Validation
- Let founders define hypotheses and validation experiments.
- Support interviews, surveys, retailer outreach, landing-page tests and pilot experiments.
- Record observations, metrics, sample sizes, methods, timestamps and evidence references.
- Compare recorded outcomes with predefined success thresholds.
- Distinguish reported interest from qualified leads, purchases and repeat purchases.
- Never invent results or declare a market validated without sufficient evidence.

### Market Proof Loop
Connect the initial city assessment, local contacts, hypotheses, experiments and results. The final view should show which assumptions are supported, challenged or still untested, with traceable evidence and limitations.

## 3. Technology decisions

Use this stack unless the repository or a concrete technical constraint requires a change:
- Next.js App Router
- React and TypeScript strict mode
- Tailwind CSS and shadcn/ui
- Supabase PostgreSQL and Supabase Auth
- Zod
- Recharts
- Optional Leaflet + OpenStreetMap
- Optional server-side LLM API integration
- Vercel deployment

Prefer one Next.js application with server-side route handlers over separate backend services. Avoid unnecessary architecture and dependencies.

If you recommend changing the stack, explain why and wait for my approval before making a major change.

## 4. Deliverables for this phase

### Deliverable A — Architecture document
Create or update `docs/ARCHITECTURE.md` with:
- Product boundaries and core user journey.
- Application architecture and request/data flow.
- Proposed folder structure.
- Page and route map.
- Reusable component strategy.
- Server-side versus client-side responsibilities.
- External services and integrations.
- Key technical decisions and trade-offs.

The planned main navigation is:
- Dashboard
- City Intelligence
- Local Connect
- Market Validation
- Market Proof
- Settings

### Deliverable B — Database design
Create or update `docs/DATABASE_DESIGN.md`.

Propose a normalized relational model that includes at least:
- `profiles` or user records
- `startups`
- `cities`
- `data_sources`
- `market_indicators`
- `competitors`
- `local_resources`
- `market_assessments`
- assessment criteria or score details
- `market_hypotheses`
- `connection_requests`
- `experiments`
- `experiment_results`

For each table, specify:
- Purpose
- Important columns and data types
- Primary key
- Foreign keys and relationships
- Ownership and visibility
- Important constraints and indexes

Ensure that each market data point can be traced to a source where applicable. Preserve historical assessments and experiment results rather than silently overwriting evidence.

Do not create every table immediately if a staged migration plan is more appropriate. Document the proposed model first.

### Deliverable C — Security plan
Create or update `docs/SECURITY.md` covering:
- Supabase Auth and protected routes.
- PostgreSQL Row Level Security (RLS).
- Ownership checks for startups, assessments, requests, experiments and results.
- Public versus private local-resource fields.
- Server-only secrets and environment variables.
- Input validation with Zod.
- Safe error handling and logging.
- Authorization checks for status updates.
- Data provenance and verification-status rules.

Do not claim security is complete merely because RLS is planned. Policies must be implemented and tested in a later phase.

### Deliverable D — Environment setup
Create or update `.env.example` with variable names and safe placeholders only.

Include only variables required by the chosen setup. Potential variables include:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or the publishable key appropriate to the installed Supabase setup
- `SUPABASE_SERVICE_ROLE_KEY` only if a documented server-side operation requires it
- A server-only LLM API key only if AI integration is planned

Never put real secrets in `.env.example`, source code, commits or client-side bundles. Explain which variables are required now and which are optional for later phases.

### Deliverable E — Project setup
If the repository is empty:
- Initialize the approved Next.js project.
- Configure TypeScript strict mode and the selected styling system.
- Add only essential dependencies.
- Add or verify useful scripts for development, linting, type checking and building.

If the repository already exists:
- Preserve working code and configuration.
- Make only necessary changes.
- Explain any configuration changes.

### Deliverable F — Implementation roadmap
Create or update `docs/IMPLEMENTATION_PLAN.md` describing the remaining phases:
1. UI foundation and dashboard.
2. Database and authentication.
3. Startup onboarding.
4. City Intelligence & Fit Score.
5. Local Connect.
6. Local Market Validation.
7. Market Proof Loop.
8. AI integration and data quality.
9. Testing, polish and deployment.

Keep this roadmap consistent with the existing project plan. Do not start implementing these features in Phase 1.

## 5. Engineering rules

- Use maintainable naming and modular design.
- Use TypeScript strict mode.
- Avoid unnecessary dependencies.
- Preserve working functionality.
- Never overwrite or delete files without inspecting them.
- Do not fabricate data or external-service results.
- Keep secrets out of version control.
- Do not build fake buttons or claim unimplemented features work.
- Do not add AI functionality yet.
- Do not implement the three feature modules yet.
- Do not generate large amounts of placeholder UI.
- Report commands and checks accurately. Never claim a command ran if it did not.

## 6. Verification

At the end of Phase 1:
- Verify the folder structure and important configuration files.
- Run available project checks if the project is initialized.
- Report which checks actually ran and their outcomes.
- List files created or modified.
- List required setup steps I must perform manually.
- List decisions or blockers that need my input.
- Give concise manual verification steps.

## 7. Stop condition

Stop after Phase 1 is complete. Do not automatically proceed to Phase 2.

Your final response must include:
1. What you inspected.
2. Architecture decisions made.
3. Files created or changed.
4. Commands and checks actually run.
5. Required environment setup.
6. Known limitations and unresolved decisions.
7. A clear statement of whether Phase 1 acceptance criteria are met.

Begin by inspecting the repository. Do not start by generating the entire application.
```

---

# Phase 1 Acceptance Checklist

- [ ] Claude inspected the existing repository before editing.
- [ ] `docs/ARCHITECTURE.md` exists and describes the system.
- [ ] `docs/DATABASE_DESIGN.md` describes tables, relationships, ownership and provenance.
- [ ] `docs/SECURITY.md` documents the intended security model.
- [ ] `.env.example` contains placeholders only, never real secrets.
- [ ] Project setup is initialized or existing setup is verified.
- [ ] `docs/IMPLEMENTATION_PLAN.md` documents the remaining phases.
- [ ] Relevant checks were actually run and their results reported.
- [ ] No feature modules were prematurely implemented.
- [ ] Claude stopped and waited for approval.

## What to do if Claude reports completion

Before moving on:
1. Read the architecture and database documents.
2. Check the repository diff to see what changed.
3. Confirm there are no secrets in the files or Git changes.
4. Run the documented setup and verification commands yourself if possible.
5. Fix any critical setup issues.
6. Commit the verified result to Git.

**Do not proceed to Phase 2 until the project foundation is understandable and stable.**
