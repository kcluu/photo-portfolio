import { useCallback, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

interface Point {
  x: number;
  y: number;
}

// Tracks cursor position for custom viewfinder
export const useRelativeMousePosition = (initial: Point) => {
  const [position, setPosition] = useState<Point>(initial);

  const onMouseMove = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }, []);

  return { position, onMouseMove };
};
