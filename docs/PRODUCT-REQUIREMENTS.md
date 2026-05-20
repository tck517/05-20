# Product Requirements Document

## Product Overview

- **Type**: Web application
- **Category**: Developer tools
- **Domain**: A docs site for a developer platform (Agile Flow)
- **Value Proposition**: Provide a great documentation experience for users of the Agile Flow agent harness.

## Vision and Problem Statement

### Problem

Agile Flow users today have only one way to learn the platform: read raw
markdown files inside the GitHub repo. That works for the technically
fluent but is inaccessible to "civilians" — including the solo founders
who are the platform's primary audience.

### Vision

A dedicated docs site that helps users maximize the value of Agile Flow
by clearly explaining how to use it, lowering cognitive load and
shortening time-to-first-value.

### How People Solve This Today

The only existing documentation is markdown in the repository itself.
This is not accessible to non-technical or evaluating users — it requires
navigating GitHub, reading raw markdown, and stitching context together
across files.

## Target Audience

### Primary Users

- **Who**: A solo founder who wants to ship a product using Agile Flow.
- **Pain Point**: Cognitive load — too much to keep in working memory while learning a multi-agent harness.
- **Current Solution**: Reading markdown directly on GitHub.

The audience also includes people **evaluating** Agile Flow who need to
decide whether to adopt — better docs directly improve their evaluation
experience and conversion likelihood.

### Secondary Users

None — single user type.

## Features

### MVP (Must Have)

- [ ] **Search** — full-text search across all docs content; primary navigation method.
- [ ] **Loom video embeds in context** — ability to link or embed Loom videos directly inside doc pages.
- [ ] **Slash-command cheat sheet** — at-a-glance reference of the main `/` commands available in the harness.
- [ ] **Agent roster** — page that lists each agent with an avatar and short bio.
- [ ] **Flow diagram** — visual diagram of how the agents and artifacts flow through the workflow.
- [ ] **Mailing list signup + seminar lead page** — capture interest for the seminar and grow a contact list.

### Out of Scope (v1)

- User login / authentication. The site is fully public for v1.

### Core Value Proposition

The product must do **search** exceptionally well. Search is the primary
way users will route around their cognitive-load problem and find the
answer they need fast.

## Success Metrics

| Metric | Target (3 months) |
|--------|-------------------|
| Primary: Click-throughs from docs to vibeacademy repos (leading indicator of intent-to-fork) | 100 click-throughs |

## Competitive Analysis

| Competitor | Strength | Weakness | Your Differentiator |
|-----------|----------|----------|---------------------|
| Reading the Agile Flow markdown on GitHub directly (the only alternative) | Always current with source | Raw markdown, no search, no diagrams, no embedded video, hostile to non-technical users | Purpose-built docs experience: search, navigation, embedded video, and visual diagrams aimed at solo founders and evaluators |

## Constraints and Requirements

- **Timeline**: ASAP — target launch within 1-2 weeks.
- **Budget**: Not a binding constraint.
- **Technical**: Built on **Astro + Starlight**.
- **Team**: Solo founder.

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Security | Public site, no auth in v1. Standard HTTPS. |
| Performance | Search results return in under 200 ms on the client; page loads under 2 s on a typical connection. |
| Scalability | Static site — capacity is essentially CDN-bound. |
| Accessibility | WCAG 2.1 AA as a working target (Starlight's defaults). |

## Dependencies

- Astro + Starlight (site framework).
- Loom (embedded video host).
- Mailing-list provider for signup capture (TBD during architecture phase).
- vibeacademy repos (click-through destination for the primary metric).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 1-2 week launch window is tight | High | Keep MVP scope frozen at the six features above; defer everything else. |
| Search quality is the make-or-break feature | High | Use Starlight's built-in search and tune content for findability before adding any custom search work. |
| Docs drift from the underlying Agile Flow repo | Medium | Establish a simple sync/review cadence after launch; out of scope for v1. |

## Glossary

| Term | Definition |
|------|------------|
| Agile Flow | The agent harness / developer platform that this docs site documents. |
| Slash command | A `/`-prefixed command used inside the Agile Flow harness. |
| Vibeacademy | The downstream repos users fork from after deciding to adopt Agile Flow. |
