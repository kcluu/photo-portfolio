# Film Portfolio — Contact Sheet

A React + TypeScript contact-sheet portfolio: a square-cell grid that always
fills the screen regardless of how many photos are in the current category,
a viewfinder-style cursor, a light/dark switch, and a lightbox that morphs
seamlessly out of whichever frame you click.

Photos live in Cloudinary and are fetched live on every page load — nothing
is committed to this repo or baked in at build time. Adding, removing, or
re-tagging a photo in Cloudinary shows up on the site within minutes, no
redeploy required.

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Cloudinary API key/secret
npm run dev:vercel     # runs `vercel dev`, serving both the app and /api
```

Then open the printed local URL. The app calls `/api/photos`, a serverless
function, so use `npm run dev:vercel` (the Vercel CLI, via `npx`) rather
than plain Vite — `npm run dev` (bare `vite`) still works for frontend-only
work, but `/api/photos` won't resolve and the grid will show the fetch
error state.

## How photos get from Cloudinary to the site

1. **Upload photos to Cloudinary**, organized into folders: `live`,
   `portraits`, `postcards`, `editorial`. The folder is what determines
   category — filenames don't matter.
2. **Optionally set metadata** per photo in the Cloudinary Media Library:
   a `name` field (shown as the lightbox title; falls back to the category
   name if unset) and a `location` field (shown under the title, omitted if
   unset).
3. The browser calls `/api/photos` on every page load. That serverless
   function ([api/photos.ts](api/photos.ts)) authenticates to Cloudinary's
   Admin API with your API key/secret (kept server-side only — a secret can
   never be used client-side), lists every resource, maps each one's folder
   to a category, reads its `name`/`location`, and returns a plain JSON list
   of photos with ready-to-use Cloudinary delivery URLs
   (`f_auto,q_auto,w_2000` — automatic format/compression, capped at 2000px).
4. The response is cached at the CDN edge for 5 minutes
   (`Cache-Control: s-maxage=300`), so Cloudinary's Admin API (which has a
   fairly low rate limit) is only actually called about once every 5
   minutes, not once per visitor.

## Deploying

Deploy to Vercel as usual (`vercel` or connect the GitHub repo). In the
Vercel project's environment variables, set `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` — the same values from your local `.env`. Nothing
else is required; `api/photos.ts` is picked up automatically.

## Project structure

Every component lives in its own folder with a co-located CSS file — there
is intentionally no single global stylesheet beyond `src/index.css` (a small
reset plus the `@font-face` declarations for PP Editorial New).

```
api/
  photos.ts           — serverless function: Cloudinary Admin API -> JSON
src/
  assets/fonts/        — PP Editorial New (licensed, not a web font CDN)
  components/
    ContactSheet/
    InfoModal/
    Lightbox/
    LoadingScreen/
    PhotoCell/
    TopBar/             — site name, category tabs, nav links, light switch
    Tooltip/
    ViewfinderCursor/
  data/
    photos.ts           — static category label maps only
  hooks/
    useContactSheetLayout.ts  — picks the grid shape & per-cell rects
    useElementSize.ts         — ResizeObserver wrapper
    useImagePreload.ts        — waits for a list of image URLs to load
    useLightbox.ts            — open/close state machine for the lightbox
    usePhotos.ts               — fetches /api/photos on mount
    useRelativeMousePosition.ts
  types/
    index.ts
  utils/
    shuffle.ts
  App.tsx
  App.css
  main.tsx
```

## Notes on the grid

`useContactSheetLayout` searches column counts for whichever one produces
square cells for the current photo count (or, when `fixedRows` is passed,
for a fixed row count instead — used by the "All" tab to always show exactly
3 rows). Switching categories reflows into a different, still-complete grid;
the "All" tab shows a random subset of every photo (reshuffled once per page
load), sized to exactly fill 3 rows so it doesn't have to render everything
at once.

## Notes on the lightbox

`useLightbox` uses a two-step transition trick: clicking a cell first snaps
the lightbox instantly onto that cell's exact position (invisible, since it
perfectly overlaps the cell), then a frame later enables the transition and
moves it to the centered target rect — producing a seamless "grow out of
the cell" animation instead of a generic fade-in. Closing reverses the same
motion before disappearing. Arrowing through the lightbox cycles through
whichever set of photos is currently displayed (the full shuffled set on
"All", or that category's set on a category tab).
