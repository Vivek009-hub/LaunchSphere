# City Launchpad — Phase 8: Market Proof Loop

## Objective

Build **Market Proof Loop**, City Launchpad's signature differentiator. It connects evidence from City Intelligence, Local Connect and Local Market Validation so founders can see which expansion assumptions are supported, challenged or still untested.

At the end of this phase, a founder should be able to open one target-city proof view, inspect the assumptions behind a market assessment, see relevant local contacts and introduction-request outcomes, connect experiments to those assumptions, and review recorded evidence with clear limitations.

**Scope boundary:** Do not add LLM-based summaries or AI interpretation in this phase. Those belong in Phase 9. Build evidence relationships, status classification and summaries using deterministic, documented application logic.

## Prerequisites

- Phases 1–7 are implemented and reviewed.
- City Intelligence can save assessments with criteria breakdowns and source references.
- Local Connect can save local resources and introduction requests.
- Local Market Validation can save hypotheses, experiments and experiment results.
- Supabase authentication, database migrations and Row Level Security work.

If these modules store information in incompatible shapes, inspect the current schema and implement the smallest safe migrations needed to connect them. Do not rebuild working features or disable RLS.

---

# Product principles

1. **Traceable conclusions.** Every evidence status must link to the source, contact activity or experiment result behind it.
2. **No fabricated proof.** A submitted request is not a successful introduction; an interview is not a purchase; an empty result is not validation.
3. **Distinguish evidence types.** Desk research, reported feedback, observed behavior and actual transactions are not equivalent.
4. **Keep uncertainty visible.** Small samples, stale sources, missing data and conflicting results must be displayed.
5. **Preserve history.** Keep prior assessments, experiment outcomes and important status changes.
6. **Deterministic classification.** Use documented application rules, not an LLM, to classify evidence in this phase.
7. **Decision support, not guarantees.** The Market Proof view should help founders choose the next test; it must not promise market success.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer and evidence-workflow designer working on City Launchpad.

Implement Phase 8 only: Market Proof Loop.

## 1. Inspect the existing project first

Before editing:
- Inspect the repository, current database schema, migrations, TypeScript database types, routes, components and relevant business logic.
- Read the architecture, security, City Intelligence, Local Connect and Market Validation documentation.
- Identify how market assessments, criterion scores, sources, hypotheses, connection requests, experiments and results are currently represented.
- Preserve all working functionality from Phases 1–7.
- Do not recreate the project, overwrite files blindly or disable Row Level Security.

If the current schema cannot link the existing records, propose the smallest compatible migration, explain it and implement it through the existing migration workflow.

## 2. Purpose and core workflow

The Market Proof Loop connects three stages:

1. City Intelligence: identify a potential opportunity and the assumptions behind it.
2. Local Connect: find relevant contacts and record actual introduction-request outcomes.
3. Local Market Validation: run experiments and record evidence about the assumptions.

Build a unified Market Proof page for a selected startup and target city.

The founder should be able to:
- Select a saved city assessment.
- Inspect the assumptions or criteria behind that assessment.
- See related local resources and connection-request statuses.
- Associate hypotheses with relevant assessments or criteria.
- Associate experiments and results with those hypotheses.
- Review supporting, challenging or insufficient evidence for each hypothesis.
- See what remains unknown and which next test may reduce uncertainty.

Do not create a separate fourth core feature. Market Proof is the integration layer for the existing three modules.

## 3. Data relationships

Inspect the current schema and use existing relationships wherever possible.

Ensure the data model can connect:
- Startup.
- Target city.
- Saved market assessment and its scoring-model version.
- Assessment criteria, score breakdown and sources.
- Market hypothesis.
- Local resource.
- Connection request and its actual status.
- Experiment and its hypothesis.
- Experiment results and evidence references.

A hypothesis may be associated with an assessment, one or more criteria, or a relevant market assumption. Use a normalized relation table where many-to-many relationships are needed.

Requirements:
- Avoid duplicating the same source or result in multiple unrelated records.
- Use foreign keys and constraints where appropriate.
- Preserve the history of assessments and results.
- Track timestamps and ownership.
- Make evidence provenance explicit.
- Add a version-controlled SQL migration only if needed.
- Update generated or maintained TypeScript database types after schema changes.

Do not delete or rewrite existing data as a shortcut to the new relationships.

## 4. Hypothesis lifecycle and evidence classification

Build a documented, deterministic classification model for each hypothesis.

Use understandable states such as:
- `untested` — no relevant evidence has been recorded.
- `insufficient_evidence` — some evidence exists, but it does not meet the minimum requirements for interpretation.
- `supported` — available evidence meets predefined criteria in favor of the hypothesis.
- `challenged` — available evidence meets predefined criteria against the hypothesis.
- `mixed` — credible evidence points in different directions.
- `inconclusive` — evidence has been collected, but no defensible conclusion can be made.

