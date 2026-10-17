# City Launchpad — Phase 4: Startup Onboarding and Profile Management

## Objective

Build the complete startup onboarding and profile-management workflow for City Launchpad.

At the end of this phase, an authenticated founder should be able to create a startup profile, save it to Supabase, return later to edit it, and use that saved profile as the shared context for City Intelligence, Local Connect and Market Validation.

**Scope boundary:** Do not implement city scoring, resource matching, introduction requests, experiment workflows, Market Proof logic or AI integrations in this phase. Build the profile workflow and the minimum integration needed to make the saved profile available to later modules.

## Prerequisites

- Phase 1 architecture and database design are reviewed.
- Phase 2 UI foundation is working.
- Phase 3 Supabase setup and authentication are implemented and verified.
- Database migrations are applied to the development Supabase project.
- Required environment variables are configured locally.

If authentication or database access is broken, report and fix that blocking issue before implementing onboarding. Do not work around broken permissions by disabling Row Level Security.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer working on City Launchpad.

Implement Phase 4 only: Startup Onboarding and Profile Management.

## 1. Inspect the existing project first

Before editing:
- Inspect the current repository, routes, components, Supabase clients, database types, migrations and authentication flow.
- Read the existing `docs/ARCHITECTURE.md`, `docs/DATABASE_DESIGN.md`, `docs/SECURITY.md` and `docs/DATABASE_SETUP.md` if present.
- Confirm the actual startup/profile schema and adapt to it.
- Preserve the working Phase 2 UI and Phase 3 authentication/database implementation.
- Do not recreate the project or blindly overwrite files.

If the current schema cannot support the required profile fields, propose the smallest compatible migration and explain why it is needed before applying it.

## 2. Profile information to collect

Create a clear, polished onboarding flow that collects:

### Required fields
- Startup name.
- Short business description.
- Industry or business category.
- Product or service description.
- Target customer segment.
- Current operating city.
- Product/service price or price range, when applicable.
- Primary sales or distribution channel.

### Optional fields
- Website URL.
- Product category or subcategory.
- Target customer location or geography.
- Candidate expansion cities.
- Existing traction, if any, with a clear unit or description.
- Additional context relevant to expansion.

Use sensible fields and types. Do not force founders to invent traction or pricing when they do not have it. Clearly distinguish missing information from zero traction.

If the current schema uses different field names, map the UI to the existing model or make a documented migration. Do not create duplicate columns representing the same concept.

## 3. Onboarding experience

Build an onboarding flow that:
- Has a clear title, short explanation and visible progress if divided into steps.
- Groups related fields logically.
- Uses appropriate input types, select controls, text areas and URL inputs.
- Gives concise examples or helper text where useful.
- Supports validation feedback close to the relevant fields.
- Provides back/continue controls if multi-step.
- Prevents accidental duplicate submissions.
- Shows loading, success and failure states.
- Works on desktop, tablet and mobile.
- Fits the existing City Launchpad design system.

Avoid making the onboarding excessively long. Prefer a small number of focused steps, and make nonessential fields optional.

## 4. City selection

- Populate current-city and expansion-city choices from the existing `cities` table.
- Do not hardcode city options in UI components if the database already contains them.
- Support selecting one current city and zero or more candidate expansion cities.
- Handle the case where the database contains no supported cities.
- Do not assume that every Indian city is available in the prototype.
- If candidate expansion cities need a join table or an existing relation, inspect the schema and implement the smallest normalized solution.

## 5. Validation

Use Zod or the project's existing validation approach.

Validate appropriately:
- Required text fields are not blank.
- Text fields have reasonable length limits.
- Price values and ranges are numeric and nonnegative where applicable.
- Minimum price does not exceed maximum price.
- URLs use an allowed URL format.
- Industry/category values are valid or come from an approved source.
- Selected city IDs exist in the database.
- Optional fields may be absent without being converted into misleading zero values.

Validate untrusted data on the server as well as providing helpful client-side feedback. Do not rely on client-side validation for security.

## 6. Database persistence and ownership

