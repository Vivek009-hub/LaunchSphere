# City Launchpad — Phase 3: Database and Authentication

## Objective

Connect City Launchpad to Supabase PostgreSQL and implement a secure authentication foundation.

At the end of this phase, a user should be able to sign up, sign in, sign out, access protected pages, and create or read only the private records they are authorized to access. The database schema, migrations, seed data and access policies should be reproducible.

**Scope boundary:** Do not implement startup onboarding, city scoring, Local Connect matching, market experiments, Market Proof logic or AI integration in this phase. Prepare the database foundation those features will use later.

## Prerequisites

- Phase 1 architecture and database design have been reviewed
- Phase 2 UI foundation and navigation work locally.
- The repository is available to Claude.
- A Supabase project is available, or you are ready to create one.
- You can configure environment variables locally.

If the existing project structure differs from the expected structure, inspect it and adapt without rebuilding the application unnecessarily.

---

# Copy-Paste Prompt for Claude

```text
You are my senior full-stack engineer and security-conscious database engineer for City Launchpad.

Implement Phase 3 only: Database and Authentication using Supabase.

## 1. Inspect the repository first

Before editing:
- Inspect the current codebase, package.json, routes, auth-related code, environment configuration and Phase 1/2 documentation.
- Read `docs/DATABASE_DESIGN.md`, `docs/SECURITY.md` and `docs/ARCHITECTURE.md` if they exist.
- Identify the installed Supabase SDK version and follow the appropriate current API for that version.
- Preserve working UI, routes and configuration.
- Do not recreate the project or overwrite files blindly.

If the approved schema or security plan is missing or contradictory, explain the issue and propose a minimal correction before making major changes.

## 2. Configure Supabase

Use Supabase PostgreSQL and Supabase Auth.

Implement the appropriate Supabase client setup for the installed Next.js and Supabase SDK versions:
- A browser/client-side Supabase client for permitted browser operations.
- A server-side client for server components and route handlers.
- Correct cookie/session handling for the installed framework and SDK versions.
- A clearly documented server-only administrative client only if genuinely required.

Never expose a service-role or secret key to the browser. Do not use an old Supabase auth-helper package if the project uses the current `@supabase/ssr` approach. Verify package versions and use their supported APIs rather than guessing.

Create or update `.env.example` with placeholders only. Document the required local environment variables. Do not ask me to paste secrets into source files or commit them to Git.

## 3. Database schema and migrations

Use version-controlled SQL migrations, preferably through the existing Supabase CLI workflow if configured.

Review the Phase 1 data model and implement the minimum schema foundation needed for the following entities:

### User and startup
- User profile linked to `auth.users`.
- Startup records owned by an authenticated user.
- Support for a user owning one or more startup records if consistent with the approved design.

### City and market data
- Cities.
- Data sources with publisher, URL, source type, publication date where available, collection date and provenance notes.
- Market indicators with city, category, value, unit, time period where relevant, source and collection metadata.
- Competitor records with city, category, public source and price information where available.

### Local Connect
- Local resources with name, category, industry tags, service area, public profile details, source and verification status.
- Connection requests linking a startup to a local resource, with purpose, message/context, status, owner and timestamps.

### Market validation
- Market assessments with startup, city, score details, scoring version and assessment timestamp.
- Market hypotheses linked to the appropriate startup and assessment context.
- Experiments linked to a startup, city and relevant hypotheses.
- Experiment results with metric name, value, unit, sample size, method, evidence reference and collection timestamp.

You may split these into additional normalized tables where useful. Avoid giant JSON blobs for data that needs reliable filtering or relationships. JSONB is acceptable for genuinely variable structured details such as a versioned score breakdown, provided the important relational fields remain explicit.

For every table:
- Use appropriate primary keys and foreign keys.
- Define nullability and reasonable constraints.
- Add indexes for common filters and joins.
- Use timestamps consistently.
- Define deletion behavior deliberately.
- Preserve source provenance and historical evidence.
- Avoid storing unnecessary personal information.

If a table belongs to a later feature, it is acceptable to create its minimal schema now, but do not build that feature's application workflow in this phase.

## 4. Row Level Security and authorization

Enable Row Level Security on tables that need it.

Define and document policies for:
- Users reading and updating their own profile.
- Users reading and modifying only their own startup records.
- Users accessing only assessments, hypotheses, experiments and results belonging to startups they own.
- Public or authenticated read access to approved local-resource listings, according to the product's privacy needs.
- Founders creating and viewing only their own connection requests.
- Authorized recipients or administrators updating connection-request status, based on an explicit access model.

Important:
- Do not assume that a hidden UI button is a security control.
- Do not trust a client-supplied `user_id` or startup ID without checking ownership.
- Use database relationships and policies to prevent access through related records.
- Do not expose private provider contact details in public queries.
- Do not give all authenticated users unrestricted write access to all records.
- Never disable RLS as a shortcut to make the application work.

If the recipient/administrator model is not fully implemented yet, use a safe limited policy and document the limitation. Do not grant broad update access just to support a demo.

## 5. Authentication flow

Implement:
- Sign-up.
- Sign-in.
- Sign-out.
- Session persistence and refresh using the supported Supabase/Next.js approach.
- Protected application pages.
- Redirects for unauthenticated users.
- A clear route for authentication errors.
- Appropriate loading and error states.

Integrate authentication into the existing UI shell instead of replacing the Phase 2 design.

Do not assume a session is valid solely because a client-side state variable says so. Validate sessions appropriately on the server for protected operations.

If email confirmation is enabled in the Supabase project, provide clear UI feedback when a user needs to confirm their email. Do not falsely show a successful authenticated session before one exists.

## 6. Seed data

Provide reproducible seed data for a small demonstration environment:
- Two example cities.
- A limited number of market indicators with source metadata.
- A small set of competitor examples with source metadata.
- A small set of local resources.
- A few example categories or industry tags.

Rules:
- Clearly label any invented sample records as demonstration or simulated data.
- Do not fabricate citations or claim sample records are verified.
- Do not insert fake authentication users or hardcode user IDs in production migrations.
- Ensure seed data can be applied safely and repeatedly where practical.
- Use a separate seed file or documented workflow rather than mixing sample data into schema migrations.

If no verified dataset is available yet, use explicitly simulated records with obvious labels and example URLs only when they cannot be mistaken for real citations. Prefer leaving factual fields empty over making them up.

## 7. Database types and application integration

- Generate or maintain TypeScript database types using the supported Supabase workflow if practical.
- Use typed queries where available.
- Centralize Supabase client creation.
- Keep database access out of presentational components where possible.
- Use server-side validation for writes.
- Handle database errors without leaking secrets or sensitive internals.
- Preserve Phase 2 demo screens, replacing only the minimum necessary behavior for authentication and the database foundation.

Do not build the feature-specific database workflows yet.

## 8. Testing and verification

Verify what can be tested in the current environment.

At minimum:
- Run lint and TypeScript checks.
- Run the production build if supported.
- Verify SQL migration syntax using the available Supabase tooling when possible.
- Test sign-up, sign-in and sign-out with a configured Supabase project if credentials are available.
- Test that an unauthenticated user cannot access protected routes or private API operations.
- Test that one user cannot read or modify another user's startup or experiment records.
- Test local-resource read access and connection-request ownership policies.
- Inspect the actual RLS policies and related-table access paths.

If Supabase credentials or a live project are not configured, do not claim live authentication or RLS tests passed. State exactly what was tested locally and provide the remaining manual steps.

## 9. Documentation

Create or update:
- `docs/DATABASE_SETUP.md` — how to configure Supabase, apply migrations, load seed data and generate types.
- `docs/SECURITY.md` — actual policies implemented, known limitations and tests performed.
- `.env.example` — variable names with safe placeholders only.

Document any manual dashboard settings needed, such as authentication providers, redirect URLs and email confirmation configuration.

## 10. Final report and stop condition

At the end, report:
1. Tables and relationships implemented.
2. Migrations and seed files created.
3. Authentication routes and behavior implemented.
4. RLS policies created and how they restrict access.
5. Files created or modified.
6. Commands and checks actually run, with real results.
7. Manual setup steps and required environment variables.
8. Known limitations or tests that could not be performed.

Stop after Phase 3. Do not automatically proceed to Phase 4.
```

