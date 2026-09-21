import type { Photo } from "../../types";
import "./Lightbox.css";

interface LightboxProps {
  photo: Photo | null;
  isOpen: boolean;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Lightbox = ({ photo, isOpen, totalCount, onClose, onNext, onPrevious }: LightboxProps) => (
  <>
    <div
      className="lightbox-scrim"
      style={{ opacity: isOpen ? 0.86 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      onClick={onClose}
    />

    <div
      className={`lightbox-box ${isOpen ? "lightbox-box-visible" : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      {photo && (
        <img
          className="lightbox-image"
          src={photo.src}
          alt={photo.caption}
          onContextMenu={(event) => event.preventDefault()}
        />
      )}

      <div className="lightbox-caption">
        <div className="lightbox-meta">
          FRAME {photo?.frame}
        </div>
        <div className="lightbox-title">{photo?.caption}</div>
        {photo?.location && <div className="lightbox-location">{photo.location}</div>}
      </div>

      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  </>
);
