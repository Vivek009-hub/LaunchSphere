# City Launchpad — Phase 6: Local Connect

## Objective

Build Local Connect, the feature that helps founders discover relevant local businesses and ecosystem contacts and manage requests for introductions.

At the end of this phase, an authenticated founder should be able to search real records stored in Supabase, filter and rank relevant local resources, understand why each resource matches their needs, inspect its source and verification status, and create and track an introduction request.

**Scope boundary:** Do not implement full market-validation experiments, Market Proof integration or AI matching in this phase. Use documented, deterministic matching logic. Any optional AI-based search interpretation can be considered in Phase 9.

## Prerequisites

- Phases 1–5 are complete and reviewed.
- Supabase authentication and Row Level Security are working.
- Startup profiles and supported cities are available.
- The database has a local-resource table and a connection-request model, or a documented migration can add the required fields.
- The app runs locally and the City Launchpad design system is in place.

If the current schema differs from this prompt, inspect it first and adapt through a small, version-controlled migration. Do not disable RLS to make the feature work.

---

# Product principles

1. **Relevant over numerous.** A small, useful list of contacts is better than a huge unverified directory.
2. **Explain every match.** Show why a resource is relevant to the founder's city, industry and stated needs.
3. **Transparent verification.** Distinguish unverified, source-checked and directly confirmed records.
4. **Permission-based introductions.** Do not expose private contact details or imply an introduction was delivered without a successful operation.
5. **Real persistence.** Search, requests and status changes must use the database, not pretend API calls.
6. **Honest demonstration data.** Clearly label simulated resources and requests.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer working on City Launchpad.

Implement Phase 6 only: Local Connect.

## 1. Inspect the existing project first

Before editing:
- Inspect the repository, route structure, database schema, Supabase clients, authentication flow, startup-profile model and existing UI components.
- Read the architecture, database design, security, database setup and implementation documentation where available.
- Review the current `local_resources` and `connection_requests` tables and their Row Level Security policies.
- Preserve working City Intelligence, onboarding, authentication and UI functionality.
- Do not recreate the project or overwrite files blindly.

If the current schema cannot support the required behavior, propose the smallest compatible migration, explain it and implement it using the project's migration workflow.

## 2. Core user journey

Implement this workflow:

1. A signed-in founder opens Local Connect.
2. The app loads the founder's active startup profile and expansion-city choices.
3. The founder searches local resources by city, industry, category, service area and capabilities.
4. The app ranks matching resources using documented deterministic rules.
5. The founder opens a resource profile and sees why it is relevant, its source and verification status.
6. The founder submits an introduction request with a specific purpose and business context.
7. The request is stored in Supabase and shown in the founder's request list.
8. The founder can revisit the request and see its current status.

If the founder has no startup profile, show a clear link to complete onboarding. If no matching records exist, show an honest empty state and useful suggestions for changing filters.

## 3. Local-resource categories

Support a flexible set of resource categories relevant to startup market entry, such as:
- Retailers and retail partners.
- Distributors and wholesalers.
- Suppliers and manufacturers.
- Logistics and warehousing providers.
- Potential pilot customers or business buyers.
- Industry mentors and specialists.
- Incubators, universities and startup ecosystem organizations.
- Other relevant local service providers.

Use controlled category values where practical, but allow the model to be extended without rewriting the whole UI.

## 4. Resource data model and provenance

Inspect the approved schema and make sure each resource can represent, where available:
- Name and public profile description.
- Resource category.
- Industry tags and capabilities.
- City and geographic coverage or service area.
- Public website or public contact method.
- Source URL or source record.
- Verification status.
- Last verification or review date.
- Created and updated timestamps.
- Whether the record is demonstration data.

Use a transparent verification state such as:
- `unverified`
- `source_checked`
- `directly_confirmed`

Use the existing enum or status convention if one exists. Do not claim a resource is verified simply because it has a website or a database row.

Keep private contact details out of publicly readable resource fields. Do not collect or expose unnecessary personal information. Only display contact information that is legitimately public or has been provided with permission.

