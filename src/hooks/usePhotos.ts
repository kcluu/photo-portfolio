import { useEffect, useState } from "react";
import type { Category, Photo } from "../types";
import { CATEGORY_LABELS } from "../data/photos";

interface ApiPhoto {
  filename: string;
  category: Category;
  name?: string;
  location?: string;
  src: string;
}

interface UsePhotosResult {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
}

// Fetches the live photo list from Cloudinary (via the /api/photos proxy) on mount
export const usePhotos = (): UsePhotosResult => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/photos")
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        return response.json() as Promise<{ photos: ApiPhoto[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        setPhotos(
          data.photos.map((entry, index) => ({
            id: index,
            frame: String(index + 1).padStart(2, "0"),
            caption: entry.name ?? CATEGORY_LABELS[entry.category],
            location: entry.location,
            category: entry.category,
            src: entry.src,
          })),
        );
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load photos");
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { photos, isLoading, error };
};
