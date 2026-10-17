# Feature: Dark/light theme toggle

**Why:** The board is always dark navy. Some people find a light screen easier to read, especially in a bright room.

**Done means:** A button in the header switches the board between dark and light, and the page remembers your choice after a refresh.

## Chunk 1: Light theme and toggle button (#1)
**Goal:** A button in the header switches the whole page between the dark theme and a new light theme.

**Acceptance criteria**
- The page starts in dark mode, the same as today.
- The header has a button labelled "Switch to light mode".
- Clicking it turns the page light and changes the label to "Switch to dark mode". Clicking again switches back.
- In light mode, all text, including the flight status colours, is easy to read on the light background.

**Tests to write first**
- `ThemeToggle starts in dark mode`: the `<html>` element has `data-theme="dark"` and the button says "Switch to light mode".
- `ThemeToggle switches to light`: one click sets `data-theme="light"` and changes the label.
- `ThemeToggle switches back`: a second click returns to dark.
- `App shows the theme toggle`: the button appears in the app header.

**Files likely touched**
- `src/components/ThemeToggle.jsx` (new)
- `src/components/ThemeToggle.test.jsx` (new)
- `src/App.jsx`: add the button to the header
- `src/App.test.jsx`: check that the button is there
- `src/styles.css`: light colour values under `[data-theme="light"]`, and change the hard-coded border colour `#1e3a5f` into a variable

**Out of scope**
- Remembering the choice after a refresh (Chunk 2)
- Following the computer's dark/light setting (Chunk 2)

## Chunk 2: Remember the choice (#2)
**Goal:** The page remembers your theme in `localStorage`. On a first visit, it follows the computer's dark/light setting.

**Acceptance criteria**
- After picking light mode and refreshing, the page is still light.
- On a first visit with nothing saved, the page uses the system setting (`prefers-color-scheme`), and dark if that's unknown.
- If `localStorage` is blocked or throws an error, the toggle still works. It just doesn't remember.

**Tests to write first**
- `ThemeToggle saves the choice`: clicking stores `"light"` under the key `skywatch-theme`.
- `ThemeToggle uses a saved choice`: with `"light"` already saved, it starts light.
- `ThemeToggle follows the system setting`: with nothing saved and a light system preference, it starts light.
- `ThemeToggle survives broken storage`: if `localStorage` throws, clicking still switches the theme with no crash.

**Files likely touched**
- `src/components/ThemeToggle.jsx`
- `src/components/ThemeToggle.test.jsx`

**Out of scope**
- Avoiding a quick dark flash before React loads on a light-mode refresh. That needs a script in `index.html`; noted as a possible follow-up.

## Risks and open questions
- jsdom (the fake browser the tests run in) has no `window.matchMedia`, so Chunk 2's tests need to mock it.
- The light colours are a judgement call. You should look at them in the browser before merging Chunk 1.
