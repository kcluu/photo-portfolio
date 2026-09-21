import { useLayoutEffect, useRef, useState } from "react";
import "./Tooltip.css";

interface TooltipProps {
  x: number;
  y: number;
  visible: boolean;
  text: string;
  accentColor: string;
  boundsWidth: number;
  boundsHeight: number;
}

const OFFSET = 22;

export const Tooltip = ({ x, y, visible, text, accentColor, boundsWidth, boundsHeight }: TooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (ref.current) {
      setSize({ width: ref.current.offsetWidth, height: ref.current.offsetHeight });
    }
  }, [text]);

  const overflowsRight = x + OFFSET + size.width > boundsWidth;
  const overflowsBottom = y + OFFSET + size.height > boundsHeight;

  return (
    <div
      ref={ref}
      className="tooltip"
      style={{
        left: overflowsRight ? x - OFFSET - size.width : x + OFFSET,
        top: overflowsBottom ? y - OFFSET - size.height : y + OFFSET,
        opacity: visible ? 1 : 0,
        borderColor: accentColor,
      }}
    >
      {text}
    </div>
  );
};
