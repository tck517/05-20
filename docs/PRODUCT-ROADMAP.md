# Product Roadmap

## Overview

Ship a public Astro + Starlight docs site for the Agile Flow agent
harness within 1-2 weeks. Phase 1 (MVP) delivers the six core features
needed to make the platform learnable by solo founders and evaluators.
Phase 2 iterates on real user feedback, and Phase 3 grows usage of the
docs as an acquisition surface for the vibeacademy repos.

## Phase 1: MVP

- **Target**: Launch within 1-2 weeks (by approximately 2026-06-03).
- **Goal**: Deliver a learnable docs experience that meaningfully lowers cognitive load for solo founders using Agile Flow.

### Features

| Feature | Priority | Status |
|---------|----------|--------|
| Search across all docs (primary navigation) | P0 | Backlog |
| Loom video embeds in context | P0 | Backlog |
| Slash-command cheat sheet | P0 | Backlog |
| Agent roster with avatars and bios | P0 | Backlog |
| Flow diagram of the agent workflow | P0 | Backlog |
| Mailing list signup + seminar lead page | P0 | Backlog |

### Success Criteria

- [ ] All six MVP features live on a public URL.
- [ ] Search works across every published page.
- [ ] On track toward 100 click-throughs to vibeacademy repos within 3 months of launch.

## Phase 2: Iteration

- **Target**: 1-2 months after launch.
- **Goal**: Iterate on real user feedback. Expect content gaps, search-query misses, and navigation issues to surface here.

### Features

| Feature | Priority | Status |
|---------|----------|--------|
| Content additions driven by observed search queries and feedback | TBD | Backlog |
| Search ranking / synonyms tuning | TBD | Backlog |
| Additional flow diagrams / agent deep-dives | TBD | Backlog |

### Success Criteria

- [ ] Hitting or exceeding the 100-click-through 3-month target.
- [ ] Mailing list growth trending up week-over-week.

## Phase 3: Growth

- **Target**: 3-6 months post-launch.
- **Goal**: Use the docs as a top-of-funnel acquisition surface that converts evaluators into vibeacademy forks.

### Features

| Feature | Priority | Status |
|---------|----------|--------|
| User login / personalization (explicitly deferred from v1) | TBD | Backlog |
| Versioned docs (if Agile Flow releases warrant it) | TBD | Backlog |
| Tutorials / guided onboarding flows | TBD | Backlog |

## Milestone Definitions

| Milestone | Criteria | Target Date |
|-----------|----------|-------------|
| M1: MVP Launch | All six MVP features live, public URL, search working | ~2026-06-03 |
| M2: 100 Click-throughs | 100 click-throughs to vibeacademy repos | ~2026-08-20 |
| M3: Growth | Sustained week-over-week mailing list and click-through growth | ~2026-11-20 |

## Constraints and Risks

| Risk | Phase | Mitigation |
|------|-------|------------|
| 1-2 week launch window is tight | 1 | Freeze MVP scope at the six features; defer everything else (including login) to later phases. |
| Search must be the standout feature; failure here undermines the whole product | 1 | Lean on Starlight's built-in search; tune content for findability before custom search work. |
| Docs content drifts from the Agile Flow source repo | 2 | Establish a sync/review cadence post-launch; out of scope for v1. |
| Solo founder is the only contributor — bus factor of one | All | Keep docs site simple and well-structured so contribution remains low-friction. |

## Dependencies

```text
Phase 1: MVP (Astro + Starlight site, six core features)
    |
    v
Phase 2: Iteration (requires user feedback and search-query data from Phase 1)
    |
    v
Phase 3: Growth (requires Phase 2 evidence that docs drive vibeacademy click-throughs)
```

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2026-05-20 | Initial roadmap created from /bootstrap-product questionnaire | tck517 |
