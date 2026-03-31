# Responsive Animated React Dashboard

This project is a React + TypeScript dashboard built with Vite, Tailwind CSS, Framer Motion, and Radix UI components. It includes a responsive mobile-first layout and modern UI animations for a polished user experience.

## Features

- Mobile-first responsive design
- Smooth motion and hover interactions with Framer Motion
- Native `fetch` API usage; no `axios` dependency installed
- Vite-powered fast development experience
- Local API server available via `dev:api`
- TypeScript-safe codebase with custom UI components and pages

## Project Structure

- `src/` - frontend source code
  - `components/` - reusable UI and layout components
  - `pages/` - route-driven page views
  - `auth/` - authentication utilities and context
  - `styles/` - global CSS
- `server/` - local auth API server and database support
- `public/` - static assets

## Requirements

- Node.js 20+ recommended
- npm or pnpm

## Setup

```bash
npm install
```

If you prefer pnpm:

```bash
pnpm install
```

## Local Development

Start the frontend app:

```bash
npm run dev
```

Start the local API server in a separate terminal:

```bash
npm run dev:api
```

Then open the Vite dev URL shown in the terminal.

## Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Notes

- The app is set up to work responsively across phones, tablets, and desktops.
- Animations are implemented in a way that avoids performance regressions and keeps interactions smooth.
- The project currently uses native `fetch` for all API requests, so there is no need to install or use `axios`.

## Deployment

This app can be deployed to static-hosting platforms such as Vercel, Netlify, or GitHub Pages after building.

1. Build the app: `npm run build`
2. Publish the `dist/` folder or follow your host's Vite deployment guide.

---

If you want, I can also add a `.github/workflows` CI file for GitHub deployment automation.