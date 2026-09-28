# Christmas Movie Advent Calendar — Framework Comparison

This school project compares React, Vue and Angular by implementing the same Christmas Movie Advent Calendar in each framework. The applications will share the same design, movie data and functionality to support a fair comparison.

## Repository structure

```text
react/       Current React + TypeScript + Vite application
vue/         Vue 3 + TypeScript + Vite application
angular/     Angular + TypeScript standalone application
comparison/  Reserved for the future interactive comparison website
```

React, Vue and Angular are implemented. The comparison folder contains only a `.gitkeep` placeholder; its website has not been created yet.

## Run the React application

Use Node.js 22.12+ (or Node.js 20.19+). From the repository root:

```sh
cd react
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build:

```sh
npm run build
npm run preview
```

See [the React README](react/README.md) for component explanations, features and verification details.

The existing React application is preserved without source changes. Its development date is currently December 10: doors 1–10 are available and doors 11–24 are locked. Change `DEVELOPMENT_DAY` on line 3 of `react/src/date.ts` to another December day, or `null` for the real date. Production builds always use the real date.

Each implementation will keep its own dependencies and run commands. There is no root application or shared package configuration yet. Dependencies and generated build output are excluded from Git.

## Run the Vue application

```sh
cd vue
npm ci
npm run dev
```

Use the URL printed by Vite (port 5174 or the next available port). See [the Vue README](vue/README.md) for components, comparison notes and test-date settings. The Vue preview is currently November 30; set `DEVELOPMENT_MODE` in `vue/src/date.ts` to `'before-december'` to test editing or `null` to use the real date. Production always uses the real date.

## Run the Angular application

```sh
cd angular
npm ci
npm run dev
```

Open http://127.0.0.1:4200/. Run `npm run build` inside `angular` to create a production build. See [the Angular README](angular/README.md) for component and signal explanations. `angular/src/date.ts` line 3 selects `'december'`, `'before-december'`, or `null` (real date); line 4 sets the December day, currently 10. Production always uses the real date. React and Vue remain unchanged.
# Guide-8-
