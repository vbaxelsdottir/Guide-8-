# Christmas Movie Advent Calendar — Vue

Vue 3, TypeScript, Vite, Single-File Components and `<script setup>`, with plain CSS. No UI library, Pinia, backend or external movie API.

## Run

Use Node.js 22.12+ (or 20.19+). From the repository root:

```sh
cd vue
npm ci
npm run dev
```

Vite starts at port 5174, or the next free port. Use the URL it prints. React and Vue can run at the same time on different ports.

```sh
npm run build
npm run preview
```

## Test dates

Edit `src/date.ts`:

- Line 3: `DEVELOPMENT_MODE = 'december'` simulates December.
- Line 4: `DEVELOPMENT_DAY = 10` unlocks doors 1–10; change the number to test another December day (1–31).
- The current setting is `DEVELOPMENT_MODE = 'before-december'` to simulate November 30 and test the movie editor, even if the real date is in December.
- Set `DEVELOPMENT_MODE` to `null` to use today's real date.

Production builds always use the real local date. The simulation controls both door locks and editing; editing is never enabled during simulated December. January–November lock all doors, December 1–23 unlock through today, and December 24–31 unlock all doors. A new year starts a new calendar. The countdown reaches zero on December 25 and stays zero through December 31.

## Components and Vue concepts

- `App.vue` owns reactive state with `ref()`: the current date, open door, opened history, movies and editing mode. `computed()` derives availability, editing eligibility and the visible door. Lifecycle hooks start and clean up a 30-second date timer.
- `Calendar.vue` receives props and uses `v-for` with stable day keys to render 24 doors. It forwards a child's `toggle` event.
- `CalendarDoor.vue` receives state through props, emits `toggle`, uses conditional classes for the flip, and inserts the title with `v-if` only while open.
- `Countdown.vue` derives its count with `computed()` from its date prop.
- `MovieEditor.vue` copies the movie list into a local reactive draft. `v-model` binds each input, `@submit.prevent` handles saving, and `save`/`cancel` emits communicate with App. Cancel unmounts the editor, discarding the draft.

Only `openDay` controls the flipped card: it is a single number or `null`. Previously opened history is separate. A `watch()` saves history after changes; refresh loads the history while resetting the visible door. Year changes reload the new year's history and movie list. Save explicitly writes the edited list to storage and checks that December has not started. Empty/whitespace-only titles are rejected, titles are trimmed and limited to 120 characters, and storage errors are shown without discarding the draft.

## Fair comparison with React

The CSS, default `{ day, title }` data and storage helper are copied exactly from React. Visible design, flip animation, date rules, countdown, title validation, save/cancel behavior and browser persistence match it. Vue replaces React state/effects/JSX with refs, computed values, watchers, templates, props and emits. The only additional development setting is a named November 30 mode so editing can be tested throughout the year.

Both implementations use the same year-specific storage format (`christmas-movie-calendar:YEAR:opened` and `christmas-movie-calendar:YEAR:movies`). Different ports have separate browser storage. If served on the same origin, the implementations share those keys. No server sync or authentication is involved.

Movie titles are hidden in the normal calendar UI, not secured against source inspection; data is shipped to the browser, just as in React.

## Verification

- TypeScript (`vue-tsc`) and Vite production build pass.
- Exactly 24 doors; default December 10 has 10 available and 14 locked.
- Opening December 7 closes December 3; refreshing restores opened markers with no flipped cards.
- November 30 exposes 24 editor fields and locks all doors.
- Edited titles survive reload; Cancel discards unsaved titles; whitespace-only titles are rejected.
- December mode hides the editor. The preview is now set to November 30 so the editor is available.
- 390px mobile and 1440px desktop grids fit without horizontal overflow.
- React source, configuration and README verified unchanged against the prior snapshot.
