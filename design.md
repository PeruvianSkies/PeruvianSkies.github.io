# Design.md — Arah Visual Terinspirasi mutheeew.tech

## ⚠️ STATUS: ada perubahan yang BELUM DIVERIFIKASI (per akhir sesi ini)

Sesi kerja ini di-compact oleh user tepat setelah edit terakhir ke
[Hero.astro](src/components/Hero.astro) — **user belum konfirmasi hasilnya**, jadi kalau lanjut
sesi baru, cek dulu ke user apa fix terakhir ini udah sesuai atau perlu diiterasi lagi.

**Yang lagi dikerjain:** foto Hero (half-body, background transparan — lihat section di bawah)
diminta user biar "nempel sampai ke bawah layar" (flush ke bottom viewport, kayak referensi).
Iterasi yang udah dicoba:
1. `justify-center` → `justify-end` di container Hero + foto pakai `self-end` + `max-h-[92vh]` —
   user bilang **masih kurang kebawah** (masih ada gap), pakai screenshot ber-lingkaran nunjuk
   area kosong di kiri-bawah + garis potong foto yang masih keliatan.
2. **Diganti total ke `position: absolute`** (bukan lagi flex/grid alignment): foto sekarang
   `lg:absolute lg:inset-y-0 lg:right-6` dengan `items-end` di dalam flex wrapper-nya, dipatok
   langsung ke batas bawah container `<div class="relative min-h-[calc(100svh-4rem)] ... lg:pb-0">`
   (bottom padding di-nol-in khusus di breakpoint `lg` biar gak ada jarak). Alasan pindah ke
   absolute: sebelumnya foto ikut tinggi grid row yang ditentukan kolom teks di sebelahnya (kalau
   summary teks pendek, row jadi pendek, foto ketarik naik) — absolute positioning independen dari
   itu, jadi dijamin nempel ke bawah container apapun panjang teksnya.
   - Sempat ada bug residual: 1 tag `</div>` nyasar dari edit sebelumnya (struktur grid lama)
     bikin HTML gak valid — udah dibersihin di edit yang sama.
   - **User diminta jalanin `npm run dev` sendiri dari terminalnya** (bukan saya) buat cek hasil
     akhirnya — belum ada laporan balik sukses/gagal pas chat ini di-compact.

**Kalau lanjut sesi baru dan user bilang masih belum pas**: kemungkinan penyebab yang belum dicek:
- Apakah `lg:` breakpoint (min-width 1024px sesuai Tailwind default) beneran aktif di layar user
  (mereka pakai browser window besar tapi perlu dipastikan viewport width-nya emang ≥1024px).
- Apakah ada padding/margin lain di parent (`<section id="about">` sendiri, atau `<main>`/`body`)
  yang belum ke-notice ikut ngasih jarak di bawah.
- Coba screenshot ulang & ukur persis berapa px gap-nya buat isolasi masalah, jangan tebak lagi.

## Follow-up: rescan + 2 fix tambahan

Setelah rombak total selesai, di-scan ulang referensi (scroll penuh dari atas ke bawah) buat cari
detail yang belum ke-tangkep. Dua yang diminta user buat diterapin langsung, sudah dicek mekanisme
teknisnya di DOM/CSS referensi (bukan cuma tebakan visual):

1. **Hero "kaya halaman terpisah"** — dicek: referensi **gak pakai CSS scroll-snap** (semua
   `scroll-snap-type: none`). Efeknya murni karena section Hero mereka tingginya ~1 viewport
   (972px vs viewport 900px), jadi baris statistik baru kelihatan setelah scroll. Diterapkan:
   konten utama Hero ([Hero.astro](src/components/Hero.astro)) dibungkus
   `min-h-[calc(100svh-4rem)]` + `flex flex-col justify-center`, statistik jadi baru muncul
   setelah scroll ~1 layar, gak numpuk di layar pertama lagi.
