# smg-ui

The SmartGift web front end. Everything the site serves lives in this repo.

```
src/                    Vite + React landing (hero, videos, archive gallery)
public/catalog/         the customer catalog — a self-contained page, no build step
public/logo-smg.jpg     brand mark
Dockerfile              node build -> nginx, the way it is deployed
```

Two pages, one container:

| path | what |
|---|---|
| `/` | landing |
| `/catalog/` | catalog |

## Develop

```bash
npm install
npm run dev            # authoring tools are on automatically
```

`npm run dev` serves `public/` too, so `/catalog/` works the same as in production.

## Build and run

```bash
docker compose up -d --build     # http://localhost:8080
```

or without Docker:

```bash
npm run build && npx serve dist
```

## Authoring tools

The grid overlay and media config drawer are hidden from visitors. Add `?dev=1`
to any URL to show them — it is remembered afterwards; `?dev=0` clears it. They
are always on under `npm run dev`.

This is a visibility switch, not a login. Both tools only touch this browser's
own `localStorage`, so there is nothing for a password to protect, and in a
static bundle a password would ship readable in the JavaScript anyway.

## Catalog data

The catalog page is edited here like any other source. Only the JSON under
`public/catalog/data/` has an upstream — the SmartGift pricing pipeline
regenerates it — so pull a fresh copy when that runs:

```bash
npm run refresh:catalog
# or, if the pipeline repo is elsewhere:
npm run refresh:catalog -- --from ../path/to/business-01-smart-gift
```

Review the diff before committing; it overwrites in place.
