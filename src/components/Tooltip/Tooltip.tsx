import "./Tooltip.css";

interface TooltipProps {
  x: number;
  y: number;
  visible: boolean;
  text: string;
  accentColor: string;
}

export const Tooltip = ({ x, y, visible, text, accentColor }: TooltipProps) => (
  <div
    className="tooltip"
    style={{
      left: x + 22,
      top: y + 22,
      opacity: visible ? 1 : 0,
      borderColor: accentColor,
    }}
  >
    {text}
  </div>
);
