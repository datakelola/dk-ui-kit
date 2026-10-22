# DESIGN.md — DK UI Kit Design System

Sumber kebenaran token adalah kode: `src/app.css` (variabel) dan
`components.json` (alias registry). Referensi visual: 28 screenshot Figma
di `design-systems/` (Button.png, Colors.png, Input.png, dst.).

**Aturan pemakaian** (kapan memilih komponen/varian, layout, state, dan
aksesibilitas) ada di `UI-RULES.md`. Dokumen ini hanya menjelaskan nilai token
dan alasan di baliknya.

Aturan terpenting:

1. **Warna selalu lewat token Tailwind** (`bg-primary`, `text-muted-foreground`,
   `bg-danger-600`), bukan nilai hex per-halaman. Tailwind v4 membaca
   CSS vars lewat blok `@theme inline` di `src/app.css:296`.
2. **Ukuran & spacing memakai skala Tailwind baku** (h-9, gap-4, p-4).
   Tidak ada utility padding/margin kustom; nilai arbitrary (`text-[11px]`,
   `p-[13px]`) dilarang untuk hal baru.
3. **i18n wajib 4 locale** (id default, en, th, tl). Waktu memakai Intl dengan
   locale aktif, bukan hardcode `id-ID`.

---

## 1. Warna

### Semantic tokens (digandakan light/dark di `:root` dan `.dark`)

| Token | Pakai |
|---|---|
| `background` / `foreground` | permukaan halaman & teks utama |
| `card` / `card-foreground` | kartu; Card.Internal `bg-card` |
| `popover` / `popover-foreground` | dropdown, popper |
| `primary` / `primary-hover` / `primary-active` / `primary-foreground` | fill tombol utama, badge, pill tab aktif. **Light:** fill `#60a5f9` + foreground **putih**, rampinteraction **menggelap** (`#5691d9` → `#4a7ab5`) agar kontras naik saat hover/press. **Dark:** fill `#79b3fa` + foreground **hitam** `#131927` (8.06:1), ramp interaction **mencerah** (`#a1cbff` → `#bedbff`) — kebalikan dari light, supaya kontras tetap naik saat interaksi |
| `primary-text` | aksen (ikon, teks link, border terpilih, focus ring) — **bukan** `--primary`. Light `#2c4a70`, dark `#a1cbff` |
| `primary-muted` / `primary-muted-foreground` / `primary-border` | latar item aktif (sidebar, list chat), badge info lembut |
| `secondary` / `secondary-foreground` | tombol sekunder |
| `muted` / `muted-foreground` | latar sekunder & teks sekunder |
| `accent` / `accent-foreground` | hover surface (`hover:bg-accent`) |
| `destructive` / `destructive-foreground` | aksi merah; fill `#a9302d` (danger-700) berpasangan dengan putih — WAJIB pasangan ini, jangan pakai `danger-600` untuk teks-putih |
| `success` / `success-foreground`, `warning` / `warning-foreground`, `info` / `info-foreground` | status; foreground default `#131927` (teks gelap di atas fill cerah) |
| `border`, `input`, `ring` | garis & fokus. `--ring` light `#4a7ab5`, dark `#79b3fa` (darker dari fill agar terlihat di atas `--border`) |

### Color ramps Figma (digandakan selepas semantic)

`--brand-*`, `--azure-*`, `--success-*`, `--danger-*`, `--warning-*`,
`--neutral-*` masing-masing 900→50 (sumber: `design-systems/Colors.png`).
Digunakan via `bg-brand-500` dkk. **Hanya untuk kasus spesial yang butuh
tahun warna di luar pasangan semantic** (chart tambahan, ilustrasi).

### Token domain khusus

- Data chart: `--chart-1..5` (chart-series). `--chart-1` mengikuti tema:
  `#60a5f9` light, `#79b3fa` dark.
