# One calendar, three frameworks

An interactive student report based on the actual React, Vue and Angular Christmas Movie Advent Calendar implementations. Built with plain HTML, CSS and JavaScript, with no npm dependencies.

## Run locally

Use Node.js 20 or newer. From the repository root:

```sh
cd comparison
npm run dev
```

Open http://127.0.0.1:4300/. No npm install is needed. Stop the server with Ctrl+C.

## Build

```sh
npm run build
npm run preview
```

The build copies five self-contained static files into dist/. Preview uses port 4300 too, so stop the development server first. Serve the files over HTTP rather than opening index.html directly, because the page loads data.json.

## What is included

- A short introduction and real locked framework versions.
- 11 selectable concepts with 33 verbatim source excerpts, file paths and line ranges.
- React/Vue/Angular tabs with arrow-key, Home and End keyboard navigation.
- A small, explicitly labelled JavaScript demo of one open door and separate opened history.
- Findings, fairness caveats, a concept mapping, framework-choice questions and a student-style conclusion.
- Source-file, line and direct-dependency measurements, with methodology and counted-file lists.
- Responsive layouts, reduced-motion support and a copy-code button.

## Evidence and verification

`data.json` is a snapshot extracted by `scripts/extract.py`. That script reads the three sibling projects and writes only inside comparison. It extracts snippets, versions from lockfiles, counts and a source hash manifest. It does not change the framework projects.

Run `npm run verify` (Python 3 required) to compare all 33 excerpts with their actual source lines, verify measured counts and confirm the source manifest still matches. To deliberately refresh the snapshot after future framework edits, run `python3 scripts/extract.py`, review the report prose for stale claims, then run verify and build again.

The report avoids bundle-size/build-time rankings. Its source line counts include comments and blank lines and exclude CSS, the entry HTML document, config, dependencies and build output. Direct dependency counts do not include transitive packages.

Checks completed: build and JavaScript syntax check; all excerpts/counts/source hashes verified; browser framework tabs, mobile concept selector, desktop concept buttons, door switching/reset and metric selector checked; mobile width 390px without horizontal page overflow; desktop layout visually inspected; browser error log empty. React, Vue and Angular files were not modified.
