# UI-RULES.md — Panduan lengkap komponen, warna, dan layout

**Versi:** 1.0 · **Diperbarui:** 2026-10-22 · **Status:** mengikat

Dokumen ini adalah rulebook UI `dk-ui-kit`. Isinya menjawab tiga pertanyaan
untuk setiap perubahan UI:

1. **Komponen apa** yang dipakai (dan varian/ukuran mana).
2. **Warna/token apa** yang boleh dipakai.
3. **Layout dan perilaku UX** seperti apa yang wajib dipenuhi.

`DESIGN.md` menjelaskan *nilai* token (ramp, radius, tipografi, keputusan desain).
Dokumen ini menjelaskan *pemakaiannya*. Referensi visual ada di
`design-systems/*.png`, tetapi kode + token tetap menang bila berbeda.

### Tingkat kata kunci

| Kata | Arti |
|---|---|
| **WAJIB** | Pelanggaran = perubahan ditolak |
| **SEBAIKNYA** | Default; penyimpangan harus punya alasan yang ditulis di PR/commit |
| **JANGAN** | Anti-pattern; jangan dipakai tanpa persetujuan eksplisit |
| **BOLEH** | Pengecualian yang sudah disepakati |

### Urutan prioritas saat konflik

1. `UI-RULES.md` — perilaku, pemilihan komponen, aksesibilitas, state.
2. `DESIGN.md` + `src/app.css` — nilai token, ukuran, radius, tipografi.
3. `design-systems/*.png` — referensi visual.
4. Preferensi halaman individual.

Bila screenshot dan implementasi berbeda secara permanen, catat keputusannya di
`DESIGN.md` (bagian riwayat keputusan) **sebelum** mengubah komponen bersama.

### Daftar isi

