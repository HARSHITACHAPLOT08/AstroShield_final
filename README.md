# AstroShield

AstroShield is a futuristic AI-powered Space Weather Intelligence Platform built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lenis, Recharts, Chart.js, D3, React Leaflet, Zustand, and shadcn-style UI primitives.

## Features

- Cinematic landing page with animated space background, Earth scene, live ticker, and mission-control messaging
- Immersive login and registration experience with role selection and animated auth states
- Fully responsive platform shell with sidebar, topbar, mobile drawer, and bottom nav
- Dedicated modules for:
  - `/dashboard`
  - `/solar-monitor`
  - `/ai-predictions`
  - `/grid-risk`
  - `/satellites`
  - `/aviation`
  - `/analytics`
  - `/alerts`
  - `/admin`
  - `/profile`
- Hybrid live data layer that normalizes NOAA SWPC and NASA DONKI feeds into the UI, with local mock fallbacks when upstream feeds are unavailable
- Reusable component system for stat cards, charts, maps, alerts, role-guarding, and glassmorphism panels

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis smooth scrolling
- Recharts
- Chart.js
- D3
- React Leaflet
- Zustand
- Radix UI primitives in shadcn-style components

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Project Shape

```text
src/
  app/
    (platform)/
    login/
    globals.css
    layout.tsx
    page.tsx
  components/
    charts/
    layout/
    maps/
    providers/
    shared/
    ui/
    visuals/
  data/mock/
  hooks/
  lib/
  store/
  types/
```

## Notes

- AstroShield now fetches live upstream space-weather data through `src/app/api/platform/[resource]/route.ts`.
- NOAA SWPC and NASA DONKI data are normalized in `src/lib/api/platform-server.ts`.
- Local JSON in `src/data/mock` is still used as a fallback layer for resilience and for domain-specific demo modules that do not have public infrastructure APIs.
- Map tiles use a dark Carto base layer when running with internet access.

