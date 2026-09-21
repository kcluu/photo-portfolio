import "./ViewfinderCursor.css";

interface ViewfinderCursorProps {
  x: number;
  y: number;
  accentColor: string;
  size?: number;
}

export const ViewfinderCursor = ({ x, y, accentColor, size = 25 }: ViewfinderCursorProps) => (
  <div
    className="viewfinder-cursor"
    style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }}
  >
    <div className="viewfinder-cursor-line viewfinder-cursor-line-h" style={{ background: accentColor }} />
    <div className="viewfinder-cursor-line viewfinder-cursor-line-v" style={{ background: accentColor }} />
    <span className="viewfinder-cursor-corner viewfinder-cursor-corner-tl" style={{ borderColor: accentColor }} />
    <span className="viewfinder-cursor-corner viewfinder-cursor-corner-tr" style={{ borderColor: accentColor }} />
    <span className="viewfinder-cursor-corner viewfinder-cursor-corner-bl" style={{ borderColor: accentColor }} />
    <span className="viewfinder-cursor-corner viewfinder-cursor-corner-br" style={{ borderColor: accentColor }} />
  </div>
);
