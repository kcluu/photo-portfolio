import { useCallback, useRef, useState } from "react";
import type { LightboxPhase } from "../types";

const CLOSE_ANIMATION_MS = 550;

interface LightboxState {
  selectedIndex: number | null;
  phase: LightboxPhase;
  // True only for the single frame that must snap instantly, with no transition
  skipTransition: boolean;
  open: (index: number) => void;
  close: () => void;
  showNext: () => void;
  showPrevious: () => void;
  reset: () => void;
}

export const useLightbox = (itemCount: number): LightboxState => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<LightboxPhase>("closed");
  const skipTransitionRef = useRef(false);

  const open = useCallback((index: number) => {
    skipTransitionRef.current = true;
    setSelectedIndex(index);
    setPhase("atCell");

    // Wait a frame so the browser paints the instant snap before we enable
    // the transition and move to the expanded rect
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        skipTransitionRef.current = false;
        setPhase("expanded");
      });
    });
  }, []);

  const close = useCallback(() => {
    skipTransitionRef.current = false;
    setPhase("atCell");

    window.setTimeout(() => {
      skipTransitionRef.current = true;
      setSelectedIndex(null);
      setPhase("closed");
    }, CLOSE_ANIMATION_MS);
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => (current === null ? current : (current + 1) % itemCount));
  }, [itemCount]);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => (current === null ? current : (current - 1 + itemCount) % itemCount));
  }, [itemCount]);

  const reset = useCallback(() => {
    skipTransitionRef.current = true;
    setSelectedIndex(null);
    setPhase("closed");
  }, []);

  return {
    selectedIndex,
    phase,
    skipTransition: skipTransitionRef.current,
    open,
    close,
    showNext,
    showPrevious,
    reset,
  };
};
