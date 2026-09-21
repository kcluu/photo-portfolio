import { useMemo, useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import { TopBar } from "./components/TopBar/TopBar";
import { ContactSheet } from "./components/ContactSheet/ContactSheet";
import { Lightbox } from "./components/Lightbox/Lightbox";
import { InfoModal } from "./components/InfoModal/InfoModal";
import { ViewfinderCursor } from "./components/ViewfinderCursor/ViewfinderCursor";
import { Tooltip } from "./components/Tooltip/Tooltip";
import { useElementSize } from "./hooks/useElementSize";
import { useRelativeMousePosition } from "./hooks/useRelativeMousePosition";
import { useContactSheetLayout } from "./hooks/useContactSheetLayout";
import { useLightbox } from "./hooks/useLightbox";
import { createPhotoPool, CATEGORY_LABELS, FILM_STOCK_LABELS } from "./data/photos";
import type { CategoryFilter } from "./types";
import "./App.css";

const ACCENT_COLOR = "#e2b33c";
const GRID_GAP = 3;
const GRID_TOP_OFFSET = 52;
const TOTAL_PHOTOS = 60;
const CATEGORIES: CategoryFilter[] = ["all", "concert", "portrait", "postcard", "editorial"];

const ALL_PHOTOS = createPhotoPool(TOTAL_PHOTOS);

const MODAL_CONTENT: Record<string, { title: string; body: string[] }> = {
  About: {
    title: "About",
    body: [
      "Katelyn Luu is a film photographer shooting concert, portrait, postcard, and editorial work on 35mm.",
      "This site is an ongoing contact sheet — new rolls are added as they're developed.",
    ],
  },
  Contact: {
    title: "Contact",
    body: ["For bookings and print inquiries:", "hello@katelynluu.com"],
  },
};

export const App = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightsOn, setLightsOn] = useState(false);
  const [isOverGrid, setIsOverGrid] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const { ref: stageRef, size: stageSize } = useElementSize<HTMLDivElement>();
  const { ref: sheetRef, size: sheetSize } = useElementSize<HTMLDivElement>();
  const { position: cursorPosition, onMouseMove } = useRelativeMousePosition({ x: 720, y: 450 });

  const photos = useMemo(
    () => (activeCategory === "all" ? ALL_PHOTOS : ALL_PHOTOS.filter((photo) => photo.category === activeCategory)),
    [activeCategory],
  );

  const { columns, rows, spans, rects } = useContactSheetLayout(
    photos.length,
    sheetSize.width,
    sheetSize.height,
    GRID_GAP,
    GRID_TOP_OFFSET,
  );

  const lightbox = useLightbox(photos.length);

  const targetRect = useMemo(() => {
    const width = Math.min(720, stageSize.width * 0.6 || 720);
    const height = width * 0.75;
    return {
      left: (stageSize.width - width) / 2,
      top: (stageSize.height - height) / 2,
      width,
      height,
    };
  }, [stageSize.width, stageSize.height]);

  const handleSelectCategory = (category: CategoryFilter) => {
    setActiveCategory(category);
    setHoveredIndex(null);
    lightbox.reset();
  };

  const hoveredPhoto = hoveredIndex !== null ? photos[hoveredIndex] : null;
  const selectedPhoto = lightbox.selectedIndex !== null ? photos[lightbox.selectedIndex] : null;
  const originRect = lightbox.selectedIndex !== null ? rects[lightbox.selectedIndex] ?? null : null;

  return (
    <div className={`stage ${lightsOn ? "stage-lights-on" : ""}`} ref={stageRef} onMouseMove={onMouseMove}>
      <LoadingScreen accentColor={ACCENT_COLOR} />

      <TopBar
        siteName="(Katelyn Luu)"
        lightsOn={lightsOn}
        onToggleLights={() => setLightsOn((prev) => !prev)}
        categories={CATEGORIES}
        categoryLabels={CATEGORY_LABELS}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenLink={setActiveLink}
      />

      <ContactSheet
        containerRef={sheetRef}
        photos={photos}
        spans={spans}
        columns={columns}
        rows={rows}
        gap={GRID_GAP}
        hoveredIndex={hoveredIndex}
        lightsOn={lightsOn}
        filmStockLabel={FILM_STOCK_LABELS[activeCategory]}
        onHoverStart={setHoveredIndex}
        onHoverEnd={() => setHoveredIndex(null)}
        onSelect={lightbox.open}
        onGridEnter={() => setIsOverGrid(true)}
        onGridLeave={() => setIsOverGrid(false)}
      />

      <Tooltip
        x={cursorPosition.x}
        y={cursorPosition.y}
        visible={hoveredPhoto !== null}
        text={hoveredPhoto ? `#${hoveredPhoto.frame} — ${hoveredPhoto.caption}` : ""}
        accentColor={ACCENT_COLOR}
      />

      <Lightbox
        photo={selectedPhoto}
        originRect={originRect}
        targetRect={targetRect}
        phase={lightbox.phase}
        skipTransition={lightbox.skipTransition}
        totalCount={photos.length}
        onClose={lightbox.close}
        onNext={lightbox.showNext}
        onPrevious={lightbox.showPrevious}
      />

      {(isOverGrid || selectedPhoto !== null) && (
        <ViewfinderCursor x={cursorPosition.x} y={cursorPosition.y} accentColor={ACCENT_COLOR} />
      )}

      <InfoModal
        title={activeLink ? MODAL_CONTENT[activeLink].title : ""}
        body={activeLink ? MODAL_CONTENT[activeLink].body : []}
        isOpen={activeLink !== null}
        onClose={() => setActiveLink(null)}
      />
    </div>
  );
};
