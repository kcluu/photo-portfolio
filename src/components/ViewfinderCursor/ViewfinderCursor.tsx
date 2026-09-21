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
    <div className="viewfinder-cursor__line viewfinder-cursor__line--h" style={{ background: accentColor }} />
    <div className="viewfinder-cursor__line viewfinder-cursor__line--v" style={{ background: accentColor }} />
    <span className="viewfinder-cursor__corner viewfinder-cursor__corner--tl" style={{ borderColor: accentColor }} />
    <span className="viewfinder-cursor__corner viewfinder-cursor__corner--tr" style={{ borderColor: accentColor }} />
    <span className="viewfinder-cursor__corner viewfinder-cursor__corner--bl" style={{ borderColor: accentColor }} />
    <span className="viewfinder-cursor__corner viewfinder-cursor__corner--br" style={{ borderColor: accentColor }} />
  </div>
);