- [0. Ringkasan cepat (TL;DR)](#0-ringkasan-cepat-tldr)
- [1. Prinsip UX](#1-prinsip-ux)
- [2. Warna](#2-warna)
- [3. Tipografi](#3-tipografi)
- [4. Layout](#4-layout)
- [5. Komponen](#5-komponen) · [5.1 Aksi](#51-aksi) · [5.2 Form](#52-form) · [5.3 Navigasi](#53-navigasi) · [5.4 Data display](#54-data-display) · [5.5 Feedback dan status](#55-feedback-dan-status) · [5.6 Overlay](#56-overlay) · [5.7 Messaging / omnichannel](#57-messaging--omnichannel) · [5.8 Komposit aplikasi](#58-komposit-aplikasi)
- [6. Pola halaman (recipes)](#6-pola-halaman-recipes)
- [7. State wajib](#7-state-wajib)
- [8. Aksesibilitas](#8-aksesibilitas)
- [9. i18n dan format](#9-i18n-dan-format)
- [10. Copy dan UX writing](#10-copy-dan-ux-writing)
- [11. Performa yang terasa (perceived performance)](#11-performa-yang-terasa-perceived-performance)
- [12. Checklist review UI](#12-checklist-review-ui)
- [13. Anti-pattern](#13-anti-pattern)
- [14. Tata kelola](#14-tata-kelola)
- [15. Catatan implementasi saat ini (utang yang perlu diselaraskan)](#15-catatan-implementasi-saat-ini-utang-yang-perlu-diselaraskan)

---

## 0. Ringkasan cepat (TL;DR)

1. Satu aksi `primary` per area; sisanya `outline`/`secondary`/`ghost`.
2. Warna hanya lewat token; tidak ada hex, tidak ada `text-primary` untuk teks.
3. Setiap aksi butuh feedback: loading, sukses, gagal, kosong.
4. Aksi destruktif wajib `AlertDialog` + tombol `destructive`, fokus awal “Batal”.
5. Error validasi tampil inline di field, bukan toast.
6. Status tidak boleh dibedakan hanya dengan warna.
7. Mobile-first: target sentuh ≥ 36 px, tidak ada aksi yang hanya muncul saat hover.
8. Tabel di bawah `md` berubah menjadi daftar kartu, bukan scroll horizontal buta.
9. Semua copy ada di 4 locale (`id`, `en`, `th`, `tl`); tanggal/angka pakai `Intl`.
10. Semua alur utama selesai dengan keyboard dan fokus terlihat.
11. Loading mempertahankan layout (skeleton), bukan menggeser konten.
12. Jangan menambah komponen/varian lokal; pakai primitif di `src/lib/components/ui`.

---

## 1. Prinsip UX

### 1.1 Hierarki dan fokus

- Setiap layar punya **satu tujuan utama**. Aksi utama harus paling menonjol dan
  berada di posisi yang konsisten (kanan atas area konten, atau kanan bawah form).
- Urutan visual: judul → konteks/ringkasan → konten → aksi. Jangan menaruh aksi
  utama di tengah konten atau di sidebar.
- Maksimal **satu** tombol `default` (primary) per area pandang. Bila ada dua
  aksi sama penting, salah satunya `outline` dan jelaskan bedanya lewat label.
- Aksi sekunder yang sering dipakai boleh `secondary`; aksi netral di toolbar
  memakai `ghost`/`outline`.
- Jangan memakai warna, ukuran, atau animasi untuk menyaingi aksi utama.

### 1.2 Feedback dan waktu respons

| Durasi | Persepsi | Yang wajib dilakukan |
|---|---|---|
| < 100 ms | instan | Tidak perlu indikator; beri state hover/active |
| 100–300 ms | terasa cepat | Boleh tanpa spinner, tetapi tombol harus “pressed” |
| 300 ms–1 s | menunggu | Spinner pada tombol/aksi, tombol disabled |
| 1–3 s | menunggu jelas | Skeleton pada area konten + teks status |
| > 3 s | lama | Progress (jika diketahui) + opsi batal/lihat detail |
| Gagal | — | Pesan spesifik + aksi “Coba lagi” |

- Aksi async: disable tombol saat submit untuk mencegah double-submit.
- Jangan menghilangkan konteks saat loading; pertahankan header/filter.
- Sukses: konfirmasi singkat (toast) atau perubahan state yang terlihat.
- Gagal: jangan menelan error. Tampilkan di dekat aksi + alasan + langkah lanjut.

### 1.3 Pencegahan dan pemulihan error

- Cegah error: disable aksi sampai valid, tampilkan format yang diharapkan,
  batasi input, dan konfirmasi aksi berisiko.
- Jangan menghapus input pengguna saat error; pertahankan nilai dan fokus.
- Untuk form panjang, tampilkan ringkasan error di atas + fokus ke field pertama
  yang error.
- Aksi yang tidak bisa dibatalkan wajib punya konfirmasi dan menyebut objeknya
  (“Hapus 3 tiket?”), bukan “Apakah Anda yakin?”.
- Sediakan undo untuk aksi ringan yang bisa dibatalkan (arsip, tandai, geser).

### 1.4 Beban kognitif

- **Recognition over recall:** tampilkan pilihan/nilai saat ini; jangan meminta
  pengguna menghafal kode, filter, atau langkah sebelumnya.
- **Progressive disclosure:** tampilkan pilihan yang relevan; sembunyikan detail
  lanjutan di `Collapsible`/`Dialog`/`Sheet`.
- Gunakan pola yang sudah dikenal: sidebar untuk rute, tabs untuk view, dialog
  untuk form fokus, tabel untuk perbandingan.
- Jangan meminta pengguna mengingat kode/ID; tampilkan nama + ID sekunder.
- Filter aktif terlihat sebagai `Chip` yang bisa dihapus.
- Kelompokkan field form dengan `Field.Group`/`Field.Set` dan beri judul.

### 1.5 Konsistensi

- Komponen, istilah, dan posisi aksi harus sama lintas halaman.
- Istilah operasional konsisten: “Tiket”, “Thread”, “Agen”, “Kanal” — jangan
  berganti-ganti dengan sinonim di halaman berbeda.
- Ikon dari `@lucide/svelte` saja; ukuran mengikuti konteks (`size-4` default,
  `size-5` di sidebar).
- Jangan menduplikasi styling komponen di halaman; kalau butuh varian baru,
  tambahkan ke komponen bersama + aturan di dokumen ini.

### 1.6 Aksesibilitas sejak awal

- Desain harus bisa diselesaikan tanpa mouse.
- Jangan mengandalkan warna saja; sertakan teks/ikon.
- Fokus harus selalu terlihat dan urutannya logis.
- Semua gambar/ikon fungsional punya nama aksesibel.
- Semua overlay bisa ditutup `Esc` dan mengembalikan fokus.

### 1.7 Motion

- Transisi 100–200 ms untuk hover/fokus; 200–300 ms untuk overlay.
- Jangan memakai animasi loop kecuali indikator loading.
- Hormati `prefers-reduced-motion`; hilangkan slide/zoom, sisakan fade.
- Jangan memakai animasi untuk menutupi keterlambatan data.

---

## 2. Warna

### 2.1 Arsitektur token

Sumber tunggal: `src/app.css`.

1. **Semantic tokens** (`--background`, `--primary`, `--destructive`, dst.) —
   dipakai sehari-hari; otomatis berubah di `.dark`.
2. **Color ramps** (`--brand-*`, `--azure-*`, `--success-*`, `--danger-*`,
   `--warning-*`, `--neutral-*`) — hanya chart/ilustrasi/step khusus.
3. **Domain tokens** (`--bubble-*`, `--sidebar-*`, `--chart-*`) — hanya untuk
   domainnya.

Tailwind membaca token lewat blok `@theme inline` (`src/app.css:319`). Jadi
`bg-primary`, `text-primary-text`, `border-primary-border`, `bg-chart-1` valid;
hex langsung tidak.

### 2.2 Referensi token semantic

Nilai dan kontras diambil dari `src/app.css:158–317`. Rasio dihitung dengan
rumus kontras WCAG terhadap latar token masing-masing (light: `background`,
dark: `background`, kecuali disebut lain).

#### Light

| Token | Nilai | Kontras | Pakai |
|---|---|---|---|
| `background` | `#ffffff` | — | latar halaman |
| `foreground` | `#131927` | 16.80:1 | teks utama |
| `card` | `#ffffff` | — | permukaan kartu |
| `popover` | `#ffffff` | — | dropdown/dialog/sheet |
| `primary` | `#60a5f9` | 2.55:1 dgn putih | **fill** tombol/badge; label pendek saja |
| `primary-hover` | `#5691d9` | 3.26:1 | hover fill primary |
| `primary-active` | `#4a7ab5` | 4.43:1 | press fill primary |
| `primary-foreground` | `#ffffff` | — | label di atas primary |
| `primary-text` | `#2c4a70` | 9.05:1 | teks/ikon/link/border aksen |
| `primary-muted` | `#eaf3ff` | — | latar item aktif/badge info |
| `primary-muted-foreground` | `#2c4a70` | 8.09:1 di muted | teks di primary-muted |
| `primary-border` | `#bedbff` | — | border item aktif |
| `secondary`/`muted`/`accent` | `#f3f4f6` | — | permukaan sekunder/hover |
| `secondary-foreground`/`accent-foreground` | `#131927` | 15.95:1 | teks di sekunder |
| `muted-foreground` | `#4d5461` | 7.62:1 | teks sekunder/metadata |
| `destructive` | `#a9302d` | 6.67:1 dgn putih | aksi merusak |
| `destructive-foreground` | `#ffffff` | — | label aksi merusak |
| `success` | `#43b75d` | 6.83:1 dgn gelap | status sukses |
| `warning` | `#ffaa00` | 9.20:1 dgn gelap | status peringatan |
| `info` | `#0088e8` | 4.75:1 dgn gelap | status informasi |
| `success/warning/info-foreground` | `#131927` | — | teks di atas status |
| `border`/`input` | `#e5e7ea` | — | garis dan outline kontrol |
| `ring` | `#4a7ab5` | 3.57:1 vs border | focus ring |
| `bubble-sent` | `#60a5f9` | 6.90:1 dgn `#131927` | bubble terkirim |
| `bubble-received` | `#f3f4f6` | 15.95:1 dgn `#131927` | bubble diterima |
| `bubble-system` | `#ecf8ef` | 8.99:1 dgn `#1c4d27` | pesan sistem |
| `chart-1..5` | `#60a5f9`, `#43b75d`, `#ffaa00`, `#0095ff`, `#ee443f` | — | seri chart |

#### Dark

| Token | Nilai | Kontras | Pakai |
|---|---|---|---|
| `background` | `#131927` | — | latar halaman |
| `foreground` | `#f9fafb` | 16.80:1 | teks utama |
| `card`/`popover` | `#212936` | — | permukaan |
| `primary` | `#79b3fa` | 8.06:1 dgn `#131927` | fill tombol |
| `primary-hover` | `#a1cbff` | 10.45:1 | hover (mencerahkan) |
| `primary-active` | `#bedbff` | 12.35:1 | press (mencerahkan) |
| `primary-foreground` | `#131927` | — | label di atas primary |
| `primary-text` | `#a1cbff` | 10.45:1 | teks/ikon/link aksen |
| `primary-muted` | `#2c4a70` | — | latar item aktif |
| `primary-muted-foreground` | `#a1cbff` | 5.39:1 di muted | teks di primary-muted |
| `primary-border` | `#375d8b` | — | border item aktif |
| `secondary`/`muted`/`accent` | `#394050` | — | permukaan sekunder |
| `muted-foreground` | `#c1c5cd` | 10.15:1 | teks sekunder |
| `destructive` | `#a9302d` | 6.67:1 dgn putih | aksi merusak |
| `success`/`warning` | `#43b75d`/`#ffaa00` | — | status |
| `info` | `#33aaff` | — | status info |
| `border`/`input` | `#394050` | — | garis/outline |
| `ring` | `#79b3fa` | — | focus ring |
| `bubble-sent` | `#79b3fa` | 8.06:1 dgn `#131927` | bubble terkirim |
| `bubble-received` | `#394050` | 9.93:1 dgn `#f9fafb` | bubble diterima |
| `bubble-system` | `#1c4d27` | 7.43:1 dgn `#c5e9cd` | sistem |
| `chart-1..5` | `#79b3fa`, `#43b75d`, `#ffaa00`, `#0095ff`, `#ee443f` | — | seri chart |

### 2.3 Pohon keputusan warna

```
Butuh warna?
├─ Ini warna teks/ikon/link aksen?      → primary-text
├─ Ini fill aksi utama?                 → primary + primary-foreground
├─ Ini latar item aktif/terpilih?       → primary-muted + primary-muted-foreground (+ primary-border)
├─ Ini status?                          → success / warning / destructive / info (+ foreground gelap)
├─ Ini permukaan netral?                → background / card / popover / muted / accent
├─ Ini garis atau outline?              → border (garis) / input (kontrol) / ring (fokus)
├─ Ini data chart?                      → chart-1..5
├─ Ini bubble chat?                     → bubble-sent / bubble-received / bubble-system
└─ Selain itu                           → JANGAN pakai ramp; pakai semantic terdekat
```

### 2.4 Aturan kontras

- Teks normal ≥ **4.5:1**; teks besar ≥ **3:1**; elemen non-teks ≥ **3:1**.
- `primary` light hanya 2.55:1 dengan putih. Ini keputusan desain yang
  didokumentasikan di `DESIGN.md`; konsekuensinya:
  - **BOLEH** untuk label tombol/badge pendek.
  - **JANGAN** untuk paragraf, pesan, tabel panjang, placeholder, atau ikon tipis.
  - Untuk teks aksen gunakan `primary-text`.
- Placeholder tidak boleh menjadi satu-satunya pembeda; label tetap ada.
- Teks `disabled` boleh di bawah 4.5:1, tetapi harus jelas disabled dan tidak
  menjadi satu-satunya informasi.
- Hover/press harus **menaikkan** kontras:
  - Light: fill menggelap (`primary` → `primary-hover` → `primary-active`).
  - Dark: fill mencerahkan (`primary` → `primary-hover` → `primary-active`).
- Focus ring harus kontras terhadap `border` dan latar, bukan menyatu.

### 2.5 Matriks status

| Status | Fill | Teks | Ikon | Kapan |
|---|---|---|---|---|
| Netral/info | `bg-primary-muted` / `bg-info` | `text-primary-muted-foreground` / `text-info-foreground` | `Info` | konteks, bukan error |
| Sukses | `bg-success` atau `bg-success-50` | `text-success-foreground` / `text-success-700` | `CircleCheck` | selesai, tersimpan, aktif |
| Peringatan | `bg-warning` atau `bg-warning-50` | `text-warning-foreground` / `text-warning-900` | `TriangleAlert` | tenggat, kuota, risiko |
| Bahaya | `bg-destructive` atau `bg-danger-50` | `text-destructive-foreground` / `text-danger-700` | `OctagonX`/`CircleAlert` | gagal, hapus, berhenti |
| Nonaktif | `bg-muted` | `text-muted-foreground` | — | arsip, offline, tidak berlaku |

Aturan:

- Warna status hanya untuk status, bukan dekorasi.
- Selalu pasangkan **ikon + teks**, kecuali badge yang sudah punya label teks.
- Satu baris maksimal satu warna status dominan.
- Jangan memakai `destructive` untuk “penting” atau “baru”.
- Jangan memakai `success` untuk tombol utama.
- Jangan memakai `warning` untuk error validasi (pakai `destructive`).

### 2.6 Theme parity

- Setiap warna baru wajib diuji di light **dan** dark.
- Jangan memakai `bg-white`, `text-black`, `bg-gray-*`, `text-red-*`,
  `fill-yellow-*` — semuanya tidak mengikuti tema.
- Bila butuh varian dark, gunakan token + `dark:` (contoh:
  `bg-success-50 dark:bg-success-900/40`), bukan hex.
- Komponen pihak ketiga (chart, calendar, toast) harus di-override lewat token,
  bukan dibiarkan memakai warna default library.

### 2.7 Yang dilarang

| Dilarang | Alasan | Ganti |
|---|---|---|
| `bg-[#60a5f9]`, `style="color:#..."` | memutus tema | token semantic |
| `text-primary` untuk teks | kontras rendah | `text-primary-text` |
| `border-primary` untuk border terpilih | terlalu terang | `border-primary-text`/`primary-border` |
| `bg-primary` untuk paragraf/chat | tidak terbaca | `bg-primary-muted`/`bg-bubble-sent` |
| `bg-danger-600 text-white` | 4.0:1 | `bg-destructive` (danger-700 + putih) |
| `text-white` di `success`/`warning`/`info` | kontras gagal | foreground gelap `#131927` |
| Ramp untuk halaman biasa | tidak konsisten | semantic |
| Warna sebagai satu-satunya status | aksesibilitas | ikon + teks |

### 2.8 Contoh

```svelte
<!-- Aksi utama -->
<Button>Simpan perubahan</Button>

<!-- Aksen teks, bukan fill -->
<a href="/tickets" class="text-primary-text underline-offset-4 hover:underline">Lihat tiket</a>

<!-- Item aktif sidebar -->
<a class="bg-sidebar-active text-sidebar-active-text" aria-current="page">Kotak masuk</a>

<!-- Status dengan ikon + teks -->
<Badge variant="success"><CircleCheck /> Selesai</Badge>

<!-- Chart memakai token seri -->
<div class="bg-chart-1"></div>
```

---

## 3. Tipografi

### 3.1 Font stack

`--font-sans: 'Inter', 'Noto Sans Thai', ui-sans-serif, system-ui, ...`
(`src/app.css:322`).

- **JANGAN** menghapus `Noto Sans Thai`; locale `th` akan jatuh ke font sistem.
- **JANGAN** memuat font tambahan tanpa alasan brand yang disetujui.
- Locale `th` memakai line-height 1.7 pada body dan 1.5 pada heading
  (`src/app.css:509–515`); jangan menimpa dengan `leading-none`.

### 3.2 Skala

| Class | Ukuran | Line-height | Pakai |
|---|---|---|---|
| `text-xs` | 12 px | 16 px | metadata, timestamp, badge, helper |
| `text-meta` | 13 px | 20 px | teks sekunder desain (token khusus) |
| `text-sm` | 14 px | 20 px | **default** teks UI, tabel, form |
| `text-base` | 16 px | 24 px | teks utama mobile, input mobile |
| `text-lg` | 18 px | 28 px | sub-judul section |
| `text-xl` | 20 px | 28 px | judul panel |
| `text-2xl` | 24 px | 32 px | judul halaman di body (jarang) |
| `text-3xl` | 30 px | 36 px | hero/landing saja |

- Ukuran < 12 px **DILARANG**.
- Input/textarea memakai `text-base` di mobile dan `md:text-sm` untuk mencegah
  zoom otomatis iOS.
- Angka di tabel/uang memakai `tabular-nums`.
- Jangan memakai `leading-none` untuk teks ≤ 12 px.

### 3.3 Bobot dan kapital

- Maksimal dua bobot per layar: `font-medium` dan `font-semibold`.
- `font-bold` hanya untuk angka ringkasan besar, bukan teks panjang.
- `uppercase` hanya untuk label metadata kecil (`text-meta`/`text-xs`), bukan
  kalimat.
- Jangan memakai `tracking-tight` pada teks kecil; aman untuk heading.

### 3.4 Panjang baris

- Paragraf: 45–75 karakter; gunakan `max-w-prose` atau `max-w-2xl`.
- Deskripsi di card: maksimal 2–3 baris; sisanya pindah ke detail.
- Pesan chat: `max-w-[80%]` (bubble), teks tetap `leading-relaxed`.

---

## 4. Layout

### 4.1 Shell

Sumber: `src/routes/+layout.svelte`.

```
┌────────────────────────────────────────────────────────────┐
│ Topbar h-16: brand/judul · search · notif · locale · tema · profil │
├──────────────┬─────────────────────────────────────────────┤
│ Sidebar      │ <main> p-5 md:p-6                           │
│ 16rem / 3rem │   page header + aksi                        │
│ drawer 18rem │   ringkasan → toolbar → konten → footer     │
└──────────────┴─────────────────────────────────────────────┘
```

Aturan:

- Sidebar/topbar hanya di shell; halaman tidak membuat navigasi sendiri.
- `<main>` reguler `p-5 md:p-6` + `overflow-y-auto`. Halaman full-bleed
  (chat v4) memakai `p-0 overflow-hidden`.
- **JANGAN** menambah padding wrapper kedua di halaman.
- Sidebar desktop `16rem`, collapse `3rem`, mobile drawer `18rem`
  (`sidebar/constants.ts`).
- Topbar `h-16`; hanya satu search global.
- Login dan wallboard mem-bypass shell.

### 4.2 Template halaman

| Tipe halaman | Struktur | Catatan |
|---|---|---|
| Dashboard | header + 2–4 ringkasan card + 1–2 chart + tabel ringkas | chart punya legend & ringkasan teks |
| List/tabel | header + toolbar + tabel + pagination | filter menempel pada tabel |
| Detail | header + ringkasan + tabs/section + panel samping | aksi utama di header |
| Form | header + `Field.Group` + footer aksi sticky | error summary di atas |
| Settings | sidebar/tabs pengaturan + panel konten | simpan per section atau sticky bar |
| Chat | 3 panel (inbox, thread, info) | full-bleed; info jadi sheet < xl |
| Auth | kartu terpusat `max-w-sm` | tidak memakai shell |
| Wallboard | full-screen, auto-refresh, tanpa interaksi | kontras tinggi, font besar |

### 4.3 Skala spacing

Tailwind v4: 1 unit = 4 px.

| Class | px | Pakai |
|---|---|---|
| `gap-1` | 4 | ikon + label rapat, metadata |
| `gap-2` | 8 | intra-komponen (label–input) |
| `gap-3` | 12 | antar-field dalam grup |
| `gap-4` | 16 | antar-section dalam card |
| `gap-5` | 20 | antar-blok form |
| `gap-6` | 24 | antar-section halaman |
| `gap-8` | 32 | pemisah blok besar (jarang) |
| `p-4` | 16 | padding card default |
| `p-5`/`p-6` | 20/24 | padding halaman (`p-5 md:p-6`) |

- **JANGAN** membuat spacing baru (`p-[13px]`, `gap-[7px]`).
- Pengecualian yang sudah ada di `DESIGN.md`: `rounded-[4px]` untuk kontrol
  ≤ 32 px, dan lebar minimum tabel.
- Gunakan `space-y-*`/`gap-*`, bukan margin atas acak.

### 4.4 Grid

- Konten `max-w-7xl`; form `max-w-2xl`; auth `max-w-sm`.
- Ringkasan: 1 kolom (< `sm`), 2 (`sm`), 3–4 (`lg`).
- Form: 1 kolom mobile, 2 kolom `md`; field panjang full-width.
- Jangan memakai 4+ kolom di bawah `lg`; kartu akan terlalu sempit.
- Grid harus tetap sejajar: tinggi card dalam satu baris disamakan
  (`h-full`/`items-stretch`).

### 4.5 Breakpoint dan perilaku

| Breakpoint | px | Perilaku wajib |
|---|---|---|
| default | < 640 | 1 kolom; sidebar drawer; aksi utama bisa full-width; tabel → kartu |
| `sm` | ≥ 640 | 2 kolom ringkasan; toolbar boleh wrap; search topbar muncul |
| `md` | ≥ 768 | form 2 kolom; tabel boleh tampil; sidebar icon/drawer |
| `lg` | ≥ 1024 | sidebar penuh; 3–4 kolom ringkasan; toolbar satu baris |
| `xl` | ≥ 1280 | 3 panel chat; panel info tetap terlihat |
| `2xl` | ≥ 1536 | konten tetap `max-w-7xl`; jangan melebarkan teks |

### 4.6 Tabel dan data padat

- Tabel ≥ `md`; di bawahnya ubah ke `Card`/`Item` list.
- `Table.Root` sudah membungkus `relative w-full overflow-x-auto`; jangan
  menambah wrapper overflow kedua.
- Header `h-11`, sel `px-3.5 py-3`, teks `text-sm`.
- Angka rata kanan (`text-right tabular-nums`); teks rata kiri.
- Kolom aksi paling kanan, memakai `DropdownMenu` + `aria-label`.
- Baris yang bisa diklik tidak boleh berisi kontrol interaktif yang saling
  bertabrakan; bila ada checkbox/aksi, klik baris jangan menutupi aksi tersebut.
- Sorting harus terlihat (ikon panah + `aria-sort`).
- Pagination menyebut rentang (“1–10 dari 120”) dan mempertahankan filter.
- Sticky header boleh untuk tabel panjang, tetapi jangan menutupi topbar.

### 4.7 Scroll

- Halaman: scroll di `<main>`, bukan `body`, agar topbar tetap.
- Panel chat: hanya area pesan yang scroll; header dan composer tetap.
- Jangan membuat scroll bersarang tanpa alasan; jika perlu, beri batas tinggi
  jelas dan scrollbar terlihat.
- `ScrollArea` untuk panel kecil, bukan pengganti scroll halaman.
- Auto-scroll chat hanya bila pengguna berada di bawah.

### 4.8 z-index

| Lapisan | Nilai | Contoh |
|---|---|---|
| Konten | 0 | halaman |
| Sticky header | 10–20 | header tabel |
| Dropdown/popover | 50 | menu, date picker |
| Sheet/drawer | 50 | panel |
| Dialog/alert dialog | 50 | modal |
| Toast | 60+ (library) | sonner |

- Jangan memakai `z-[9999]`. Ikuti skala di atas.

### 4.9 Density

- Default: nyaman (`h-10` kontrol, `py-3` sel).
- Dense hanya untuk tabel operasional: `h-8` kontrol, `py-2` sel, `text-xs`.
- Density tidak boleh menurunkan target sentuh di mobile.
- Jangan mencampur density dalam satu tabel.

---

## 5. Komponen

### Konvensi import

- Komponen satu-file (mis. `button`, `input`, `badge`) diimpor sebagai named
  import.
- Komponen multi-bagian (mis. `card`, `field`, `table`, `dialog`) diimpor
  sebagai namespace agar anatominya terbaca.
- Selalu impor dari folder komponen (barrel `index.ts`), bukan langsung dari
  file `.svelte`-nya.

```ts
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import * as Field from '$lib/components/ui/field';
import * as Card from '$lib/components/ui/card';
import * as Table from '$lib/components/ui/table';
import * as Dialog from '$lib/components/ui/dialog';
```

### 5.0 Matriks pemilihan cepat

| Kebutuhan | Komponen |
|---|---|
| Aksi utama/sekunder | `Button` |
| Beberapa aksi terkait | `ButtonGroup` |
| On/off langsung | `Switch` |
| Pilihan tunggal 2–4 | `RadioGroup` |
| Pilihan banyak | `Checkbox` |
| Pilihan > 4 | `Select` |
| Pilihan cepat sebagai chip | `Chip`/`ToggleGroup` |
| Form field + label + error | `Field` |
| Input dengan prefix/suffix | `InputGroup` |
| Tanggal/waktu | `Calendar`/`DatePicker`/`TimePicker` |
| Navigasi rute | `Sidebar` |
| Navigasi view | `Tabs` |
| Navigasi hierarki | `Breadcrumb` |
| Halaman data | `Table` |
| Baris list | `Item`/`Card` |
| Status ringkas | `Badge` |
| Status + hapus/filter | `Chip` |
| Feedback kontekstual | `Alert` |
| Feedback sementara | `Sonner` |
| Konfirmasi destruktif | `AlertDialog` |
| Form/detail fokus | `Dialog` |
| Panel samping | `Sheet`/`Drawer` |
| Info singkat pada hover | `Tooltip`/`HoverCard` |
| Menu aksi | `DropdownMenu`/`ContextMenu` |
| Pesan chat | `Message` + `Bubble` |
| Lampiran | `Attachment` |
| Tidak ada data | `Empty` |
| Loading konten | `Skeleton`/`Spinner`/`Progress` |

---

### 5.1 Aksi

#### `Button`

**Anatomi:** label teks + ikon opsional (kiri/kanan) + state.

| Variant | Fungsi | Aturan |
|---|---|---|
| `default` | aksi utama | maksimal satu per area; label kata kerja |
| `secondary` | aksi pendamping | boleh lebih dari satu, tetapi jangan bersaing |
| `outline` | aksi netral/sekunder | default untuk “Batal”, filter, toolbar |
| `ghost` | aksi dalam baris/toolbar | wajib hover state; icon-only wajib `aria-label` |
| `destructive` | hapus/berhenti | wajib `AlertDialog`; jangan untuk “Batal” |
| `link` | navigasi teks | tampil seperti link; jangan untuk mutasi data |

| Size | Tinggi | Pakai |
|---|---|---|
| `xs` | 28 px | tabel sangat padat, badge aksi |
| `sm` | 32 px | toolbar/tabel padat |
| `default` | **40 px** | default semua halaman |
| `lg` | 48 px | hero/CTA, form penting |
| `xl` | 56 px | landing/empty state utama |
| `icon` | 40×40 | aksi ikon default |
| `icon-xs`…`icon-xl` | 28…56 | mengikuti density |

**State wajib:**

| State | Perilaku |
|---|---|
| Default | jelas, label terbaca |
| Hover | `bg-primary-hover` (light menggelap, dark mencerahkan) |
| Active/press | `bg-primary-active`, jangan menggeser layout |
| Focus-visible | ring 3 px `ring-ring/50` |
| Disabled | `disabled:bg-neutral-200` + teks `neutral-500`; pointer none |
| Loading | `Spinner` + label tetap; `disabled`; jangan ubah lebar |

**Aturan UX:**

- `type="button"` default; hanya submit form yang memakai `type="submit"`.
- Ikon dalam tombol memakai `data-icon="inline-start|inline-end"`; jangan
  menambah margin manual.
- Icon-only: `aria-label` + `Tooltip` (desktop) atau label terlihat (mobile).
- Jangan memakai tombol disabled sebagai satu-satunya penjelasan; sertakan alasan.
- Jangan menaruh dua `default` berdampingan.
- Jangan memakai `link` untuk aksi yang mengubah data.
- Saat submit, cegah double-click; pertahankan ukuran tombol.

```svelte
<!-- Hierarki aksi -->
<Button variant="outline">Batal</Button>
<Button>Simpan perubahan</Button>

<!-- Ikon -->
<Button variant="outline" size="icon" aria-label="Filter">
  <Filter />
</Button>

<!-- Loading -->
<Button disabled>
  <Spinner aria-label="Menyimpan" /> Menyimpan…
</Button>
```

#### `ButtonGroup`

- Untuk 2–4 aksi yang saling terkait (zoom, alignment, prev/next).
- Jangan mencampur variant dalam satu grup.
- Beri `Separator`/border pemisah; fokus salah satu item harus terlihat.
- Di mobile, pertimbangkan `ToggleGroup` atau menu jika terlalu sempit.

#### `Toggle`

- Untuk state on/off yang langsung terlihat (bold, mute, pin).
- Wajib `aria-label`/teks; jangan ikon saja tanpa tooltip.
- State aktif harus jelas (`bg-muted`/`aria-pressed`).
- Jangan memakai toggle untuk pilihan eksklusif (pakai radio).

#### `ToggleGroup`

- Untuk memilih satu/lebih dari beberapa opsi (view grid/list, alignment).
- Pilihan aktif terlihat, bukan hanya hover.
- Maksimal 4–5 item; jika lebih, pakai `Select`.
- Jangan untuk navigasi halaman.

---

### 5.2 Form

#### `Field` (dan `Label`, `Description`, `Error`, `Group`, `Set`)

**Anatomi baku:**

```svelte
<Field.Field>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" bind:value={email}
    aria-invalid={!!error} aria-describedby={error ? 'email-error' : undefined} />
  <Field.Description>Kami tidak akan membagikan alamat ini.</Field.Description>
  <Field.Error id="email-error">{error}</Field.Error>
</Field.Field>
```

Aturan:

- Setiap kontrol wajib punya label terlihat; placeholder bukan label.
- `Field.Description` untuk bantuan; `Field.Error` untuk error (bukan toast).
- `Field.Group` mengelompokkan field; `Field.Set` + `Field.Legend` untuk
  kelompok radio/checkbox.
- Error: `role="alert"` sudah ada di `Field.Error`; hubungkan `aria-describedby`.
- Jangan memakai `aria-label` untuk menggantikan label terlihat, kecuali
  kontrol benar-benar tanpa ruang (mis. search topbar).

#### `Input`

- Satu baris teks/email/angka/password/search.
- `h-10`, `rounded-lg`, `px-3.5`, `text-base md:text-sm`.
- `aria-invalid` + `aria-describedby` saat error.
- `type` yang tepat (`email`, `password`, `search`, `tel`, `number`).
- Jangan memakai `type="number"` untuk kode pos/telepon (pakai `inputmode`).
- Placeholder bersifat contoh, bukan instruksi; instruksi ada di description.

#### `Textarea`

- Untuk pesan/catatan multi-baris; `min-h-16`, `field-sizing-content`.
- `rows` awal 3–5; tampilkan counter bila ada batas karakter.
- Auto-resize maksimal ±120 px di composer; setelah itu scroll.
- Jangan memakai textarea untuk data satu baris.

#### `InputGroup`

- Untuk input dengan prefix/suffix/ikon/tombol (search, URL, nominal).
- Addon tidak boleh menutupi teks; input tetap punya label.
- `InputGroup.Button` default `ghost`; jangan membuat tombol primary di addon
  kecuali itu satu-satunya aksi (mis. search submit).
- Di mobile, addon ikon boleh; tombol teks panjang tidak.

#### `InputOTP`

- Hanya untuk kode OTP; bukan PIN/password umum.
- Tampilkan jumlah digit dan status error per grup.
- Auto-advance + paste didukung; jangan memaksa klik per sel.
- Beri label “Kode verifikasi” dan deskripsi masa berlaku.

#### `Select`

- Untuk pilihan tunggal ≥ 5 opsi.
- 2–4 opsi → `RadioGroup`/segmented agar semua terlihat.
- Placeholder = instruksi (“Pilih kanal”), value terpilih harus terbaca.
- `size="sm"` hanya untuk toolbar/tabel; default `h-10`.
- Jangan memakai Select untuk navigasi.

#### `Checkbox`

- Pilihan banyak / persetujuan; label bisa diklik.
- Kotak visual 24 px dengan target ±36 px; jangan mengecilkan pseudo-target.
- Dukung `indeterminate` untuk “pilih semua”.
- Jangan memakai checkbox untuk aksi instan (pakai `Switch`).

#### `RadioGroup`

- Pilihan tunggal 2–4; semua opsi terlihat.
- Jangan memberi default tanpa alasan; jika default, jelaskan.
- Label grup memakai `Field.Legend`; setiap item punya label.

#### `Switch`

- Pengaturan on/off yang langsung tersimpan.
- Default 44×24; small 36×20; target sentuh ±8 px.
- Beri feedback setelah perubahan (toast/status), karena tidak ada tombol simpan.
- Jangan memakai switch untuk persetujuan legal (pakai checkbox).

#### `Slider`

- Nilai kontinu dalam rentang (volume, ambang).
- Tampilkan nilai saat ini; sediakan input angka alternatif untuk presisi.
- Jangan memakai slider untuk angka yang butuh presisi tinggi.
- Target thumb minimal 24 px; dukung keyboard arrow/Home/End.

#### `Calendar` / `RangeCalendar`

- `Calendar` untuk satu tanggal; `RangeCalendar` untuk rentang.
- Tandai hari ini dan tanggal terpilih; navigasi keyboard wajib.
- Tanggal dinonaktifkan harus jelas (bukan hanya warna).
- `RangeCalendar` menampilkan awal–akhir eksplisit; jangan hanya highlight.

#### `DatePicker`, `DateRangePicker`, `TimePicker`

- Gunakan di dalam `Popover`, bukan halaman baru.
- Tombol trigger memakai `variant="outline"` + ikon kalender/jam.
- Tampilkan format locale aktif; jangan hardcode `YYYY-MM-DD` di UI.
- Time picker: jam/menit jelas, dukungan keyboard, dan nilai default yang masuk
  akal (hindari 00:00 tanpa alasan).
- Tombol “Hari ini”/“Bersihkan” membantu, tetapi jangan menutupi kalender.

#### Aturan umum form

- Susun field dalam satu alur logis; grup dengan `Field.Group`.
- Tombol submit di akhir form; pada form panjang boleh sticky footer.
- Enter di field tunggal boleh submit; di textarea **tidak** (kecuali composer
  chat dengan aturan eksplisit).
- Validasi saat blur/submit, bukan setiap karakter (kecuali format yang sudah
  pasti).
- Setelah submit sukses: reset hanya jika form untuk entri berulang; jika edit,
  tetap tampilkan nilai tersimpan.
- Jika ada perubahan belum disimpan dan pengguna menutup dialog/navigasi, minta
  konfirmasi.
- Jangan menonaktifkan seluruh form saat satu field error.

---

### 5.3 Navigasi

#### `Sidebar`

- Satu-satunya navigasi rute utama.
- Item aktif: `bg-sidebar-active text-sidebar-active-text` + `aria-current`.
- Urutan/kelompok global; jangan mengubah per halaman.
- Collapse menyimpan state (`localStorage.dk-sidebar`).
- Saat collapsed, tooltip wajib untuk ikon.
- Maksimal 7 item per grup; lebih dari itu, kelompokkan.
- Mobile: drawer + overlay; jangan memaksa sidebar terbuka.
- Aksi destruktif hanya logout (dengan konfirmasi).

#### `Breadcrumb`

- Untuk hierarki > 2 level.
- Item terakhir `Breadcrumb.Page`, bukan link.
- Jangan dipakai di mobile sempit; sembunyikan item tengah dengan ellipsis.
- Jangan menggantikan navigasi utama.

#### `Tabs`

- Mengganti view dalam konteks yang sama, bukan rute.
- Varian: `default` (segmented), `pill`, `line`.
- Maksimal 5–7 tab; label singkat; state aktif persisten.
- Jangan mencampur varian dalam satu halaman.
- Tab yang dinonaktifkan harus punya alasan (tooltip/teks).
- Jangan memakai tabs untuk wizard (pakai `Stepper`).

#### `Pagination`

- Untuk data > 1 halaman; tampilkan rentang dan total.
- Pertahankan filter/sort saat pindah halaman.
- `Pagination.Link` aktif memakai `default`; lainnya `ghost`.
- Jangan menampilkan nomor halaman berlebihan; gunakan ellipsis.
- Di mobile, previous/next + info rentang cukup.

#### `NavbarBottom`

- Navigasi mobile 3–5 tujuan utama.
- Item aktif jelas; label selalu terlihat.
- Aman dari safe-area (`pb-[env(safe-area-inset-bottom)]` sudah ada).
- Jangan untuk desktop.

#### `Command` / `CommandDialog`

- Pencarian/aksi cepat (`Cmd+K`), bukan navigasi utama.
- Sediakan kategori, shortcut (`Kbd`), dan empty result.
- Jangan menyembunyikan aksi penting hanya di command palette.

#### `Collapsible`

- Untuk detail sekunder yang bisa dibuka (filter lanjutan, metadata).
- Jangan menyembunyikan aksi utama atau konten wajib.
- State terbuka/tertutup harus jelas; gunakan `aria-expanded` (sudah dari primitif).

---

### 5.4 Data display

#### `Card`

- Mengelompokkan konten terkait dengan judul/deskripsi/aksi.
- `Card.Root` `rounded-xl`, `ring-1 ring-foreground/10`, padding 16 px
  (`size="sm"` 12 px).
- Jangan membuat card di dalam card; gunakan `Item`/`Separator`.
- Aksi card di `Card.Action` (kanan header), bukan di footer, jika itu aksi
  utama kartu.
- Ringkasan dashboard memakai ukuran/tinggi identik.

#### `Table`

- Untuk data terstruktur yang dibandingkan kolom.
- `Table.Root` menangani scroll horizontal.
- Header `h-11`, sel `px-3.5 py-3`; angka `text-right tabular-nums`.
- Kolom aksi di kanan; gunakan menu, bukan 3+ ikon berjajar.
- Sorting terlihat; loading memakai skeleton baris; kosong memakai `Empty`.
- Jangan memakai tabel untuk feed/chat/list kartu.
- Jangan menaruh teks panjang tanpa `truncate`/lebar kolom jelas.

#### `Item`

- Baris list dengan media + judul + deskripsi + aksi.
- Varian `default`, `outline`, `muted`; size `default`, `sm`, `xs`.
- Seluruh baris bisa diklik bila hanya ada satu aksi; jika ada aksi lain,
  gunakan tombol/menu yang jelas.
- Jangan memakai `Item` untuk perbandingan kolom (pakai `Table`).

#### `Avatar`

- Identitas orang/agen; fallback inisial wajib.
- Size `sm` 24, `default` 32, `lg` 40.
- Status online/away/busy/offline memakai titik + `aria-label`/teks.
- Gambar punya `alt` bermakna atau `alt=""` bila dekoratif.
- Jangan memakai avatar sebagai ikon generik.

#### `Chart`

- Untuk tren/perbandingan, bukan data presisi tunggal.
- Gunakan `Chart.Container` + `Chart.Tooltip`; warna dari `--chart-1..5`.
- Wajib: label sumbu, unit, legend bila > 1 seri, dan ringkasan tekstual.
- Maksimal 5 seri; lebih dari itu, kelompokkan atau pakai tabel.
- Jangan mengandalkan warna saja; bedakan dengan pola/label.
- Sediakan empty/error/loading state; jangan chart kosong tanpa pesan.
- Angka memakai locale aktif.

#### `Badge`

- Status/label non-interaktif; teks singkat.
- Varian: `default`, `info`, `secondary`, `destructive`, `success`, `warning`,
  `outline`, `ghost`, `link`.
- Size `sm` 20, `default` 24, `lg` 32.
- Maksimal 3 badge per baris; lebih dari itu, ringkas.
- Jangan memakai badge sebagai tombol/filter (pakai `Chip`).

#### `Chip`

- Tag/filter/pilihan yang bisa dihapus.
- Varian: `default`, `info`, `success`, `warning`, `destructive`, `secondary`,
  `outline`; size `sm`, `default`, `lg`.
- `Chip.Dismiss` hanya jika benar-benar bisa dihapus; beri label aksesibel.
- Filter aktif harus terlihat sebagai chip + tombol reset semua.

#### `Marker`

- Penanda pada timeline/chart/list (tanggal, “baru”, pemisah).
- Varian `default`, `separator`, `border`.
- Jangan mengandalkan warna saja; sertakan teks.

#### `Kbd`

- Shortcut keyboard yang benar-benar berfungsi.
- Jangan menampilkan shortcut palsu atau untuk aksi yang tidak ada.

#### `Separator`

- Pemisah visual antar-blok.
- Jangan menambah border pada elemen yang sudah punya border.
- Gunakan spacing, bukan separator, untuk memisahkan field form.

#### `Resizable`

- Panel desktop yang bisa diatur (chat/editor).
- Simpan ukuran panel; sediakan default aman.
- Nonaktifkan/di-sederhanakan di mobile.

#### `ScrollArea`

- Area scroll kecil dengan styling konsisten.
- Jangan menggantikan scroll natural halaman.

#### `Skeleton`

- Placeholder yang menyerupai konten akhir.
- Untuk loading > 300 ms; jangan untuk aksi submit.
- Jangan mencampur skeleton dan spinner di area yang sama.
- Hormati `prefers-reduced-motion` (animasi pulse boleh dimatikan).

---

### 5.5 Feedback dan status

#### `Alert`

- Informasi kontekstual yang harus dibaca.
- Varian `default`/`info` (subtle), `success`, `warning`, `destructive`;
  `mode="filled"` untuk kritis.
- Selalu sertakan judul + deskripsi + langkah berikutnya.
- Jangan memakai alert untuk error field (pakai `Field.Error`).
- Jangan menumpuk banyak alert di satu halaman; prioritaskan.

#### `Sonner` (toast)

- Hasil aksi async: sukses/gagal/info.
- Maksimal satu toast per aksi; durasi 4–6 detik; bisa ditutup.
- Jangan memakai toast untuk error validasi atau informasi yang harus dibaca lama.
- Jangan menaruh aksi kritis hanya di toast (bisa terlewat).

#### `Progress`

- Proses dengan progres diketahui (upload, ekspor).
- Sertakan label + persen; jangan hanya bar.
- Untuk proses tak diketahui, pakai `Spinner` + teks.

#### `Spinner`

- Tunggu singkat < 3 detik; pada tombol/aksi.
- Sertakan teks “Memuat…” untuk pembaca layar.
- Jangan menaruh spinner di tengah halaman untuk semua loading.

#### `Empty`

- Tidak ada data; bedakan “belum ada” vs “filter kosong”.
- Wajib ada aksi berikutnya (buat, impor, reset filter).
- Gunakan `Empty.Media` + `Empty.Title` + `Empty.Description` + `Empty.Content`.
- Jangan menampilkan empty state di dalam tabel tanpa header.

#### `Stepper`

- Alur multi-langkah berurutan (wizard).
- State `complete`, `current`, `upcoming`; label + deskripsi.
- Bisa kembali ke langkah sebelumnya; jangan mengunci tanpa alasan.
- Jangan memakai stepper untuk navigasi bebas.

#### `Tooltip`

- Menjelaskan ikon/istilah singkat.
- Jangan untuk konten interaktif atau informasi kritis.
- Jangan menjadi satu-satunya label; `aria-label` tetap wajib.
- Muncul setelah delay singkat; hilang saat `Esc`/blur.

---

### 5.6 Overlay

#### `Dialog`

- Form/detail yang butuh fokus; maksimal satu dialog aktif.
- Wajib `Dialog.Title` + `Dialog.Description` (boleh `sr-only`).
- Fokus awal ke field pertama; `Esc` menutup; fokus kembali ke pemicu.
- Jika ada perubahan belum disimpan, konfirmasi sebelum menutup.
- Jangan menumpuk dialog di atas dialog; selesaikan/tutup yang pertama.
- Jangan memakai dialog untuk konten panjang berbentuk halaman.

#### `AlertDialog`

- Konfirmasi aksi destruktif/permanen.
- Fokus awal ke “Batal”; tombol destruktif di kanan.
- Sebut objek dan akibat (“Hapus 3 tiket? Tindakan ini tidak bisa dibatalkan.”).
- Jangan memakai `AlertDialog` untuk info biasa.
- Jangan memakai `Dialog` untuk konfirmasi hapus.

#### `Sheet`

- Panel samping/detail di desktop; lebar `sm:max-w-sm`.
- `side` konsisten per konteks (detail kanan, filter kiri).
- `Esc` menutup; overlay klik luar menutup kecuali ada perubahan.

#### `Drawer`

- Aksi/detail mobile dari bawah; maksimal 80vh.
- Sediakan handle dan tombol tutup; jangan menutupi seluruh layar tanpa alasan.
- Jangan memakai drawer untuk form panjang di desktop.

#### `Popover`

- Konten ringan dekat pemicu (filter, date picker, info).
- `w-72` default; jangan sarang popover.
- Tutup saat klik luar/`Esc`.

#### `DropdownMenu`

- Daftar aksi kontekstual; maksimal 7 item.
- Aksi destruktif dipisah `Separator` + `variant="destructive"`.
- Item minimal `min-h-10`; ikon + label.
- Jangan memakai dropdown untuk navigasi utama.
- Jangan menyembunyikan satu-satunya aksi di balik ikon “…” tanpa label.

#### `ContextMenu`

- Aksi klik kanan; selalu sediakan alternatif tombol/keyboard.
- Jangan menaruh aksi utama hanya di sini.

#### `HoverCard`

- Preview singkat (profil, detail tiket).
- Jangan untuk informasi penting; tidak tersedia di sentuh.
- Sediakan cara lain membuka detail.

---

### 5.7 Messaging / omnichannel

`Message`, `Bubble`, `SystemMessage`, `Attachment`, dan `TicketBanner` ada di
`src/lib/components/ui/`; `ChatInput`, `EmailItem`, dan `EmailCompose` adalah
single-file di folder yang sama.

#### `Message` + `Bubble`

- `Message` membungkus avatar + header + bubble + footer.
- `Bubble` varian `sent`/`received`/`system`; `sent` di kanan.
- Gunakan `bg-bubble-*`, bukan `bg-primary`.
- `Bubble.Content` menangani teks panjang (`wrap-break-word`, `max-w-[80%]`).
- Timestamp di footer, `text-xs text-muted-foreground`.
- Aksi pesan lewat menu, bukan hanya hover.
- Jangan mencampur bubble sistem dengan pesan pengguna.

#### `SystemMessage`

- Info sistem di dalam thread (tiket dibuat, agen berganti).
- Varian `default`, `info`, `warning`, `destructive`, `muted`; shape `pill`,
  `banner`, `plain`.
- `pill` untuk info singkat, `banner` untuk peringatan.
- Jangan memakai untuk pesan pelanggan.

#### `Attachment`

- Lampiran file/gambar; state `idle`, `uploading`, `processing`, `error`, `done`.
- Tampilkan nama, ukuran, dan aksi hapus/retry.
- Jangan menyembunyikan error upload; beri retry.
- Orientation horizontal default; vertical untuk galeri.

#### `ChatInput` / composer

- Enter mengirim, Shift+Enter baris baru (kecuali disepakati lain).
- Tombol kirim disabled saat kosong; attachment/emoji punya `aria-label`.
- Auto-resize maksimal 120 px; setelah itu scroll.
- Jangan menghapus draft saat gagal kirim.
- Jangan menyembunyikan tombol kirim di menu.

#### `TicketBanner`

- Konteks tiket aktif; varian `default`, `solid`, `outline`, `warning`,
  `destructive`; size `sm`, `default`, `lg`.
- Sertakan ID tiket (`TicketBanner.Id`) + aksi buka tiket.
- Jangan menutupi composer.

#### `EmailItem`

- Baris daftar email; status baca jelas, aksi massal di toolbar.
- Jangan memakai `role="button"` pada div dengan kontrol interaktif di dalamnya;
  gunakan tombol/link yang tepat.
- Ikon bintang/attachment memakai token, bukan warna Tailwind acak.

#### `EmailCompose`

- Validasi penerima sebelum kirim; konfirmasi saat menutup draft.
- Attachment memakai `Attachment`; jangan membuat komponen sendiri.
- Status kirim jelas (draft, mengirim, terkirim, gagal).

#### `ChannelIcon`

- Menandai kanal; selalu dengan label teks/tooltip.
- Jangan mengandalkan ikon saja untuk membedakan kanal.

---

### 5.8 Komposit aplikasi

Lokasi: `src/lib/components/omnichat/` (bukan `ui/`).

| Komponen | Aturan |
|---|---|
| `inbox-panel` | Search + filter di atas list; item aktif memakai surface aktif; unread jelas |
| `thread-panel` | Header ringkas (nama, kanal, status), isi scroll, composer sticky |
| `agent-panel` | Konteks agen; jangan menduplikasi aksi thread header |
| `composer` | Attachment/emoji/kirim berlabel; Enter/Shift+Enter konsisten |
| `chat-list-item` | Seluruh baris bisa diklik; maksimal 2 baris teks; timestamp + unread |

---

## 6. Pola halaman (recipes)

### 6.1 Page header + aksi

```svelte
<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div class="max-w-2xl space-y-1">
    <p class="text-meta text-muted-foreground">Tiket</p>
    <h2 class="text-xl font-semibold tracking-tight">Daftar tiket</h2>
    <p class="text-sm text-muted-foreground">Kelola tiket dari semua kanal.</p>
  </div>
  <div class="flex gap-2">
    <Button variant="outline">Ekspor</Button>
    <Button>Buat tiket</Button>
  </div>
</div>
```

- Judul halaman tetap muncul di topbar; header konten boleh mengulang konteks
  tanpa menduplikasi title bar.
- Aksi utama di kanan; di mobile boleh full-width di bawah deskripsi.

### 6.2 Ringkasan dashboard

- 2–4 card, tinggi sama, angka besar + label + tren.
- Angka memakai `tabular-nums`; tren memakai ikon + teks, bukan warna saja.
- Jangan menaruh lebih dari 4 metrik utama; sisanya di halaman detail.

### 6.3 Toolbar + tabel

- Toolbar: search (kiri), filter (chip/dropdown), aksi massal (kanan).
- Filter aktif tampil sebagai chip di bawah toolbar.
- Search debounce 250–300 ms; tombol clear.
- Saat filter berubah, reset ke halaman 1.
- Empty karena filter wajib punya “Reset filter”.

### 6.4 Form

- Satu kolom default; dua kolom hanya untuk field pendek berpasangan.
- Label di atas field; helper di bawah; error menggantikan helper saat error.
- Tombol submit di akhir; “Batal” di kiri.
- Form panjang: ringkasan error di atas + sticky footer aksi.

### 6.5 Settings

- Navigasi pengaturan (tabs/sidebar) + panel konten.
- Simpan per section atau sticky bar; jangan menyimpan otomatis tanpa indikator.
- Perubahan berisiko (hapus akun, reset) memakai zona bahaya terpisah.

### 6.6 Konfirmasi destruktif

```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger>Hapus tiket</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Hapus tiket #4821?</AlertDialog.Title>
      <AlertDialog.Description>
        Tiket dan riwayat percakapan akan dihapus permanen.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Batal</AlertDialog.Cancel>
      <AlertDialog.Action variant="destructive">Hapus tiket</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### 6.7 State loading / empty / error

```svelte
{#if loading}
  <div class="space-y-2">
    {#each Array(5) as _}
      <Skeleton class="h-12 w-full" />
    {/each}
  </div>
{:else if error}
  <Alert variant="destructive">
    <Alert.Title>Gagal memuat tiket</Alert.Title>
    <Alert.Description>{error}</Alert.Description>
    <Alert.Action><Button variant="outline" size="sm" onclick={retry}>Coba lagi</Button></Alert.Action>
  </Alert>
{:else if rows.length === 0}
  <Empty.Root>
    <Empty.Header>
      <Empty.Media variant="icon"><Inbox /></Empty.Media>
      <Empty.Title>Belum ada tiket</Empty.Title>
      <Empty.Description>Tiket baru akan muncul di sini.</Empty.Description>
    </Empty.Header>
    <Empty.Content><Button>Buat tiket</Button></Empty.Content>
  </Empty.Root>
{:else}
  <!-- tabel -->
{/if}
```

### 6.8 Chart

- Judul + rentang waktu + unit.
- Legend untuk > 1 seri; tooltip menampilkan nilai + label.
- Ringkasan tekstual untuk pembaca layar
  (`<p class="sr-only">Tren naik 12% dibanding minggu lalu.</p>`).
- Empty state jika tidak ada data pada rentang.

### 6.9 Chat 3 panel

- `xl`: inbox (kiri), thread (tengah), info (kanan).
- `< xl`: info menjadi sheet; inbox menjadi drawer/halaman.
- Thread header tetap; hanya daftar pesan yang scroll.
- Unread + timestamp di inbox; jangan memotong nama terlalu agresif.

### 6.10 Login

- Card `max-w-sm`, logo, judul, form, error inline, tombol utama full-width.
- Token disimpan di `localStorage.dk_token`; redirect ke `/login` bila hilang.
- Jangan menampilkan pesan error yang membocorkan detail autentikasi.

---

## 7. State wajib

### 7.1 Matriks per halaman data

| State | Tampilan | Aksi |
|---|---|---|
| Loading awal | Skeleton sesuai layout | — |
| Loading filter | Spinner kecil di toolbar / overlay tipis | tetap bisa batalkan |
| Empty | `Empty` + penjelasan | buat/impor |
| No results | `Empty` + “Tidak ada hasil” | reset filter |
| Error | `Alert destructive` / panel error | coba lagi |
| Partial error | Banner + data yang berhasil | muat ulang bagian gagal |
| Success | Toast/alert | lanjut/lihat |
| Disabled | Kontrol disabled + alasan | — |
| Read-only | Kontrol read-only + alasan izin | minta akses |
| Unauthorized | Pesan izin + kembali | — |
| Offline | Banner persisten | coba lagi |

### 7.2 Aturan state

- Jangan menampilkan angka `0` saat data belum dimuat; gunakan skeleton.
- Jangan menghilangkan filter saat loading/error.
- Jangan memakai satu state untuk dua kondisi (empty vs error).
- Jangan menampilkan `null`/`undefined`/`NaN` ke UI.
- Fallback data demo boleh, tetapi beri indikator “data contoh” bila perlu.

---

## 8. Aksesibilitas

### 8.1 Keyboard

- Urutan fokus mengikuti urutan visual.
- `Tab`/`Shift+Tab` menjangkau semua kontrol; `Enter`/`Space` mengaktifkan.
- `Esc` menutup overlay; fokus kembali ke pemicu.
- Arrow keys untuk radio, tabs, menu, slider, kalender.
- Tidak ada focus trap di luar overlay; overlay wajib trap.
- Jangan memakai `tabindex > 0`.

### 8.2 Fokus

- Ring 3 px `ring-ring/50`; jangan `outline-none` tanpa pengganti.
- Fokus programatik setelah submit error ke field pertama.
- Jangan memindahkan fokus tanpa alasan.

### 8.3 Label dan ARIA

- Ikon-only: `aria-label`.
- Tombol dengan ikon + teks: teks sudah cukup.
- Status dinamis: `role="status"`/`aria-live="polite"`.
- Error kritis: `role="alert"`.
- Toggle: `aria-pressed` (dari primitif).
- Tabs: `role="tablist"`/`tab`/`tabpanel` (dari primitif).
- Tabel: header semantik; `aria-sort` untuk sorting.
- Dialog: `aria-labelledby`/`aria-describedby` (dari `Title`/`Description`).

### 8.4 Target sentuh

- Minimal 36×36 px; ideal 40–44 px.
- Checkbox/radio 24 px visual + pseudo ±6 px; switch pseudo ±8 px.
- Jangan menempatkan dua target sentuh berdekatan tanpa jarak ≥ 8 px.
- Aksi baris tabel di mobile harus punya menu, bukan ikon 16 px.

### 8.5 Kontras dan warna

- Teks ≥ 4.5:1; besar ≥ 3:1; non-teks ≥ 3:1.
- Status tidak hanya warna.
- Placeholder/disabled tidak boleh menjadi satu-satunya informasi.
- Uji light + dark.

### 8.6 Gerak dan media

- Hormati `prefers-reduced-motion`.
- Tidak ada autoplay audio/video.
- Gambar punya `alt`; dekoratif `alt=""`.
- Jika ada video/audio player, kontrol keyboard wajib.

---

## 9. i18n dan format

- 4 locale wajib: `id` (default), `en`, `th`, `tl`.
- Setiap halaman punya `const STR = { id, en, th, tl }` + `let s = $derived(STR[$locale])`.
- Jangan menyusun kalimat dari potongan string; gunakan placeholder utuh.
- Jangan hardcode `id-ID`; gunakan locale aktif untuk `Intl.*`.
- Format:
  - Tanggal: `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })`.
  - Waktu: `Intl.DateTimeFormat(locale, { timeStyle: 'short' })`.
  - Angka: `Intl.NumberFormat(locale)`.
  - Relatif: `Intl.RelativeTimeFormat(locale, { numeric: 'auto' })`.
- Label tombol pendek; uji `th` dan `tl` agar tidak meluber.
- Thai butuh line-height lebih tinggi; jangan `leading-none`.
- Jangan menerjemahkan nama produk/istilah teknis yang sudah baku.
- Teks arah (jika nanti RTL) memakai logical properties (`ms-*`, `me-*`, `ps-*`,
  `pe-*`), bukan `ml-*`/`mr-*`.

---

## 10. Copy dan UX writing

### 10.1 Nada

- Ringkas, langsung, tidak menyalahkan pengguna.
- Bahasa Indonesia default; istilah operasional tetap konsisten.
- Hindari jargon internal di UI pelanggan.

### 10.2 Pola

| Kebutuhan | Pola | Contoh |
|---|---|---|
| Tombol | kata kerja + objek | “Simpan perubahan”, “Hapus tiket” |
| Judul dialog | pertanyaan/aksi jelas | “Hapus tiket #4821?” |
| Error | apa + kenapa + solusi | “Email tidak valid. Gunakan format nama@domain.com.” |
| Empty | kondisi + langkah | “Belum ada tiket. Buat tiket pertama Anda.” |
| No results | kondisi + reset | “Tidak ada hasil untuk ‘budi’. Reset filter.” |
| Sukses | hasil + konteks | “Tiket #4821 tersimpan.” |
| Konfirmasi | akibat + ireversibilitas | “Tindakan ini tidak bisa dibatalkan.” |
| Helper | batasan/format | “Maksimal 160 karakter.” |

### 10.3 Larangan copy

- “OK”/“Ya”/“Tidak” sebagai label aksi.
- “Apakah Anda yakin?” tanpa objek/akibat.
- “Error!” tanpa penjelasan.
- “Klik di sini” sebagai link.
- ALL CAPS untuk kalimat.
- Singkatan yang tidak dikenal pengguna.

---

## 11. Performa yang terasa (perceived performance)

- Tampilkan kerangka layout sebelum data; jangan layar putih.
- Pertahankan posisi scroll saat kembali dari detail.
- Optimistic update untuk aksi ringan (tandai dibaca, pin), dengan rollback +
  toast bila gagal.
- Debounce search 250–300 ms; batalkan request lama.
- Pagination server-side untuk data besar; jangan render ribuan baris.
- Lazy-load chart/editor berat; tampilkan skeleton.
- Cegah layout shift: beri ukuran gambar/avatar/chart.
- Prefetch rute yang sering dibuka (opsional, jangan berlebihan).
- Jangan menampilkan spinner penuh untuk operasi < 300 ms.

---

## 12. Checklist review UI

### Visual & tema

- [ ] Tidak ada hex/rgb/hsl atau arbitrary value baru.
- [ ] Tidak ada `text-primary`/`border-primary` untuk teks/ikon.
- [ ] Light dan dark benar; kontras teks ≥ 4.5:1.
- [ ] Status memakai ikon + teks, bukan warna saja.
- [ ] Radius/ukuran mengikuti `DESIGN.md`.

### Hierarki & layout

- [ ] Satu aksi primary per area.
- [ ] Judul → konteks → konten → aksi.
- [ ] Mobile: 1 kolom, tabel → kartu, aksi utama terjangkau.
- [ ] Tidak ada padding wrapper ganda.
- [ ] Grid sejajar dan tidak meluber.

### State & feedback

- [ ] Loading, empty, no-results, error, success ada.
- [ ] Tombol async disabled + spinner.
- [ ] Error validasi inline.
- [ ] Aksi destruktif dikonfirmasi.

### Aksesibilitas

- [ ] Semua alur selesai dengan keyboard.
- [ ] Fokus terlihat; `Esc` menutup overlay.
- [ ] Ikon-only punya `aria-label`.
- [ ] Form punya label + `aria-describedby` saat error.
- [ ] Target sentuh ≥ 36 px.
- [ ] `prefers-reduced-motion` dihormati.

### i18n

- [ ] Copy ada di 4 locale.
- [ ] Tanggal/angka memakai locale aktif.
- [ ] Uji `th` dan `tl` tidak meluber.

### Verifikasi

- [ ] `bun run check` tidak menambah error baru dari baseline.
- [ ] `bun run build` berhasil.
- [ ] Diuji di 375 px, 768 px, 1024 px, 1440 px.
- [ ] Diuji light + dark.

---

## 13. Anti-pattern

| Pola | Masalah | Ganti |
|---|---|---|
| `bg-[#60a5f9]` | memutus tema | `bg-primary` |
| `text-primary` untuk link | kontras 2.55:1 | `text-primary-text` |
| Dua tombol primary | hierarki kabur | satu primary + outline |
| “OK”/“Ya” | tidak jelas | kata kerja + objek |
| Error via toast | mudah terlewat | `Field.Error` |
| Status hanya warna | tidak aksesibel | ikon + teks |
| Spinner halaman penuh | menggeser konteks | skeleton |
| `overflow-x-auto` ganda | scroll ganda | biarkan `Table.Root` |
| Dialog untuk hapus | tidak cukup tegas | `AlertDialog` |
| Drawer untuk semua overlay | berlebihan | Dialog/Popover |
| Tabrakan klik baris vs aksi | aksi salah | tombol/menu eksplisit |
| `hover:` satu-satunya akses | tidak mobile/keyboard | kontrol selalu terlihat |
| `z-[9999]` | tumpukan tak terkendali | skala z-index |
| `uppercase` paragraf | sulit dibaca | kapital normal |
| Hardcode `id-ID` | locale salah | `Intl` + locale aktif |
| Teks < 12 px | tidak terbaca | minimum `text-xs` |
| `leading-none` teks kecil | terpotong (Thai) | `leading-tight`+ |
| Padding manual di halaman | tidak konsisten | padding shell |
| Warna Tailwind (`text-yellow-400`) | tidak bertema | token semantic/ramp |
| Div `role="button"` berisi tombol | a11y rusak | `button`/`a` yang tepat |

---

## 14. Tata kelola

### Menambah komponen

1. Pastikan belum ada primitif yang cocok di `src/lib/components/ui`.
2. Tambahkan folder `foo/` + `foo.svelte` + `index.ts` (barrel), mengikuti
   konvensi shadcn-svelte.
3. Gunakan token; jangan hex/arbitrary.
4. Tambahkan aturan pakai/jangan pakai ke bagian 5 dokumen ini.
5. Tambahkan entri di route `/design-system` agar bisa direview.
6. Jalankan `bun run check` + `bun run build`.

### Menambah varian

- Varian baru hanya jika menyelesaikan masalah UX yang berulang di ≥ 2 halaman.
- Dokumentasikan kapan dipakai dan kapan tidak.
- Jangan menambah varian hanya untuk mengejar satu desain halaman.

### Mengubah token

- Ubah `src/app.css` (light + dark).
- Perbarui tabel di `DESIGN.md` dan bagian 2 dokumen ini bila nilai/kontras
  berubah.
- Cek seluruh pemakaian token (`grep`/search) sebelum mengganti nama.

### Menghapus/deprekasi

- Tandai di `DESIGN.md` + dokumen ini.
- Migrasikan semua pemakaian; jangan meninggalkan alias tanpa catatan.

---

## 15. Catatan implementasi saat ini (utang yang perlu diselaraskan)

Bagian ini bukan aturan baru, melainkan gap yang ditemukan saat menyusun
dokumen. Perbaiki saat menyentuh file terkait.

| File | Gap | Aturan terkait |
|---|---|---|
| `src/lib/components/ui/chat-input.svelte` | `Shift+Enter` mengirim (terbalik dari konvensi); placeholder/`aria-label` hardcoded Inggris; tombol mentah, bukan `Button` | §5.7, §9 |
| `src/lib/components/ui/chat-bubble.svelte` | Legacy: `rounded-2xl`, `shadow-sm`, border manual; tidak memakai primitif `Bubble` | §5.7 |
| `src/lib/components/ui/email-item.svelte` | `text-yellow-400`/`fill-yellow-400` (bukan token); avatar `bg-primary` + inisial; `role="button"` pada div berisi tombol; `bg-muted/30` untuk unread, status baca tanpa teks; `aria-label` bintang hardcoded Inggris | §2.5, §2.6, §5.4, §8, §9 |
| `src/lib/components/ui/time-picker.svelte` | Label/“Jam”/“Menit”/`aria-label` hardcoded Indonesia, bukan 4 locale | §9 |
| `src/lib/components/ui/spinner.svelte` | Default `aria-label="Loading"` (Inggris); beri label locale di pemakaian | §8.3, §9 |
| `src/routes/home`, `report`, `spv` | Beberapa chart belum punya ringkasan tekstual (`sr-only`) untuk pembaca layar | §5.4, §6.8 |

Perbaikan gap di atas **tidak** boleh mengubah struktur halaman; cukup
menyelaraskan komponen ke aturan.
