import type { Photo } from "../types";

interface PhotoTone {
  caption: string;
  category: Photo["category"];
  colorFrom: string;
  colorTo: string;
}

// Each tone stands in for a real scan. Swap `colorFrom`/`colorTo` for a real
// `src` (and drop the gradient in PhotoCell.css) once you have your images.
const TONES: PhotoTone[] = [
  { caption: "Stage Lights, Bowery Ballroom", category: "concert", colorFrom: "#241119", colorTo: "#7a2f4a" },
  { caption: "Crowd Silhouettes, Brooklyn Steel", category: "concert", colorFrom: "#1a1424", colorTo: "#4a3f8a" },
  { caption: "Backstage, Amp Glow", category: "concert", colorFrom: "#2a180f", colorTo: "#8a5a2f" },
  { caption: "Window Light", category: "portrait", colorFrom: "#2b2118", colorTo: "#7a5a3d" },
  { caption: "Rooftop Portrait", category: "portrait", colorFrom: "#20241b", colorTo: "#5c6b47" },
  { caption: "Loft Window", category: "portrait", colorFrom: "#242018", colorTo: "#7a6a45" },
  { caption: "Brooklyn Bridge, Fog", category: "postcard", colorFrom: "#22262b", colorTo: "#5c6670" },
  { caption: "Coney Island, Winter", category: "postcard", colorFrom: "#23282d", colorTo: "#7d8a92" },
  { caption: "Central Park, Dusk", category: "postcard", colorFrom: "#1b2320", colorTo: "#4d6355" },
  { caption: "Subway Platform, 14th St", category: "editorial", colorFrom: "#1c2b33", colorTo: "#4a6a78" },
  { caption: "Bodega, 3AM", category: "editorial", colorFrom: "#2c1a16", colorTo: "#8a4636" },
  { caption: "Diner Counter", category: "editorial", colorFrom: "#2a2020", colorTo: "#6b4a4a" },
];

/** Builds a pool of photos by cycling through the tone list. */
export const createPhotoPool = (count: number): Photo[] =>
  Array.from({ length: count }, (_, index) => {
    const tone = TONES[index % TONES.length];
    return {
      id: index,
      frame: String(index + 1).padStart(2, "0"),
      caption: tone.caption,
      category: tone.category,
      colorFrom: tone.colorFrom,
      colorTo: tone.colorTo,
    };
  });

export const CATEGORY_LABELS: Record<Photo["category"] | "all", string> = {
  all: "All",
  concert: "Concerts",
  portrait: "Portraits",
  postcard: "Postcard",
  editorial: "Editorial",
};

export const FILM_STOCK_LABELS: Record<Photo["category"] | "all", string> = {
  all: "Kodak Tri-X 400",
  concert: "Concerts",
  portrait: "Portraits",
  postcard: "Postcard",
  editorial: "Editorial",
};
