export type Category = "live" | "portrait" | "postcard" | "editorial";

export type CategoryFilter = "all" | Category;

export interface Photo {
  id: number;
  frame: string;
  caption: string;
  location?: string;
  category: Category;
  src: string;
}

export interface CellRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type LightboxPhase = "closed" | "atCell" | "expanded";
