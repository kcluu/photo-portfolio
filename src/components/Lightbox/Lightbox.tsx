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
        className="lightbox__scrim"
        style={{ opacity: isOpen ? 0.86 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={onClose}
      />

      <div
        className={`lightbox__box ${skipTransition ? "lightbox__box--no-transition" : ""}`}
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
        {photo && (
          <div
            className="lightbox__image"
            style={{ background: `linear-gradient(160deg, ${photo.colorFrom}, ${photo.colorTo})` }}
          />
        )}

        <div className={`lightbox__caption ${isExpanded ? "lightbox__caption--visible" : ""}`}>
          <div className="lightbox__meta">
            FRAME {photo?.frame} / {totalCount} — PLACEHOLDER IMAGE
          </div>
          <div className="lightbox__title">{photo?.caption}</div>
        </div>

        <button
          type="button"
          className={`lightbox__close ${isExpanded ? "lightbox__control--visible" : ""}`}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <button
          type="button"
          className={`lightbox__nav lightbox__nav--prev ${isExpanded ? "lightbox__control--visible" : ""}`}
          onClick={onPrevious}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          type="button"
          className={`lightbox__nav lightbox__nav--next ${isExpanded ? "lightbox__control--visible" : ""}`}
          onClick={onNext}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </>
  );
};
