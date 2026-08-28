[![Netlify Status](https://api.netlify.com/api/v1/badges/ef8befb4-6866-44e9-9f5b-3d933cbe0df8/deploy-status)](https://app.netlify.com/sites/tianputra/deploys)

# Tian Putra — Portfolio

Personal portfolio site built with [Astro](https://astro.build) + Tailwind CSS, bilingual (EN/ID) via Astro's built-in i18n routing.

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # build static site to dist/
npm run preview   # preview the production build
```

## Content

All copy lives in `src/content/{author,about,skills,experiences,projects,site}/{en,id}.yaml`, validated against schemas in `src/content.config.ts`. Edit the YAML, no code changes needed for content updates.

## Deploy

- **Netlify**: builds from `netlify.toml` (`npm run build` → `dist/`).
- **GitHub Pages**: `.github/workflows/deploy-site.yaml` builds on push to `source` and publishes `dist/` to the `main` branch.
