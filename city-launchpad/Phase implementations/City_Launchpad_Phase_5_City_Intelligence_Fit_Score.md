# City Launchpad — Phase 5: City Intelligence & Fit Score

## Objective

Build the first core intelligence module for City Launchpad: a transparent city-comparison workflow that helps a founder assess whether a target city may be suitable for their startup.

At the end of this phase, an authenticated founder should be able to select supported cities, compare sourced market indicators and competitors, understand how a deterministic Fit Score is calculated, inspect the evidence behind the score, and see where data is missing or outdated.

**Scope boundary:** Do not implement Local Connect workflows, market-validation experiments, Market Proof integration or AI-powered research in this phase. Prepare the assessment and evidence model so later phases can connect to it cleanly.

## Prerequisites

- Phases 1–4 are complete and reviewed.
- Authentication, database access and startup profiles work.
- The development database contains supported city records.
- The approved schema includes or can safely support market indicators, competitors, data sources and market assessments.
- The startup profile can be retrieved for the authenticated founder.

If the existing schema differs from this prompt, inspect it first and make the smallest documented migration needed. Do not disable Row Level Security or replace existing database structures blindly.

---

# Product principles

1. **Evidence before confidence.** Show sources, dates, units, geography and limitations.
2. **Explainability.** Users must be able to understand why a city scored as it did.
3. **No fabricated facts.** Do not invent statistics, competitor prices, source URLs or claims of verification.
4. **Separate score from coverage.** A city may appear attractive but have weak evidence, or have strong evidence suggesting it is a poor fit.
5. **Product-specific comparisons.** City fit depends on the startup's customer, pricing and distribution model, not population alone.
6. **Honest demo data.** Simulated data must be visibly labelled and must not be represented as verified research.
7. **Repeatable calculations.** Given the same inputs, scoring logic must produce the same result.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer and data-product engineer working on City Launchpad.

Implement Phase 5 only: City Intelligence & Fit Score.

## 1. Inspect the existing project first

Before editing:
- Inspect the repository, routes, Supabase schema, migrations, database types and startup-profile implementation.
- Read the architecture, database design, security and setup documents where available.
- Identify the existing tables and relationships for cities, sources, market indicators, competitors and assessments.
- Preserve working authentication, onboarding, UI components and configuration.
- Do not recreate the project or overwrite files blindly.

If the schema does not support this feature, propose the smallest compatible migration, explain it and implement it using the project's migration workflow.

## 2. Core user journey

Implement this end-to-end flow:

1. An authenticated founder opens City Intelligence.
2. The application loads the founder's saved startup profile.
3. The founder chooses two supported expansion cities from the database.
4. The application retrieves comparable market indicators, competitor records and source metadata.
5. The application calculates a transparent Fit Score using deterministic application code.
6. The UI shows a side-by-side comparison, criteria breakdown, evidence coverage and limitations.
7. The founder can inspect source details and save an assessment.
8. The founder can revisit a previously saved assessment and see when it was calculated and which scoring version was used.

If no startup profile exists, show a clear action to complete onboarding. If no cities or indicators are available, show a useful empty state instead of fabricated results.

## 3. Data model and provenance

Use the approved schema and extend it only as necessary.

A market indicator should include, where applicable:
- City or geographic area.
- Indicator category.
- Numeric value or a clearly typed qualitative value.
- Unit.
- Time period or reference date.
- Source reference.
- Collection date.
- Geographic scope.
- Notes about methodology or limitations.
- Whether the record is verified, estimated or simulated.

A competitor record should include, where available:
- Name and category.
- City or service geography.
- Product or offering.
- Observed price and currency/unit.
- Source URL.
- Date observed.
- Notes about comparability and limitations.

A source record should preserve:
- Publisher or organization.
- Source URL.
- Source type.
- Publication date when available.
- Collection date.
- Relevant notes.

Requirements:
- Keep important filterable values in relational columns.
- Preserve source provenance for every factual indicator or competitor price where available.
- Never invent a source URL, source date or verification status.
- Clearly label demonstration records.
- Treat data from different periods, geographic scopes or units carefully; do not compare incompatible values as if they were equivalent.
- Handle missing, stale or conflicting data explicitly.

If the prototype has no trustworthy dataset for a criterion, show it as unavailable or use clearly labelled simulated data. Do not present an invented number as a real Indian market statistic.

## 4. City selection and comparison

Build a responsive comparison interface that:
- Uses the authenticated founder's saved startup profile.
- Allows selecting two supported cities from the database.
- Displays the selected city names and the profile context used for the comparison.
- Shows comparable criteria side by side.
- Includes source details, units, reference dates and relevant notes.
- Clearly indicates when a criterion is unavailable for one or both cities.
- Offers a way to switch cities without losing unrelated profile data.
- Supports loading, empty, error and success states.

Do not hardcode city choices into the UI if the `cities` table already provides them.

## 5. Fit Score design

Implement a deterministic, tested weighted scoring model.

Use a documented structure such as:

Fit Score = sum(weight_i * normalized_score_i) / sum(weight_i for eligible criteria)

where each criterion score is normalized to the documented range and weights are configurable for the relevant industry or business model.

For an initial illustrative D2C example, criteria might include:
- Demand fit.
- Competitive opportunity.
- Distribution feasibility.
- Entry cost or unit economics.
- Operational feasibility.

These are example criteria, not validated universal weights. Document the chosen default criteria and weights, why they are used, and how they can be changed. Avoid presenting them as scientifically validated.

