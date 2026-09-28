# Christmas Movie Advent Calendar — Angular

Equivalent to the React and Vue applications, using Angular 21, TypeScript, standalone components, signals and modern `@for` / `@if` templates. Styling, default movie data and storage helpers are copied from React. No UI library, external state manager, backend or movie API.

## Run

Use Node.js 22.12+ or Node.js 24. From the repository root:

```sh
cd angular
npm ci
npm run dev
```

Open http://127.0.0.1:4200/. React and Vue can continue running on their own ports.

```sh
npm run build
```

The production files are in `dist/calendar/browser`. Production always uses the real date. To view that build locally, serve that directory with a static HTTP server.

## Development date: src/date.ts

Line 3:

```ts
export const DEVELOPMENT_MODE: 'december' | 'before-december' | null = 'december';
```

- `'december'` (default): simulate December; doors 1–10 are available, 11–24 locked.
- `'before-december'`: simulate November 30; show **Edit movies** and lock every door.
- `null`: use the real current date.

Line 4:

```ts
export const DEVELOPMENT_DAY = 10;
```

Change 10 to another December day (1–31). There is no date-testing interface. Editing is intentionally hidden in December mode, just like React and Vue. `isDevMode()` prevents simulations in the optimized production build.

## Components and Angular concepts

- `src/app.ts` and `src/app.html`: own the date, movie list, opened history and editor state. `signal()` stores mutable state; `computed()` derives availability and the visible door. An `effect()` persists opened history. Lifecycle hooks start and stop the 30-second date refresh timer.
- `src/components/calendar.ts`: receives data through `input()` and renders 24 doors with `@for (...; track movie.day)`. Forwards door events with `output()`.
- `src/components/calendar-door.ts`: uses input signals for state and emits its day on click. Conditional classes drive the same CSS flip. `@if` inserts a movie title only while its door is open.
- `src/components/countdown.ts`: computes the Christmas countdown from its date input.
- `src/components/movie-editor.ts`: initializes a separate draft in `ngOnInit()`. Property and event bindings connect inputs to that draft. Save trims and validates titles, then emits the list to App. Cancel unmounts the editor, discarding unsaved changes.

One `openDay` signal holds a number or `null`; it cannot represent multiple open doors. History is a separate array. Reload restores markers but initializes `openDay` to `null`.

The standalone components explicitly list the child components they use. No NgModule or routing is needed. Angular's built-in signal change detection updates the templates without a Zone.js dependency. Date arithmetic, storage format and CSS are ordinary TypeScript/browser features, not Angular-specific concepts.

## Matching behavior

The calendar belongs to the current year. January–November lock all doors and allow movie editing. December unlocks through today, with all doors available December 24–31. January starts a fresh year's history and defaults. Countdown reaches zero December 25 and stays zero through December 31.

Storage keys match the other implementations: `christmas-movie-calendar:YEAR:opened` and `christmas-movie-calendar:YEAR:movies`. Different localhost ports have separate browser storage. The editor accepts up to 120 characters per title, rejects whitespace-only titles and shows save failures while retaining the draft. The save handler rechecks the date to prevent saving a form left open into December.

The CSS is identical to React's. The door component adds only a host layout rule because Angular keeps a wrapper element for each component. No extra product features are added. Movie data remains inspectable in downloaded source, as expected for this front-end-only project.

## Verification

- Angular template/TypeScript compilation and production build passed.
- Browser: 24 doors, 10 available and 14 locked under December 10.
- Opening December 7 closes December 3; after reload, markers persist and no cards remain open.
- November 30: all 24 editor inputs, save/reload persistence, Cancel flow and whitespace validation checked.
- 390px mobile / 1440px desktop: two / six grid columns, with no horizontal overflow.
- Production served separately: all doors locked on the real September date, editing available, no simulation note.
- React and Vue's 34 project files match the previous archive unchanged.

Angular CLI disk caching is disabled and the development server polls for changes every second. These settings in `angular.json` avoid a native cache crash and file-watcher limits encountered on this machine; they do not change application behavior.
