# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev         # dev server at localhost:4321 (default port)
npm run build        # type-checks content + builds static site to dist/
npm run preview      # serve the production build from dist/ locally
```

There is no test suite and no linter configured. `npm run build` is the closest thing to a
correctness check — it runs Astro's content-collection type checking (against the Zod schemas in
`src/content.config.ts`) before emitting output, so a bad YAML edit fails the build rather than
failing silently at runtime.

## Architecture

Astro 7 static site (output: `static`), Tailwind CSS v4 (via `@tailwindcss/vite`, config lives in
`src/styles/global.css` using `@theme`/`@custom-variant`, not a `tailwind.config.js`). Bilingual
EN/ID via Astro's built-in i18n routing (`astro.config.mjs`): English is the default locale served
at `/`, Indonesian at `/id/` (`prefixDefaultLocale: false`).

### Content model

All copy (bio, skills, work history, project list, site meta) lives as data, not markup, under
`src/content/<collection>/{en,id}.yaml`. Each collection has exactly one entry per locale — this is
not a blog-style collection of many posts, it's one config object per language. Collections and
their Zod schemas are defined once in `src/content.config.ts` using the `glob()` loader
(`base: './src/content/<name>'`, `pattern: '*.yaml'`), so the entry `id` is the filename without
extension (`en` / `id`), which doubles as the locale key.

**To update site content, edit the YAML — never hardcode copy in a `.astro` component.** The six
collections are `author`, `about`, `skills`, `experiences`, `projects`, `site`; see any existing
`en.yaml`/`id.yaml` pair for the shape before adding fields (adding a field means updating the
schema in `src/content.config.ts` too, for both locales).

`src/components/Home.astro` is the single place that calls `getEntry()` for all six collections for
a given `lang` and passes the resolved `.data` down as props to the section components
(`Hero`, `Skills`, `Experience`, `Projects`, `Footer`). `src/pages/index.astro` and
`src/pages/id/index.astro` are both just `<Home lang="en" />` / `<Home lang="id" />` — keep new
locales/pages this thin; put logic in `Home.astro` or the section components, not the page files.

### Images

Source images live in `src/assets/images/{author,skills,sections/projects}/`, not `public/` — this
gets them Astro's build-time optimization (auto WebP + resizing via `<Image />`). Because YAML data
can't hold static `import` statements, `src/lib/images.ts` globs each folder eagerly
(`import.meta.glob(..., { eager: true })`) into a `Map<filename, ImageMetadata>`; components look up
an icon by the filename string stored in the YAML (e.g. `icon: "docker.png"`) via
`skillIcons.get(...)` / `projectLogos.get(...)` / `authorPhotos.get(...)`. **When adding a new
skill/project image, drop the file in the matching `src/assets/images/...` subfolder and reference
its filename in the YAML — no code change needed.** Resume PDFs are the one static-file exception:
they're user-downloadable binaries, not build inputs, so they live in `public/files/` and are
referenced by absolute URL path in `about.yaml`.

### i18n UI strings

Fixed UI copy that isn't part of the content collections (nav labels, button text, aria-labels) is
in `src/i18n/ui.ts` as a `{ en: {...}, id: {...} }` dictionary, consumed via
`useTranslations(lang)` → `t('key')`. Section *titles* (e.g. "Skills" vs "Keahlian") are **not**
here — they come from each collection's own `section.name` field in the YAML, since that copy is
already locale-specific content, not UI chrome.

### Social icons

Social links (`about.yaml`'s `socialLinks`) render through `src/components/SocialIcon.astro`, which
maps a link's `name` (lowercased) to a hand-picked inline SVG path — there's no icon-font or CDN
dependency. Add a new platform by adding a `paths[key]` entry there.

### Deploy

Two independent deploy paths build from the `source` branch:

- **Netlify** (`netlify.toml`): `npm run build` → publishes `dist/`.
- **GitHub Pages** (`.github/workflows/deploy-site.yaml`): on push to `source`, builds with Node and
  force-pushes `dist/` to the `main` branch via `peaceiris/actions-gh-pages`. `main` is a generated
  artifacts branch, not a branch you edit directly.
