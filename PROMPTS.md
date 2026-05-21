# AI Prompt Log

This project used AI assistance (Cursor, Claude). Below are the main prompts.

---

## Entry 001

**Tool:** Cursor (Claude)  
**Goal:** Implement light/dark theme across the portal without colour mismatches.

**Prompt:**
> Add light dark mode toggle in header in this project and make sure colors and theme everything should be according to the theme there should not be mismatched

**Outcome:** Adapted. Added `ThemeToggle`, wired `next-themes`, switched layout/pages from hardcoded grays to semantic tokens (`bg-background`, `text-muted-foreground`, etc.), and imported `index.css` for shadcn theme variables.

---

## Entry 002

**Tool:** Cursor (Claude)  
**Goal:** Make the entire app usable on mobile and tablet without changing business logic.

**Prompt:**
> Make this whole app responsive without changing the present logic just work on making it responsive

**Outcome:** Adapted. Mobile drawer navigation, responsive header, full-width sandbox inputs, scrollable tables/charts, and padding/breakpoint tweaks on all main pages. No changes to data fetching or sandbox request logic.

---

## Entry 003

**Tool:** Cursor (Claude)  
**Goal:** Resolve rejected push and merge conflicts with remote `main`.

**Prompt:** *(terminal output shared)* — push rejected: remote contains work not present locally; conflicts in `index.html` and `header.tsx`.

**Outcome:** Adapted. Rebased onto `origin/main`, kept theme-aware `suppressHydrationWarning` and semantic header styles, completed push to `rds2398/developer-portal`.

---

## Entry 004

**Tool:** Cursor (Claude)  
**Goal:** Sandbox enhancements aligned with assignment bonus section.

**Prompt:** *(paraphrased)*  
> Add code snippet generator (cURL, fetch, Python) with copy functionality, request history tracking with replay support, and rate limit usage visualization after each request.

**Outcome:** Adapted. Implemented `snippet-generator.ts`, Zustand `api-history` store, and sandbox UI updates for request/response lifecycle tracking.

---

## Entry 005

**Tool:** Cursor (Claude)  
**Goal:** Improve API documentation UX consistency across endpoints.

**Prompt:**
> Improve API docs page rendering so endpoints, parameters, and responses are easier to scan and consistent across different APIs in the registry.

**Outcome:** Adapted. Standardized endpoint layout structure, improved spacing/typography in parameter tables, and ensured OpenAPI-driven rendering remains consistent across all registered APIs.

---

