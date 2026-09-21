import type { RefObject } from "react";
import type { Photo } from "../../types";
import { PhotoCell } from "../PhotoCell/PhotoCell";
import "./ContactSheet.css";

interface ContactSheetProps {
  containerRef: RefObject<HTMLDivElement>;
  photos: Photo[];
  spans: number[];
  columns: number;
  rows: number;
  gap: number;
  hoveredIndex: number | null;
  filmStockLabel: string;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
  onSelect: (index: number) => void;
}

export const ContactSheet = ({
  containerRef,
  photos,
  spans,
  columns,
  rows,
  gap,
  hoveredIndex,
  filmStockLabel,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: ContactSheetProps) => (
  <>
    <div className="contact-sheet__sprocket contact-sheet__sprocket--top" />

    <div className="contact-sheet" ref={containerRef}>
      <div
        className="contact-sheet__grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {photos.map((photo, index) => (
          <PhotoCell
            key={photo.id}
            photo={photo}
            columnSpan={spans[index] ?? 1}
            isDimmed={hoveredIndex !== null && hoveredIndex !== index}
            isHighlighted={hoveredIndex === index}
            onHoverStart={() => onHoverStart(index)}
            onHoverEnd={onHoverEnd}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>

    <div className="contact-sheet__sprocket contact-sheet__sprocket--bottom" />

    <div className="contact-sheet__slate">
      ROLL 04 — {filmStockLabel} — {photos.length} EXPOSURES — PLACEHOLDER IMAGES
    </div>
  </>
);
