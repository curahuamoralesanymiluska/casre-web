# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **CASRE INGENIERÍA** (topography, cadastre and land-titling firm in Ayacucho, Peru). All user-facing copy is in Spanish, and commit messages are written in Spanish using Conventional Commit prefixes (`feat:`, `fix:`). Angular 22, standalone components, SCSS, no backend.

## Commands

- `npm start`: dev server at http://localhost:4200 (development configuration)
- `npm run build`: production build to `dist/angular-production-ready/browser` (budgets: 500kB warn / 1MB error initial; 10kB warn / 20kB error per component stylesheet)
- `npm test`: unit tests via Vitest (`@angular/build:unit-test`, jsdom). There are currently no `*.spec.ts` files. To run one file: `npx ng test --include src/app/path/to/file.spec.ts`
- `node optimize.js`: converts every `.jpg`/`.jpeg` in `public/assets` and `public/assets/images` to `.webp` (quality 75) using sharp, and **deletes the originals**
- Formatting: Prettier (`.prettierrc`: printWidth 100, single quotes, Angular parser for HTML). No lint target is configured.

## Deployment

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`, which builds with `--base-href /casre-web/` and publishes to the `gh-pages` branch. `npm run deploy` does the same thing by hand. Because the site is served under `/casre-web/`, use relative asset paths (`assets/...`, not `/assets/...`).

## Architecture

- **Bootstrap**: `src/main.ts` → `AppComponent` (navbar + `<router-outlet>` + footer). `app.config.ts` sets up the router with component input binding, preloading of all lazy routes, and scroll-to-top on navigation.
- **Routes** (`app.routes.ts`): `''` loads `HomeComponent` eagerly. `nosotros`, `servicios` and `contacto` are lazy `loadComponent` routes. `**` redirects to home. (`pages/not-found` exists but is not routed.)
- **`pages/` vs `components/`**: pages are route targets. `pages/home` is just a stack of section components from `components/` (hero, about, services-cards, why-choose-us, quote-form, whats-app-floating). Scroll reveals, magnetic buttons and card tilt come from the directives in `shared/directives/` (styles for reveals live in `src/styles/identity.scss`). `components/about` (the home section, imported with the alias `AboutSectionComponent`) and `pages/about` (the `/nosotros` page) are different components that share a class name.
- **Content source**: `services/data.service.ts` (`DataService`) holds company info (WhatsApp number, email, address), the services list with image paths, and `getWhatsAppUrl()`. Edit contact details and service copy there, not in templates.
- **Quote form**: `components/quote-form` keeps form state in signals and POSTs to `formsubmit.co/ajax/casreconsultores@gmail.com` (there is no backend). SweetAlert2 is dynamically imported only for the result dialog, which keeps it out of the initial bundle.
- **Leftover scaffold code**: `ProjectService`, `models/project.model.ts`, `components/project-card`, `shared/pipes/truncate.pipe.ts`, and `src/styles/_variables.scss` / `_utilities.scss` (a dark indigo theme) come from the original template. Nothing in the live site imports them.

## Styling

- The real design tokens are the CSS custom properties in `src/styles.scss` `:root`: brand navy `--color-primary-dark: #0f2d52`, CASRE orange `--color-accent: #F37021`, fonts Montserrat (headings) and Lato (body), plus radius, shadow and duration tokens. Don't use the tokens in `src/styles/_variables.scss`, since that file isn't loaded.
- Component class names use a BEM-style `casre__block-element` prefix.
- Icons come from Bootstrap Icons (`<i class="bi bi-...">`), and fonts come from Google Fonts, both loaded by CDN in `src/index.html`.
- `main` gets `padding-top: 80px` to clear the fixed navbar.
- Responsive breakpoints in use are mostly `max-width: 900px` and `992px`. Recent work has been mobile fixes (hero blur on mobile only, opaque white side menu, text wrapping), so check desktop and mobile both when changing hero, navbar or section layouts.
- Static assets live in `public/` (served from the site root) and should be `.webp`.
