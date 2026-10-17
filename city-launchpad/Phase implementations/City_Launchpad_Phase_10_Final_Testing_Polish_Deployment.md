# City Launchpad — Phase 10: Final Testing, Polish & Deployment

## Purpose

Prepare City Launchpad for a reliable, professional demonstration and deployment. Audit and test the complete product built in Phases 1–9, fix real defects, improve the most important usability issues, verify security and data integrity, and document a repeatable deployment process.

**Product one-liner:** City Launchpad is an AI-assisted platform that helps Indian startups expand into new cities by identifying promising markets, connecting them with relevant local businesses, and validating real customer demand.

**Tagline:** From local market intelligence to real-world proof.

This is the final phase of the planned build. Preserve the existing architecture and working features. Do not perform a wholesale rewrite or add unrelated features. The goal is a stable, coherent product that can be demonstrated honestly and deployed safely.

---

## Copy-paste prompt for Claude

You are a senior full-stack engineer and QA lead working inside the existing **City Launchpad** codebase. Implement **Phase 10 only: Final Testing, UI Polish & Deployment Readiness**.

### 1. Inspect before changing anything

Before making changes:

1. Inspect the full repository structure and read the project README, architecture documentation, environment-variable examples, migrations, and `docs/AI_INTEGRATION.md`.
2. Review the implemented features from Phases 1–9: authentication, startup onboarding, City Intelligence & Fit Score, Local Connect, Local Market Validation, Market Proof Loop, AI assistance, source provenance, and security controls.
3. Inspect the package scripts and installed tool versions. Identify the actual lint, typecheck, test, and build commands. Do not assume a command exists.
4. Identify existing failing tests, TODOs, broken routes, unsafe shortcuts, incomplete flows, and misleading demo data.
5. Create a concise QA and deployment plan, grouped by severity, before editing.
6. Preserve existing conventions and architecture. Do not replace the stack, redesign every screen, or introduce microservices.

Do not claim a feature is complete based only on the presence of a page or component. Trace critical user journeys through validation, server-side authorization, database persistence, and user-visible outcomes.

### 2. Product scope and non-negotiable behavior

The finished application must retain exactly these three core product features:

1. **City Intelligence & Fit Score** — compare cities using transparent, deterministic scoring based on available evidence.
2. **Local Connect** — discover relevant local businesses, retailers, distributors, suppliers, service providers, and mentors using available records; show clear verification status and track introduction requests.
3. **Local Market Validation** — manage hypotheses and experiments, record results, and compare observations with preconfigured thresholds.

The **Market Proof Loop** is the integration layer connecting assumptions, city assessments, local connections, experiments, and recorded evidence.

AI is an assistant, not an authority:
- It may summarize authorized, retrieved sources and propose drafts.
- It must not invent market facts, contacts, source URLs, verification states, or results.
- It must not calculate or override deterministic City Fit Scores, experiment metrics, or evidence-state classifications.
- Source references must map to actual authorized records.
- If AI is not configured, manual workflows must remain usable and the application must clearly communicate that AI is unavailable.

Never claim that the product has live market coverage, verified contacts, real customer demand, or live AI unless the code and configured services genuinely support those claims. Mark simulated/demo data clearly.

### 3. Run a full quality baseline

Run the available commands for:
- Linting.
- Type checking.
- Unit tests.
- Integration tests.
- End-to-end tests, if the repository already supports them.
- Production build.

Record baseline failures before editing. Distinguish pre-existing failures from failures introduced during this phase. Fix issues within scope, then rerun relevant checks.

If external services or credentials are missing, do not fabricate a successful test. Use mocks for automated tests where appropriate and document which live checks could not be completed.

### 4. Verify critical end-to-end journeys

Test and repair these flows across UI, server-side logic, and database behavior.

#### Journey A — New user and authentication
- A new user can sign up using the configured auth flow.
- Invalid inputs and duplicate accounts receive safe, understandable feedback.
- Sign-in and sign-out work.
- Protected routes reject unauthenticated users.
- Sessions behave correctly on refresh and direct navigation.
- Error messages do not reveal secrets or unnecessary account information.

