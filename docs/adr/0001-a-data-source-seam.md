# ADR 0001 — A `DataSource` seam; the simulation is its only implementation

**Status:** accepted

## Context

Every figure on screen was a constant inside a component: the stats grid,
the bottleneck list, the SOP scores, the "24 Active" contributors. The
"real-time" feed was a `setInterval` in `WorkflowMonitor` drawing names and
actions from `Math.random()`; the "AI findings" toasts were another interval
in `App` choosing one of four strings 30% of the time. Ids came from
`Date.now()`. None of it could be tested, and nothing in the UI said that it
was made up — the sidebar said "Live Engine … scanning 4 active workflows".

## Decision

`src/lib/data.ts` defines the types and a `DataSource` interface: the
catalogues (`getStats`, `getBottlenecks`, `getSuggestions`, `getSops`,
`getSettingsSections`, `getInitialEvents`), two subscriptions
(`subscribeEvents`, `subscribeFindings`) and a `status` whose `mode` is
`simulation` or `live`.

`src/lib/simulation.ts` is the only implementation. It is the old inline
behaviour, moved: the same catalogues, the same intervals and probabilities —
but the random generator and the clock are injectable, ids come from
counters, and its `status.mode` is `simulation`. Components get the source
from a React context and render whatever it returns; the sidebar renders
`status`.

## Consequences

- The UI is testable with a hand-driven source; the simulation is testable
  with a seeded generator and fake timers.
- A backend, when one exists, implements the interface and flips the mode.
  Until then the page says "Simulation" and every panel that shows invented
  numbers says so.
- The design (glass panels, motion) is unchanged; this is a seam, not a
  redesign.