- Chat bubbles: `bubble-sent` (azure — `#60a5f9` light / `#79b3fa` dark,
  teks gelap #131927), `bubble-received`, `bubble-system`.
  Bubble **tidak** memakai `bg-primary`; rasanya `--bubble-sent` yang
  foreground-nya sudah gelap (6.90:1 / 8.06:1).
- Sidebar: `--sidebar-*` (bg, foreground, primary, accent, ring) +
  `--sidebar-active` (surface aktif). Latar sidebar putih di light mode.
- Dimensi sidebar: `sidebar/constants.ts` — `SIDEBAR_WIDTH = 16rem`,
  `SIDEBAR_WIDTH_ICON = 3rem`, `SIDEBAR_WIDTH_MOBILE = 18rem`.

---

## 2. Tipografi

- Font: **Inter**, dengan **Noto Sans Thai** sebagai fallback (`app.css:299`
  `--font-sans`; dimuat di `app.html`). Jangan menghapus Noto Sans Thai —
  locale `th` akan jatuh ke font sistem arbitrer.
- `:lang(th)` baris dan heading dilayani line-height 1.7 / 1.5 di `app.css:480`
  (unlayered on-purpose: untuk menang di atas `leading-*` utility Tailwind).
- Opsional: hindari `leading-none` pada teks 12px ke bawah —
  `leading-tight` sudah aman.
- Ukuran: teks utama `text-sm` (14px), teks sekunder `text-xs` (12px),
  input/text base `text-base` di mobile & `md:text-sm` (anti iOS-zoom);
  teks < 12px tidak diizinkan.

---

## 3. Radius

Sumber `app.css:68–71, 429–434`:

- `--radius: 0.5rem` (8px; dr: `rounded-lg`).
- `--radius-control: 0.5rem` (8px, dari pengukuran Figma Button: r=8px pada
  tombol 40/48/56px). Dipakai Button base, search panel, textarea composer:
  `rounded-control`. Ukuran 32px ke bawah memakai `rounded-[4px]` (r=4px di
  Figma), bukan `rounded-control`.
- `--radius-control-lg: 0.625rem` (10px) untuk panel overlay —
  Dropdown.png ≈10px, Context Menu.png 10–20px.
- `rounded-lg` untuk Input/Select default (8px), `rounded-xl` untuk card,
  `rounded-md` untuk kontrol sekunder / trigger kecil, `rounded-sm` untuk
  badge & chip (Figma 4–8px, bukan pill).

---

## 4. Ukuran komponen & target sentuh

Nilai height `h-*` di Tailwind v4 = `--spacing(4) per unit` (1 unit = 4px),
jadi `h-9` = 36px.

**Button** (`button.svelte`): `default` **h-10** (40px), `sm` h-8,
`xs` h-7, `lg` h-12, `xl` h-14. Icon-only: `icon` **size-10**, `icon-sm` 8,
`icon-xs` 7, `icon-lg` 12, `icon-xl` 14. Ukuran 40px adalah default untuk
tombol baru; h-8/h-7 hanya untuk tabel padat atau penggunaan sekunder.

**Form controls** — h-10: Input (px-3.5), Select trigger default (h-10,
sm h-9), InputGroup (h-10), Toggle (h-10 / sm h-9 / lg h-12). Input dalam
shell topbar memakai h-10 via `InputGroup` default.

**Checkbox & Radio**: kotak visual size-6 (24px, r=4px sesuai desain) dengan
pseudo expand ±6px (`after:-inset-1.5 after:pointer-events-none`) sehingga hit
target ±36px. Jangan kurangi pseudo-target — keyboard hit ring 3px
`focus-visible`. Border saat `data-checked` memakai `border-primary-text`,
bukan `border-primary`.

**Switch**: default 44×24 (h-6 w-11), small 36×20 (h-5 w-9) — thumb 20px/16px,
pseudo ±8px.

**Tabel**: `TableCell` `px-3.5 py-3`; `TableHead` `px-3.5 h-11`;
`Table.Root` sudah membungkus tabel dalam `relative w-full overflow-x-auto`
— **jangan tambah wrapper overflow ganda** di halaman. `min-w-[640px]`
pada tabel hanya bila memang kolom tetap.

Aturan kontrol kecil: bila value density mendorong pakai h-8/h-7/icon-8,
konfirmasi tidak dijadikan area sentuh utama di mobile.

---

## 5. Spacing halaman

Ritme umum halaman: `p-5 md:p-6` pada `<main>` shell + `flex flex-col
gap-4` blok section. Card `--card-spacing: 16px` (sm 12px) internal.
Gap gap-2 umum di jarak intra-section, gap-1/2 di metadata compact,
gap-3/4 di antar-kartu. Tidak ada utility spacing semantic selain barisan
default Tailwind; jangan masukkan nilai acak baru.

---

## 6. Status antarmuka (shell)

- Sidebar collapsible = `icon`; hover-peek terpisah, delay 120ms
  (`hoverCollapseDelay` di shell, default 150ms di provider).
- Topbar h-16. Halaman `chat/v4` men-collapse sidebar ke icon rail dan
  main full-bleed (`overflow-hidden`, `p-0`); halaman lain reguler
  `p-4 md:p-6`.
- State persistence: localStorage
  `dk-sidebar` (0/1), `dk-notif`, `dk-aux`, `dk-token`,
  `dk-locale` (id/en/th/tl, default id).
- Toast via `svelte-sonner` (`Toaster position="top-right"`), delays
  standard.

---

## 7. Referensi visual

28 gambar di `design-systems/`: Action Sheet, Alert, Avatar, Badge & Chip,
Breadcrumbs, Button, Button Group, Card, Checkbox, Colors, Context Menu,
Dropdown, Font, Input, List, Loader, Navbar Top, Navbar Bottom, Page
Control, Pagination, Pop-Up, Progress Bar, Radio, Shadow, Stepper, Tab,
Toggle, Tooltip.

Pemetaan file komponen ↔ screenshot (konvensi `src/lib/components/ui/`):
Button.png → `button/`, Input.png → `input/` + `input-group/`,
Card.png → `card/`, dsb. Bila ada divergensi visual di antara implementasi
dan screenshot, tampanan terkini di kode menang; catat perbedaannya di sini
bila permanen.

---

## 8. Draft riwayat keputusan

| Keputusan | Mengapa |
|---|---|
| Perekat warna: CSS vars (`:root`/`.dark`) + `@theme inline`, bukan utility Tailwind jamak | Single source; dark mode cukup flip `.dark` |
| Fill primary mengikuti desain mockup: light `#60a5f9` + foreground **putih**, dark `#79b3fa` + foreground **hitam** `#131927` | User: `#60A5F9` = primary light (pages-design/ + Button.png), `#79B3FA` = versi dark. Light mockup memang teks putih (2.55:1, di bawah AA — tidak ada ramp biru lebih terang, jadi fill ikut desain dan keterbacaan dibawa ramp interaksi). **Dark mockup justru label gelap `#111828`** → user: "warna font pada button biru harus hitam" → 8.06:1. Kedua tema sengaja berbeda, dan itu sesuai mockup |
| Ramp interaksi mengikuti arah foreground tiap tema | Prinsipnya sama: kontras harus **naik** saat hover/press. Foreground putih → gelapkan fill (light 2.55 → 3.26 → 4.43). Foreground hitam → cerahkan fill (dark 8.06 → 10.45 → 12.35). Dark ramp: hover `#a1cbff`, active `#bedbff` |
| Dark `--sidebar-primary` = `#79b3fa` (sebelumnya `#60a5f9`) | Sidebar item aktif di dark harus memakai fill primary dark yang sama, bukan warna light |
| Token aksen baru `--primary-text` (light `#2c4a70`, dark `#a1cbff`) + migrasi `text-primary`/`border-primary` | `--primary` dobel-duty: 50× `bg-primary` (fill) vs 47× `text-primary` (ikon/link aksen). Kalau keduanya `#60a5f9`, teks aksen di light = 2.55:1 (tidak terbaca) di 36 file. `primary-text` = 9.05:1 / 10.45:1 |
| `--ring` light `#4a7ab5` (bukan `#60a5f9`) | `#60a5f9` vs `--border` `#e5e7ea` hanya 2.06:1 → focus ring nyaris tak terlihat. `#4a7ab5` = 3.57:1 |
| Badge/chip `rounded-sm` (bukan pill) | Figma Badge & Chip.png: 132×40 r8, 125×32 r4, 95×24 r4 — persegi, bukan kapsul |
| Checkbox/Radio size-6 (24px) + switch 44×24 | Figma Checkbox.png: kotak visual 24×24 r4 dengan outer hit box 30×30; Toggle.png: 44×24 |
| destructive light = `danger-700` (#a9302d), bukan `danger-600` | 6.67:1 dengan foreground putih; danger-600 hanya 4.0:1 |
| `success/warning/info-foreground` = gelap `#131927` | fill cerah (hijau/kuning/biru) dengan teks putih gagal kontras |
| bubbles memakai `--bubble-sent` (fill azure + teks gelap #131927) | 6.90:1 light / 8.06:1 dark; bubble adalah bacaan panjang sehingga butuh kontras, bukan sekadar label tombol |
| Inter + Noto Sans Thai | glyph Thai tidak ada di Inter; fallback menghindari font sistem arbitrer di `th` |
| `:lang(th)` unlayered | Tailwind v4 mengurut utilities di layer; `@layer base` kalah dari `leading-*` |
| controls dinaikkan ke 40px default | Figma Button.png ladder 56/48/40/32/24; 40px adalah default app, 24–32px hanya untuk tabel padat |
| `Table.Root` scroll terintegrasi | satu tempat kebijakan scroll; menghindari wrapper overflow ganda |
| i18n per-halaman objek `STR` (id/en/th/tl) | copy berada dekat markup; locale di `localStorage.dk-locale` |
| Chat v4 penuh lebar (sidebar auto-collapse) | 3 panel (inbox, thread, info) butuh lebar maksimal |