## 5. Search and filtering

Build a responsive discovery interface with:
- Search by resource name, category, capability or relevant keywords.
- City filter.
- Industry filter.
- Resource-category filter.
- Service-area filter where applicable.
- Clear-filters action.
- Useful result counts and empty states.
- Loading and error states.
- Resource detail view or dialog.

Use database queries for retrieval and filtering. Do not load an unbounded directory into the browser and filter everything client-side.

Validate and constrain query parameters on the server. Use appropriate database indexes for commonly queried fields. If full-text search is unnecessary for the prototype, use a documented, safe query strategy rather than adding a complex search service.

## 6. Deterministic matching and explanations

Implement a documented relevance score or ranking system using actual resource fields.

Possible factors:
- Industry relevance.
- Geographic or service-area fit.
- Resource category or task relevance.
- Profile completeness and verification status.

Use reasonable, configurable weights and explain their purpose in `docs/LOCAL_CONNECT.md`. Do not present the ranking as a validated predictive model.

For each result, show understandable reasons such as:
- Matches the startup's industry.
- Serves the selected expansion city.
- Offers the requested type of service.
- Has a source-checked or directly confirmed profile.

Rules:
- Missing data must not automatically be treated as a match.
- Do not infer capabilities that are not present in the record.
- Do not use verification status as proof of commercial quality.
- Do not fabricate match reasons.
- Use server-side filtering and pagination or a reasonable result limit.

Keep the ranking logic deterministic and testable. Do not add LLM-based matching in this phase.

## 7. Resource detail view

Display the resource's:
- Name and category.
- Description and relevant capabilities.
- City and service coverage.
- Industry tags.
- Public website or approved public contact methods.
- Source and verification status.
- Last verification date, if available.
- Match explanation for the current startup.

Clearly label unverified and demonstration records. If a field is unavailable, omit it or explain that it is not provided instead of inventing a value.

## 8. Introduction-request workflow

Build a form for an authenticated founder to request an introduction.

Collect:
- Selected resource.
- Purpose of the request.
- Brief business context.
- Desired outcome or next step.
- Optional message intended for the resource or authorized recipient.

Store:
- Startup ID.
- Resource ID.
- Requesting user ID, derived from the authenticated session.
- Purpose and context.
- Status.
- Created and updated timestamps.
- Any response/status timestamps required by the existing model.

Use a documented lifecycle, for example:
- `draft` if drafts are supported.
- `pending`
- `accepted`
- `declined`
- `cancelled`
- `completed`

Only implement states that have clear meaning and authorized transitions. Do not add statuses that the app cannot actually reach or explain.

Requirements:
- Validate all fields server-side.
- Confirm the founder owns or is authorized to use the startup profile.
- Confirm the resource exists and is eligible for requests.
- Prevent duplicate submissions caused by repeated clicks where practical.
- Show success only after the database confirms the write.
- Show the request's actual persisted status.
- Allow founders to view their own requests and cancel only when the documented transition rules permit it.
- Ensure one founder cannot read or modify another founder's requests.

## 9. Who can update request status?

Do not let any authenticated user change any request status.

Inspect the existing recipient/admin model. Implement only the permission model the current app can support safely.

If recipient accounts and authorization are already supported:
- Allow the authorized recipient to accept or decline their own requests.
- Record who changed the status and when, if the schema supports it.
- Validate allowed state transitions.

If recipient accounts are not implemented:
- Do not invent recipient functionality or expose a global admin endpoint.
- Keep the founder-side request submission and tracking functional.
- Add a safe, documented administrator-only mechanism only if the project already has a secure admin model.
- Clearly document that recipient response handling is not yet implemented.

Never claim an introduction was delivered, accepted or completed unless the relevant event actually happened and was recorded.

## 10. Security and database rules

- Enforce Row Level Security on private records.
- Derive the requesting user ID from the authenticated server session.
- Do not trust client-supplied ownership fields.
- Validate startup-resource relationships on the server.
- Protect all request reads and writes with authorization checks.
- Keep service-role keys server-side only.
- Avoid leaking private resource or request data in logs and errors.
- Add or update version-controlled SQL migrations and database types if required.
- Do not disable RLS to make queries work.
- Ensure public-resource access cannot expose private contact fields.

