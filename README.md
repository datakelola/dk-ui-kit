# DK UI Kit

UI kit omnichannel CRM (SvelteKit + Svelte 5 runes + Tailwind + `@lucide/svelte`)
dengan komponen gaya **shadcn** (`src/lib/components/ui`: button, card, badge,
input, label, textarea, select, dialog, tabs, table, avatar, progress) dan tema
**biru** + dark mode.

Repositori: `git@github.com:datakelola/dk-ui-kit.git`

Data saat ini mock (`src/lib/mock.ts`) — ganti dengan fetch API saat integrasi
backend. Mode UI-only berjalan tanpa backend.

## Jalankan

Proyek ini **hanya memakai bun** (lihat `packageManager` di `package.json`).
Jangan memakai `npm`, `pnpm`, atau `yarn`.

```powershell
bun install
bun run dev      # http://localhost:5173
bun run build
bun run preview
```

## Rute

home, agent/performance, agent-productivity-dashboard, threads,
chat/v3, chat/v3/ticket/result, chat/v3/ticket/kirana-monitoring,
ticketing, email (+ compose, send, history, templates, ?status=draft),
spv, recordings, recording-archive, report (+ csat, csat-interaction),
settings, agent-schedule, work-calendar.

Sidebar bisa minimize (persisten), drawer di mobile, toggle dark/light
di topbar. Layout: `src/routes/+layout.svelte`.

## Performa

- Ikon diimpor per-file (`@lucide/svelte/icons/*`), bukan barrel, agar dev
  tidak mem-prebundle seluruh koleksi ikon.
- `paneforge` dikecualikan dari optimizer Vite (hanya publish kondisi `svelte`).
- Paket berat (`layerchart`, `bits-ui`, dll.) dimuat per-rute lewat code
  splitting SvelteKit.
