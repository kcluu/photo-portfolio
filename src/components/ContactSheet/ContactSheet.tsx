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
  lightsOn: boolean;
  filmStockLabel: string;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
  onSelect: (index: number) => void;
  onGridEnter: () => void;
  onGridLeave: () => void;
}

export const ContactSheet = ({
  containerRef,
  photos,
  spans,
  columns,
  rows,
  gap,
  hoveredIndex,
  lightsOn,
  filmStockLabel,
  onHoverStart,
  onHoverEnd,
  onSelect,
  onGridEnter,
  onGridLeave,
}: ContactSheetProps) => (
  <>
    <div className="contact-sheet-sprocket contact-sheet-sprocket-top" />

    <div className="contact-sheet" ref={containerRef} onMouseEnter={onGridEnter} onMouseLeave={onGridLeave}>
      <div
        className={`contact-sheet-grid ${lightsOn ? "contact-sheet-grid-lit" : ""}`}
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
            isDimmed={!lightsOn && hoveredIndex !== null && hoveredIndex !== index}
            isHighlighted={hoveredIndex === index}
            onHoverStart={() => onHoverStart(index)}
            onHoverEnd={onHoverEnd}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>

    <div className="contact-sheet-sprocket contact-sheet-sprocket-bottom" />

    <div className="contact-sheet-slate">
      ROLL 04 — {filmStockLabel} — {photos.length} EXPOSURES — PLACEHOLDER IMAGES
    </div>
  </>
);