2. **Hover animasi icon skill** — dicek classnya di DOM referensi:
   `transition-all duration-300 hover:scale-110` (CSS murni, bukan JS/Framer Motion meski mereka
   pakai Framer Motion buat animasi lain). Diterapkan sama persis di
   [Skills.astro](src/components/Skills.astro): `transition-transform duration-300
   hover:scale-110` di tiap item grid skill. (Catatan verifikasi: Tailwind v4 pakai CSS property
   `scale` standalone, bukan `transform` — kalau ngecek manual pakai devtools/script, cek
   `getComputedStyle(el).scale`, bukan `.transform`.)

Ditemukan juga 2 hal lain yang **sengaja belum diterapin** (dikonfirmasi ke user dulu):
- Grid background pattern di referensi nyambung di seluruh halaman, bukan cuma Hero — diputuskan
  gak ditiru karena section kita udah cukup ramai (watermark + dot warna + icon).
- Label kecil "TIMELINE" di atas heading "Career Path" — belum diterapin, masih opsional.
- Badge tech-stack kecil per project card — butuh field data baru + icon baru, scope lebih besar.

## Follow-up: lebar kontainer + foto setengah badan

User ngerasa kontainer halaman "mepet ke tengah" dibanding referensi yang mentok kiri-kanan di
layar lebar. Root cause: `max-w-7xl` (1280px) jadi kelihatan sempit banget di monitor besar
(1920px+), nyisain ratusan px kosong tiap sisi. Semua container section (Header, Hero, Experience,
Skills, Projects, SectionDivider) dilebarin ke `max-w-[100rem]` (1600px) — diverifikasi di 1920px,
1280px, dan mobile, gak ada yang pecah.

Foto Hero juga diganti — sebelumnya crop kotak headshot ketat (kepala+bahu doang, hasil crop
sebelumnya), sekarang di-crop ulang dari source asli
(`~/Downloads/ChatGPT Image Aug 28, 2026, 11_21_40 PM.png`, masih tersimpan) jadi **setengah badan**
(kepala sampai pinggang, tangan kelihatan) — lebih dekat ke komposisi foto referensi. Bingkai/ring
dihapus, ukuran dibesarin.

**Update lagi**: user nunjuk fade `mask-image` doang gak cukup — background asli foto (studio,
tanaman) masih kelihatan di sisi-sisi & atas, gak transparan kayak referensi yang beneran gak ada
background sama sekali. Solusinya pakai background removal beneran, bukan cuma fade satu sisi:
1. Install `rembg` (Python, model `bria-rmbg-2.0` ~1GB, jalan lokal — bukan API pihak ketiga,
   foto gak dikirim kemana-mana) di scratchpad.
2. Jalanin ke source foto asli → hasil PNG transparan bersih (subjek terisolasi penuh).
3. Crop ulang ke komposisi setengah badan yang sama, simpan sebagai
   `src/assets/images/author/avatar.png` (**PNG, bukan JPEG** — JPEG gak bisa transparan).
   `avatar.jpg` lama dihapus, referensi filename di [author/en.yaml](src/content/author/en.yaml)
   & [author/id.yaml](src/content/author/id.yaml) diupdate ke `avatar.png`.
4. [Hero.astro](src/components/Hero.astro): `mask-image` gradient dibuang (gak perlu lagi, udah
   transparan asli), `object-cover` → `object-contain` (jangan sampai motong subjek).

Diverifikasi di light, dark, dan mobile — foto sekarang beneran blend total ke background gradient,
gak ada kotak/tepi keliatan sama sekali di mode manapun.


## Referensi

