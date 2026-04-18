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

## MongoDB Setup (Atlas + Mongoose)

AstroShield now supports MongoDB-backed persistence while keeping the same UI and route structure.

1. Copy env template:

```bash
cp .env.local.example .env.local
```

2. Fill in:

```bash
MONGODB_URI=...
MONGODB_DB=...
```

3. Start app:

```bash
npm run dev
```

If MongoDB is unavailable or not configured, AstroShield gracefully falls back to the existing live/mock data paths.

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

## API Reference

### 1) Platform Resources

- Route: `/api/platform/[resource]`
- Method: `GET`
- Handler: `src/app/api/platform/[resource]/route.ts`

Supported resource values:

| Resource | Description |
| --- | --- |
| `landing` | Landing page ticker and mission content |
| `dashboard` | Core operational metrics, geomagnetic scale, timeline |
| `alerts` | Normalized operational alert feed |
| `solar-monitor` | CME activity, active regions, flare history |
| `ai-predictions` | Forecast windows, flare class probabilities, drivers |
| `grid-risk` | Grid location risk overlays |
| `satellites` | Satellite asset risk and exposure trends |
| `aviation` | Route risk, zones, and incidents |
| `analytics` | Storm history and cycle trend data |
| `admin` | API health and admin logs |
| `profile` | User profile and preferences |

Platform endpoint examples:

```http
GET /api/platform/dashboard
GET /api/platform/solar-monitor
GET /api/platform/analytics
```

### 2) Live Telemetry Stream

- Route: `/live-solar`
- Method: `GET`
- Handler: `src/app/live-solar/route.ts`
- Data sources: NOAA SWPC + NASA DONKI (live upstream pulls with resilient fallback values)

Example response:

```json
{
  "timestamp": "2026-04-18T11:24:00.000Z",
  "kpIndex": 5.7,
  "solarWindSpeed": 612,
  "flareActivity": "M-class flare"
}
```

### 4) MongoDB CRUD APIs

The following API routes are available for persistent data operations:

- `GET | POST | PUT | DELETE /api/telemetry`
- `GET | POST | PUT | DELETE /api/alerts`
- `GET | POST | PUT | DELETE /api/predictions`
- `GET | POST | PUT | DELETE /api/sites`
- `GET | POST | PUT | DELETE /api/reports`
- `GET | POST | PUT | DELETE /api/preferences`

Pagination is supported with `page` and `limit` query params for list endpoints.

### 5) Mongo Collections

Mongoose models are defined in:

- `src/models/Telemetry.ts`
- `src/models/Alert.ts`
- `src/models/Prediction.ts`
- `src/models/SolarSite.ts`
- `src/models/Report.ts`
- `src/models/UserPreference.ts`
- `src/models/UserAccount.ts`
- `src/models/UserSession.ts`
- `src/models/PasswordResetToken.ts`

Connection singleton lives in:

- `src/lib/db/mongodb.ts`

### 6) Auth Persistence APIs

Mongo-backed auth routes are available at:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET | POST /api/auth/reset-password`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Auth sessions are stored with secure HTTP-only cookies and persisted in `user_sessions`.
Password reset tokens are short-lived, single-use, and persisted in `password_reset_tokens`.

### 3) Synthetic Dataset Mode

AstroShield now supports a synthetic scenario dataset that covers the same parameter families used in the platform modules (solar telemetry, alerts, risk scores, satellites, aviation, analytics, and admin health).

- API query toggle:

```http
GET /api/platform/dashboard?dataset=synthetic
GET /api/platform/satellites?dataset=synthetic
```

- Global server mode:

```bash
PLATFORM_DATA_MODE=synthetic
```

- Global client mode:

```bash
NEXT_PUBLIC_PLATFORM_DATASET_MODE=synthetic
```

Synthetic mode is deterministic per short time window so values remain coherent across cards/charts while still changing over time.

## ML Enhancement Layer

AstroShield now includes a non-destructive ML enhancement layer powered by the uploaded synthetic CSV dataset.

- Data pipeline: `src/lib/ml/data-pipeline.ts`
- ML engine: `src/lib/ml/engine.ts`
- Prediction API: `src/app/api/predict/route.ts`
- Client prediction service: `src/services/predictions/`
- Prediction state (Zustand): `src/store/prediction-store.ts`

Example inference request:

```http
GET /api/predict
GET /api/predict?irradiance=7.4&landArea=92&temperature=29&dustIndex=18&region=MEA
```

## Notes

- AstroShield now fetches live upstream space-weather data through `src/app/api/platform/[resource]/route.ts`.
- NOAA SWPC and NASA DONKI data are normalized in `src/lib/api/platform-server.ts`.
- Local JSON in `src/data/mock` is still used as a fallback layer for resilience and for domain-specific demo modules that do not have public infrastructure APIs.
- Map tiles use a dark Carto base layer when running with internet access.

