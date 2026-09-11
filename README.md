# smg-ui

The SmartGift web front end. Everything the site serves lives in this repo.

```
src/                    Vite + React landing (hero, videos, archive gallery)
public/catalog/         catalogue data and images the app loads; /catalog/ itself forwards to /#catalog
public/logo-smg.jpg     brand mark
Dockerfile              node build -> nginx, the way it is deployed
```

Two views, one container:

| path | what |
|---|---|
| `/` | landing |
| `/#catalog` | catalog (`/catalog/` forwards here) |

## Develop

```bash
npm install
npm run dev            # authoring tools are on automatically
```

`npm run dev` serves `public/` too, so `/catalog/data/` and `/catalog/assets/` work the same as in production.

## Build and run

```bash
docker compose up -d --build     # http://localhost:8080
```

or without Docker:

```bash
npm run build && npx serve dist
```

## Publish and monitor

The container is published to the internet through Tailscale Funnel:

```bash
tailscale funnel --bg --https=8443 http://127.0.0.1:8080   # https://desktop-vetatmq.tail71c7d1.ts.net:8443/
tailscale funnel status
```

That route has disappeared on its own before (`.brain/rca/2026-09-09-funnel-8443-missing.md`),
so a scheduled task checks it every 5 minutes — the container on :8080, the Funnel route and the
public URL — logging each run to `.monitor/funnel.log` and raising a Windows popup only when the
state changes.

```powershell
powershell -File scripts/install-funnel-monitor.ps1               # detect and alert only
powershell -File scripts/install-funnel-monitor.ps1 -AutoRestore  # also re-add a missing route
powershell -File scripts/install-funnel-monitor.ps1 -Uninstall
powershell -File scripts/monitor-funnel.ps1                       # one check by hand
```

`-AutoRestore` re-adds only the :8443 route, only while the container is healthy, and never resets
other Funnel routes. It is off by default because it puts the site back on the public internet
without anyone deciding to.

## Authoring tools

The grid overlay and media config drawer are hidden from visitors. Add `?dev=1`
to any URL to show them — it is remembered afterwards; `?dev=0` clears it. They
are always on under `npm run dev`.

This is a visibility switch, not a login. Both tools only touch this browser's
own `localStorage`, so there is nothing for a password to protect, and in a
static bundle a password would ship readable in the JavaScript anyway.

## Catalog data

The catalogue is built from the SmartGift pipeline repo (`../business-01-smart-gift`):

```bash
npm run build:catalog   # src/data/catalogItems.generated.ts + public/catalog/data/supplier-items.json
npm run build:3d        # dimension-accurate models for the round products
npm run check:3d        # gate every published 3D model against its product's dimensions
```

Review the diff before committing; both rewrite in place.

The standalone customer catalogue that used to live at `/catalog/` was retired on 2026-09-11 in
favour of `/#catalog`; `/catalog/` now forwards there. `npm run refresh:catalog` copied that page's
data and nothing in the app reads it any more.
