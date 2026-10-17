# City Launchpad — Phase 2: UI Foundation and Dashboard

## Objective

Build a polished, responsive UI foundation for City Launchpad, including the shared application layout, navigation, reusable UI components and dashboard.

**This phase is UI-focused.** Do not implement the real Supabase database, authentication, city-scoring logic, Local Connect workflows, market experiments or AI integrations yet. Those belong to later phases. Use clearly labelled demo data where necessary, and structure the UI so real data can be connected later without rewriting everything.

## Prerequisites

Before starting:
- Phase 1 is complete and reviewed.
- The repository is accessible to Claude.
- `docs/ARCHITECTURE.md` and `docs/IMPLEMENTATION_PLAN.md` are available, if created in Phase 1.
- The project can start locally, or any setup issue is understood.

If Phase 1 is incomplete or the project does not run, identify and resolve the blocking issue first. Do not blindly recreate the project.

## Product context

City Launchpad helps Indian startups evaluate expansion cities, find relevant local contacts, and validate real demand.

The three core modules are:

1. **City Intelligence & Fit Score** — sourced city comparisons and transparent scoring.
2. **Local Connect** — local-resource discovery and introduction requests.
3. **Local Market Validation** — hypotheses, experiments and measurable outcomes.

The signature differentiator is the **Market Proof Loop**, which links the initial market assessment, local connections and recorded experiment evidence.

## Design direction

Build a modern, credible B2B SaaS dashboard suitable for a startup-focused hackathon presentation.

Visual priorities:
- Clear information hierarchy and readable typography.
- Consistent spacing, sizing, borders, radii and icon usage.
- Restrained, professional use of color.
- Responsive layouts for desktop, tablet and mobile.
- Accessible controls and keyboard navigation.
- Useful charts and status indicators rather than decorative graphics.
- A coherent design system rather than unrelated screens.

Avoid:
- A generic AI-chatbot landing page.
- Excessive gradients, unnecessary animation or visual clutter.
- Fake live data or unlabelled invented statistics.
- Buttons that look functional but do nothing.
- Large amounts of placeholder copy.
- Building every feature in this phase.

Use Tailwind CSS and the existing component system. If shadcn/ui is already installed, reuse it. If not, follow the approved Phase 1 plan before adding it.

---

# Copy-Paste Prompt for Claude

