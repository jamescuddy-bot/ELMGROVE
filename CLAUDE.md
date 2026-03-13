# Elm Grove Air Quality — Project Guide

## What this is
A React/Vite progressive web app for parents at Elm Grove Primary School, Brighton. Displays live and historical NO₂ data from an EarthSense Zephyr sensor (Device 392) outside the school gate, and lets parents sign up for SMS alerts.

Deployed on Netlify: https://elmgrove.netlify.app

## Stack
- **React + Vite** (v8), react-router-dom v7
- **Tailwind CSS v3** with custom breakpoints: `tablet: 640px`, `desktop: 1024px`
- **Recharts** for data visualisation
- **Netlify Functions** (ES module format — `export default async (req) =>` + `export const config`)
- **Netlify Blobs** (`@netlify/blobs`) for storing daily NO₂ readings
- **Google Font**: Inclusive Sans

## Key conventions
- All Netlify functions use ES module syntax, not CommonJS
- `export const config = { path: '/.netlify/functions/function-name' }` at the bottom of every function
- Tailwind custom colour tokens: `text-ink` (near-black), `text-teal` / `bg-teal` (accent green), `bg-mint-tint`
- Max content width: `max-w-[960px] mx-auto`
- Floating nav: `fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[928px]`
- `pt-[72px]` on Layout main to clear the floating nav
- Background: `#F1E5E5` on all pages (set on body in index.css)

## Data pipeline
1. Admin uploads EarthSense CSV export via `/admin` → parsed **client-side** in `AdminDashboard.jsx`
2. Parsed daily records sent to `/.netlify/functions/admin-upload` as `{ readings, mode }`
3. Stored in Netlify Blobs store `'readings'` with keys `day:YYYY-MM-DD`
4. `/.netlify/functions/readings` serves historical data (grouped into Mon–Fri weeks)
5. `/.netlify/functions/latest-stats` serves most-recent week stats for homepage statements

## EarthSense CSV format
- 8 metadata rows before the header row
- Header columns: `Date (Local)`, `Time (Local)`, `NO2 Concentration`
- Drop-off window: 08:15–09:15 · Pick-up window: 14:45–15:45
- Weekends are excluded
- Dates in `YYYY/MM/DD` format

## Pages
| Route | File | Purpose |
|---|---|---|
| `/` | `Home.jsx` | Animated word-chip statements from live data |
| `/data` | `HistoricalData.jsx` | Week navigator + historical trends tab |
| `/alerts` | `Alerts.jsx` | SMS alert sign-up form |
| `/no2` | `No2.jsx` | NO₂ explainer + evidence cards + councillor email tool |
| `/admin` | `Admin.jsx` | Password gate |
| `/admin/dashboard` | `AdminDashboard.jsx` | CSV upload + subscriber management |

## Netlify Functions
| Function | Purpose |
|---|---|
| `admin-auth.js` | Password check (server-side) |
| `admin-upload.js` | Write daily readings to Blobs |
| `admin-subscribers.js` | List subscribers |
| `admin-delete.js` | Delete a subscriber |
| `readings.js` | Return all readings grouped by week |
| `latest-stats.js` | Return most recent week summary for homepage |
| `subscribe.js` | Add a new SMS subscriber |
| `unsubscribe.js` | Remove an SMS subscriber |

## Local dev
```
npm run dev
```
Functions require Netlify Blobs and won't work locally without `netlify dev`. For frontend-only changes, `npm run dev` is sufficient.

## Git / deploy
- Branch: `main`
- Push to `main` triggers auto-deploy on Netlify
- `.csv` and `.rtf` files are gitignored — never commit EarthSense exports