Adapt the exact names to the existing model if necessary, but document their meaning.

Classification rules must:
- Be implemented in tested application code.
- Consider the hypothesis's defined success criteria and the relevant experiment results.
- Require sufficient data before assigning `supported` or `challenged`.
- Preserve contradictory evidence rather than hiding it.
- Treat missing data as unknown, not negative evidence.
- Avoid treating an introduction request as proof of demand.
- Avoid treating a response or stated interest as equivalent to an actual purchase.
- Avoid declaring the entire city or business model validated because one hypothesis was supported.
- Keep manual status overrides, if supported, explicitly labelled with a reason and timestamp.

Do not use an LLM to assign evidence status in this phase.

## 5. Evidence types and quality

Show the type of each evidence item, such as:
- Published or official market research.
- Public competitor or price observation.
- Founder-entered observation.
- Customer interview feedback.
- Survey response.
- Retailer or distributor response.
- Qualified lead.
- Landing-page signup.
- Paid order or pilot.
- Repeat purchase.

Show relevant evidence metadata:
- Source or evidence reference.
- Collection or observation date.
- Sample size and denominator, when applicable.
- Collection method.
- Geographic scope.
- Whether it is verified, estimated or simulated.
- Known limitations.

Do not invent a universal statistical confidence score. If you show an evidence-quality label, define it using explicit rules and explain that it is a data-quality indicator, not a probability of success.

Keep the following distinct:
- Evidence availability.
- Evidence quality or coverage.
- Direction of evidence.
- Overall business or market attractiveness.

## 6. Local Connect integration

For each hypothesis, show relevant Local Connect activity:
- Matching resources where relevant.
- Introduction requests associated with the hypothesis or experiment.
- The actual persisted request status.
- Request dates and any recorded responses.
- Whether a request is pending, accepted, declined, cancelled or completed, according to the existing lifecycle.

Do not infer that a contact has been reached simply because it appears in search results.
Do not infer that a request was accepted or an introduction completed unless the database records that status.
Do not treat a successful introduction as proof that customers will purchase.

If the current Local Connect schema cannot associate requests with a hypothesis or experiment, add the smallest safe relationship required.

## 7. City Intelligence integration

Show the assessment that motivated the hypothesis:
- Target city and startup context.
- Fit Score and scoring-model version.
- Criterion-level breakdown.
- Source links and dates.
- Evidence gaps and limitations.
- Assessment timestamp.

Preserve the original assessment as a historical snapshot. Do not silently recalculate an old assessment using new weights or newly collected data and present it as the original result.

If a newer assessment exists, make it clear that it is a newer assessment rather than overwriting the historical one.

## 8. Market Validation integration

For each hypothesis, display related experiments:
- Experiment objective and method.
- Defined target audience.
- Predefined success threshold.
- Sample-size goal.
- Experiment status.
- Recorded results and metrics.
- Whether the threshold was met, not met, or could not be assessed.
- Evidence links, dates and limitations.

Use the actual saved experiment records. Do not generate placeholder outcomes that look real.

If an experiment's threshold changed, show the current threshold and preserve the history of the change where supported. Make it possible to inspect how the interpretation was reached.

## 9. Market Proof UI

Build a polished, responsive Market Proof page using the existing design system.

Suggested structure:

### A. Overview
- Startup and target city.
- Selected market assessment.
- A concise evidence summary.
- Counts of hypotheses by status.
- An explicit warning when the underlying dataset is sparse or simulated.

### B. Hypothesis evidence cards
Each card should show:
- Hypothesis statement.
- Current evidence status.
- Why that status was assigned.
- Related assessment criteria and source links.
- Relevant Local Connect activity.
- Related experiments and results.
- Sample size and key limitations.
- Last updated date.
- Suggested next step based on documented rules.

### C. Evidence timeline
Show key events in chronological order:
- Assessment created or refreshed.
- Introduction request created or updated.
- Experiment started or completed.
- Result recorded.
- Hypothesis classification changed.

Do not invent timestamps or imply that unrecorded events happened.

### D. Evidence gaps and next actions
Identify gaps such as:
- No direct customer evidence.
- Too few valid responses.
- No relevant local contact activity.
- Missing or outdated market sources.
- Conflicting results.
- No observed purchase behavior where purchase evidence is necessary for the hypothesis.

Provide practical next steps based on the actual gap. Label them as recommendations, not proven conclusions.

### E. Empty states
If no assessment, hypothesis, contact activity or experiment exists, show a clear next action linking to the appropriate existing module.

Do not create a fake fully populated dashboard just to make the page look complete.

## 10. Deterministic next-step suggestions

