import type { Photo } from "../../types";
import "./PhotoCell.css";

interface PhotoCellProps {
  photo: Photo;
  columnSpan: number;
  isDimmed: boolean;
  isHighlighted: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}

export const PhotoCell = ({
  photo,
  columnSpan,
  isDimmed,
  isHighlighted,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: PhotoCellProps) => (
  <div
    className={`photo-cell ${isDimmed ? "photo-cell-dimmed" : ""}`}
    style={{
      gridColumn: `span ${columnSpan}`,
      background: `linear-gradient(160deg, ${photo.colorFrom}, ${photo.colorTo})`,
    }}
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
    onClick={onSelect}
  >
    <div className="photo-cell-grain" />
    <div className={`photo-cell-frame ${isHighlighted ? "photo-cell-frame-visible" : ""}`}>
      {photo.frame}
    </div>
  </div>
);
