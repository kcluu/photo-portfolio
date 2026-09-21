import type { CellRect, LightboxPhase, Photo } from "../../types";
import "./Lightbox.css";

interface LightboxProps {
  photo: Photo | null;
  originRect: CellRect | null;
  targetRect: CellRect;
  phase: LightboxPhase;
  skipTransition: boolean;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const EMPTY_RECT: CellRect = { left: 0, top: 0, width: 0, height: 0 };

export const Lightbox = ({
  photo,
  originRect,
  targetRect,
  phase,
  skipTransition,
  totalCount,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) => {
  const isOpen = photo !== null;
  const isExpanded = phase === "expanded";
  const shownRect = phase === "expanded" ? targetRect : originRect ?? EMPTY_RECT;

  return (
    <>
      <div
        className="lightbox-scrim"
        style={{ opacity: isOpen ? 0.86 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onClose}
      />

      <div
        className={`lightbox-box ${skipTransition ? "lightbox-box-no-transition" : ""}`}
        style={{
          left: shownRect.left,
          top: shownRect.top,
          width: shownRect.width,
          height: shownRect.height,
          pointerEvents: isOpen ? "auto" : "none",
          boxShadow: isExpanded ? "0 30px 80px rgba(0, 0, 0, 0.6)" : "none",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {photo && <img className="lightbox-image" src={photo.src} alt={photo.caption} />}

        <div className={`lightbox-caption ${isExpanded ? "lightbox-caption-visible" : ""}`}>
          <div className="lightbox-meta">
            FRAME {photo?.frame} / {totalCount}
          </div>
          <div className="lightbox-title">{photo?.caption}</div>
          {photo?.location && <div className="lightbox-location">{photo.location}</div>}
        </div>

        <button
          type="button"
          className={`lightbox-close ${isExpanded ? "lightbox-control-visible" : ""}`}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <button
          type="button"
          className={`lightbox-nav lightbox-nav-prev ${isExpanded ? "lightbox-control-visible" : ""}`}
          onClick={onPrevious}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          type="button"
          className={`lightbox-nav lightbox-nav-next ${isExpanded ? "lightbox-control-visible" : ""}`}
          onClick={onNext}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </>
  );
};
