# Christmas Movie Advent Calendar — React

A small React + TypeScript + Vite application with plain CSS. No UI library, backend, external movie API, images, or state-management package.

## Run

Use Node.js 22.12+ (or Node.js 20.19+).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check and preview production:

```sh
npm run build
npm run preview
```

## Development date

`src/date.ts` contains the only development setting:

```ts
export const DEVELOPMENT_DAY: number | null = 10;
```

The current setting `10` simulates December 10 during `npm run dev`: doors 1–10 are available and 11–24 are locked. Change line 3 of `src/date.ts` to another December day (1–31), or set it to `null` to use the real local date. Editing movies is closed during simulated December. Production always uses the real date. The small development note never appears in production.

The calendar belongs to the current year: January through November are locked, December 1–23 unlock through today, and December 24–31 unlock all 24. On January 1 a new year's calendar starts. The clock refreshes every 30 seconds. The countdown reaches zero on Christmas Day and remains zero through December 31.

## Components and React concepts

- `App.tsx`: owns the date; its small `AdventCalendar` component owns `openDay` and `openedDays` using `useState`. A year change remounts the calendar with the new year's storage.
- `Calendar.tsx`: uses `movies.map()` to render 24 `CalendarDoor` components with stable day keys. Data and callbacks pass down through props.
- `CalendarDoor.tsx`: renders a native button. An `onClick` handler updates the parent. Props select its locked, previously opened, today, and flipped styles. Conditional rendering inserts a title only while that door is open. CSS handles the flip; reduced-motion preferences disable animation.
- `Countdown.tsx`: receives the date as a prop and displays a simple calculated day count.

`openDay` contains one number or `null`, so two cards cannot remain open simultaneously. Clicking the current card closes it. `openedDays` is separate history; opening another card never erases history.

A `useEffect` writes history to localStorage after it changes. A lazy `useState` initializer loads it once. The year-specific key is `christmas-movie-calendar:2026:opened` (with the current year). Refreshing restores the markers but starts with all cards closed. Invalid stored values are filtered; corrupt or unavailable storage does not crash the app. Stored history never overrides date locks.

React-specific features are JSX, components, props, `useState`, `useEffect`, React event handlers, conditional JSX, and list keys. The movie array, date calculations, storage format, CSS grid, and CSS animation can be reused in Vue and Angular.

## Comparison contract

Keep these identical in the other implementations:

1. The 24 `{ day, title }` records in `src/movies.ts`.
2. One open day (`number | null`) and a separate list of revealed days.
3. Local calendar-date unlocking and the current-year season boundary.
4. Year-scoped browser history; no automatically open door after reload.
5. A December 25 countdown using calendar-day arithmetic.
6. The same CSS, layout, labels, and development simulation behavior.

This is a front-end surprise, not a security mechanism: movie data is included in the downloaded source, as expected for a backend-free project.

## Verification completed

- TypeScript check and Vite production build passed.
- Browser preview: all 24 doors, December 10 simulation, 14 future doors disabled.
- Open December 3, then December 4: only December 4 stays open.
- Refresh: previously opened markers remain, all doors close.
- Desktop (1440px): six columns; mobile (390px): two columns; neither has horizontal overflow.
- Date-function checks: January 1, November 30, December 1, 5, 10, 24, 25, and 31.
- Development simulation and production real-date override checked.
- Countdown checked for December 10, 25, and 31.

## Editing movies before December

Click **Edit movies** before December 1 to reveal the list and customize the 24 titles. **Save movies** trims and stores the titles; **Cancel** discards the draft. Empty titles are rejected. MovieEditor uses local `useState` for the draft and passes the finished list to App through an `onSave` prop. Calendar now receives movies through props.

Titles are saved separately under `christmas-movie-calendar:YEAR:movies`. They persist in this browser for the current year's calendar. The next year starts with the placeholder list. Editing closes during December, including a date check when saving a form left open across midnight. The development date also controls editing availability. No new packages are used.

Verified: all 24 inputs, save and refresh persistence, cancel discarding edits, and no Edit movies button under simulated December 10. Production build passes. Add these same rules to Vue and Angular for a fair comparison.
