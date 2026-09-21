import { useEffect, useState } from "react";

// Preloads every URL and reports once they've all loaded (or failed)
export const useImagePreload = (urls: string[]): boolean => {
  const [allSettled, setAllSettled] = useState(urls.length === 0);

  useEffect(() => {
    if (urls.length === 0) {
      setAllSettled(true);
      return;
    }

    setAllSettled(false);
    let remaining = urls.length;
    let cancelled = false;

    const handleSettled = () => {
      remaining -= 1;
      if (!cancelled && remaining <= 0) setAllSettled(true);
    };

    const images = urls.map((url) => {
      const img = new Image();
      img.onload = handleSettled;
      img.onerror = handleSettled;
      img.src = url;
      return img;
    });

    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  return allSettled;
};
