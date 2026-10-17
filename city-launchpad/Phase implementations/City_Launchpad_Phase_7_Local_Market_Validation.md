# City Launchpad — Phase 7: Local Market Validation

## Objective

Build Local Market Validation, the feature that helps founders test assumptions about a target city and record evidence of real customer demand.

At the end of this phase, an authenticated founder should be able to define a market hypothesis, create a structured experiment, set a measurable success threshold, record observations and results, and compare the recorded outcome with the original threshold.

**Scope boundary:** Do not build the integrated Market Proof Loop yet; that is Phase 8. Do not add LLM-powered experiment generation yet; that belongs in Phase 9. Build a reliable, evidence-oriented workflow with deterministic calculations and real database persistence.

## Prerequisites

- Phases 1–6 are complete and reviewed.
- Authentication, startup profiles and Supabase persistence work.
- City Intelligence can save assessments.
- Local Connect can find resources and save introduction requests.
- The database includes or can safely support hypotheses, experiments and experiment results.
- Row Level Security and server-side ownership checks are enabled for private records.

If the existing schema differs from this prompt, inspect it first and create only the necessary version-controlled migration. Never disable RLS to make the feature work.

---

# Product principles

1. **Testable hypotheses.** Every hypothesis should be specific enough to investigate.
2. **Predefined success criteria.** Record the threshold before interpreting results, so founders cannot unknowingly move the goalposts.
3. **Evidence over opinions.** Distinguish reported interest, qualified leads, actual purchases and repeat purchases.
4. **Transparent samples.** Show sample sizes, methods and limitations.
5. **No fabricated outcomes.** Do not generate fake customer feedback or mark a market validated without evidence.
6. **Deterministic metrics.** Calculate metrics from recorded data using tested application code.
7. **Privacy.** Avoid collecting unnecessary personal information from interviewees or customers.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer working on City Launchpad.

Implement Phase 7 only: Local Market Validation.

## 1. Inspect the existing project first

Before editing:
- Inspect the repository, route structure, Supabase schema, database types, authentication, startup-profile implementation, City Intelligence and Local Connect.
- Read the architecture, database design, security and setup documentation where available.
- Review the existing hypothesis, experiment and result tables, if they exist.
- Preserve all working functionality from Phases 1–6.
- Do not recreate the project or overwrite files blindly.

If the schema cannot support this feature, propose and implement the smallest compatible migration using the existing migration workflow. Do not disable Row Level Security.

## 2. Core user journey

Implement this end-to-end workflow:

1. An authenticated founder opens Market Validation.
2. The founder selects the startup and target city.
3. The founder creates a market hypothesis.
4. The founder chooses an experiment type and defines its audience, method, sample-size target and success threshold.
5. The founder saves the experiment before recording outcomes.
6. The founder records observations and results as data becomes available.
7. The application calculates metrics from the recorded data.
8. The founder compares results with the predefined threshold and updates the experiment status.
9. The founder can revisit the experiment and its evidence after refreshing or signing in again.

If the founder has no startup profile or no supported city, show a useful empty state with a link to the appropriate setup page.

## 3. Hypothesis management

Allow founders to create and manage market hypotheses.

A hypothesis should include:
- A clear statement of the assumption being tested.
- The startup and target city.
- The customer segment or audience.
- The underlying problem, need or opportunity.
- The expected behavior or outcome.
- Why the hypothesis matters.
- Status such as `untested`, `testing`, `supported`, `challenged` or `inconclusive`, using a documented status model.
- Created and updated timestamps.

A hypothesis should be specific and testable. Provide helper text and examples, but do not automatically claim that a hypothesis is true.

If hypotheses need to reference a City Intelligence assessment, use the existing schema or add a nullable relationship through a migration. Do not require an assessment when the founder wants to test a standalone hypothesis.

## 4. Experiment types

Support a practical set of experiment methods:
- Customer interviews.
- Surveys.
- Retailer or distributor outreach.
- Landing-page or waitlist tests.
- Product or service pilots.
- Paid trial or purchase tests.
- Other, with a description.

Each experiment should store:
- Startup and target city.
- Related hypothesis.
- Experiment name and objective.
- Experiment type and method.
- Target audience or inclusion criteria.
- Planned sample size or outreach target.
- Start and end dates, if applicable.
- Predefined success threshold.
- Metric definition and unit.
- Current status.
- Notes and limitations.
- Created and updated timestamps.

