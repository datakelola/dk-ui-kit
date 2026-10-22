# UI-RULES.md — Aturan pakai komponen, warna, dan layout

Dokumen ini **mengikat** untuk setiap perubahan UI di `dk-ui-kit`. Tujuannya
bukan mendeskripsikan token (itu tugas `DESIGN.md`), tetapi memutuskan **kapan
sebuah komponen/token/layout dipakai** agar hasilnya konsisten dan berorientasi
UX.

Urutan prioritas saat ada konflik:

1. `UI-RULES.md` (perilaku, aksesibilitas, pemilihan komponen)
2. `DESIGN.md` + `src/app.css` (nilai token, ukuran, radius, tipografi)
3. `design-systems/*.png` (referensi visual Figma)
4. Selera/preferensi halaman individual

Kalau implementasi dan screenshot berbeda, **jangan** menyalin screenshot secara
buta. Catat divergensinya di `DESIGN.md` lebih dulu, baru ubah komponen bersama.

---

## 0. Prinsip UX yang tidak boleh dilanggar

1. **Satu tujuan utama per layar.** Satu aksi `default` (primary) per area.
   Aksi sekunder memakai `outline`/`secondary`/`ghost`, bukan primary kedua.
2. **Feedback selalu ada.** Setiap aksi yang butuh waktu > 300 ms wajib punya
   indikator loading; setiap aksi selesai wajib memberi konfirmasi (toast,
   alert, atau perubahan state yang terlihat).
3. **Jangan membuat pengguna menebak.** Label eksplisit, ikon tanpa label wajib
   punya `aria-label` + tooltip, dan status tidak boleh dibedakan hanya lewat
   warna.
4. **Cegah error sebelum terjadi.** Disable aksi yang belum valid, tampilkan
   format yang diharapkan, konfirmasi aksi destruktif, dan jangan reset input
   saat terjadi error.
5. **Recognition over recall.** Filter/pilihan aktif harus terlihat sebagai
   chip/badge, bukan tersembunyi di dropdown.
6. **Progressive disclosure.** Detail sekunder masuk ke dialog/sheet/popover,
   bukan memenuhi halaman utama.
7. **Mobile-first, bukan desktop-diperkecil.** Tidak ada fungsi yang hanya bisa
   diakses lewat hover. Target sentuh minimal 36×36 px (ideal 40–44 px).
8. **Konsisten.** Komponen yang sama untuk masalah yang sama. Jangan membuat
   varian lokal hanya karena satu halaman ingin terlihat berbeda.
9. **Hemat perhatian.** Warna status hanya untuk status. Jangan memakai merah,
   kuning, atau hijau sebagai dekorasi.
10. **Bisa dipakai tanpa mouse.** Semua alur utama selesai dengan keyboard dan
    fokus terlihat jelas.

---

## 1. Warna

### 1.1 Sumber warna

- **WAJIB** memakai token: `bg-primary`, `text-muted-foreground`,
  `bg-primary-muted`, `border-primary-border`, `text-danger-700`, dst.
- **DILARANG** menulis hex/rgb/hsl langsung di halaman atau komponen
  (`bg-[#60a5f9]`, `style="color:#..."`). Satu-satunya tempat nilai warna adalah
  `src/app.css`.
- **DILARANG** memakai `text-primary`/`border-primary` untuk teks atau ikon.
  `--primary` adalah warna **fill** (kontras rendah terhadap putih). Untuk teks,
  ikon, link, dan border terpilih gunakan `--primary-text`.
- Ramp Figma (`brand-*`, `azure-*`, `success-*`, `danger-*`, `warning-*`,
  `neutral-*`) hanya untuk chart, ilustrasi, dan pasangan status yang memang
  butuh step di luar semantic. Bukan untuk kebutuhan halaman sehari-hari.
- Setiap warna wajib benar di light **dan** dark. Kalau butuh pengecualian dark,
  tulis varian `dark:` dengan token, bukan hex.

### 1.2 Pemilihan token

