# Film Portfolio — Contact Sheet

A React + TypeScript port of the contact-sheet portfolio concept: a dynamic
grid that always fills the screen regardless of how many photos are in the
current category, a viewfinder-style cursor, category tabs, and a lightbox
that morphs seamlessly out of whichever frame you click.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Using your own photos

Photo data lives in `src/data/photos.ts`. Each entry currently uses a
`colorFrom`/`colorTo` duotone gradient as a placeholder. To use real scans:

1. Add a `src` field to the `Photo` type usage (already defined in
   `src/types/index.ts`) pointing at your image.
2. In `src/components/PhotoCell/PhotoCell.tsx` and
   `src/components/Lightbox/Lightbox.tsx`, swap the gradient `background`
   for a real `<img src={photo.src} />` (or a `background-image`).

## Project structure

Every component lives in its own folder with a co-located CSS file — there
is intentionally no single global stylesheet beyond `src/index.css`, which
only holds a tiny reset.

```
src/
  components/
    CategoryTabs/
    ContactSheet/
    Lightbox/
    LoadingScreen/
    PhotoCell/
    TopBar/
    Tooltip/
    ViewfinderCursor/
  data/
    photos.ts        — sample photo pool + label maps
  hooks/
    useContactSheetLayout.ts   — picks the grid shape & per-cell rects
    useElementSize.ts          — ResizeObserver wrapper
    useLightbox.ts             — open/close state machine for the lightbox
    useRelativeMousePosition.ts
  types/
    index.ts
  App.tsx
  App.css
  main.tsx
```

## Notes on the grid

`useContactSheetLayout` searches column counts for whichever one produces
cells closest to a 4:3 ratio for the current photo count, then distributes
any leftover space in the final row across the cells that are actually
there (via `grid-column: span`), so the sheet always finishes flush —
switching categories reflows into a different, still-complete grid.

## Notes on the lightbox

`useLightbox` uses a two-step transition trick: clicking a cell first snaps
the lightbox instantly onto that cell's exact position (invisible, since it
perfectly overlaps the cell), then a frame later enables the transition and
moves it to the centered target rect — producing a seamless "grow out of
the cell" animation instead of a generic fade-in. Closing reverses the same
motion before disappearing.
