# ADR 0002 — Say what it is

**Status:** accepted

## Context

The README described a "24/7 Autonomous Workflow Intelligence Platform" with
a "real-time perception-action loop" that "predicts failures before they
occur"; the Settings screen said "Using Claude 3.5 Sonnet / OpenAI GPT-4o
hybrid" and "Zapier, Slack, Jira, and 12 other connected APIs"; a badge said
"LIVE TRAFFIC". The repository is a React front end with no network calls.
`package.json` has no HTTP client and no model SDK.

Buttons — Global Scan, Execute Strategy, Apply Fix Routine, Reset Agent,
Import SOP, the bell, the search box — did nothing when clicked.

## Decision

The UI and the README describe the thing that exists: a front-end prototype
of an operations dashboard whose data is simulated in the browser.

- Text that named products or capabilities the code does not have is
  replaced with what is true ("None configured — findings and scores are
  simulated in-process").
- Controls with no behaviour are `disabled` with a `title` that says so,
  rather than styled as live. The search box, which is cheap to make real,
  filters the lists.
- The feed badge says "SIMULATED FEED"; the sidebar shows the source's
  `status`.
- The README's feature list becomes a description of the screens and the
  seam a backend would plug into.

## Consequences

- The repository is a smaller claim and a truthful one. As a portfolio piece
  it shows front-end work, motion, and a testable data seam — which is what
  it contains.
- Anyone who wants the autonomous platform of the old README has a clear
  starting point: implement `DataSource`.