| Kebutuhan | Token | Jangan pakai |
|---|---|---|
| Latar halaman | `bg-background` | `bg-white` / `bg-neutral-50` |
| Permukaan kartu/panel | `bg-card` | `bg-background` di dalam card |
| Dropdown/popover/dialog | `bg-popover` | `bg-card` untuk overlay |
| Teks utama | `text-foreground` | `text-black` |
| Teks sekunder/metadata | `text-muted-foreground` | `text-neutral-500` |
| Aksi utama (fill) | `bg-primary text-primary-foreground` | `bg-brand-500` |
| Hover/press aksi utama | `bg-primary-hover` / `bg-primary-active` | opacity hijau/merah |
| Aksen teks/ikon/link | `text-primary-text` | `text-primary` |
| Latar item aktif | `bg-primary-muted text-primary-muted-foreground` | `bg-primary/10` |
| Border item aktif | `border-primary-border` | `border-primary` |
| Permukaan hover netral | `bg-accent` / `bg-muted` | `bg-gray-100` |
| Aksi merusak | `bg-destructive text-destructive-foreground` | `bg-danger-600` + teks putih |
| Sukses / warning / info | `success` / `warning` / `info` + `*-foreground` | hijau/kuning acak |
| Garis | `border-border` | `border-neutral-200` |
| Outline kontrol | `border-input` | `border-border` untuk field |
| Focus ring | `ring-ring` | ring biru muda `primary/30` |
| Chart | `--chart-1..5` | ramp acak per halaman |
| Bubble chat | `bg-bubble-sent` / `bg-bubble-received` / `bg-bubble-system` | `bg-primary` |

### 1.3 Aturan kontras

- Teks normal minimal **4.5:1**; teks besar (≥ 18.66 px bold / 24 px) minimal
  **3:1**; komponen non-teks minimal **3:1**.