#### Journey B — Startup onboarding
- A user can create and edit their startup profile.
- Required fields and enum values are validated server-side.
- Data persists after refresh and a new session.
- The user can access only their own startup data.
- Empty, incomplete, and validation-error states are clear.

#### Journey C — City Intelligence & Fit Score
- Users can select and compare available cities.
- Scoring uses the existing deterministic scoring implementation.
- Criteria, weights, missing values, and evidence coverage are represented accurately.
- Missing or stale inputs do not silently become fabricated values.
- Historical assessments and scoring versions remain intact.
- UI labels distinguish market attractiveness from confidence/evidence coverage.
- Scores do not change unpredictably between identical inputs.

#### Journey D — Local Connect
- Search and filters use existing database records and supported fields.
- Match explanations correspond to actual matching criteria.
- Verification status is visible and truthful.
- Introduction requests persist and display accurate statuses.
- A request is not presented as accepted or answered unless the application has actual evidence of that event.
- Contact details and private records are protected by authorization rules.

#### Journey E — Local Market Validation
- Users can create and edit hypotheses and experiments.
- Experiment types and thresholds are validated.
- Recorded results persist and can be reviewed.
- Sample size, missing observations, and limitations remain visible.
- Threshold changes do not erase historical context.
- Interest, intent, sign-ups, pilot usage, and purchases are not treated as interchangeable evidence.

#### Journey F — Market Proof Loop
- The UI traces a city assessment to its source records and related hypotheses/experiments where relationships exist.
- Evidence states come from the existing deterministic domain logic.
- The application distinguishes untested, insufficient evidence, supported, challenged, mixed, and inconclusive states wherever implemented.
- A connection request alone is not treated as proof of demand.
- Contradictory evidence and evidence gaps remain visible.
- Next-step suggestions do not claim to be verified outcomes.

#### Journey G — AI assistance
- AI endpoints enforce authentication, record ownership, input validation, and rate limits.
- API keys remain server-side.
- Invalid model output and fabricated source IDs are rejected safely.
- Missing credentials, provider errors, timeouts, and rate limits produce useful messages.
- AI-generated drafts require user review before saving or applying.
- The AI cannot override deterministic scores, metrics, or evidence states.
- No mock response is labelled as a real provider result.

### 5. Security and privacy audit

Inspect the application for security defects and fix confirmed issues.

At minimum, verify:
- Supabase Row Level Security is enabled for user-owned data and policies correctly scope reads, inserts, updates, and deletes.
- Server actions and route handlers independently enforce authorization; do not rely on hiding UI controls.
- Queries joining records from different tables cannot expose another user's data through a related-record ID.
- Service-role credentials are used only on the server and never exposed to the client.
- `.env` files containing secrets are not committed. `.env.example` contains placeholders only.
- Inputs are validated server-side and outputs are safely rendered.
- No user-provided text is executed as code or inserted unsafely into HTML/SQL.
- AI prompts and logs do not unnecessarily expose personal information, credentials, or private contact details.
- Error responses and logs do not leak stack traces, tokens, or environment variables.
- Rate limiting and input-size controls protect expensive AI routes.
- Dependency audit results are reviewed using the package manager's supported tooling. Do not automatically upgrade major versions without compatibility review.

Do not claim that a security audit proves the application is completely secure. Document the scope and any remaining limitations.

### 6. Database and data integrity

- Review migrations for consistency, ordering, and reproducibility.
- Verify a clean database can be set up using the documented migration and seed process.
- Check foreign keys, required fields, enum constraints, unique constraints, and indexes used by important queries.
- Ensure seed data is clearly labelled as demo/simulated and cannot be confused with verified production evidence.
- Confirm that deletion or editing of a parent record does not leave misleading orphaned evidence.
- Preserve historical city assessments, experiment results, and source provenance where required by the current product model.
- Do not delete real user data or reset a production database as part of testing.
- Avoid destructive migrations. If a migration is necessary, make it backward-compatible where practical and document its rollout.

### 7. UI polish and accessibility

Polish the existing design instead of replacing it.

