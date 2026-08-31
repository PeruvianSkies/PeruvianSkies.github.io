# PRD — Portfolio Revamp for Tian Putra

## ⚠️ Status & handoff (read this first if continuing in a new session)

- **Branch**: `astro-revamp`. Last commit: `3727989` ("content: update work experience from
  latest resume"). **All work since then — including the entire visual overhaul described below —
  is still uncommitted** (`git status` will show many modified/untracked files). Not pushed yet.
  Do not commit without the user explicitly asking.
- **Major pivot that happened after the "Follow-up: terminal/CLI visual redesign" section below**:
  the terminal/CLI design has **been fully replaced**, not just extended — the user asked for a
  full overhaul to the [mutheeew.tech](https://www.mutheeew.tech/) style (light/dark modern, Inter
  font, no more monospace/prompt look). Full decision details & outcomes are in
  **[design.md](design.md)** — read that for the current visual context; the "terminal/CLI visual
  redesign" section in this PRD is kept as historical archive.
- **There was one last change that was NOT YET VERIFIED** when this session was compacted: the Hero
  photo position (to keep it flush against the bottom of the viewport) had just been restructured
  to `position: absolute` in [Hero.astro](src/components/Hero.astro), and the user was asked to run
  `npm run dev` themselves to check — no result was reported back. **Check with the user whether
  this fix is confirmed working** before doing any further Hero work. Full technical details plus
  likely causes if it's still broken are at the very top of [design.md](design.md).

## Background

The previous portfolio was a static Hugo site using the `hugo-toha/toha` theme (git submodule),
with all content (bio, skills, experience, projects) as data-driven YAML, bilingual EN/ID, with no
layout/SCSS customization at all. The stack was old (Hugo `0.109.0` pinned since 2023, deploy
action using `ubuntu-18.04`), and the user decided on a full revamp to a new stack rather than a
mere content refresh or override of the old theme.

## Goals

- A more modern design (single-page, dark/light mode, mobile-friendly) without losing existing
  content/work history.
- An architecture that's easier to customize going forward — content stays separate from
  presentation (data-driven), but using more actively-maintained tooling than a third-party Hugo
  theme.
- Stay bilingual EN/ID, keep deploying to Netlify + GitHub Pages as before.

## Technical Decisions

| Area | Before | After | Reason |
|---|---|---|---|
| Framework | Hugo + `toha` theme (submodule) | Astro 7 | Static-first, Content Collections fit the YAML section-based pattern well, built-in i18n routing, no third-party theme submodule needed |
| Styling | Toha theme's built-in CSS | Tailwind CSS v4 | Full customization, not tied to someone else's theme design |
| Social icons | Font Awesome (from the theme) | Local inline SVG ([SocialIcon.astro](src/components/SocialIcon.astro)) | No added external CDN dependency |
| Images | Raw PNGs from `static/`/`assets/` | `src/assets/images/` + Astro `<Image />` | Auto-optimized to WebP at build time (avatar 91KB → 2KB) |
| Deploy | `hugo --gc --minify` | `npm run build` | Node toolchain, see the Deploy section of [CLAUDE.md](CLAUDE.md) |

Architecture details (content collection structure, how to add a skill/project, etc.) are in
[CLAUDE.md](CLAUDE.md) — this document focuses on decisions & status, not day-to-day technical
guidance.

## Revamp Scope (Done)

- [x] Migrated all YAML content (author, about, skills, experiences, projects, site) as-is from
      `data/en/` and `data/id/` to `src/content/*/{en,id}.yaml`, validated via Zod schemas.
- [x] New layout: Header (nav + language switch + theme toggle + mobile hamburger), Hero/About,
      Skills grid, Experience timeline, Projects grid with tag filter, Footer.
- [x] Dark/light mode (toggle + `prefers-color-scheme`, persisted in `localStorage`).
- [x] Google Analytics (`G-R8GV6WLH4M`) still works, only in the production build.
- [x] Netlify & GitHub Actions deploy pipelines updated to Astro/Node.
- [x] The `toha` theme submodule and all Hugo-specific files (`config.yaml`, `archetypes/`,
      `resources/`, `.gitmodules`) removed.
- [x] Verified working: `npm run build` succeeds, EN & ID render correctly, dark mode, mobile nav,
      project filter, and resume download link (status 200) — checked with Playwright + screenshots.

All work above is on the `astro-revamp` branch, **not yet committed/pushed** — pending manual
review from the user before merging into `source`.

### Follow-up: UI/UX audit (ui-ux-pro-max skill)

Reviewed with the `ui-ux-pro-max` skill + a manual WCAG contrast check, resulting in 5 findings
that have been fixed:
- `text-term-dim` contrast in light mode failed AA (4.43:1) — token darkened to `#5b6472` (5.49:1).
- The company link in [Hero.astro](src/components/Hero.astro) was still using leftover
  `text-accent-600` from before the terminal redesign, with 3.38:1 contrast (failing AA) — aligned
  to the `text-term-dim hover:text-prompt` pattern used by Experience, and the
  `--color-accent-600` token was also fixed to `#0e7490` as a safeguard in case it's used again. A
  guard for an empty `company.url` was also added (no such case currently, but About may be updated
  to the iForte company which doesn't have a URL yet).
- The social icon click target in [Footer.astro](src/components/Footer.astro) was only ~16×16px
  (below the WCAG 24px minimum) and inconsistent with Hero's 36×36px — sizes were aligned.
- The filter buttons in [Projects.astro](src/components/Projects.astro) didn't expose state to
  assistive tech — `aria-pressed` was added, toggled alongside the class in the script.
- The SVG in [SocialIcon.astro](src/components/SocialIcon.astro) got `aria-hidden="true"` added
  (the parent link already has `aria-label`, so the icon is redundant for screen readers).

### Follow-up: terminal/CLI visual redesign

After the initial migration, the user felt the look was still generic (a modern SaaS-style card
layout, just a different engine than Hugo). Since every component is now custom code, it was
redesigned into a **terminal/CLI** identity — full monospace font (JetBrains Mono), a terminal
color palette (dark: near-black + green prompt; light: "terminal paper" cream, not plain white),
Hero wrapped in a `TerminalWindow` component (3-dot title bar), other sections given
command-style headers (`$ cat skills.yaml`, `$ git log --oneline --graph`, `$ ls -la ./projects/`),
nav styled as paths (`./about`, `./skills`, etc). Purely a presentation change, the YAML content
did not change.

## Content Fixes Made During Migration

These are fixes to bugs that already existed on the old site, not newly invented content:

1. The ID version's resume link pointed to `files/resume.pdf`, which never existed in
   `static/files/` — aligned to the valid EN resume file (`resume-tian2022.pdf`).
2. The "Eigen Test" project pointed to a `no-code.png` logo that didn't exist in any asset — the
   logo was left blank (see the `NOTE` comment in [projects/en.yaml](src/content/projects/en.yaml)
   and [projects/id.yaml](src/content/projects/id.yaml)).
3. The hardcoded copyright year "© 2021" — now computed automatically
   (`new Date().getFullYear()` in [Footer.astro](src/components/Footer.astro)).

## Known Issues / Technical Debt (not yet addressed)

These were also left as-is from the old site because they need an editorial decision, not just a
technical fix — noted here so they aren't forgotten:

- **Project filter tag mismatch in the ID version.** The ID filter buttons only have
  `hobi`/`perekrutan`, but some projects still use the `hobby`/`server` tags (English/different
  words) that don't match any button — so the "Hobi" filter in the ID version doesn't show all the
  hobby projects it should. The tags need to be aligned in
  [projects/id.yaml](src/content/projects/id.yaml).
- **`public/files/resume-tian2022.pdf` and `resume-tianputra.pdf` are no longer referenced
  anywhere** (the one currently used is `resume-tian2026.pdf`) — dangling assets, still need a
  decision on whether to delete or keep as archive.
- **The `iForte Payment Infrastructure` company has no city location** in
  [about/en.yaml](src/content/about/en.yaml), [about/id.yaml](src/content/about/id.yaml),
  [experiences/en.yaml](src/content/experiences/en.yaml) &
  [experiences/id.yaml](src/content/experiences/id.yaml) — the URL is filled in
  (`https://ifortepay.id/`), the location is still left blank (no info available yet).
- No automated tests / linter yet (ESLint, Prettier) — validation is only the content collection
  type-check during `npm run build`.
- No custom 404 page yet.
- `og:image` still uses the raw `background.png`, not yet designed specifically for a social
  preview card.
- `EBADENGINE` warning during `npm install` (the `undici` package wants Node `>=22.19`, local is
  still `22.12`) — not breaking yet, but CI uses generic Node `22` so it should be watched in case
  it errors later.

## Next Steps

Content updates planned after this revamp is reviewed:

- [x] **Update photo** — replaced [src/assets/images/author/avatar.jpg](src/assets/images/author/avatar.jpg)
      (cropped from a WhatsApp screenshot; low resolution & B&W, replace again once an original
      photo is available).
- [x] **Update About (ID & EN)** — [src/content/about/en.yaml](src/content/about/en.yaml) &
      [src/content/about/id.yaml](src/content/about/id.yaml): `designation`/`company` aligned to
      **DevOps Engineer Lead @ iForte Payment Infrastructure**, `summary` replaced with a summary
      from `resume-tian2026.pdf`. `company.url` left blank (not in the resume) — safe since
      Hero.astro renders it as plain text when the url is empty. `socialLinks` & `softSkills`
      unchanged (no data for them in the resume).
- [x] **Update latest experience** — [src/content/experiences/en.yaml](src/content/experiences/en.yaml) &
      [src/content/experiences/id.yaml](src/content/experiences/id.yaml), aligned to
      `resume-tian2026.pdf`: added iForte Payment Infrastructure (DevOps Engineer Lead, Apr 2026–
      present + Senior DevOps Engineer, Oct 2022–Apr 2026), updated Jaya Agung Teknologi (now
      Senior DevOps Engineer, ending Oct 2022) & Meteor (ending July 2021). Pre-2020 history (Adira/
      Sinqe/Blue Bird) was kept at the user's request even though it's not in the new resume.
      The resume link in About (EN+ID) now points to `/files/resume-tian2026.pdf`.
- [ ] **Overhaul all projects** — many are no longer relevant, replace them in
      [src/content/projects/en.yaml](src/content/projects/en.yaml) &
      [src/content/projects/id.yaml](src/content/projects/id.yaml) (also fix the ID filter tag
      mismatch noted above if the problematic old projects get removed along the way).
- [x] **Skills additions** — [src/content/skills/en.yaml](src/content/skills/en.yaml) &
      [src/content/skills/id.yaml](src/content/skills/id.yaml) reworked from a flat list into
      **categories** (Platform & Cloud, Container & Orchestration, CI/CD & Automation, Security &
      Compliance, FinOps, Observability & Monitoring, Systems & Networking), adding 9 new skills
      from `resume-tian2026.pdf` (ArgoCD, SAST & SCA, SonarQube, SIEM/Wazuh, HashiCorp Vault,
      Kubecost, Prometheus, Datadog, ELK Stack). Existing skills kept their real logos
      (`src/assets/images/skills/`); new skills had no logo file so they used one generic SVG icon
      per category ([CategoryIcon.astro](src/components/CategoryIcon.astro)) — a deliberate choice
      to avoid adding an external icon-CDN dependency. Went through 4 display iterations (3
      reviewed with the `ui-ux-pro-max` skill): click-to-expand cards (hover-only was rejected,
      fails on touch devices — High severity) → pill/badge that's entirely a link to docs
      (mirroring the user's reference portfolio) → static pills that couldn't be clicked (not an
      `<a>`, just a `<span>` — "Compact Label Semantics" guideline, High severity: a skill is a
      tag/value, not an action) → **ended up flat, with no category headings at all**, matching the
      user's reference portfolio exactly (the YAML data stays structured by category for
      maintainability + the generic fallback icon, it's just `flatMap`'d at render time). The `url`
      field is still in the YAML for reference but isn't used at render time.
- **Real brand logos** were added for 7 skills that previously used a generic icon — sourced from
  the official [Simple Icons](https://simpleicons.org/) database (CC0, downloaded once and stored
  locally in `src/assets/images/skills/`, not a live CDN): `argocd.svg`, `trivy.svg`,
  `sonarqube.svg`, `vault.svg`, `prometheus.svg`, `datadog.svg`, `elastic.svg` (for ELK Stack).
  Official brand colors (hex from Simple Icons data) are injected directly into the SVG's `fill`
  attribute to stay accurate in light & dark mode. **"SAST & SCA (Horusec, Trivy)" was split into 2
  separate skills** (Horusec, Trivy) so Trivy could get its real logo. Horusec, SIEM (Wazuh), and
  Kubecost aren't in the Simple Icons database — they still use the generic per-category icon.
- **"Cloud Computing" was split into 4 separate skills**: Google Cloud Platform, AWS, Alibaba Cloud,
  DigitalOcean. Real logos were found for GCP (`gcp.svg`), Alibaba Cloud (`alibabacloud.svg`), and
  DigitalOcean (`digitalocean.svg`) — AWS isn't in the Simple Icons database (likely pulled for
  Amazon trademark reasons), it still uses the generic cloud icon.