Important scoring rules:
- Keep the scoring algorithm in tested TypeScript or another deterministic application layer, not in an LLM prompt.
- Validate weight configuration and define how weights are normalized.
- Define how raw indicators are mapped to criterion scores.
- Avoid arbitrary score mappings with no documented rationale.
- Make scoring criteria appropriate to the available data and startup profile.
- Do not assume higher raw values are always better; for example, greater competition or higher entry costs may have different interpretations.
- Do not silently treat missing indicators as zero, average, or positive evidence.
- If missing criteria are excluded from the calculation, show which criteria were excluded and the weight coverage used.
- If evidence is insufficient for a meaningful comparison, show “Insufficient data” instead of an authoritative-looking score.
- Store the scoring-model version and the inputs or criterion breakdown used for a saved assessment.
- Ensure the same inputs and scoring version produce the same output.

## 6. Evidence coverage

Display evidence coverage separately from the Fit Score.

The evidence-coverage calculation must be documented and deterministic. It may consider the availability, recency and provenance of relevant indicators, but do not make up a universal confidence percentage.

Show:
- Which criteria have supporting data.
- Which criteria lack data.
- Which sources are old or geographically mismatched.
- Which records are estimates or simulated.
- Any limitations that materially affect the comparison.

Do not label evidence coverage as statistical confidence or probability of startup success.

## 7. UI and visualization

Use the existing City Launchpad design system.

Build:
- A city selector and comparison header.
- A side-by-side comparison table.
- A clear Fit Score display for each city.
- A breakdown of each criterion and its contribution.
- A separate evidence-coverage panel.
- Competitor and pricing comparison where comparable data exists.
- Source-detail links or expandable source information.
- Helpful explanations of missing data and score limitations.
- A save-assessment action and a way to revisit saved assessments.

Use Recharts only where a chart adds useful information. Provide labels, units and context. Do not use a chart to imply data exists when it does not.

## 8. Saving and retrieving assessments

- Save assessments to Supabase for the authenticated founder and the relevant startup.
- Store selected city IDs, score breakdown, scoring-model version, evidence coverage and assessment timestamp.
- Store sufficient information to understand how the result was calculated at that time.
- Preserve historical assessments; do not silently overwrite a previous assessment when the inputs change.
- Ensure users can access only assessments associated with startups they are authorized to access.
- Validate all submitted IDs and values on the server.
- Enforce authorization through the existing RLS policies and server-side checks.
- Do not display a success state until the save operation succeeds.

If schema changes are required, create a version-controlled migration and update database types.

## 9. Tests

Add unit tests for:
- Weight normalization and invalid weights.
- Raw-indicator-to-score transformations.
- Directionality of each criterion.
- Missing-data behavior.
- Evidence coverage.
- Minimum evidence requirements.
- Reproducibility of scores.
- Scoring-model version handling.

Add integration or manual verification for:
- Loading the saved startup profile.
- Loading supported cities and indicators.
- Comparing two cities.
- Saving and reopening an assessment.
- Handling missing or stale data.
- Preventing unauthorized assessment access.

Run the available lint, TypeScript, test and production-build commands. Report the actual results. If live database credentials are unavailable, distinguish mocked tests from live integration tests.

## 10. Documentation

Create or update `docs/CITY_INTELLIGENCE.md` with:
- Data sources and provenance rules.
- Criterion definitions.
- Weight defaults and rationale.
- Score-normalization rules.
- Missing-data behavior.
- Evidence-coverage method.
- Scoring-model versioning.
- Known limitations and assumptions.
- How to add new city indicators without fabricating data.

## 11. Final report and stop condition

At the end, report:
1. City comparison behavior implemented.
2. Scoring criteria, weights and normalization rules.
3. How missing and stale data are handled.
4. Data tables or migrations changed.
5. Files created or modified.
6. Tests and commands actually run, with results.
7. Manual setup or data-entry steps still required.
8. Known limitations.

Stop after Phase 5. Do not automatically proceed to Phase 6.
```

---

# Phase 5 Acceptance Checklist

## City comparison
- [ ] Founder can select two supported cities.
- [ ] Comparison uses the saved startup profile.
- [ ] Indicators and competitor data come from the database.
- [ ] Units, dates and geographic scope are visible.
- [ ] Missing or incompatible data is handled explicitly.

## Fit Score
- [ ] Scoring logic is deterministic and tested.
- [ ] Criteria, weights and normalization are documented.
- [ ] Score contributions can be inspected.
- [ ] Missing data is not silently treated as a zero or positive score.
- [ ] Insufficient evidence can produce an “Insufficient data” state.
- [ ] Evidence coverage is separate from market attractiveness.
- [ ] Scoring-model version is stored with saved assessments.

## Data quality and security
- [ ] Source provenance is displayed.
- [ ] Simulated records are labelled.
- [ ] No invented statistics or citations are presented as real.
- [ ] Assessments persist and can be revisited.
- [ ] Historical assessments are preserved.
- [ ] Authorization and RLS protect saved assessments.

## Quality
- [ ] Scoring and missing-data tests pass.
- [ ] Lint, type checks and build results are reported honestly.
- [ ] `docs/CITY_INTELLIGENCE.md` exists.
- [ ] Claude stops before implementing Phase 6.

---

# How to Verify Phase 5 Yourself

1. Sign in and confirm your startup profile is available.
2. Open City Intelligence and select two supported cities.
3. Inspect the underlying source and date for every displayed market indicator.
4. Change cities and verify that the comparison updates.
5. Check that missing indicators do not silently become zero or a favorable score.
6. Inspect the criteria, weights and score calculation.
7. Save the assessment, refresh the page and reopen it.
8. Verify that the saved assessment shows the scoring-model version and original breakdown.
9. Test a city with sparse data and confirm the UI communicates the limitation.
10. Commit the verified implementation before starting Phase 6.

**Important:** The Fit Score is a structured decision aid, not a guarantee of market success. A defensible score with transparent limitations is better than a precise-looking number built from unsupported data.