```text
You are my senior frontend engineer working on City Launchpad.

Implement Phase 2 only: UI Foundation and Dashboard.

## 1. Inspect before editing

Before making changes:
- Inspect the current repository and package scripts.
- Read `docs/ARCHITECTURE.md` and `docs/IMPLEMENTATION_PLAN.md` if they exist.
- Check which components, styles, routes and UI libraries already exist.
- Preserve working code and configuration.
- Do not recreate the project or overwrite files blindly.

If Phase 1 has not produced a working project foundation, stop and explain the blocking issues before proceeding.

## 2. Build the application shell

Create a responsive application layout with:
- A desktop sidebar.
- A mobile-friendly navigation menu.
- A top bar with the current page title and a clearly labelled demo profile/avatar.
- A main content region with consistent width, spacing and page structure.
- Navigation links for:
  - Dashboard
  - City Intelligence
  - Local Connect
  - Market Validation
  - Market Proof
  - Settings

Use the approved route structure. If the exact routes have not been defined, propose a consistent structure such as:
- `/dashboard`
- `/city-intelligence`
- `/local-connect`
- `/market-validation`
- `/market-proof`
- `/settings`

Make the active route visually clear. All navigation items must lead to real pages or explicitly marked, minimal placeholder pages. Do not create dead links.

## 3. Build the dashboard

Create a useful founder dashboard containing:

### A. Startup overview
- Startup name and short description.
- Industry and target customer.
- Current operating city and selected expansion cities.
- A clear empty state if no startup profile has been configured.

Use a clearly labelled demonstration profile only if required for the visual prototype.

### B. City assessment summary
- Recent city assessment cards or a comparison summary.
- Fit Score presentation that explains it is demo data until connected to the real scoring module.
- Evidence-coverage indicator that is separate from the Fit Score.
- A link to City Intelligence.

Do not present invented figures as real market research or verified conclusions.

### C. Local Connect activity
- A summary of recent introduction requests and their statuses.
- Useful empty states when no requests exist.
- A link to Local Connect.

Do not imply that a real introduction was sent or accepted.

### D. Market validation progress
- A summary of experiments, their statuses and next actions.
- A link to Market Validation.

Clearly label any simulated experiments and outcomes.

### E. Market Proof preview
- A compact summary of assumptions supported, challenged or not yet tested.
- A link to the full Market Proof page.
- Make it clear when the summary uses demo data.

Do not imply that the market has been validated without recorded evidence.

## 4. Create reusable UI components

Build or reuse appropriate components, such as:
- App sidebar and mobile navigation.
- Page header and breadcrumbs where useful.
- Summary/stat cards.
- Status badges.
- Data tables.
- Filter controls.
- Empty-state panels.
- Loading-state skeletons.
- Error-state panels.
- Dialogs and forms where actually needed.
- Chart containers and accessible chart labels.

Avoid overengineering. Extract a component when it improves consistency or reuse; do not split every small element into its own file.

## 5. Establish the visual system

Use the project's approved Tailwind and UI configuration.

Create consistent choices for:
- Typography hierarchy.
- Spacing and layout.
- Border and corner radius.
- Surface and background colors.
- Status colors with readable contrast.
- Focus, hover, disabled and selected states.
- Icon sizes and usage.

Keep the product professional, clean and credible. Use icons consistently. Ensure text and controls remain readable on narrow screens.

If a chart is used, include an appropriate title, units, labels and accessible context. Avoid decorative charts that imply data the app does not have.

## 6. Demo data and page boundaries

This phase may use a small, centralized demo-data module for visual development.

Requirements:
- Keep demo data separate from UI components.
- Clearly label the app or relevant sections as demonstration data.
- Do not scatter hardcoded records throughout components.
- Do not fake API calls, database writes or successful user actions.
- Do not invent external source citations.
- Provide sensible empty states for when real data is absent.
- Keep component props and types ready for future integration with Supabase.

Create minimal feature placeholder pages only to support working navigation. Do not implement actual city scoring, resource matching, introduction workflows, experiment persistence or Market Proof business logic in this phase.

## 7. Functionality and accessibility

- Every visible navigation control must work.
- Any implemented button must perform its stated action.
- Use semantic HTML and accessible labels.
- Support keyboard focus and navigation.
- Avoid relying on color alone to communicate status.
- Ensure responsive behavior at desktop, tablet and mobile widths.
- Include appropriate loading, empty and error states where relevant.
- Do not add interactions that falsely imply a backend operation succeeded.

## 8. Engineering rules

- Use TypeScript and preserve strict typing.
- Reuse existing libraries where practical.
- Avoid unnecessary dependencies.
- Preserve Phase 1 documentation and configuration.
- Do not add Supabase integration or authentication in this phase.
- Do not add LLM API integration.
- Do not implement the core business logic for the three modules yet.
- Keep demo data centralized and explicitly labelled.
- Do not claim checks passed unless you actually ran them.

## 9. Verification

After implementation:
- Run the available lint command.
- Run the available TypeScript check.
- Run the production build if the environment supports it.
- Report any command that could not be run and why.
- Inspect the rendered UI if browser tooling is available.
- Check desktop and mobile layouts.
- Verify all navigation links and any interactive controls.
- Fix issues found before reporting completion.

## 10. Final report and stop condition

At the end, report:
1. What was implemented.
2. Files created or modified.
3. Routes available.
4. Which areas use demo data.
5. Commands and checks actually run, with results.
6. Known limitations or remaining issues.
7. Manual steps to verify the UI.

Stop after Phase 2. Do not automatically proceed to Phase 3.
```

---

# Phase 2 Acceptance Checklist

- [ ] Phase 1 foundation was inspected and preserved.
- [ ] Responsive desktop sidebar and mobile navigation work.
- [ ] All six navigation destinations work.
- [ ] Dashboard includes startup overview and summaries for all three modules.
- [ ] Market Proof preview is present.
- [ ] Demo data is centralized and clearly labelled.
- [ ] Empty, loading and error states are implemented where relevant.
- [ ] Buttons do not falsely claim backend actions succeeded.
- [ ] UI components and styles are consistent.
- [ ] Accessibility and keyboard focus were checked.
- [ ] Lint, TypeScript and build checks were run where available.
- [ ] Claude reported actual results and stopped before Phase 3.

## After Claude completes Phase 2

1. Start the development server and open the app in your browser.
2. Click every navigation item and check for broken routes.
3. Test the layout at desktop and mobile widths.
4. Confirm that demo data is visibly labelled.
5. Review the Git diff and revert any unrelated or destructive changes.
6. Fix critical UI problems and commit the verified phase.

**Do not move to Phase 3 until the UI foundation is stable.**