Use clear, typed fields where practical. Do not store all structured data in one unvalidated text blob.

## 5. Predefine success criteria

Require founders to define how they will interpret results before collecting them, while allowing a clearly documented exception for exploratory experiments.

Examples:
- Interview test: speak to at least 12 people in the target customer segment, with at least 7 independently describing the same relevant problem.
- Retailer outreach: contact 20 eligible retailers and receive at least 5 qualified replies.
- Landing page: achieve at least a specified signup conversion rate from a defined number of qualified visitors.
- Paid pilot: obtain at least a specified number of paid trials or orders.

These are examples only, not universal recommendations. Let the founder choose thresholds suitable for the business and experiment.

For every threshold, record:
- Metric name.
- Numerator and denominator if applicable.
- Comparison operator, such as greater than or equal to.
- Target value and unit.
- Minimum sample size if relevant.
- Rationale or notes.

Do not allow the application to silently change the original threshold after results are entered. If a founder edits the threshold, preserve the previous value in history or clearly record that the criteria changed.

## 6. Record observations and results

Build a workflow for recording evidence as it is collected.

Depending on the experiment type, support fields such as:
- Number of people contacted.
- Number of valid responses.
- Number of qualified leads.
- Number of respondents reporting the target problem.
- Number of signups.
- Number of paid orders or pilots.
- Revenue or transaction value, if relevant.
- Interview or observation notes.
- Rejection reasons or objections.
- Evidence URL or private evidence reference.
- Observation date and collection method.

Use a suitable normalized structure for results and metric definitions. If one experiment needs multiple observations over time, preserve the observation history instead of overwriting it without trace.

Privacy rules:
- Avoid storing unnecessary names, phone numbers, emails or sensitive personal information about interviewees.
- Make notes private to the authorized startup owner.
- Do not expose private evidence through public URLs or public-resource endpoints.
- Validate evidence references and uploaded-file access if file uploads already exist; do not add an unsafe upload mechanism just for this phase.

Clearly distinguish:
- Interview feedback.
- Survey responses.
- Expressions of interest.
- Qualified leads.
- Signups or waitlist registrations.
- Paid purchases.
- Repeat purchases.

Never treat all of these as interchangeable signals of demand.

## 7. Metric calculations

Implement deterministic, tested calculations in application code.

Examples:
- Response rate = valid responses / people contacted, when the denominator is greater than zero.
- Problem-confirmation rate = qualifying responses / valid responses, when the denominator is greater than zero.
- Signup conversion rate = signups / qualified visitors, when the denominator is greater than zero.
- Paid conversion rate = paid orders or customers / the explicitly defined eligible audience, when that denominator is valid.

Requirements:
- Document the numerator, denominator and unit for every metric.
- Guard against division by zero.
- Do not report a percentage when the denominator is unknown or zero.
- Do not mix denominators from different populations.
- Distinguish counts from rates and currency values.
- Use appropriate numeric precision and rounding.
- Test boundary cases and invalid values.
- Avoid treating small samples as conclusive proof.

Do not use an LLM to calculate the metrics.

## 8. Experiment status and interpretation

Use a documented experiment lifecycle, for example:
- `draft`
- `planned`
- `running`
- `completed`
- `cancelled`

Use only states with clear meanings and permitted transitions.

Display a separate outcome interpretation such as:
- Threshold met.
- Threshold not met.
- Insufficient sample.
- Inconclusive.
- Not yet evaluated.

Do not equate “threshold met” with “the market is validated.” A single experiment may support or challenge one hypothesis but may not prove overall market viability.

Update hypothesis status only according to documented rules and available evidence. Do not silently change a hypothesis to `supported` based on incomplete or simulated data.

## 9. UI requirements

Use the existing City Launchpad design system.

Build:
- A Market Validation overview page.
- A list of hypotheses and their statuses.
- A hypothesis creation/edit form.
- An experiment creation flow.
- Experiment details showing method, audience, sample target and success threshold.
- A form to record observations and results.
- A metrics/results panel.
- A comparison between actual outcomes and the predefined threshold.
- A history or timeline of important experiment changes.
- Loading, empty, validation, error and success states.
- Responsive layouts for desktop and mobile.

