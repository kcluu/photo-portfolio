export type Category = "concert" | "portrait" | "postcard" | "editorial";

export type CategoryFilter = "all" | Category;

export interface Photo {
  id: number;
  frame: string;
  caption: string;
  category: Category;
  // TODO: Replace these with a real `src`
  colorFrom: string;
  colorTo: string;
  src?: string;
}

export interface CellRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type LightboxPhase = "closed" | "atCell" | "expanded";