[mutheeew.tech](https://www.mutheeew.tech/) — portofolio frontend developer. Sudah direview
lengkap (desktop + mobile + hover + keyboard focus, pakai skill `ui-ux-pro-max`) sebelum dokumen
ini ditulis. Ringkasan temuan ada di bawah, biar keputusan "elemen apa yang ditiru" didasarkan ke
fakta, bukan cuma kesan visual sekilas.

### Yang bagus dari referensi
- **Tipografi display besar & berani** — nama "I'M MUTE" + role dalam huruf besar tebal, jadi focal
  point Hero.
- **Watermark teks raksasa transparan** di belakang tiap section ("FRONTEND DEV", "SKILL",
  "JOURNEY") — elemen dekoratif yang bikin tiap section punya identitas visual sendiri sambil tetap
  konsisten satu sama lain.
- **Baris statistik** (2+ Years, 10+ Projects, 9/5 Support, 96% Satisfaction) di awal Hero — bangun
  kredibilitas cepat sebelum orang scroll.
- **Responsive yang niat**: project cards di desktop pakai layout "scattered/overlap", tapi di
  mobile otomatis ganti total ke list satu kolom bersih — bukan cuma reflow grid biasa.
- **Timeline "Journey"** (Universitas → Bootcamp → Kerja): garis horizontal, titik berwarna beda
  per tahap, card di bawahnya. Jelas & enak diikuti.

### Yang bermasalah (diverifikasi langsung, bukan tebakan)
1. **Teks project card ketutupan permanen kalau gak di-hover.** Card-card di desktop saling
   overlap; defaultnya banyak paragraf ke-cover card di depannya (misal deskripsi
   "Service Hub Integration Web" cuma nyisa satu-dua kata per baris). Hover memang bikin card naik
   ke depan, tapi:
2. **Nol dukungan keyboard.** Dicek langsung ke DOM: card yang gak punya tombol "Live Site" itu
   **tidak punya elemen focusable sama sekali**. Pengguna keyboard-only gak akan pernah bisa baca
   card yang ketutupan — gak ada cara trigger reveal-nya tanpa mouse.
3. **Semua thumbnail project kosong** — placeholder lingkaran abu-abu, bukan screenshot produk
   asli. Mengurangi bukti visual kerjaan padahal itu seharusnya jadi highlight utama portofolio
   frontend dev.

## Update: rombak total (bukan cuma adaptasi)

Rencana awal di bawah ini ("adaptasi ke tema terminal") sempat diimplementasikan (baris statistik +
watermark dipasang di versi terminal), tapi user lalu mengklarifikasi: maunya bukan "ambil
beberapa elemen ke tema terminal", melainkan **ganti total identitas visual** situs ke gaya
mutheeew.tech (bold sans besar, light/dark modern, bukan terminal/CLI sama sekali). Rombakan ini
sudah dieksekusi — lihat "Hasil akhir" di bawah. Bagian "Arah adaptasi ke tema terminal" & tabelnya
di bawah ini dibiarkan sebagai arsip histori keputusan, bukan state saat ini.

## Hasil akhir (diterapkan)

- **Font**: JetBrains Mono → **Inter** (satu keluarga, weight 400–900), token
  `--font-mono` di-rename `--font-sans`. Heading pakai weight 900 + `italic`.
- **Palet**: token warna dipertahankan namanya (`--color-bg`, `--color-panel`,
  `--color-panel-border`, `--color-term-text`, `--color-term-dim`, `--color-prompt`,
  `--color-warn`) tapi nilainya ganti total ke light putih/biru + dark navy/biru — kontras WCAG
  divalidasi ulang (semua ≥4.5:1). [global.css](src/styles/global.css).
- **`TerminalWindow.astro` dihapus** — gak dipakai lagi.
- **Header**: logo prompt-style → wordmark biasa (sebagian huruf warna aksen), nav path-style →
  kata polos (`nav.*` di [ui.ts](src/i18n/ui.ts) balik ke "About"/"Skills"/dst).
- **Hero**: full rombak — nama besar bold-italic, foto bulat besar, tagline besar, CTA pill
  (resume + kontak), "Follow Me" row, background gradient biru + pola grid CSS
  (`.bg-grid` di global.css), watermark pakai kata pertama designation (mis. "DEVOPS").
- **Baris statistik**: tetap dipertahankan dari task sebelumnya (pipeline datanya sudah ada),
  direstyle jadi angka besar polos + label, ditaruh di bawah Hero.
- **Skills**: pill+accordion → grid icon+label polos (flat, gak ada heading kategori, sama kayak
  keputusan sebelumnya). **Soft skills dipindah ke sini** (sebelumnya di Hero) sebagai sub-section
  progress bar — tetap dipertahankan kontennya, cuma pindah rumah biar Hero gak terlalu penuh.
- **Experience → "Journey"**: dari `git log --graph` (dash bullet, monospace) → timeline vertikal
  dot berwarna bergilir (biru/oranye/hijau/pink/sky/violet, siklus ulang) + card putih per posisi.
  Tetap vertikal (bukan horizontal kayak referensi) karena data kita 8 perusahaan vs referensi
  cuma 3 — horizontal gak scalable.
- **Projects**: heading besar + filter pill biru. Kartu project pakai **CSS `columns` (masonry)**
  + rotasi kecil bergantian (`rotate-1`/`-rotate-1`, `rotate-0` on hover) buat kesan "scattered" —
  **tanpa** overlap absolute-position sungguhan. Diverifikasi langsung: 10/10 kartu tetap elemen
  `<a>` asli (full keyboard-focusable), beda dari referensi yang sebagian kartunya nol elemen
  focusable.
- **Footer**: dari baris komentar monospace → panel CTA besar ("Contact Me" + tombol email pill).
- **SectionDivider**: buang prefix `$`/`./`, tinggal label kata polos.

Tidak berubah: `content.config.ts`, semua YAML content, `images.ts`, `SocialIcon.astro`,
`CategoryIcon.astro`, pipeline deploy — murni presentasi.

## Arah adaptasi ke tema terminal (arsip — sudah tidak berlaku)

Situs ini sudah punya identitas sendiri (monospace penuh, palet terminal, command-style header
`$ cat skills.yaml`, dll) — tujuannya bukan copy tampilan mutheeew.tech mentah-mentah, tapi
nerjemahin elemen yang efektif ke bahasa visual yang sudah ada.

| Elemen referensi | Adaptasi versi terminal | File yang kena |
|---|---|---|
| Baris statistik | Baris output ala `$ neofetch --stats` di bawah blok `$ neofetch` yang sudah ada di Hero (mis. `years_experience: 5+`, `projects_shipped: 10+`) | [Hero.astro](src/components/Hero.astro) |
| Watermark teks raksasa | Kata command/section raksasa transparan di belakang tiap section (mis. `SKILLS`, `EXPERIENCE`) pakai `font-mono`, warna sangat pudar — motif yang sama, font beda | Semua section component + [global.css](src/styles/global.css) |
| Project card scattered | **Didesain ulang biar aksesibel**, bukan ditiru plek: reveal (hover ATAU fokus keyboard) gak pernah menyembunyikan teks permanen — bisa pola serupa accordion Skills yang sudah ada (klik/fokus = expand, bukan overlap yang nutupin tetangganya) | [Projects.astro](src/components/Projects.astro) |
| Timeline Journey berwarna | Opsional/didiskusikan — timeline vertikal gaya `git log --graph` yang sekarang sudah kuat secara identitas (cocok banget buat DevOps); ganti ke horizontal berwarna generik berisiko malah ngurangin ciri khas | [Experience.astro](src/components/Experience.astro) |

## Yang TIDAK ditiru dari referensi (tetap berlaku)
- Overlap card tanpa fallback keyboard (masalah #1 & #2 di atas) — sudah difix dengan pendekatan
  masonry+rotasi, bukan overlap sungguhan.
- Placeholder gambar kosong — project di situs ini tetap pakai logo asli per project.
