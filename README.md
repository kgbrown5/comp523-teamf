# comp523-teamf
Project Website for COMP523 Team F

Static HTML/CSS site, deployed using Vercel.

## Local preview

```bash
npx serve .
```

## Structure

- `index.html` — Project intro
- `team.html` — Team roles, contact info, client info
- `schedule.html` — Assigned action items, completed work, and recurring meeting schedule
- `rules.html` — Team rules
- `journal.html` — Meeting journal (reverse chronological)
- `deliverables`
    - `specifications.html` — D1: Specifications
    - `architecture.html` — Architecture Analysis
    - `systems-metaphor.html` — Systems Metaphor

## Action items

The Todo & Schedule page refreshes its vertical action list from `journal.html`.
Keep meetings newest first, give each entry a unique `id` such as
`meeting-2026-10-26`, and mark its action list with `class="journal-actions"`.
Owners and deadlines stay in the journal text. The saved list in `schedule.html`
is also available when JavaScript is disabled or the page is opened locally.
