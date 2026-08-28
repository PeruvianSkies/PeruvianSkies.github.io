# PRD — Revamp Portofolio Tian Putra

## Latar Belakang

Portofolio sebelumnya adalah situs Hugo statis memakai tema `hugo-toha/toha` (git submodule),
dengan seluruh konten (bio, skills, experience, projects) sebagai YAML data-driven, bilingual
EN/ID, tanpa kustomisasi layout/SCSS sama sekali. Stack-nya sudah tua (Hugo `0.109.0` di-pin dari
2023, action deploy pakai `ubuntu-18.04`), dan user memutuskan revamp total ke stack baru daripada
sekadar refresh konten atau override tema lama.

## Tujuan

- Desain baru yang lebih modern (single-page, dark/light mode, mobile-friendly) tanpa kehilangan
  konten/histori kerja yang sudah ada.
- Arsitektur yang lebih gampang dikustomisasi ke depan — konten tetap terpisah dari tampilan
  (data-driven), tapi pakai tooling yang lebih hidup daripada tema Hugo pihak ketiga.
- Tetap bilingual EN/ID, tetap deploy ke Netlify + GitHub Pages seperti sebelumnya.

## Keputusan Teknis

| Area | Sebelum | Sesudah | Alasan |
|---|---|---|---|
| Framework | Hugo + tema `toha` (submodule) | Astro 7 | Static-first, Content Collections cocok gantiin pola YAML section-based, i18n routing bawaan, gak butuh submodule tema pihak ketiga |
| Styling | CSS bawaan tema toha | Tailwind CSS v4 | Kustomisasi penuh, gak terikat desain tema orang lain |
| Ikon sosial | Font Awesome (dari tema) | SVG inline lokal ([SocialIcon.astro](src/components/SocialIcon.astro)) | Gak nambah dependency CDN eksternal |
| Gambar | PNG mentah dari `static/`/`assets/` | `src/assets/images/` + `<Image />` Astro | Auto-optimasi ke WebP saat build (avatar 91KB → 2KB) |
| Deploy | `hugo --gc --minify` | `npm run build` | Toolchain Node, lihat [CLAUDE.md](CLAUDE.md) bagian Deploy |

Detail arsitektur (struktur content collection, cara nambah skill/project, dsb) ada di
[CLAUDE.md](CLAUDE.md) — dokumen ini fokus ke keputusan & status, bukan panduan teknis harian.

## Ruang Lingkup Revamp (Selesai)

- [x] Migrasi semua konten YAML (author, about, skills, experiences, projects, site) apa adanya
      dari `data/en/` dan `data/id/` ke `src/content/*/{en,id}.yaml`, tervalidasi lewat schema Zod.
- [x] Layout baru: Header (nav + language switch + theme toggle + mobile hamburger), Hero/About,
      Skills grid, Experience timeline, Projects grid dengan filter tag, Footer.
- [x] Dark/light mode (toggle + `prefers-color-scheme`, persist di `localStorage`).
- [x] Google Analytics (`G-R8GV6WLH4M`) tetap jalan, hanya di production build.
- [x] Pipeline deploy Netlify & GitHub Actions diupdate ke Astro/Node.
- [x] Submodule tema `toha` dan seluruh file khusus Hugo (`config.yaml`, `archetypes/`,
      `resources/`, `.gitmodules`) dihapus.
- [x] Diverifikasi jalan: `npm run build` sukses, EN & ID render benar, dark mode, mobile nav,
      filter project, dan link download resume (status 200) — dicek pakai Playwright + screenshot.

Semua pekerjaan di atas ada di branch `astro-revamp`, **belum di-commit/push** — nunggu review
manual dari user sebelum di-merge ke `source`.

### Follow-up: UI/UX audit (ui-ux-pro-max skill)

Review pakai skill `ui-ux-pro-max` + pengecekan kontras WCAG manual, hasilnya 5 temuan yang
sudah diperbaiki:
- Kontras `text-term-dim` di light mode gagal AA (4.43:1) — token digelapin ke `#5b6472` (5.49:1).
- Link company di [Hero.astro](src/components/Hero.astro) masih pakai `text-accent-600` sisa
  sebelum redesign terminal, kontrasnya 3.38:1 (gagal AA) — disamakan ke pola
  `text-term-dim hover:text-prompt` seperti Experience, sekalian token `--color-accent-600`
  dibetulkan ke `#0e7490` buat jaga-jaga kalau dipakai lagi. Ditambahkan juga guard untuk
  `company.url` kosong (belum ada kasusnya sekarang, tapi About kemungkinan akan diupdate ke
  company iForte yang belum ada URL-nya).
- Target klik social icon di [Footer.astro](src/components/Footer.astro) cuma ~16×16px (di bawah
  minimum WCAG 24px), gak konsisten sama Hero yang 36×36px — disamakan ukurannya.
- Filter button di [Projects.astro](src/components/Projects.astro) gak expose state ke assistive
  tech — ditambah `aria-pressed`, di-toggle bareng class di script.
- SVG di [SocialIcon.astro](src/components/SocialIcon.astro) ditambah `aria-hidden="true"` (parent
  link udah punya `aria-label`, jadi icon-nya redundant buat screen reader).

### Follow-up: redesign visual terminal/CLI