## 11. UI requirements

Use the existing City Launchpad design system.

Build:
- Local Connect page with search and filters.
- Resource cards or a compact results table.
- Match-reason labels.
- Verification-state badges with text, not color alone.
- Resource detail view.
- Introduction-request form.
- My Requests list with status and created date.
- Loading, empty, error and success states.
- Responsive layouts for desktop and mobile.

Keep the interface professional and useful. Avoid unnecessary animations or decorative charts. Do not implement buttons that do nothing.

## 12. Tests

Add tests for:
- Industry and city matching.
- Ranking calculations.
- Missing-field behavior.
- Verification-status display.
- Search/filter validation.
- Request creation validation.
- Allowed and disallowed status transitions.
- Ownership and authorization checks.

Manually verify:
1. A founder can search and filter resources.
2. Match explanations reflect actual stored fields.
3. Resource provenance and verification status are displayed accurately.
4. A founder can submit a request and see the persisted record.
5. Refreshing the page preserves request status.
6. One user cannot access another user's requests.
7. Unauthorized users cannot change request status.
8. Empty results and failed database operations are handled honestly.

Run available lint, TypeScript, tests and production build. Report actual results. If live Supabase access is unavailable, distinguish mocked tests from live integration tests.

## 13. Documentation

Create or update `docs/LOCAL_CONNECT.md` with:
- Resource categories and field definitions.
- Matching criteria and weights.
- Verification-state definitions.
- Source and provenance rules.
- Request status lifecycle and allowed transitions.
- Authorization model.
- Known limitations and future integration needs.

## 14. Final report and stop condition

At the end, report:
1. Search, filters and ranking implemented.
2. Resource detail and verification behavior.
3. Introduction-request lifecycle implemented.
4. Database changes and migrations.
5. Authorization rules and tests.
6. Files created or modified.
7. Commands and checks actually run.
8. Any missing data or setup steps.
9. Known limitations, including whether recipient responses are supported.

Stop after Phase 6. Do not automatically proceed to Phase 7.
```

---

# Phase 6 Acceptance Checklist

## Discovery
- [ ] Resource records come from Supabase.
- [ ] Search and filters work.
- [ ] Results are limited or paginated appropriately.
- [ ] Matching criteria are documented and deterministic.
- [ ] Match explanations reflect actual database fields.
- [ ] Resource sources and verification status are visible.
- [ ] Missing information is not fabricated.

## Introduction requests
- [ ] Founder can submit a request.
- [ ] Request is saved and can be revisited.
- [ ] Status reflects the actual database record.
- [ ] Status transitions follow documented rules.
- [ ] Unauthorized users cannot view or change requests.
- [ ] Recipient response functionality is either safely implemented or explicitly documented as not yet available.

## Security and quality
- [ ] RLS and server-side ownership checks are in place.
- [ ] Private contact details are protected.
- [ ] No service-role key is exposed to the client.
- [ ] Lint, TypeScript, tests and build results are reported honestly.
- [ ] `docs/LOCAL_CONNECT.md` exists.
- [ ] Claude stops before implementing Phase 7.

---

# How to Verify Phase 6 Yourself

1. Sign in and open Local Connect.
2. Search for a resource by name or keyword.
3. Filter by city, category and industry.
4. Open a resource and inspect its source and verification status.
5. Confirm the match explanation reflects actual resource fields.
6. Submit an introduction request and wait for the database-confirmed success state.
7. Refresh the page and confirm the request remains visible with its real status.
8. If possible, sign in as another user and confirm the request is not accessible.
9. Try unauthorized status changes and verify they are rejected.
10. Review the migration and Git diff, then commit the verified phase.

**Important:** A polished directory is not enough. Local Connect is useful only when its listings are traceable, its match explanations are honest, and its request workflow truly persists and enforces permissions.
