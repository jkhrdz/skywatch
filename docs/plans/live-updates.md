# Feature: Live status updates

**Why:** The board looks frozen. A real departures board changes all the time, so SkyWatch should feel live.

**Done means:** Every few seconds a flight's status changes on its own. The old status is erased one letter at a time, then the new one types in (for example "Cancelled" turns into "On time"), and a pulsing "LIVE" badge sits in the header.

## Chunk 1: Typewriter status text (#3)
**Goal:** When a flight's status changes, the Status cell erases the old word letter by letter, then types the new word, instead of swapping it instantly.

**Acceptance criteria**
- On first load, every status shows in full straight away, with no typing.
- When a status changes, the old text shrinks one letter at a time, then the new text grows one letter at a time.
- The colour (green/blue/amber/red) matches the new status once it starts typing.
- Screen readers get the final status, not each letter in between.

**Tests to write first**
- `TypewriterText shows the first text in full`: no animation on first render.
- `TypewriterText erases then types the new text`: with fake timers, after a few ticks part of the old word is gone; later part of the new word shows; at the end the full new word shows.
- `TypewriterText gives screen readers the final text`: the element's accessible label is the new status right away.
- Existing `DeparturesBoard` tests still pass unchanged.

**Files likely touched**
- `src/components/TypewriterText.jsx` (new)
- `src/components/TypewriterText.test.jsx` (new)
- `src/components/DeparturesBoard.jsx`: use `TypewriterText` in the Status cell
- `src/styles.css`: a blinking cursor while typing

**Out of scope**
- Anything that actually changes statuses (Chunk 2)

## Chunk 2: Fake live updates and LIVE badge (#4)
**Goal:** Every 5 seconds the app picks one flight and gives it a new, different status. The header shows a pulsing "LIVE" badge.

**Acceptance criteria**
- About every 5 seconds, one flight's status changes to a different status from: On time, Boarding, Delayed, Cancelled.
- Updates only start after flights have loaded, and stop when the page closes (no leftover timers).
- The header shows a "LIVE" badge with a small pulsing dot.

**Tests to write first**
- `pickStatusUpdate changes exactly one flight`: given a list and a fixed "random" number, one flight gets a new status and the rest are unchanged.
- `pickStatusUpdate never picks the same status`: the new status is always different from the old one.
- `pickStatusUpdate doesn't change the original list`: it returns a new list.
- `App changes a status over time`: with fake timers, after flights load and 5 seconds pass, one status on the board is different.
- `App shows the LIVE badge`.

**Files likely touched**
- `src/api/liveUpdates.js` (new): `pickStatusUpdate(flights, random)`
- `src/api/liveUpdates.test.js` (new)
- `src/App.jsx`: start a 5-second timer once flights load, clean it up on unmount; add the badge
- `src/App.test.jsx`
- `src/styles.css`: badge and pulse animation

**Out of scope**
- Changing gates or times (only statuses change)
- A real flight API

## Risks and open questions
- The updates are random and fake. That's fine for a demo, but the UI should never claim to be real data.
- Animations and fake timers can make tests flaky; tests must use `vi.useFakeTimers()` and never real waits.
- People who turn on "reduce motion" in their system settings probably shouldn't get the typing or pulsing. That could be a small follow-up.
- This branches from `main`, which doesn't have the theme toggle yet. Both features touch `App.jsx` and `styles.css`, so whichever merges second may need a small conflict fix.
