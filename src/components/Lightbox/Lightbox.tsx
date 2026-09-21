import type { Photo } from "../../types";
import "./Lightbox.css";

interface LightboxProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox = ({ photo, isOpen, onClose }: LightboxProps) => (
  <>
    <div
      className="lightbox-scrim"
      style={{ opacity: isOpen ? 0.86 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      onClick={onClose}
    />

    <div
      className={`lightbox-content ${isOpen ? "lightbox-content-visible" : ""}`}
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
        <span className="lightbox-meta">FRAME {photo?.frame}</span>
        <span className="lightbox-title">{photo?.caption}</span>
        {photo?.location && <span className="lightbox-location">{photo.location}</span>}
      </div>
    </div>

    <button
      type="button"
      className={`lightbox-close ${isOpen ? "lightbox-close-visible" : ""}`}
      onClick={onClose}
      aria-label="Close"
    >
      ×
    </button>
  </>
);