---

# Phase 3 Acceptance Checklist

## Database
- [ ] Supabase configuration is centralized and version-appropriate.
- [ ] SQL migrations are version-controlled.
- [ ] Tables, foreign keys, constraints and indexes match the approved design.
- [ ] Source provenance is represented in the schema.
- [ ] Seed data is reproducible and clearly labelled.
- [ ] TypeScript database types are generated or their absence is documented.

## Authentication
- [ ] Sign-up, sign-in and sign-out are implemented.
- [ ] Session persistence and server-side checks work.
- [ ] Protected routes reject unauthenticated users.
- [ ] Email-confirmation behavior is handled if enabled.
- [ ] Existing Phase 2 UI remains intact.

## Security
- [ ] RLS is enabled where needed.
- [ ] Users cannot access other users' private startup records.
- [ ] Related records are protected through ownership checks.
- [ ] Connection-request permissions are explicitly defined.
- [ ] No service-role or secret key is exposed to the client.
- [ ] Policies are tested or untested policies are clearly disclosed.

## Quality
- [ ] `.env.example` contains placeholders only.
- [ ] Setup instructions are documented.
- [ ] Lint and type checks are reported honestly.
- [ ] Build results are reported honestly.
- [ ] Claude stopped before implementing Phase 4.

---

# How to Verify Phase 3 Yourself

1. Configure the Supabase project and local environment variables.
2. Apply migrations using the documented workflow.
3. Start the app and create a test account.
4. Sign out, then sign in again to check session behavior.
5. Open a protected route while signed out and confirm access is blocked.
6. If feasible, create two test users and verify that one cannot access the other's private records.
7. Review the SQL policies and migration diff.
8. Confirm `.env.local` is ignored by Git and no secrets appear in commits.
9. Commit the phase only after critical checks pass.

**Important:** A successful build does not prove that authentication, database permissions or Row Level Security are secure. Verify those behaviors separately before moving to Phase 4.
