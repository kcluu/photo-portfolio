import { useCallback, useRef, useState } from "react";

// Matches the box's opacity/transform transition duration in Lightbox.css.
const CLOSE_ANIMATION_MS = 300;

interface LightboxState {
  selectedIndex: number | null;
  isOpen: boolean;
  open: (index: number) => void;
  close: () => void;
  reset: () => void;
}

export const useLightbox = (): LightboxState => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<number>();

  const open = useCallback((index: number) => {
    window.clearTimeout(closeTimerRef.current);
    setSelectedIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Keep the photo mounted until the fade-out finishes, so the box isn't
    // suddenly empty while it's still visible.
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedIndex(null);
    }, CLOSE_ANIMATION_MS);
  }, []);

  const reset = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    setSelectedIndex(null);
    setIsOpen(false);
  }, []);

  return {
    selectedIndex,
    isOpen,
    open,
    close,
    reset,
  };
};
