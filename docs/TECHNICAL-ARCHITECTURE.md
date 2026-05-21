# Technical Architecture

## Overview

A static documentation site for the **Agile Flow** agent harness. The site
exists to lower cognitive load for solo founders learning the platform and
to convert evaluators into vibeacademy forks (see
[PRODUCT-REQUIREMENTS.md](PRODUCT-REQUIREMENTS.md) for the full PRD).

Architecture is deliberately minimal: static-site generation at build time,
client-side search at runtime, no application server, no database, no auth.
The only runtime dependency beyond the CDN is the future error-receiver
endpoint (deferred — see "Error Receiver" below).

## Technology Stack

### Frontend

- **Framework**: [Astro 6](https://astro.build/) — chosen for its zero-JS-by-default
  output model, MDX support, and first-class Starlight integration.
- **Docs theme**: [Starlight 0.39](https://starlight.astro.build/) — ships
  navigation, sidebar autogeneration, dark mode, i18n hooks, and the
  Pagefind-based built-in search that satisfies the PRD's primary navigation
  requirement.
- **Language**: TypeScript 5.x (strict mode — extends `astro/tsconfigs/strict`).
- **Content authoring**: MDX (Markdown + JSX) for pages that need embedded
  components (e.g., Loom embed wrappers, slash-command tables).
- **Styling**: Starlight's built-in CSS system; only override via
  `src/styles/` when a custom rule is unavoidable.
- **Asset pipeline**: `sharp` (auto-installed by Astro) for image optimization.

### Backend

None at MVP. The site is fully static.

Two future runtime endpoints, both deferred:

1. **Error receiver** — Cloudflare Worker accepting Sentry envelopes and creating
   GitHub issues. See "Error Receiver" section below.
2. **Mailing list signup proxy** — likely a Cloudflare Worker that forwards the
   form submission to the chosen provider (ConvertKit / Buttondown). Provider
   selection is itself a backlog ticket.

### Search

- **Stack**: [Pagefind](https://pagefind.app/) (bundled via Starlight).
- **How it works**: at build time, Pagefind crawls the static output, generates
  a per-page search index, and ships the runtime as a ~50 KB browser-side
  bundle. Search runs entirely client-side — no API call, no per-query infra.
- **Performance budget**: the PRD targets sub-200 ms search results. Pagefind
  returns indexed lookups in 10-50 ms on modern hardware; CDN-edge delivery of
  the index pieces is what drives total latency. Cloudflare Pages on the free
  tier serves from 270+ POPs, well inside the budget for the global audience.

### Infrastructure

- **Hosting**: **Cloudflare Pages**. Pages-native deploys from the
  `dist/` directory; automatic per-PR preview URLs; free tier covers the
  MVP traffic targets (100 click-throughs in 3 months).
- **CI/CD**: GitHub Actions —
  [.github/workflows/ci.yml](../.github/workflows/ci.yml) runs `npm ci` + `astro check`
  + `astro build` on every PR;
  [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) deploys to
  Cloudflare Pages on push to `main` via the official `cloudflare/wrangler-action@v3`.
- **Monitoring** (deferred): the framework's error-receiver pattern, when
  ported, sends Astro runtime errors (build-time + worker-side, if added) to
  the GitHub-issue ingest pipeline.

## System Design

### Component Diagram

```text
┌─────────────────┐                ┌─────────────────────────┐
│ Author (MDX)    │ ── git push ──►│ GitHub (main branch)    │
└─────────────────┘                └────────────┬────────────┘
                                                │ workflow trigger
                                                ▼
                                   ┌─────────────────────────┐
                                   │ GitHub Actions          │
                                   │  ci.yml (PR validation) │
                                   │  deploy.yml (on main)   │
                                   └────────────┬────────────┘
                                                │ wrangler-action
                                                ▼
                                   ┌─────────────────────────┐
                                   │ Cloudflare Pages        │
                                   │  dist/ -> 270+ POP CDN  │
                                   └────────────┬────────────┘
                                                │ HTTPS
                                                ▼
                                   ┌─────────────────────────┐
                                   │ Browser                 │
                                   │  Static HTML +          │
                                   │  Pagefind search bundle │
                                   └─────────────────────────┘
```

### Data Flow

There is no application-layer data flow. Every interaction is either:

1. A static page fetch (HTML + CSS + minimal JS) from the CDN.
2. A search query handled entirely client-side by Pagefind against pre-built
   index shards loaded on demand.
3. (Future) A POST to the mailing-list-signup endpoint, forwarded to the
   chosen provider by a Cloudflare Worker.
4. (Future) An error envelope from `@sentry/astro` SDK to the error-receiver
   Worker, which calls the GitHub Issues API.

### API Design

No app-internal APIs. External APIs consumed:

- **GitHub Issues API** (future, error receiver only) — `POST /repos/{owner}/{repo}/issues`.
- **Mailing-list provider** (future, signup form only) — provider-specific.
- **Loom embed iframe** — pure static iframe; no API key.

## Data Models

No persistent data store. Content is the data model:

- **Doc pages** — MDX files under `src/content/docs/` keyed by slug. Schema is
  [Starlight's built-in `docsSchema`](https://starlight.astro.build/reference/frontmatter/).
- **Sidebar config** — defined declaratively in
  [astro.config.mjs](../astro.config.mjs) (`starlight.sidebar`).
- **Future, mailing-list opt-ins** — stored at the chosen provider, not in this repo.

## Development Standards

### Project layout

```text
.
├── astro.config.mjs          # Astro + Starlight config (entry point)
├── package.json              # deps + scripts
├── tsconfig.json             # extends astro/tsconfigs/strict
├── public/                   # static assets served as-is (favicon, og:image)
├── src/
│   ├── assets/               # imported assets (optimized by Astro)
│   ├── content/
│   │   ├── docs/             # MDX docs pages
│   │   └── content.config.ts # collection schema (Starlight-managed)
│   └── styles/               # global CSS overrides (when unavoidable)
└── dist/                     # build output (gitignored)
```

### Code Style

- **Linting**: `astro check` (covers TS + content schema + frontmatter
  validation in one pass). Aliased to `npm run check` and `npm run lint`.
- **Formatting**: rely on Prettier defaults via VS Code if installed; no
  enforced pre-commit formatter for MVP (low value vs. setup cost on a
  content-heavy repo).
- **Naming**: kebab-case for files and slugs; PascalCase for `.astro` component
  filenames when they're added.

### Testing Requirements

- **MVP**: none. Astro's `astro check` catches schema violations, broken links
  within content collections, and TS errors. The site has zero application
  logic to unit-test. Manual smoke test = `npm run dev` and visiting key pages.
- **Phase 2 candidate**: add Playwright for end-to-end smoke tests of the six
  MVP features (search returns ≥1 result for known query; agent-roster page
  renders all configured agents; mailing-list form POSTs successfully).
- **Coverage threshold**: N/A for MVP.

### Documentation

- The site **is** the documentation. Inline comments inside MDX are reserved
  for non-obvious authoring decisions (e.g., why a particular Loom embed needs
  a wrapper component).
- ADRs for technology decisions go in this file's "Architecture Decision
  Records" section below.

### Code Review

Standard framework review checklist (`pr-reviewer` agent). Domain-specific
checks for this codebase:

- New MDX pages have valid frontmatter (`title`, `description`).
- Internal links use Astro/Starlight relative slugs (not `.md` extensions).
- Any client-side script added is justified — the default-zero-JS posture is
  load-bearing for the < 200 ms search target.
- Sidebar entries in `astro.config.mjs` are kept in sync when pages are
  added/renamed.

## Security

### Authentication

None at MVP. Site is fully public per PRD section "Out of Scope (v1)".

### Authorization

N/A.

### Data Protection

- HTTPS enforced by Cloudflare Pages by default.
- No PII collected at MVP. The mailing-list form (when added) will hand off
  the email to a third-party provider; data residency follows the provider's
  policy.
- The error-receiver Worker (when added) accepts Sentry envelopes which may
  include stack traces with file paths. Treat the receiver as
  internet-exposed and rate-limit by IP + by error fingerprint.

## Scalability

### Current Targets

- 100 click-throughs to vibeacademy repos in the first 3 months (PRD primary
  metric). Conservative read: < 10k unique visitors / month at MVP.
- < 200 ms search results (PRD non-functional requirement).
- < 2 s page loads on a typical connection (PRD non-functional requirement).

### Scaling Strategy

Static site on a global anycast CDN — scaling is effectively bandwidth-bound
and handled by Cloudflare. No capacity work required for MVP.

Worker endpoints (future) scale per Cloudflare's request-based model; the
error-receiver's rate-limit ceiling (one issue per error message per hour) is
the actual cost-control mechanism, not request volume.

## Error Receiver

**Status: deferred.** The framework's `/bootstrap-architecture` skill mandates
an error receiver for all stacks. This is intentionally a follow-up ticket
because:

1. Static sites have no server-side runtime errors at MVP — only build-time
   failures (caught by CI) and client-side JS errors (Astro ships almost no
   client JS by default).
2. Implementing the receiver requires a Cloudflare Worker, a Worker route
   binding, the `@sentry/astro` SDK, and a `GITHUB_TOKEN` rotation policy —
   none of which add reviewer-facing value to this scaffolding PR.

**Planned implementation** (file as ticket post-merge):

- `workers/error-receiver/` directory with `wrangler.toml` and `src/index.ts`.
- Endpoint: `POST /api/error-events` (Worker route bound to the Pages
  production hostname).
- Behavior: parse Sentry envelope → dedupe by error fingerprint with 1h TTL →
  call `POST /repos/vibeacademy/agile-flow-docs/issues` with label `bug:auto`.
- Always return HTTP 200 (suppresses SDK retries).
- Env vars: `GITHUB_TOKEN`, `GITHUB_REPOSITORY` (set via `wrangler secret put`).
- Astro-side: install `@sentry/astro`, configure `Sentry.init({ dsn })` where
  DSN points at the Worker route. Self-DSN construction is unnecessary for
  Pages — the production hostname is known statically.

## Architecture Decision Records

### ADR-001: Astro + Starlight over Docusaurus / VitePress / MkDocs

- **Status**: Accepted (2026-05-21).
- **Context**: The PRD requires a docs site that (a) has excellent built-in
  search, (b) supports embedded video and visual diagrams without per-page
  plumbing, (c) ships fast on a CDN-only deploy, (d) has a low maintenance
  ceiling for a solo founder. Several candidates fit:
  - **Docusaurus**: best-in-class React, but ships meaningful client-side JS;
    Algolia DocSearch is the recommended search and requires a free-tier
    application + approval.
  - **VitePress**: minimal Vue-based, fast, but search relies on local index
    that's less curated than Starlight's Pagefind integration.
  - **MkDocs (Material)**: Python-based, excellent for code-heavy docs,
    but adds a separate Python toolchain to an otherwise JS stack.
  - **Astro + Starlight**: zero-JS-by-default; Pagefind search ships as a
    bundled integration; MDX-first; first-class TypeScript story; small
    ecosystem but actively maintained by the Astro core team.
- **Decision**: Astro + Starlight. Decisive factor was Pagefind out-of-the-box
  (no external dependency, no API key, no approval gate) and zero-JS by
  default (helps the < 200 ms perceived-latency target on initial page load
  for the search-route navigation pattern the PRD targets).
- **Consequences**:
  - Stack-locked to Node.js (no Python toolchain in this repo going forward).
  - Smaller ecosystem of Astro themes vs. Docusaurus, but Starlight covers
    the docs use case completely. If we ever need a deeply custom layout, we
    fall back to building Astro components from scratch — not a downgrade.
  - Pagefind's index ships with the static site; index size grows linearly
    with content. At MVP scope (low dozens of pages) this is < 100 KB.

### ADR-002: Cloudflare Pages over Vercel / Netlify / Render

- **Status**: Accepted (2026-05-21).
- **Context**: Hosting needs:
  - Free tier covering MVP traffic (< 10k visitors/month).
  - Per-PR preview deployments to support the framework's review workflow.
  - Edge runtime available for the future error-receiver and mailing-list
    Worker endpoints (avoids splitting the stack between a static host and a
    separate function host).
  - Fast global edge for the < 200 ms search target.
- **Decision**: Cloudflare Pages, with Workers as the runtime substrate for
  future endpoints.
- **Consequences**:
  - Workers' Web-Standards API differs from Node — any future shared utility
    code between build-time and runtime needs to be isomorphic, not Node-only.
  - Pages preview URLs do not survive a force-push to the same branch (each
    push creates a new ephemeral URL). Acceptable trade-off for the
    framework's "human merges PRs" workflow.
  - Locks us to Cloudflare's free-tier limits (currently 500 builds/month,
    100k requests/day for Workers). The MVP comfortably fits; if Phase 3 growth
    blows past these we re-evaluate then.

### ADR-003: Defer the error receiver to a follow-up ticket

- **Status**: Accepted (2026-05-21).
- **Context**: The framework's `/bootstrap-architecture` skill mandates an error
  receiver for every stack. For a static Astro site at MVP, the only error
  surface is build-time (caught by CI) and client-side JS errors (rare —
  Starlight ships ~no client JS). Wiring `@sentry/astro` + a Worker route +
  GitHub-token rotation adds meaningful diff size to a scaffolding PR
  without protecting any observed failure mode at MVP.
- **Decision**: Document the planned implementation in this file's "Error
  Receiver" section and file a P2 follow-up ticket once `main` is in a
  buildable state.
- **Consequences**:
  - If a client-side JS bug ships before the receiver lands, we'll lose
    visibility into it until a user reports it manually. Risk is bounded by
    the near-zero JS footprint of Starlight.
  - The framework's "Required for All Stacks" rule is intentionally relaxed
    here; flag in the PR description so an upstream maintainer reviewing this
    fork's bootstrap doesn't read it as an oversight.

## Revision History

| Date       | Change                                                                                              | Author   |
|------------|-----------------------------------------------------------------------------------------------------|----------|
| 2026-05-21 | Initial architecture: Astro + Starlight on Cloudflare Pages; error receiver deferred; three ADRs. | tck517   |