- `--primary` light (#60a5f9) hanya boleh membawa label pendek (tombol/badge).
  **Jangan** memakai `bg-primary` untuk paragraf, pesan panjang, atau area baca.
  Untuk bacaan panjang gunakan `bg-primary-muted` atau `bg-bubble-sent` yang
  foreground-nya sudah gelap.
- Foreground status (`success`, `warning`, `info`) adalah gelap `#131927`.
  **Jangan** menggantinya menjadi putih.
- Hover/press harus **menaikkan** kontras, bukan menurunkannya. Light menggelap
  (`primary` → `primary-hover` → `primary-active`), dark mencerahkan.
- Focus ring wajib terlihat di atas border. Jangan menurunkan `--ring` menjadi
  warna fill.

### 1.4 Warna status

- Merah = destruktif/error/berhenti. Bukan untuk “penting”.
- Kuning = butuh perhatian/tenggat, bukan error.
- Hijau = selesai/sukses/aktif, bukan tombol utama.
- Biru = aksi/informasi/netral terpilih.
- Status **wajib** disertai teks atau ikon. Contoh: `<Badge variant="success">
  <Check /> Selesai</Badge>`, bukan titik hijau tanpa label.
- Satu baris/daftar maksimal memakai **satu** warna status yang dominan.

---

## 2. Tipografi dan copy

- Font hanya `--font-sans` (Inter + Noto Sans Thai). Jangan menambah font baru
  atau menghapus fallback Thai.
- Ukuran minimum 12 px (`text-xs`). Teks utama `text-sm`; metadata `text-xs`
  atau `text-meta`; judul halaman ditangani topbar, bukan `<h1>` di body.
- Maksimal 2 bobot per layar (`font-medium`, `font-semibold`). Hindari
  `font-bold` untuk teks panjang.
- Panjang baris baca 45–75 karakter. Paragraf lebar diberi `max-w-prose` atau
  `max-w-2xl`.
- Copy wajib:
  - Label aksi = kata kerja + objek (“Simpan perubahan”, bukan “OK”).
  - Error = apa yang salah + cara memperbaiki.
  - Empty state = kondisi + aksi berikutnya.
  - Konfirmasi destruktif = akibat + nama objek.
- Jangan memakai huruf kapital semua untuk kalimat (`uppercase` hanya untuk
  label kecil/meta, bukan isi pesan).
- Semua copy lewat `STR` 4 locale (id/en/th/tl). Tidak ada string hardcoded.

---

## 3. Layout

### 3.1 Shell

- Shell (`src/routes/+layout.svelte`) adalah satu-satunya pemilik sidebar,
  topbar, dan padding halaman. Halaman **tidak** membuat sidebar/topbar sendiri.
- `<main>` reguler memakai `p-5 md:p-6`; halaman full-bleed (chat v4) memakai
  `p-0 overflow-hidden`. Jangan menambah wrapper padding kedua.
- Topbar `h-16`. Konten halaman mulai dengan jarak `gap-4`/`gap-6`, bukan
  `mt-*` acak.
- Sidebar:
  - Desktop: lebar `16rem`, collapse ke `3rem` (ikon).
  - Mobile: drawer `18rem`; jangan memaksa sidebar terbuka.
  - Item aktif memakai `bg-sidebar-active text-sidebar-active-text`; hover
    memakai `bg-sidebar-bg-hover`.
  - Jangan menaruh aksi destruktif di sidebar kecuali logout (dan wajib
    konfirmasi).
- Topbar:
  - Kiri: konteks (judul halaman/breadcrumb). Kanan: pencarian, notifikasi,
    profil.
  - Satu search global saja. Search lokal milik tabel, bukan topbar.

### 3.2 Anatomi halaman

Urutan baku:

1. Page header: judul (dari topbar) + deskripsi singkat + aksi utama di kanan.
2. Ringkasan (opsional): 2–4 `Card` dengan ukuran identik.
3. Toolbar: search/filter/aksi massal, menempel pada tabel.
4. Konten utama (tabel/list/kartu).
5. Pagination/footer.
6. State: loading, empty, error, success.

- Aksi utama halaman berada di kanan atas area konten, sejajar judul.
- Filter selalu di atas data yang difilter. Jangan menaruh filter di sidebar.
- Jangan mencampur dua pola navigasi dalam satu halaman (tabs + sidebar +
  breadcrumb sekaligus). Pilih satu: sidebar untuk rute, tabs untuk view,
  breadcrumb untuk hierarki.

### 3.3 Grid dan lebar

- Kontainer konten maksimal `max-w-7xl`; form panjang maksimal `max-w-2xl`.
- Grid ringkasan: 1 kolom mobile, 2 kolom `sm`, 3–4 kolom `lg`. Hindari 4+
  kolom di bawah `lg`.
- Form: 1 kolom di mobile, 2 kolom di `md` ke atas; field panjang (`textarea`,
  alamat) selalu full-width.
- Panel 3 kolom (omnichannel) hanya untuk `xl`; di bawahnya panel info menjadi
  sheet/drawer, bukan kolom sempit.

### 3.4 Spacing

- Skala Tailwind saja: `gap-1/2` (metadata), `gap-2/3` (dalam komponen),
  `gap-4/6` (antar-section), `p-4/5/6` (permukaan).
- **DILARANG** nilai arbitrary baru (`p-[13px]`, `gap-[7px]`, `text-[11px]`).
  Pengecualian yang sudah ada di `DESIGN.md` (mis. `rounded-[4px]` untuk kontrol
  ≤ 32 px) tetap boleh.
- Card memakai spacing internal `--card-spacing`; jangan menimpa padding card
  per halaman kecuali butuh full-bleed media.

### 3.5 Tabel dan scroll

- Tabel hanya untuk data terstruktur yang butuh perbandingan kolom. Di bawah
  `md`, ubah menjadi daftar kartu (`Card`/`Item`), bukan tabel yang di-scroll
  horizontal tanpa petunjuk.
- `Table.Root` sudah membungkus `overflow-x-auto`. Jangan menambah wrapper
  overflow kedua.
- Tetapkan lebar minimum hanya bila kolom memang tetap (`min-w-[640px]` dan
  sejenisnya), dan beri isyarat visual bahwa tabel bisa di-scroll.
- Kolom aksi selalu di kanan, memakai `DropdownMenu` dengan `aria-label`.
- Header tabel `h-11`, sel `px-3.5 py-3`. Jangan memadatkan baris di bawah
  `py-2` untuk data yang bisa diklik.

### 3.6 Breakpoint

| Rentang | Perilaku wajib |
|---|---|
| `< 640` (mobile) | 1 kolom, sidebar drawer, aksi utama full-width atau icon, tabel → kartu |
| `640–767` | 2 kolom ringkasan, toolbar boleh wrap |
| `768–1023` | sidebar icon/drawer, grid 2–3 kolom, tabel boleh scroll |
| `1024–1279` | sidebar penuh, grid 3–4 kolom, toolbar satu baris |
| `≥ 1280` | layout 3 panel omnichannel boleh aktif |

### 3.7 Lapisan dan overlay

- Urutan z-index: konten < sticky header < dropdown/popover < sheet/drawer <
  dialog < toast. Jangan membuat `z-[9999]`.
- Overlay wajib bisa ditutup dengan `Esc` dan klik di luar (kecuali proses
  destruktif yang sedang berjalan).
- Saat overlay terbuka, fokus terperangkap di dalamnya dan kembali ke pemicu
  saat ditutup.

---

## 4. Aturan per komponen

### 4.1 Aksi

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Button` `default` | Aksi utama form/halaman | Navigasi biasa, aksi kedua | Maksimal satu per area; label kata kerja; `h-10` default |
| `Button` `secondary`/`outline` | Aksi pendamping, batal | Aksi destruktif | Urutan: primary di kanan, sekunder di kiri (desktop) |
| `Button` `ghost` | Aksi dalam toolbar/baris | Aksi utama yang butuh penekanan | Wajib punya hover state; icon-only wajib `aria-label` |
| `Button` `destructive` | Hapus/berhenti permanen | Peringatan biasa | Wajib lewat `AlertDialog`; jangan pakai untuk “Batal” |
| `Button` `link` | Navigasi teks dalam paragraf | Aksi yang mengubah data | Wajib jelas seperti link (underlined saat hover) |
| `Button` size `xs`/`sm`/`icon-xs`/`icon-sm` | Tabel padat, toolbar | Area sentuh utama mobile | Jangan jadikan satu-satunya cara menyelesaikan alur di mobile |
| `ButtonGroup` | Pilihan yang saling terkait | Aksi yang tidak berhubungan | Maksimal 3–4 item; beri separator; jangan campur variant |
| `Toggle` | On/off state yang langsung terlihat | Pilihan eksklusif (pakai radio) | Sertakan label; jangan pakai ikon saja tanpa tooltip |
| `ToggleGroup` | Pilihan format/view (grid/list) | Navigasi halaman | Pilihan aktif harus terlihat, bukan hanya hover |

Aturan tambahan:

- Loading pada tombol: ganti label dengan `Spinner` + teks tetap, dan
  `disabled` tombol. Jangan biarkan tombol bisa diklik dua kali.
- Ikon dalam tombol memakai `data-icon="inline-start|inline-end"` agar spacing
  otomatis; jangan menambahkan margin manual.
- Tombol disabled harus punya alasan yang bisa diketahui (tooltip/teks bantuan).

### 4.2 Form

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Field` + `Field.Label` | Setiap kontrol form | Kontrol tanpa label | Label selalu terlihat; placeholder bukan label |
| `Input` | Satu baris teks/angka | Teks panjang | `h-10`, `text-base` di mobile (anti zoom iOS) |
| `Textarea` | Pesan/catatan multi-baris | Data satu baris | Beri `rows` awal 3–5; tampilkan hitungan karakter bila ada batas |
| `InputGroup` | Input + prefix/suffix/ikon/tombol | Form field biasa | Addon tidak boleh menutupi teks; tetap punya label |
| `InputOTP` | Verifikasi OTP | PIN/password umum | Selalu tampilkan jumlah digit dan status error per grup |
| `Select` | ≥ 5 pilihan tunggal | 2–4 pilihan (pakai radio/segmented) | Placeholder = instruksi; value terpilih harus terbaca |
| `Checkbox` | Pilihan banyak / persetujuan | Aksi instan (pakai switch) | Label bisa diklik; state indeterminate didukung bila perlu |
| `RadioGroup` | Pilihan tunggal 2–4 opsi | Daftar panjang | Semua opsi terlihat sekaligus; jangan default tanpa alasan |
| `Switch` | Pengaturan on/off langsung | Persetujuan legal | Perubahan langsung tersimpan; beri feedback |
| `Slider` | Nilai kontinu dalam rentang | Input angka presisi | Tampilkan nilai saat ini; sediakan input alternatif |
| `Calendar` | Pilih tanggal tunggal | Rentang (pakai range) | Tandai hari ini dan tanggal terpilih; navigasi keyboard |
| `RangeCalendar` | Rentang tanggal | Satu tanggal | Tampilkan awal–akhir secara eksplisit |
| `DatePicker` / `DateRangePicker` / `TimePicker` | Form dengan tanggal/waktu | Filter cepat di toolbar | Gunakan popover, bukan halaman baru |
| `Label` | Teks label field | Judul section | Hubungkan `for`/`id`; jangan pakai label sebagai placeholder |

Aturan tambahan:

- Error tampil di bawah field (`Field.Error`), bukan toast. Fokus otomatis ke
  field pertama yang error setelah submit.
- Jangan memvalidasi sambil mengetik untuk aturan yang belum selesai (mis.
  “email tidak valid” saat baru 3 karakter). Validasi saat blur/submit.
- Required ditandai eksplisit; jangan hanya mengandalkan warna.
- Nilai yang tidak bisa diedit ditampilkan sebagai teks/`disabled` dengan alasan,
  bukan input yang seolah bisa diisi.
- Jangan memakai `placeholder` sebagai satu-satunya contoh format; sertakan
  `Field.Description`.

### 4.3 Navigasi

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Sidebar` | Navigasi rute utama | Navigasi dalam satu halaman | Item aktif jelas; grup maksimal 7 item; collapse menyimpan state |
| `Breadcrumb` | Hierarki > 2 level | Navigasi utama | Item terakhir tidak berupa link; jangan dipakai di mobile sempit |
| `Tabs` | Mengganti view dalam konteks yang sama | Navigasi antar rute | Maksimal 5–7 tab; label singkat; state aktif persisten |
| `Tabs` `pill`/`line` | Filter/view ringan | Konten yang butuh perbandingan | Jangan mencampur varian tab dalam satu halaman |
| `Pagination` | Data > 1 halaman | Daftar < 10 item | Tampilkan rentang (“1–10 dari 120”); pertahankan filter saat pindah |
| `NavbarBottom` | Navigasi mobile 3–5 tujuan | Desktop | Hanya untuk tujuan utama; item aktif jelas; aman dari safe-area |
| `Command` | Pencarian/aksi cepat (Cmd+K) | Navigasi utama | Sediakan shortcut, kategori, dan empty result |
| `Collapsible` | Detail sekunder yang bisa dibuka | Konten yang selalu penting | Jangan menyembunyikan aksi utama di dalamnya |
| `ScrollArea` | Area scroll dengan styling | Seluruh halaman | Jangan menggunakannya untuk menggantikan scroll natural body |

Aturan tambahan:

- Navigasi tidak boleh bergantung pada ikon saja di mobile tanpa label.
- Jangan mengubah urutan menu sidebar per halaman; urutan global ada di
  `+layout.svelte`.
- Semua item navigasi wajib ada di 4 locale.

### 4.4 Data display

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Card` | Mengelompokkan konten terkait | Setiap blok kecil (pakai `Item`) | Judul + deskripsi + aksi; jangan sarang card di dalam card |
| `Card` `size="sm"` | Panel samping/dense | Konten utama | Konsisten dalam satu grup |
| `Table` | Perbandingan kolom | Data kartu/feed | Header jelas, angka rata kanan, aksi di kolom kanan |
| `Item` | Baris list dengan media + aksi | Tabel data | Seluruh baris bisa diklik bila aksinya tunggal |
| `Avatar` | Identitas orang/agen | Ikon generik | Selalu punya fallback inisial; `alt`/label untuk gambar |
| `Chart` | Tren/perbandingan | Data presisi tunggal | Pakai `chart-1..5`, legend, label sumbu, dan ringkasan tekstual |
| `Badge` | Status/label non-interaktif | Tombol/filter | Teks singkat; jangan lebih dari 3 badge per baris |
| `Chip` | Tag/filter/pilihan | Status permanen (pakai badge) | `Chip.Dismiss` hanya bila bisa dihapus; sediakan label aksesibel |
| `Marker` | Penanda pada timeline/chart | Status utama | Jangan mengandalkan warna saja |
| `Kbd` | Shortcut keyboard | Teks biasa | Tampilkan hanya shortcut yang benar-benar berfungsi |
| `Separator` | Pemisah visual | Pengganti spacing | Jangan menambah border di elemen yang sudah punya border |
| `Resizable` | Panel yang bisa diatur (desktop) | Mobile | Simpan ukuran panel; sediakan default yang aman |
| `Skeleton` | Placeholder bentuk konten | Loading singkat < 300 ms | Bentuk harus menyerupai konten akhir; jangan animasi berlebihan |

Aturan tambahan:

- Angka besar/ringkasan memakai format locale aktif (`Intl.NumberFormat`), bukan
  hardcode `id-ID`.
- Tabel kosong wajib memakai `Empty`, bukan header tanpa isi.
- Jangan menampilkan lebih dari 5 warna chart dalam satu grafik.

### 4.5 Feedback dan status

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Alert` `variant="default"/"info"` | Informasi kontekstual | Error validasi field | Bisa ditutup bila tidak krusial |
| `Alert` `destructive`/`warning` | Peringatan yang butuh perhatian | Pengganti konfirmasi | Sertakan langkah berikutnya |
| `Alert` `mode="filled"` | Peringatan kritis di area sempit | Konten panjang | Jangan dipakai berulang di satu halaman |
| `Sonner` (toast) | Hasil aksi async (sukses/gagal) | Error validasi form | Maksimal 1 toast per aksi; auto-dismiss 4–6 dtk |
| `Progress` | Proses dengan progres diketahui | Loading halaman | Sertakan label dan nilai persen |
| `Spinner` | Tunggu singkat < 3 dtk | Loading konten besar | Sertakan teks “Memuat…” untuk pembaca layar |
| `Skeleton` | Placeholder konten | Aksi submit | Jangan mencampur spinner dan skeleton di area yang sama |
| `Empty` | Tidak ada data | Error | Selalu beri aksi berikutnya (buat/import/reset filter) |
| `Stepper` | Alur multi-langkah berurutan | Navigasi bebas | Tandai langkah selesai/aktif/berikutnya; bisa kembali ke langkah sebelumnya |
| `Tooltip` | Menjelaskan ikon/istilah | Informasi penting/kritis | Jangan untuk konten interaktif; jangan satu-satunya sumber label |
| `Badge`/`Chip` status | Status ringkas | Menggantikan pesan error | Ikon + teks, bukan warna saja |

Aturan state:

- **Loading:** pertahankan layout (skeleton) agar tidak melompat.
- **Empty:** bedakan “belum ada data” dan “filter tidak menemukan hasil”; yang
  kedua wajib punya tombol reset filter.
- **Error:** tampilkan apa yang gagal, kenapa (bila diketahui), dan tombol coba
  lagi. Jangan menelan error diam-diam.
- **Success:** konfirmasi singkat dan biarkan pengguna lanjut; jangan memblokir
  dengan dialog sukses.
- **Partial/offline:** beri banner persisten, bukan toast yang hilang.

### 4.6 Overlay

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Dialog` | Form/detail yang butuh fokus | Konfirmasi destruktif (pakai `AlertDialog`) | Judul + deskripsi wajib; maksimal 1 dialog bertumpuk |
| `AlertDialog` | Konfirmasi hapus/aksi permanen | Info biasa | Tombol destruktif di kanan; sebut objek yang terpengaruh; default fokus ke “Batal” |
| `Sheet` | Panel samping/detail di desktop | Konten panjang berbentuk halaman | Lebar `sm:max-w-sm`; tutup dengan Esc |
| `Drawer` | Aksi/detail mobile dari bawah | Form panjang | Sediakan handle; jangan menutupi seluruh layar tanpa alasan |
| `Popover` | Konten ringan dekat pemicu | Form panjang | Tutup saat klik luar; jangan sarang popover |
| `DropdownMenu` | Daftar aksi kontekstual | Navigasi utama | Maksimal 7 item; aksi destruktif dipisah dan diberi warna |
| `ContextMenu` | Aksi klik kanan | Aksi utama (harus tetap terlihat) | Selalu sediakan alternatif keyboard/tombol |
| `HoverCard` | Preview singkat | Informasi penting | Jangan untuk mobile; sediakan cara lain membuka detail |
| `Tooltip` | Label ikon | Konten panjang | Muncul setelah delay singkat; hilang saat Esc |

Aturan tambahan:

- Fokus awal di dialog: field pertama untuk form, tombol “Batal” untuk
  konfirmasi destruktif.
- Jangan menutup dialog saat klik luar bila ada perubahan belum disimpan; minta
  konfirmasi.
- `Dialog`/`AlertDialog` wajib punya `Dialog.Title` (bisa `sr-only` bila desain
  tidak menampilkannya).

### 4.7 Messaging / omnichannel

| Komponen | Pakai untuk | Jangan pakai untuk | Aturan UX |
|---|---|---|---|
| `Message` | Satu pesan dengan header/footer/avatar | Notifikasi sistem | Urutan grup pesan harus kronologis |
| `Bubble` `sent`/`received` | Isi pesan chat | Notifikasi sistem | `sent` selalu di kanan, `received` di kiri; jangan memakai `bg-primary` |
| `Bubble` `system` | Perubahan status chat | Pesan pengguna | Teks singkat, tanpa avatar |
| `SystemMessage` | Info sistem di dalam thread | Pesan pelanggan | `shape="pill"` untuk info, `banner` untuk peringatan |
| `Attachment` | Lampiran file/gambar | Aksi toolbar | Tampilkan status upload (`idle/uploading/error/done`) dan aksi hapus |
| `ChatInput`/composer | Menulis pesan | Komentar internal di luar chat | Enter mengirim, Shift+Enter baris baru (kecuali disepakati lain) |
| `TicketBanner` | Konteks tiket aktif | Status umum | Tautkan ke tiket; jangan menutupi composer |
| `EmailItem` | Baris daftar email | Detail email | Status baca jelas; aksi massal di toolbar |
| `EmailCompose` | Menulis email | Chat internal | Validasi penerima sebelum kirim; konfirmasi saat menutup draft |
| `ChannelIcon` | Menandai kanal | Aksi | Sertakan label teks/tooltip |

Aturan tambahan:

- Thread chat wajib auto-scroll hanya bila pengguna sudah berada di bawah.
  Jangan memaksa scroll saat pengguna membaca pesan lama.
- Waktu pesan memakai locale aktif dan format relatif yang konsisten.
- Aksi pada pesan (balas, teruskan, hapus) harus tersedia lewat menu, bukan
  hanya hover.

### 4.8 Komponen komposit aplikasi

| Komponen | Aturan |
|---|---|
| `agent-panel` | Hanya untuk konteks agen; jangan menduplikasi aksi yang sudah ada di thread header |
| `inbox-panel` | Filter dan pencarian di atas list; item aktif memakai surface aktif, bukan border tebal |
| `thread-panel` | Header ringkas (nama, kanal, status), isi scroll, composer sticky di bawah |
| `composer` | Attachment, emoji, dan kirim harus punya label aksesibel; jangan menyembunyikan kirim di menu |
| `chat-list-item` | Bisa diklik seluruh baris; unread indicator + timestamp; jangan lebih dari 2 baris teks |

---

## 5. State wajib per halaman

Setiap halaman data wajib mendefinisikan dan menampilkan:

1. **Loading** — skeleton untuk area konten, spinner untuk aksi.
2. **Empty** — belum ada data + aksi membuat.
3. **No results** — filter tidak cocok + reset filter.
4. **Error** — pesan + coba lagi; jangan fallback diam-diam tanpa indikator.
5. **Success** — toast/alert setelah mutasi.
6. **Disabled** — aksi yang belum valid, dengan alasan.
7. **Read-only** — bila pengguna tidak punya izin, sembunyikan atau disable
   dengan penjelasan, bukan membiarkan aksi gagal.

Halaman tanpa backend boleh memakai data demo inline, tetapi state di atas tetap
harus ada agar integrasi nanti tidak mengubah struktur UI.

---

## 6. Aksesibilitas (gate wajib)

- Semua kontrol interaktif bisa dijangkau `Tab` dan diaktifkan `Enter`/`Space`.
- Fokus terlihat (`focus-visible:ring-3 ring-ring/50`); jangan menghapus outline.
- `Esc` menutup overlay; fokus kembali ke pemicu.
- Ikon-only: `aria-label` deskriptif. Gambar: `alt` yang bermakna atau `alt=""`
  bila dekoratif.
- Form: setiap kontrol punya label; error dihubungkan via `aria-describedby`;
  `aria-invalid` dipasang saat error.
- Tabel: gunakan `Table.Header`/`Table.Head`; jangan membuat header dari `div`.
- Status dinamis diumumkan (`role="status"`/`aria-live="polite"`); error kritis
  `role="alert"`.
- Target sentuh minimal 36 px; jangan mengecilkan pseudo-target checkbox/radio.
- Hormati `prefers-reduced-motion`; animasi hanya transisi singkat (≤ 200 ms).
- Kontras diperiksa di light dan dark, termasuk disabled dan placeholder.
- Jangan menggunakan warna saja untuk menyampaikan status, error, atau pilihan.

---

## 7. i18n dan format

- Setiap halaman/komponen dengan copy baru wajib punya `STR` untuk `id`, `en`,
  `th`, `tl`. `id` default.
- Jangan menyusun kalimat dengan penggabungan string yang mengasumsikan urutan
  kata bahasa Inggris; gunakan placeholder utuh per locale.
- Tanggal, waktu, angka, dan mata uang memakai `Intl` dengan `$locale` aktif.
- Label tombol pendek; hindari terjemahan yang membuat tombol melebar melebihi
  kontainer (uji `th` dan `tl`).
- Jangan memakai teks Inggris hardcoded sebagai “sementara”.

---

## 8. Checklist review UI

Sebelum menganggap pekerjaan selesai:

- [ ] Tidak ada hex/rgb/hsl atau arbitrary value baru.
- [ ] `text-primary`/`border-primary` tidak dipakai untuk teks/ikon.
- [ ] Satu aksi primary per area; aksi destruktif memakai `destructive` +
      konfirmasi.
- [ ] Semua state (loading/empty/no-results/error/success) ada.
- [ ] Mobile: tidak ada tabel melebar tanpa petunjuk, tidak ada aksi khusus
      hover, target sentuh cukup.
- [ ] Keyboard: semua alur selesai tanpa mouse, fokus terlihat, `Esc` bekerja.
- [ ] Light dan dark sama-sama benar; kontras teks ≥ 4.5:1.
- [ ] Copy ada di 4 locale; tanggal/angka memakai locale aktif.
- [ ] `bun run check` tidak menambah error baru dari baseline.
- [ ] `bun run build` berhasil.

---

## 9. Anti-pattern yang langsung ditolak

| Pola | Ganti dengan |
|---|---|
| `bg-[#60a5f9]`, `text-[#131927]` | `bg-primary`, `text-foreground` |
| `text-primary` untuk link/ikon | `text-primary-text` |
| Dua tombol `default` berdampingan | Satu `default` + satu `outline`/`secondary` |
| `Confirm`/`OK` sebagai label aksi | Kata kerja + objek (“Hapus tiket”) |
| Error validasi lewat toast | `Field.Error` inline |
| Hanya warna untuk status | Badge/chip dengan ikon + teks |
| Spinner di tengah halaman untuk semua loading | Skeleton sesuai bentuk konten |
| `overflow-x-auto` ganda pada tabel | Biarkan `Table.Root` menangani scroll |
| `Dialog` untuk konfirmasi hapus | `AlertDialog` |
| `Drawer`/`Sheet` untuk semua overlay desktop | `Dialog` atau `Popover` sesuai bobot konten |
| `uppercase` untuk paragraf | `uppercase` hanya untuk label meta kecil |
| Hardcode `id-ID` | `Intl` + locale aktif |
| `hover:` sebagai satu-satunya akses aksi | Tombol/menu yang selalu terlihat |
| Nilai `z-[9999]` | Skala z-index di bagian 3.7 |
| Padding wrapper tambahan di halaman | Padding dari shell `+layout.svelte` |

---

## 10. Cara memakai dokumen ini

- Sebelum membuat halaman: pilih pola dari bagian 3 dan komponen dari bagian 4.
- Saat menambah komponen baru: tambahkan aturan pakai/jangan pakai ke tabel yang
  sesuai **dan** token ke `DESIGN.md` bila ada token baru.
- Saat review: pakai checklist bagian 8; tolak perubahan yang melanggar bagian
  1.1, 4, atau 9.
- Saat menemukan divergensi desain: perbarui `DESIGN.md` (keputusan + alasan)
  lebih dulu, lalu `UI-RULES.md` bila aturan pakainya berubah.