Focus on:
- Consistent spacing, typography, button styles, form fields, cards, tables, badges, and navigation.
- Responsive behavior on desktop, tablet, and mobile widths.
- Clear page titles and next actions.
- Useful empty states, loading states, success messages, and recoverable error states.
- Clear distinction between verified, estimated, stale, unknown, and simulated information where supported.
- Readable chart labels, units, legends, and accessible summaries.
- Accessible form labels, keyboard navigation, focus indicators, dialog behavior, and meaningful button names.
- Sufficient contrast and no reliance on color alone to communicate status.
- No horizontal overflow, clipped dialogs, overlapping navigation, or unreadable dense tables.
- Removal of dead links, placeholder buttons, unfinished copy, console errors, and unused UI elements.

Do not add decorative features that distract from the three core features. Keep the product demo-friendly and straightforward.

### 8. Performance and resilience

- Inspect unnecessary repeated database requests and obvious expensive client renders.
- Paginate or limit large result sets where appropriate.
- Avoid fetching all records when a filtered query is sufficient.
- Ensure charts and client components receive only the data they need.
- Handle network failures and slow service responses without losing user-entered work.
- Add or refine useful loading feedback without fake progress.
- Confirm key pages work with empty or moderately large datasets.
- Do not introduce caching that can leak one user's private data to another user.
- Do not add a performance optimization without a clear reason or a way to verify its effect.

### 9. Automated test strategy

Use the repository's current test framework. Add or improve tests around important domain logic and regression risks.

Include, as applicable:
- Unit tests for deterministic City Fit Score calculations, missing-data behavior, and scoring edge cases.
- Unit tests for experiment metrics and evidence-state classification.
- Validation tests for forms, API payloads, enums, and AI structured output.
- Authorization/RLS tests or documented manual checks for cross-user access.
- Tests that fabricated/unauthorized source IDs are rejected.
- Tests that AI cannot override deterministic calculations.
- Integration tests for important database-backed workflows.
- End-to-end tests for sign-up/sign-in, onboarding, city comparison, creating an experiment, recording results, and viewing the Market Proof Loop, if E2E infrastructure is available.
- Regression tests for defects discovered during the audit.

Tests should be deterministic, use isolated test data, and avoid real AI API calls or unnecessary external network calls. Mock external providers in automated tests. Do not remove or weaken tests merely to obtain a passing result.

### 10. Demo and production configuration

Create or update `docs/DEPLOYMENT.md` with an explicit, repeatable process for the project's actual stack.

Document:
- Required Node.js and package-manager versions, based on the repository.
- Installing dependencies and running locally.
- Required server/client environment variables and which are server-only.
- Creating/configuring the Supabase project and applying migrations.
- Configuring Supabase authentication redirect URLs and allowed production origins.
- Applying seed data safely in local/demo environments only.
- Configuring the AI provider key securely, and how to run with AI disabled.
- Running lint, typecheck, tests, and production build.
- Deploying the Next.js application to the chosen supported platform (use Vercel if it matches the existing setup).
- Setting environment variables separately for preview and production.
- Running migrations safely before or during deployment.
- Configuring production URL, authentication callbacks, and any relevant CORS/origin restrictions.
- Smoke-testing the deployed app.
- Rolling back an application deployment and handling a failed migration safely.
- Known limitations and services that require external credentials.

Do not deploy to a real account, create paid resources, change DNS, or perform irreversible actions without explicit authorization. Prepare the code and instructions; report any manual dashboard steps the user must perform.

### 11. Production readiness checklist in the repository

Create `docs/RELEASE_CHECKLIST.md` containing actionable items grouped by:
- Code quality.
- Authentication and authorization.
- Database and migrations.
- AI configuration and privacy.
- Data provenance and demo-data labelling.
- Responsive UI and accessibility.
- Tests and production build.
- Environment configuration.
- Deployment and post-deployment smoke tests.
- Known limitations and release decision.

The checklist must distinguish:
- **Verified in local automated checks**
- **Verified manually**
- **Requires production credentials or dashboard access**
- **Not verified / known limitation**

Do not mark a checklist item complete unless there is evidence it was actually checked.

### 12. Required final verification

After fixes and polish:
1. Run the available lint command.
2. Run the available typecheck command.
3. Run all relevant unit and integration tests.
4. Run end-to-end tests if configured.
5. Run the production build.
6. Review the final diff for accidental changes, debug code, hard-coded secrets, unrelated refactors, and misleading claims.
7. Recheck all seven critical journeys above, using automated tests and manual verification as appropriate.
8. If the environment supports a local server, run a final smoke test of the primary routes.
9. Record exact commands and outcomes. Clearly state checks that could not be run and why.

