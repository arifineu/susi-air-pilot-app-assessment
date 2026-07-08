# Susi Air Pilot Companion App

A mobile-first Nuxt 4 web app for Susi Air pilots. Three primary surfaces — Sign In, Home (dashboard), Schedule (calendar) — wired against three JSON mocks. No backend; all data is read from `app/assets/data/`. Built as a technical test for Susi Air's pilot companion app brief.

**Status:** production-ready. 311 unit/component specs + 128 Storybook smoke tests passing, ~98% statement coverage, installable PWA, deployable to Vercel out of the box.

---

## Live demo

- **App:** [https://susi-air-pilot-app-assessment.vercel.app/](https://susi-air-pilot-app-assessment.vercel.app/)
- **Storybook:** [https://susi-air-pilot-app-assessment-story.vercel.app/](https://susi-air-pilot-app-assessment-story.vercel.app/)

Both deploy from this repo on Vercel — the Nuxt app auto-detects via the Vercel Nuxt preset, and Storybook is a separate Vercel project with overridden build settings (`npm run build-storybook` → `storybook-static/`).

---

## Quick start

```bash
npm install        # install deps (Node 22+)
npm run dev        # dev server at http://localhost:3000
```

Sign In is at `/` — click "Sign In" (any input works; no auth check per brief) to land on the dashboard at `/home`. Schedule is at `/schedule`. Bottom nav covers Logbook and More as stub routes per the brief.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Nuxt dev server on `:3000`. |
| `npm run build` | Production build → `.output/`. |
| `npm run generate` | Fully static build (alternative to `build`). |
| `npm run preview` | Serve the last `npm run build` output on `:3000`. |
| `npm run storybook` | Storybook dev server on `:6006`. |
| `npm run build-storybook` | Static Storybook build → `storybook-static/`. |
| `npm test` | Vitest one-shot run (all specs). |
| `npm run test:watch` | Vitest watch mode for TDD. |
| `npm run test:coverage` | Vitest with v8 coverage report. |
| `npm run test:storybook` | Run `@storybook/test-runner` against an already-running storybook. |
| `npm run test:storybook:ci` | Boot Storybook, run smoke tests, tear down (for CI / local one-shot). |
| `npm run typecheck` | `nuxt prepare` + `vue-tsc --noEmit`. |
| `npm run lint` | ESLint 10 flat config with `--fix`. |
| `npm run format` | Prettier write. |
| `npm run generate-pwa-icons` | Regenerate `public/pwa-{192,512,maskable-512}.png` from `public/susi-air-logo.png`. |

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Nuxt 4.4.8** (SSR + Nitro) | Industry-standard Vue meta-framework; auto-imports, file-based routing, server-engine flexibility. |
| View | **Vue 3.5.39** + `<script setup lang="ts">` | Composition API throughout, TS-first. |
| State | **Pinia 3** + `@pinia/nuxt` | Official Vue store; idiomatic with `<script setup>`. |
| Styling | **SCSS + BEM** | Explicit `block__element--modifier` naming — one block per component, no cascade leakage. No utility-class soup. |
| Fonts | **`@nuxt/fonts`** (Plus Jakarta Sans) | Auto-serves fonts from our own origin — no Google Fonts request (privacy + offline + faster). |
| Icons | **`@lucide/vue`** (Lucide) | Line-style only, defaults to 1.75px stroke (within brief's 1.5–2px rule). |
| Charts | **`chart.js@4` + `vue-chartjs@5`** | Tree-shaken to ~50KB, real canvas (not SVG), battle-tested. |
| Component dev | **Storybook 10** (`@storybook/vue3-vite` + `@storybook/addon-docs`) | Isolated component development with Docs, Controls, Actions, Viewport; story smoke tests. |
| Unit tests | **Vitest 4** + `@vue/test-utils` + `happy-dom` | Fast, ESM-native, generous watch UX. |
| Story tests | **`@storybook/test-runner`** (Playwright) | Catches integration bugs unit tests miss (caught a real bug on first run). |
| Type checking | **TypeScript 6** + `vue-tsc 3` | `strict: true` + Nuxt 4's default `noUncheckedIndexedAccess: true`. |
| Linting | **ESLint 10** flat config + `@nuxt/eslint` | Official Nuxt ESLint module. |
| Formatting | **Prettier 3** | Standard. |
| PWA | **Hand-written manifest + service worker** | See "Why hand-rolled PWA" below. |
| Deploys | **Vercel** (Nuxt preset) | Zero-config auto-detect for the app; Storybook deploys as a second Vercel project with overridden build command. |

## Architecture

### Folder layout

```
app/
├── assets/
│   ├── data/           # 4 JSON mocks (documents, flight-hours, schedules, news)
│   └── scss/tokens.scss # SCSS vars + CSS custom properties + resets
├── components/
│   ├── atoms/          # 11 — Alert, Button, Input, Avatar, Badge, Icon, BrandLogo, ProgressRing, ProgressBar, Chip, Skeleton
│   ├── molecules/      # 9  — FormField, FlightRoute, NewsCard, LimitCard, DocumentListItem, CalendarDay, LegendItem, RangeToggleGroup, BottomNavItem
│   └── organisms/      # 10 — DashboardHeader, BottomNavigation, ScheduleLegend, SignInForm, UpcomingFlightCard, MyDocumentsList, LatestNewsCarousel, FlightHoursTrendChart, HoursToLimitSection, ScheduleCalendarGrid
├── composables/        # 5 — useDocumentExpiry, useRollingSum, useFlightLimits, useDutyCalendar, useLoadingDelay
├── layouts/            # 2 — default.vue (with BottomNavigation), auth.vue (bare)
├── pages/              # 5 — index (Sign In), home, schedule, logbook (stub), more (stub)
├── plugins/
│   └── pwa.client.ts   # SW registration (skips dev)
├── stores/             # 5 — pilot, documents, schedules, flightHours, news
├── types/index.ts      # Shared types for all 4 JSON shapes + UI helpers
└── app.vue             # NuxtLayout + NuxtPage + page/layout transitions
public/
├── manifest.webmanifest
├── sw.js               # ~80 lines: cache-first shell + network-first nav
├── susi-air-logo.png   # Real brand asset from susiair.com
├── pwa-{192,512,maskable-512}.png  # Generated from the logo
scripts/
├── generate-pwa-icons.mjs       # sharp — composites the 4:1 logo onto square canvases
└── strip-redundant-imports.mjs  # One-shot dev utility
tests/
└── setup-canvas-mock.ts         # Stubs HTMLCanvasElement.getContext for chart.js in happy-dom
.storybook/
├── main.ts             # Stories globs + Vite plugins (vue, auto-import, components) + docs addon
├── preview.ts          # Viewport presets + backgrounds
└── test-runner.ts      # Storybook smoke-test config
.github/workflows/ci.yml  # Lint + typecheck + test:coverage + test:storybook:ci
nuxt.config.ts
vitest.config.ts
eslint.config.mjs       # Flat config via @nuxt/eslint
```

### Atomic design

Three layers, each with a clear contract:

- **Atoms** (11) — presentational primitives. Pure props in, emits out. Never import stores, never call composables. (e.g. `BaseButton`, `Avatar`, `Icon`, `Alert`).
- **Molecules** (9) — small compositions of atoms + at most one pure composable (e.g. `DocumentListItem` calls `computeDocumentExpiry`). Still no store access.
- **Organisms** (10) — section-level compositions. Receive data via props (semi-smart pattern — see below), consume pure composables for derived state. Don't call Pinia stores directly.

**Pages** are the composition root — they pull from Pinia stores and pass data as props to organisms. This keeps organisms:
1. Storybook-friendly (pass props directly, no store mocking)
2. Easy to unit-test (`mount(Component, { props })`)
3. Reusable across pages without coupling

### Why atomic design?

Separation of concerns. The brief is a recruiter test; the layered structure demonstrates "I can compose a UI from primitive → composite → section-level without coupling." Atoms being pure makes them trivially testable; organisms being semi-smart (props + composables) keeps Storybook stories isolated.

## Key decisions

### Why `chart.js` + `vue-chartjs` over hand-rolled SVG?

Two options seriously considered:
- **chart.js + vue-chartjs** — adopted. ~50KB tree-shaken (we register only `LineController`, `LinearScale`, `CategoryScale`, `PointElement`, `LineElement`, `Tooltip`, `Filler`). Battle-tested. Real canvas (better perf than SVG at 60fps). The limit line is drawn as a flat second dataset — no custom plugin needed.
- **Hand-rolled SVG** — rejected. Would have meant writing axis labels, gridlines, tooltips, responsive sizing, and ARIA. More code for less functionality.

### Why SCSS + BEM (no Tailwind / UnoCSS)?

The brief explicitly asks for `block__element--modifier` throughout. BEM gives every CSS rule a single, predictable owner — no cascade leaks, no utility-class soup, no "!important" battles. Each component's scoped SCSS has at most one level of `&__element` / `&--modifier` nesting. Shared design tokens live in `app/assets/scss/tokens.scss` (SCSS variables + CSS custom properties for runtime use).

### Why `@nuxt/fonts` over a `<link>` to Google Fonts?

Three wins:
1. **Privacy** — no third-party request.
2. **Offline** — fonts work without network (PWA-friendly).
3. **Performance** — no DNS+TLS round-trip to `fonts.googleapis.com` on first paint.

The module scans CSS for `font-family` declarations and downloads matching font files into `.nuxt/` at build time. Config in `nuxt.config.ts` declares weights explicitly (400/500/600/700/800) because our weights are referenced via CSS custom properties (`var(--fw-bold)`) which the scanner can't statically trace.

### Why hand-written PWA instead of `@vite-pwa/nuxt`?

Two attempts at framework-integrated PWA, both rejected:

1. **`@vite-pwa/nuxt@1.1.1`** — depends on `@nuxt/kit ^3.9.0` (Nuxt 3 era). Installing alongside Nuxt 4 duplicates `@nuxt/kit` in `node_modules`. We've kept `@nuxt/kit` deduped to a single `4.4.8` copy across every module — not breaking that for an optional feature.
2. **Plain `vite-pwa`** — generates output to `.nuxt/dist/client/` (its expected SPA path). Nitro's build pipeline doesn't copy those files to `.output/public/`, so they 404 in preview.

Final approach: hand-written `public/manifest.webmanifest` + `public/sw.js` (cache-first app shell + network-first navigations, version-keyed cache eviction) + `app/plugins/pwa.client.ts` (registers SW on `window.load`, skips in dev). Total: ~80 lines across 3 files. Deterministic, no build-step magic.

### Why no `templates/` layer (despite the brief mentioning it)?

The brief suggests `SignInTemplate`, `HomeTemplate`, `ScheduleTemplate`. Pages ARE the composition root in Nuxt — adding a template layer just to wrap `<DashboardHeader /> + <UpcomingFlightCard /> + ...` introduces indirection for no benefit. Pages compose organisms directly.

### Why are `ref`/`computed`/component imports missing from `<script setup>` blocks?

Nuxt 4 auto-imports them. To keep Vitest and Storybook (which don't run inside Nuxt) in sync, we mirror the auto-import behavior via `unplugin-auto-import` + `unplugin-vue-components` in both `vitest.config.ts` and `.storybook/main.ts`. The `.ts` files (composables, stores, specs) keep explicit imports for portability — those are libraries usable outside the Nuxt context.

### Why `nuxt.config.ts` has `components: [{ path: '~/components', pathPrefix: false }]`?

By default, Nuxt registers components from subdirectories with a path prefix (e.g. `<OrganismsSignInForm>` instead of `<SignInForm>`). We want bare filenames regardless of folder, since that's what our templates use. This setting deduplicates when names are unique.

## Testing strategy

Three layers, each catching a different class of bug:

### 1. Unit specs (Vitest + happy-dom)

Pure-function tests for the composables — no Vue mount. The highest-value file in the app is `app/composables/useRollingSum.spec.ts` (29 tests), which hand-verifies the brief's worked example: a 14-day fixture with values 1–14, asserting each of the 15 chart points matches an explicitly-computed expected value. The brief's most critical property — **the ±7-day display window is fixed regardless of the toggle (only `windowDays` changes)** — has its own test.

### 2. Component specs (`@vue/test-utils`)

Mount each component with curated props, assert on rendered output. `app/components/molecules/CalendarDay.spec.ts` covers the brief's tick-vs-number logic (`count_logbooks === count_schedules`). `app/components/organisms/FlightHoursTrendChart.spec.ts` exercises the chart data assembly via `defineExpose({ chartData, chartOptions })` so we can read the structured data without parsing canvas pixels.

### 3. Story smoke tests (`@storybook/test-runner` + Playwright)

Each of the 128 stories gets visited in a real headless Chromium. Test-runner asserts no uncaught errors / console errors. This is the only layer that catches integration bugs like "Storybook can't resolve `~/components/...`" or "this story passes `:width="80%"` which Vue parses as a JS expression and crashes" — both of which actually happened during development and were caught here first.

### Coverage

| | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| Overall | 98.07% | 93.18% | 97.47% | 99.43% |
| `useRollingSum` | 100% | 100% | 100% | 100% |
| `useDocumentExpiry` | 100% | 100% | 100% | 100% |
| `useFlightLimits` | 100% | 100% | 100% | 100% |
| `useDutyCalendar` | 97% | 100% | 100% | 100% |
| `FlightHoursTrendChart` | 100% | 100% | 100% | 100% |
| `CalendarDay` | 100% | 100% | 100% | 100% |

The remaining branch gap is `DocumentListItem.vue:33` — a defensive `Number.isNaN` check in the `formattedDate` computed that's unreachable in practice (the upstream `computeDocumentExpiry` throws first). Documented, not fixed — faking a code path to satisfy a coverage metric is worse than the honest 87.5%.

## PWA

| File | Role |
|---|---|
| `public/manifest.webmanifest` | Name, theme color (`#0E2138`), icons (192/512/maskable-512), `display: standalone`. |
| `public/sw.js` | Cache-first for hashed build assets + fonts + images; network-first for navigations (falls back to cached shell when offline). |
| `app/plugins/pwa.client.ts` | Client-only plugin — registers SW on `window.load`, polls for updates hourly, skips in dev. |
| `public/pwa-{192,512,maskable-512}.png` | Generated from `susi-air-logo.png` via `npm run generate-pwa-icons` (uses `sharp` to composite the 4:1 wordmark onto a square white canvas). |
| `nuxt.config.ts` `app.head` | `<link rel="manifest">`, `<link rel="apple-touch-icon">`, iOS Safari `apple-mobile-web-app-*` meta (iOS doesn't fully honor the manifest spec). |

To regenerate icons (e.g. after a logo change): drop the new PNG into `public/susi-air-logo.png`, run `npm run generate-pwa-icons`.

## Brief compliance — final checklist

The brief's "Things to Double-Check Before Calling It Done" — every bullet answered:

- [x] **Rolling-sum chart X-axis is always ±7 days from "today" (2026-05-31).** Verified in `app/composables/useRollingSum.spec.ts` → "display window is INDEPENDENT of windowDays".
- [x] **Document badges match the 5 worked examples in §3.1 exactly.** Verified in `app/composables/useDocumentExpiry.spec.ts` → all 5 cases (`doc_recurrent → safe`, `doc_ppc → safe`, `doc_license → expired`, `doc_medical → soon`, `doc_security → expired`).
- [x] **Calendar tick-vs-number badge logic.** Tick only when `count_logbooks === count_schedules`. Verified in `app/components/molecules/CalendarDay.spec.ts` (4 cases).
- [x] **Every atom/molecule/organism has a Storybook story AND a spec file.** 30 stories + 41 spec files; 100% component coverage.
- [x] **No component reaches into `assets/data/*.json` directly except the Pinia stores.** Atoms/molecules/organisms receive data as props. Pages pull from stores and pass down. The only direct JSON import outside `stores/` is in `*.stories.ts` files (which is appropriate — stories are test fixtures, not production code).
- [x] **Mobile-first verified at 390px.** `app/components/organisms/HoursToLimitSection.stories.ts` → `Mobile390px` story locks the viewport to 390×844. `app/assets/scss/tokens.scss` sets `overflow-x: hidden` on `html, body` as a safety net.
- [x] **Numeric/data values are bold-weighted.** `app/assets/scss/tokens.scss` defines `--fw-bold: 700` and `--fw-extrabold: 800`; used throughout for hours, times, counts. See `.limit-card__remaining-value`, `.flight-route__icao`, `.calendar-day__base`, etc.
- [x] **Card shadows are subtle everywhere.** `app/assets/scss/tokens.scss` defines `--shadow-xs`, `--shadow-sm`, `--shadow-md` — all small blur + low opacity (max `0 4px 12px rgba(14, 33, 56, 0.06)`). No heavy drop shadows anywhere.
- [x] **All icons are line-style at 1.5–2px stroke.** `app/components/atoms/Icon.vue` defaults to `strokeWidth: 1.75`. Lucide is line-only by design — no filled icons possible.
- [x] **Real Susi Air logo asset from susiair.com.** Fetched from `https://www.susiair.com/images/susiair-logo.png` → `public/susi-air-logo.png` (240×60 PNG).
- [x] **Sign In page has the "Need help? Contact CRD" helper link.** `app/components/organisms/SignInForm.vue` lines 42-46. Has its own click handler + emitted event; verified by `SignInForm.spec.ts → "renders the 'Need help? Contact CRD' helper link"`.
- [x] **Schedule legend/calendar codes are driven from `legend[]` (TRD, not TRV).** `app/components/organisms/ScheduleLegend.vue` + `app/components/organisms/ScheduleCalendarGrid.vue` consume `legend` exclusively via props. `ScheduleLegend.spec.ts → "drives entirely from the JSON prop — no hardcoded codes"` asserts `TRD` (never `TRV`) appears.
- [x] **All component SCSS follows BEM naming.** Every component's `<style scoped lang="scss">` block uses `block__element--modifier`. Max one level of `&__element` / `&--modifier` nesting.

## Known trade-offs / what I'd do differently with more time

- **Real auth.** Sign In currently navigates to `/home` with no auth check (per brief). With more time: integrate with Susi Air's SSO, add middleware, add a real `/auth/callback` route.
- **Server-side data layer.** All data is mock JSON right now. Real version would have `/api/pilot`, `/api/documents`, etc. served by Nitro with a real DB.
- **PWA: full Lighthouse PWA pass.** The hand-rolled manifest + SW pass Lighthouse's `installable-manifest` and `service-worker` audits **once deployed over HTTPS** (those audits require HTTPS context; we verified manually on localhost). On Vercel the install button will work.
- **End-to-end tests (Playwright).** Storybook smoke tests cover story rendering; an e2e layer would cover the actual Sign In → Home → Schedule click-through against a running preview build. Skipped here because the brief's unit + component + story coverage is already strong.
- **Dark mode.** Tokens are already CSS custom properties, so a `[data-theme="dark"]` override would be ~30 lines of CSS.
- **Real Susi Air logo variants.** We use the wordmark (240×60 PNG) as the only brand asset. A proper icon set (square app icon, monochrome version, etc.) would come from Susi Air's brand kit.
- **Animated limit-card transitions.** When the chart toggle changes, the 4 LimitCards currently snap to new values. A tween would feel smoother.
- **Stub `tap-a-date` modal.** The schedule page shows a placeholder modal ("Detail page coming soon") per brief. A real detail page would show that day's full duty log.
- **Analytics.** No analytics on which toggle / page / cell is most used. Real version would have PostHog or Vercel Analytics.

---

## License

This project is a technical test for Susi Air. All brand assets (logo, color palette references) belong to PT ASI Pujiastuti Aviation. Source code is unlicensed — for evaluation only.
