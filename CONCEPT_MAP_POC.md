# Concept Map — discovery POC (Analytics-owned)

> **Status: discovery prototype, NOT for merge.** This branch exists so Platform Data can look at the *structure and UX* of an idea. It is intentionally hardcoded for visual discovery. It is not a request for PD to implement a new OpenMetadata feature this quarter. See "Ownership" and "Two paths" below.

## What this is

A business-friendly **Concept Map** navigation layer over the Tableau dashboards already cataloged in OpenMetadata: browse by **topic (front) → sub-topic → dashboard**, open the dashboard that answers your question, and **compare two dashboards** to understand why their numbers differ. Only dashboards whose dbt model is Gold-certified are shown.

Built as a branch of `open-metadata/OpenMetadata` (`openmetadata-ui`, tag `1.12.8-release`) purely to render the idea inside the real OpenMetadata chrome. **This is a Path-B artifact** (see below) used as a *discovery visual only*.

## How to run it locally (no backend needed)

```bash
cd openmetadata-ui/src/main/resources/ui
VITE_CM_PREVIEW=true yarn start   # http://localhost:3000/concept-map
```
The `preview/concept-map-local` branch adds a dev-only shim (`VITE_CM_PREVIEW`) that seeds a logged-in session and bypasses the auth providers so the app renders without a backend. That shim is **not** part of the feature.

## Files in this branch (`feat/concept-map-tab`)

**New (the feature):**
- `src/pages/ConceptMapPage/ConceptMapPage.component.tsx` — the page (Ant Design, light): fronts grid → front sub-topics → cards → detail drawer → compare.
- `src/pages/ConceptMapPage/conceptMapData.ts` — **the hardcoded data** (taxonomy + per-dashboard facets + links). This is the file that must eventually be replaced by live OpenMetadata reads.

**Changed (wiring the route + left-sidebar tab):**
- `src/constants/constants.ts` — `ROUTES.CONCEPT_MAP = '/concept-map'`.
- `src/enums/sidebar.enum.ts` — `SidebarItem.CONCEPT_MAP`.
- `src/constants/LeftSidebar.constants.ts` — adds the "Concept Map" entry to `SIDEBAR_LIST` (left sidebar), after Explore (reuses an existing icon).
- `src/components/AppRouter/AuthenticatedAppRouter.tsx` — lazy import + `<Route path={ROUTES.CONCEPT_MAP}>`.
- `src/locale/languages/en-us.json` — `label.concept-map`, `label.compare`.

**Preview-only shim (`preview/concept-map-local` branch, NOT for merge):**
- `src/preview/conceptMapPreview.ts`, plus guards in `AuthProvider.tsx` and `AppRouter.tsx`.

## What is REAL vs HARDCODED right now

**Already linked to real OpenMetadata assets** (identifiers pulled live from OM dev):
- Dashboard deep links — real `newsela-rattle-tableau.<uuid>` FQNs → `/dashboard/<fqn>`.
- "Trusted model" links — real backing dbt model tables → `/table/<fqn>` in `main_analytics`.
- Glossary link — the real **Newsela Product Data Dictionary** → `/glossary/...`.

**Hardcoded / simulated (temporary, for discovery)** — in `conceptMapData.ts`:
- The front / sub-topic taxonomy and which dashboard belongs where.
- Each card's one-line "what question it answers" text.
- The facet tags (grain, population, products, trials) and their colors.
- The "good to know" caveats.
- The front definitions ("How active and engaged teachers…").
- Owner shown as "Data Analytics".
- The Gold filter (the list is pre-filtered by hand to the 25 Gold-dbt-model boards).

## What must be replaced later (so the UI is a shell, not a doc)

| Hardcoded today | Should derive from OpenMetadata |
|---|---|
| Card "answers" text | Dashboard **description** (standardized to "primary question answered") |
| Facet tags | Dashboard **tags / custom properties** |
| "Good to know" caveats | Dashboard **custom property** |
| Front → dashboard routing | Dashboard **Concept/category tag** |
| Front definitions | **Glossary** term descriptions (Product Data Dictionary) |
| Owner | OpenMetadata **owner** |
| Gold filter | Live **certification** of the backing dbt model |
| Facets not on the dashboard | **Inherited from the data source** (dbt model) once lineage is connected |

**Principle:** descriptions, tags, and glossary links must **not** be duplicated or hardcoded in the final UI. The UI is a shell that composes metadata already governed in OpenMetadata.

## Ownership (post-PD feedback)

- **Analytics owns**: the use case, the taxonomy, the content, the metadata mapping, and validating the value.
- **PD owns**: OpenMetadata platform guardrails, API/architecture guidance, and approval of metadata changes where they are code owners.

## Two paths

- **Path A (recommended V0)** — a read-only POC **outside** the OpenMetadata core that consumes the OpenMetadata API read-only and deep-links back to native OM assets. Hosted in Lovelace, GitHub Pages, or locally. No Kubernetes, no deploy, no official navigation, no PD operational responsibility.
- **Path B (future / optional)** — a native in-OpenMetadata experience (this branch), only if explicitly prioritized later. Requires a UI fork + custom image build/deploy pipeline that does not exist today.

If publishing inside OpenMetadata is not viable this quarter (scope / demand / ownership / complexity), **Lovelace is an acceptable V0**: an Analytics-owned page that consumes OpenMetadata as the source of truth and redirects to native OM assets.