Do not claim that deployment succeeded unless the application was actually deployed and checked. Do not claim a test passed unless it ran and passed.

### 13. Required completion report

At the end, return:

1. **Summary:** what was fixed and polished.
2. **Files changed:** group important files by purpose.
3. **Quality checks:** exact commands and actual pass/fail outcomes.
4. **Security findings:** confirmed issues fixed and remaining risks.
5. **Deployment status:** ready to deploy, deployed and smoke-tested, or blocked; explain which applies.
6. **Manual steps:** required environment variables, Supabase dashboard configuration, and any other user action.
7. **Known limitations:** incomplete tests, unavailable services, or deferred fixes.
8. **Release recommendation:** whether the current state is suitable for a hackathon demo, private preview, or production use, and why.

### 14. Acceptance checklist

- [ ] Phases 1–9 remain intact; no wholesale rewrite.
- [ ] The three core features and Market Proof Loop work end to end to the extent supported by the configured environment.
- [ ] Critical user journeys are tested or have explicit, documented manual verification steps.
- [ ] Confirmed authentication, authorization, and data-isolation defects are fixed.
- [ ] Database migrations and seed instructions are reproducible and safe.
- [ ] Deterministic city scoring, experiment metrics, and evidence-state logic are covered by tests.
- [ ] AI outputs are validated, source-grounded, and unable to override deterministic business logic.
- [ ] AI secrets are server-only and AI can be disabled cleanly.
- [ ] Demo data is clearly labelled and not presented as verified market evidence.
- [ ] Responsive UI, accessible controls, empty states, loading states, and error states are reviewed.
- [ ] Dead buttons, broken links, avoidable console errors, and misleading UI claims are removed or documented.
- [ ] `docs/DEPLOYMENT.md` is complete.
- [ ] `docs/RELEASE_CHECKLIST.md` is complete and reflects actual verification.
- [ ] Lint, typecheck, tests, and production build have been run where available and their real results reported.
- [ ] No secrets, unnecessary personal data, or debug artifacts are committed.
- [ ] No deployment, paid-resource creation, DNS change, or irreversible external action occurred without authorization.

### 15. Manual verification checklist

Use this checklist after Claude finishes. Check each item only after completing it.

1. **Fresh setup:** Follow `docs/DEPLOYMENT.md` in a clean local environment and confirm the documented setup works.
2. **Authentication:** Sign up, sign in, refresh a protected route, and sign out.
3. **Profile persistence:** Create and edit a startup profile; confirm values persist after refresh.
4. **City comparison:** Compare at least two available cities; inspect score criteria, source links, missing-data handling, and assessment history.
5. **Local Connect:** Search/filter resources, inspect verification labels, and create an introduction request. Confirm statuses are truthful.
6. **Validation experiment:** Create a hypothesis and experiment, record observations, and verify the resulting metrics/status.
7. **Market Proof Loop:** Confirm evidence links to the correct records and that gaps or conflicting evidence are visible.
8. **AI enabled:** If a provider key is configured, run a grounded summary and verify every citation resolves to a real source.
9. **AI disabled:** Remove the provider key in a safe local test environment and confirm the rest of the application remains usable.
10. **Authorization:** Use two separate test accounts. Attempt to access the other account's records through direct navigation and modified record IDs; access must be denied.
11. **Responsive layout:** Check the key journeys at desktop, tablet, and mobile widths.
12. **Failure states:** Test validation errors, empty results, a failed network request, and a mocked AI provider failure.
13. **Production build:** Run the documented production build and resolve or document any failure.
14. **Deployment smoke test:** After an authorized deployment, check the production URL, authentication callback, primary routes, database access, and AI configuration without using real customer data.

### Final instruction

Implement Phase 10 only. Audit before editing, fix real defects, polish the existing product, document the release process, run all available checks, and report actual results honestly. Preserve Phases 1–9. Do not fabricate test results, data, citations, or deployment success. Do not perform external or irreversible deployment actions without explicit authorization.