Add simple, documented rules for suggesting the next action.

Examples:
- If there is no direct customer feedback, suggest an interview or survey experiment.
- If outreach is pending, suggest reviewing the request status rather than claiming the contact responded.
- If a sample-size threshold is unmet, suggest collecting more valid observations.
- If results conflict, suggest a targeted follow-up experiment.
- If all evidence is simulated, state that real-world validation has not yet occurred.

These suggestions must be based on known records and deterministic rules. Do not use an LLM in this phase.

## 11. Security and ownership

- Derive access from the authenticated session.
- Verify ownership of the selected startup and all related records.
- Apply Row Level Security to any new relationship tables.
- Ensure a user cannot infer another user's private hypotheses, requests, experiments or results through joined queries.
- Keep private notes and evidence references private.
- Do not expose private contact details in the Market Proof page.
- Validate all submitted IDs on the server.
- Do not trust client-supplied ownership fields.
- Do not disable RLS.
- Do not expose service-role keys to the browser.

## 12. Tests

Add unit tests for:
- Each evidence classification state.
- Minimum evidence requirements.
- Missing and conflicting evidence.
- Threshold-met and threshold-not-met cases.
- Distinguishing reported interest from observed purchase behavior.
- Deterministic next-step suggestions.
- Historical assessment/version handling.

Add integration or manual verification for:
- A saved assessment linked to a hypothesis.
- A Local Connect request linked to the relevant hypothesis or experiment.
- An experiment result changing the hypothesis evidence view.
- A hypothesis remaining untested when no relevant evidence exists.
- Cross-user authorization for joined data.
- Empty states and sparse datasets.

Run available lint, TypeScript, test and production-build commands. Report actual results. If live database access is unavailable, distinguish mocked tests from live integration tests.

## 13. Documentation

Create or update `docs/MARKET_PROOF_LOOP.md` documenting:
- Data relationships.
- Evidence types and provenance.
- Hypothesis states and their definitions.
- Classification rules and minimum evidence requirements.
- Treatment of conflicting or missing evidence.
- Next-step recommendation rules.
- Historical assessment handling.
- Security and known limitations.

## 14. Final report and stop condition

At the end, report:
1. How the three modules are connected.
2. Hypothesis-to-assessment, contact and experiment relationships.
3. Evidence classification rules implemented.
4. How conflicting, missing and simulated evidence are handled.
5. Database migrations and files changed.
6. Tests and commands actually run, with results.
7. Manual setup steps and known limitations.
8. Whether the end-to-end Market Proof workflow was actually verified.

Stop after Phase 8. Do not automatically proceed to Phase 9.
```

---

# Phase 8 Acceptance Checklist

## Integration
- [ ] Market Proof uses actual records from City Intelligence.
- [ ] Hypotheses can be connected to relevant assessment criteria.
- [ ] Local Connect requests can be associated with relevant hypotheses or experiments.
- [ ] Experiments and results are connected to hypotheses.
- [ ] Historical assessments remain identifiable.

## Evidence interpretation
- [ ] Evidence statuses use documented deterministic rules.
- [ ] Minimum evidence requirements are enforced.
- [ ] Conflicting evidence is visible.
- [ ] Missing evidence is not treated as negative evidence.
- [ ] Interviews, interest, leads and purchases remain distinct.
- [ ] Simulated data is clearly labelled.
- [ ] Next-step suggestions reflect actual evidence gaps.

## UI and security
- [ ] Hypothesis cards show status rationale and evidence links.
- [ ] Evidence timeline reflects recorded events only.
- [ ] Empty and sparse-data states work.
- [ ] Private records are protected across joined queries.
- [ ] New RLS policies are tested or limitations are disclosed.
- [ ] Lint, TypeScript, tests and build results are reported honestly.
- [ ] `docs/MARKET_PROOF_LOOP.md` exists.
- [ ] Claude stops before implementing Phase 9.

---

# How to Verify Phase 8 Yourself

1. Open a saved City Intelligence assessment.
2. Create or select a hypothesis linked to one of its criteria.
3. Open Local Connect and associate a relevant introduction request if the workflow supports it.
4. Create or select a Market Validation experiment linked to the hypothesis.
5. Record a result and return to Market Proof.
6. Verify that the evidence card reflects the actual assessment, request status and experiment result.
7. Check that the classification explains why evidence supports, challenges or fails to resolve the hypothesis.
8. Test conflicting evidence and insufficient sample sizes.
9. Confirm the timeline contains only recorded events.
10. If possible, test with a second account to verify that private joined data remains inaccessible.
11. Review migrations, run checks and commit the verified phase.

**Important:** Market Proof should not be a dashboard that simply combines three numbers. Its value is the traceable chain from an initial assumption to local investigation and recorded real-world evidence.
