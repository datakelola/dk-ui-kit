# AGENTS.md — dk-ui-kit (DK CRM omnichannel UI)

SvelteKit 2 + Svelte 5 (runes) + Tailwind v4 + bits-ui / shadcn-svelte UI kit for a CRM contact-center app.

## Commands

Use **bun** (bun.lock is the only lockfile; package-lock was deleted on purpose). README still says npm — ignore that.

```bash
bun install
bun run dev        # vite dev, http://localhost:5173
bun run build      # succeeds; adapter-auto prints "Could not detect a supported production environment" — expected, not a failure
bun run preview
bun run check      # = svelte-kit sync && svelte-check (typecheck for .svelte)
bun run check:watch
```

- There is **no lint, format, or test script** and no eslint/prettier/vitest/playwright config. Verification = `bun run check` + `bun run build` + clicking the route in dev.
- `bun run check` **currently fails**: baseline is `47 errors and 2 warnings in 21 files` (mostly `InputOTP.Slot index`, `Bubble.Root variant="sent"/"received"`, `sel possibly null`). Compare against this baseline; don't chase unrelated pre-existing diagnostics.

## Structure & wiring

- `vite.config.ts` **is** the SvelteKit config — there is no `svelte.config.js`. `sveltekit({ compilerOptions, adapter })` is called there. Adding a `svelte.config.js` is not how this project is configured.
  - `runes: true` is forced for every file outside `node_modules`, so legacy non-rune syntax will fail.
  - `optimizeDeps.exclude: ['paneforge']` — paneforge only publishes a `svelte` condition with no default export, so it can't be esbuild-prebundled. Don't remove this.
- `src/routes/+layout.svelte` is the app shell: sidebar nav tree, topbar, dark/light toggle, `Toaster`.
  - Login guard lives here: `onMount` redirects to `/login` when `localStorage.dk_token` is missing.
  - `/login` and `/wallboard` bypass the shell entirely.
  - **Adding a route means editing this file too**: add an entry to `parents`/`bottom`, a label in `MENU_STR` (all 4 locales), and a title in `pageTitles`. Otherwise the page has no nav link and no topbar title.
- `src/lib/components/ui/**` is shadcn-svelte registry code (`components.json` defines the `$lib/...` aliases, lucide icons, Tailwind CSS entry `src/app.css`). Folder convention: `foo.svelte` + `index.ts` barrel. Imports are namespaced (`import * as Card from '$lib/components/ui/card'`) except single-component ones (`import { Button } from '$lib/components/ui/button'`). Match the neighbouring file's pattern.
- `src/lib/hooks/is-mobile.svelte.ts` — `IsMobile` class wrapping `MediaQuery` (768px breakpoint).
- `src/lib/mock.ts` is **dead** — nothing imports it. Pages that show fake data define arrays inline in the page. README's "data is mock, see mock.ts" is stale.

## Data & auth

- `src/lib/api.ts` is the only backend client. `BASE = 'http://localhost:3001/api/v1'` is **hardcoded** — there is no env var; change the file to retarget.
- Auth is a bearer token in `localStorage.dk_token`, read client-side only. No `+page.server.ts` / `+page.ts` load functions anywhere; every page fetches in `onMount` and swallows errors with local fallback data.
- Add new endpoints to the `api` object; envelope is `{ data }` on success, `{ error: { code, message } }` on failure, and a `401` auto-clears the token and hard-redirects to `/login`.
- With no Go backend on `:3001`, every authenticated page falls back to its inline demo data. Use that to review UI without a server.

## Conventions that differ from defaults

- **i18n is mandatory per page.** `src/lib/i18n.ts` defines 4 locales (`id` default, `en`, `th`, `tl`, persisted in `localStorage.dk-locale`). Every page defines a `const STR = { id: {...}, en: {...}, th: {...}, tl: {...} }` object plus `let s = $derived(STR[$locale])`, then renders `{s.key}`. A new page with hardcoded copy is a bug — include all 4 locales.
- **Colour comes from CSS variables in `src/app.css`** (`--primary`, `--muted-foreground`, `--sidebar-*`, `--chart-1..5`, light + dark blocks). Don't hardcode hex values per page; the reference README explicitly forbids it.
- Page titles live in the topbar via `pageTitles`, not in an `<h1>` inside the page body.
- Indentation is inconsistent across the repo (tabs in most `.svelte`/`.ts`, 2 spaces in `app.css` and `api.ts`/`utils.ts`). Match the file you're editing; there is no formatter to normalise it.
- Import specifiers are mixed: `$lib/utils` and `$lib/utils.js` both appear (tsconfig sets `rewriteRelativeImportExtensions`). Stay consistent within a file.
- Commits go straight to `main`. Messages are informal and mixed (`fix error 500`, `feat: connect threads...`) — no changelog, no PR template.

## Reference material

- `UI-RULES.md` is the binding rulebook for component choice, colour usage, layout, states, and accessibility. Read it before building or reviewing any UI; `DESIGN.md` explains the tokens it references.
- `DESIGN.md` documents the design-system tokens (colour ramps, radii, typography, sizes, decision log) and maps `design-systems/*.png` to components.
- `reference/crm-ahu/` holds copied Laravel Blade views from the original CRM, used as the visual source of truth. `reference/crm-ahu/README.md` has the route → blade-file mapping table. Read-only: never copy production data, credentials, or backend connections from it.
- `tasks/plan.md` and `tasks/todo.md` hold the current phased UI-alignment plan (shell → tables → dashboards → polish) with per-phase checkpoints. Check them before starting layout work; the checkpoint list is the acceptance criteria.