Setelah migrasi awal, user merasa tampilannya masih generik (kartu modern ala SaaS, cuma beda
engine dari Hugo). Karena semua komponen sekarang custom code, di-redesign ulang ke identitas
**terminal/CLI** — font monospace penuh (JetBrains Mono), palet warna terminal (dark: near-black +
hijau prompt; light: "terminal paper" cream, bukan putih polos), Hero dibungkus komponen
`TerminalWindow` (title bar 3-dot), section lain diberi header gaya command (`$ cat skills.yaml`,
`$ git log --oneline --graph`, `$ ls -la ./projects/`), nav jadi gaya path (`./about`, `./skills`,
dst). Murni perubahan presentasi, konten YAML tidak berubah.

## Perbaikan Konten Selama Migrasi

Ini perbaikan atas bug yang sudah ada di situs lama, bukan konten baru yang dikarang:

1. Link resume versi ID nunjuk ke `files/resume.pdf` yang gak pernah ada di `static/files/` —
   disamakan ke file resume EN yang valid (`resume-tian2022.pdf`).
2. Project "Eigen Test" nunjuk ke logo `no-code.png` yang gak ada di aset manapun — logo dikosongkan
   (lihat komentar `NOTE` di [projects/en.yaml](src/content/projects/en.yaml) dan
   [projects/id.yaml](src/content/projects/id.yaml)).
3. Copyright tahun yang hardcoded "© 2021" — sekarang dihitung otomatis
   (`new Date().getFullYear()` di [Footer.astro](src/components/Footer.astro)).

## Known Issues / Utang Teknis (belum dikerjakan)

Ini juga dibiarkan apa adanya dari situs lama karena butuh keputusan editorial, bukan cuma fix
teknis — dicatat di sini biar gak lupa:

- **Mismatch tag filter project di versi ID.** Tombol filter ID cuma punya `hobi`/`perekrutan`,
  tapi beberapa project masih pakai tag `hobby`/`server` (bahasa Inggris/beda kata) yang gak
  match tombol manapun — jadi filter "Hobi" di versi ID gak nampilin semua project hobi yang
  seharusnya. Perlu disamakan tag-nya di [projects/id.yaml](src/content/projects/id.yaml).
- **`public/files/resume-tian2022.pdf` dan `resume-tianputra.pdf` sudah gak direferensikan di
  manapun** (yang dipakai sekarang `resume-tian2026.pdf`) — dangling asset, tinggal diputuskan
  dihapus atau dibiarkan sebagai arsip.
- **Company `iForte Payment Infrastructure` belum ada URL & lokasi kota** di
  [experiences/en.yaml](src/content/experiences/en.yaml) &
  [experiences/id.yaml](src/content/experiences/id.yaml) (dikosongkan karena resume gak
  mencantumkannya) — nama perusahaan tampil sebagai teks biasa (gak jadi link) sampai diisi.
- Belum ada automated test / linter (ESLint, Prettier) — validasi cuma dari type-check content
  collection saat `npm run build`.
- Belum ada custom halaman 404.
- `og:image` masih pakai `background.png` mentah, belum didesain khusus buat social preview card.
- Warning `EBADENGINE` saat `npm install` (paket `undici` minta Node `>=22.19`, lokal masih
  `22.12`) — belum breaking, tapi CI pakai Node `22` generik jadi perlu dipantau kalau nanti error.

## Rencana Selanjutnya

Update konten yang mau dikerjakan setelah revamp ini di-review:

- [x] **Update foto** — ganti [src/assets/images/author/avatar.jpg](src/assets/images/author/avatar.jpg)
      (di-crop dari screenshot WhatsApp; resolusi kecil & B&W, ganti lagi kalau ada foto original).
- [ ] **Update About (ID & EN)** — [src/content/about/en.yaml](src/content/about/en.yaml) &
      [src/content/about/id.yaml](src/content/about/id.yaml). Catatan: `designation`/`company` di
      About masih "DevOps Engineer @ Jaya Agung Teknologi" (lama) — resume terbaru bilang kamu
      sekarang **DevOps Engineer Lead @ iForte Payment Infrastructure**, jadi ini kemungkinan perlu
      diupdate bareng waktu ngerjain item ini.
- [x] **Update experience terbaru** — [src/content/experiences/en.yaml](src/content/experiences/en.yaml) &
      [src/content/experiences/id.yaml](src/content/experiences/id.yaml), disamakan ke
      `resume-tian2026.pdf`: nambah iForte Payment Infrastructure (DevOps Engineer Lead, Apr 2026–
      sekarang + Senior DevOps Engineer, Okt 2022–Apr 2026), update Jaya Agung Teknologi (jadi
      Senior DevOps Engineer, end Okt 2022) & Meteor (end July 2021). Riwayat pra-2020 (Adira/
      Sinqe/Blue Bird) tetap dipertahankan atas permintaan user meski gak ada di resume baru.
      Link resume di About (EN+ID) diarahkan ke `/files/resume-tian2026.pdf`.
- [ ] **Rombak semua project** — banyak yang udah gak relevan, replace di
      [src/content/projects/en.yaml](src/content/projects/en.yaml) &
      [src/content/projects/id.yaml](src/content/projects/id.yaml) (sekalian benerin mismatch tag
      filter ID yang dicatat di atas kalau project lama yang bermasalah ikut dibuang).
- [ ] **Penambahan skills** — [src/content/skills/en.yaml](src/content/skills/en.yaml) &
      [src/content/skills/id.yaml](src/content/skills/id.yaml) (skill baru butuh icon di
      `src/assets/images/skills/` juga, lihat [CLAUDE.md](CLAUDE.md) bagian Images).
