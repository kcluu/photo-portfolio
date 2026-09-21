import type { Photo } from "../../types";
import "./PhotoCell.css";

interface PhotoCellProps {
  photo: Photo;
  isDimmed: boolean;
  isHighlighted: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}

export const PhotoCell = ({
  photo,
  isDimmed,
  isHighlighted,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: PhotoCellProps) => (
  <div
    className={`photo-cell ${isDimmed ? "photo-cell-dimmed" : ""}`}
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
    onClick={onSelect}
  >
    <img
      className="photo-cell-image"
      src={photo.src}
      alt={photo.caption}
      loading="lazy"
      onContextMenu={(event) => event.preventDefault()}
    />
    <div className="photo-cell-grain" />
    <div className={`photo-cell-frame ${isHighlighted ? "photo-cell-frame-visible" : ""}`}>
      {photo.frame}
    </div>
  </div>
);