Make it easy to see the difference between planned targets and actual results. Clearly label simulated demo records. Do not add fake charts or pretend data has been collected.

## 10. Database, authorization and validation

- Store hypotheses, experiments and results in Supabase.
- Use version-controlled SQL migrations if schema changes are needed.
- Keep TypeScript database types up to date.
- Use Zod or the existing validation approach for server-side input validation.
- Derive user ownership from the authenticated session.
- Verify that the user owns or is authorized to access the relevant startup.
- Enforce Row Level Security for hypotheses, experiments, results and related private evidence.
- Validate related startup, city and hypothesis IDs.
- Prevent unauthorized cross-user reads or writes.
- Do not trust client-provided ownership fields.
- Do not disable RLS.
- Do not show success until the database write succeeds.
- Preserve result history and record important threshold changes.

## 11. Tests

Add tests for:
- Hypothesis and experiment validation.
- Threshold validation.
- Rate calculations and division-by-zero behavior.
- Sample-size handling.
- Outcome interpretation.
- Allowed experiment-state transitions.
- Threshold history behavior.
- Authorization and ownership checks.

Manually verify:
1. A founder can create a hypothesis.
2. The founder can create an experiment and define success criteria.
3. The founder can record observations and results.
4. Metrics update from actual saved records.
5. The threshold comparison is correct.
6. Refreshing the page preserves the data.
7. Editing a threshold is visible in the history or change record.
8. Another user cannot access the private experiment or results.
9. Empty samples and invalid denominators do not produce misleading percentages.
10. Simulated records are visibly labelled.

Run available lint, TypeScript, tests and production build. Report actual results. Distinguish mocked tests from live Supabase integration tests.

## 12. Documentation

Create or update `docs/MARKET_VALIDATION.md` documenting:
- Hypothesis fields and statuses.
- Experiment types and lifecycle.
- Metric definitions and denominators.
- Success-threshold rules.
- Outcome interpretation rules.
- Evidence and privacy rules.
- Historical-change behavior.
- Known limitations and assumptions.

## 13. Final report and stop condition

At the end, report:
1. Hypothesis management implemented.
2. Experiment types and lifecycle implemented.
3. Result-entry and metric calculations implemented.
4. How thresholds and history are handled.
5. Database migrations and files changed.
6. Tests and commands actually run, with results.
7. Required manual setup.
8. Known limitations.

Stop after Phase 7. Do not automatically proceed to Phase 8.
```

---

# Phase 7 Acceptance Checklist

## Hypotheses and experiments
- [ ] Founder can create and edit hypotheses.
- [ ] Experiments link to the correct startup and target city.
- [ ] Experiment type, audience, method and sample target are recorded.
- [ ] Success thresholds are defined before results are interpreted.
- [ ] Experiment lifecycle and hypothesis statuses are documented.

## Results and metrics
- [ ] Founder can record observations and results.
- [ ] Results persist and can be revisited.
- [ ] Metric calculations are deterministic and tested.
- [ ] Denominators and sample sizes are visible.
- [ ] Zero or missing denominators do not produce misleading rates.
- [ ] Threshold changes are recorded.
- [ ] The app distinguishes interest from actual paid behavior.
- [ ] Simulated data is labelled.

## Security and quality
- [ ] RLS and server-side ownership checks protect private records.
- [ ] Evidence and notes are not publicly exposed.
- [ ] Lint, TypeScript, tests and build results are reported honestly.
- [ ] `docs/MARKET_VALIDATION.md` exists.
- [ ] Claude stops before implementing Phase 8.

---

# How to Verify Phase 7 Yourself

1. Sign in and open Market Validation.
2. Create a hypothesis about a specific customer problem in a target city.
3. Create an experiment with a defined method, audience and success threshold.
4. Save it before recording results.
5. Enter a few observations and verify that metrics update from saved data.
6. Test a zero-response experiment and confirm no invalid percentage appears.
7. Change a threshold and verify the change is visible.
8. Refresh the page and confirm the experiment and results persist.
9. If possible, sign in as another user and verify that the records remain private.
10. Review the Git diff, run the documented checks and commit the verified phase.

**Important:** An experiment that meets its threshold is evidence about a specific hypothesis, not proof that a city or business will succeed. The app should help founders make better decisions, not manufacture certainty.