- Save the profile to Supabase for the authenticated user.
- Load an existing profile when the user revisits onboarding or profile settings.
- Allow the owner to edit and update the profile.
- Use the existing authentication/session approach from Phase 3.
- Enforce ownership through Row Level Security and server-side checks.
- Never trust a client-provided owner ID without validating it against the authenticated session.
- Prevent one user from reading or modifying another user's startup.
- Ensure candidate-city associations are saved and reloaded correctly.
- Handle duplicate submissions and database failures gracefully.
- Do not show a success message until the database operation actually succeeds.

If a founder can own multiple startups according to the approved data model, include a suitable way to select the active startup or make the initial profile flow explicit about which startup is being created. Do not silently assume one-to-one ownership if the schema supports multiple startups.

## 7. Startup profile management

Create a profile page or settings section that lets the founder:
- View saved startup information.
- Edit and save changes.
- See the current city and selected expansion cities.
- See which important profile fields are still missing.
- Understand that this profile is used to personalize the other modules.

Show a useful empty state if no profile exists, with a clear action to complete onboarding.

After a profile is successfully saved, take the user to an appropriate page in the existing application. Do not navigate away before persistence succeeds.

## 8. Integration with future modules

Create a reliable, typed way for later modules to retrieve the active startup profile and its candidate cities.

Requirements:
- Reuse the approved database and type definitions.
- Avoid copying profile data into multiple unrelated stores.
- Keep database access out of presentational components where possible.
- Make loading, missing-profile and error states explicit.
- Do not generate city recommendations or Fit Scores yet.
- Do not add AI integration yet.
- Do not implement Local Connect or experiment workflows yet.

## 9. Tests and verification

Add appropriate tests for:
- Required-field validation.
- Invalid price ranges.
- Invalid URLs.
- Optional fields.
- Profile creation and editing.
- Candidate-city associations.
- Unauthorized access and ownership checks.

Run available:
- Lint.
- TypeScript checks.
- Unit tests.
- Production build, if supported.

If live Supabase credentials are unavailable, clearly distinguish mocked/local tests from live database tests. Do not claim that RLS or live persistence has been verified unless it was actually tested.

Manually verify:
1. A signed-in user with no profile can complete onboarding.
2. The profile remains after refresh and a new session.
3. The user can edit the profile.
4. Candidate cities load from the database and persist.
5. An unauthenticated user cannot create or edit a profile.
6. Another user cannot read or change the profile.
7. Failed saves show an error and do not falsely show success.

## 10. Documentation and final report

Update the relevant documentation if the schema or setup changes.

At the end, report:
1. The onboarding and profile-management behavior implemented.
2. Files created or modified.
3. Any database migration added and why.
4. Validation and ownership protections implemented.
5. Tests and commands actually run, with results.
6. Required environment or Supabase setup.
7. Known limitations and unresolved issues.

Stop after Phase 4. Do not automatically proceed to Phase 5.
```

---

# Phase 4 Acceptance Checklist

## User experience
- [ ] Onboarding is clear and responsive.
- [ ] Required and optional fields are distinguished.
- [ ] Validation errors appear near relevant inputs.
- [ ] Loading, success and failure states work.
- [ ] The founder can revisit and edit the profile.
- [ ] An empty state guides new users to onboarding.

## Data and integration
- [ ] Profile data is saved to Supabase.
- [ ] Saved data loads correctly after refresh and re-login.
- [ ] City options come from the database.
- [ ] Candidate expansion cities persist correctly.
- [ ] A typed profile retrieval path is available to future modules.
- [ ] No fake Fit Scores or recommendations are generated.

## Security and quality
- [ ] Server-side validation is implemented.
- [ ] Ownership is enforced by existing RLS policies and server checks.
- [ ] Cross-user access is prevented.
- [ ] Lint, type checks, tests and build results are reported honestly.
- [ ] Claude stops before implementing Phase 5.

---

# How to Verify Phase 4 Yourself

1. Sign in with a test account.
2. Complete onboarding using valid data.
3. Refresh the page and confirm the profile is still present.
4. Sign out and back in, then verify the saved information.
5. Edit the business description and candidate cities, then save.
6. Test invalid input, such as a negative price or minimum price above maximum.
7. Test with no supported expansion cities available.
8. If possible, use a second test account to confirm profile privacy.
9. Review the Git diff and verify no unrelated files were overwritten.
10. Commit the verified work before starting Phase 5.

**Important:** The startup profile becomes the shared context for the remaining product. Get its data model and persistence right now so the later features can reuse it instead of duplicating profile data.
