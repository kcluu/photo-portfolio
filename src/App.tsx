import { useMemo, useState } from "react";
import type { ReactNode } from "react";
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
import { useImagePreload } from "./hooks/useImagePreload";
import { usePhotos } from "./hooks/usePhotos";
import { CATEGORY_LABELS, FILM_STOCK_LABELS } from "./data/photos";
import { shuffle } from "./utils/shuffle";
import type { Category, CategoryFilter, Photo } from "./types";
import "./App.css";

const ACCENT_COLOR = "#e2b33c";
const GRID_GAP = 3;
const CATEGORIES: CategoryFilter[] = ["all", "live", "portrait", "postcard", "editorial"];

const MODAL_CONTENT: Record<string, { title: string; body: ReactNode[] }> = {
  About: {
    title: "About",
    body: [
      <>
        Katelyn Luu is a NYC-based photographer shooting concert, portrait, scenic, and editorial work on{" "}
        <em>(mostly)</em> film.
      </>,
    ],
  },
  Contact: {
    title: "Contact",
    body: [
      "For all inquiries: katelynluuphoto@gmail.com",
      <a href="https://www.instagram.com/katelyn35mm" target="_blank" rel="noopener noreferrer">
        @katelyn35mm
      </a>,
    ],
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

  const { photos: allPhotos, isLoading, error } = usePhotos();

  // Shuffled once per fetch (not on every render) for the "All" tab
  const allPhotosShuffled = useMemo(() => shuffle(allPhotos), [allPhotos]);

  const photosByCategory = useMemo(() => {
    const grouped: Record<Category, Photo[]> = { live: [], portrait: [], postcard: [], editorial: [] };
    for (const photo of allPhotos) grouped[photo.category].push(photo);
    return grouped;
  }, [allPhotos]);

  // "All" shows every photo in one fixed random order; each category tab
  // shows that folder's full set, filename-sorted. Either way the grid
  // targets 3 rows of square cells and scrolls vertically for the rest.
  const photos = activeCategory === "all" ? allPhotosShuffled : photosByCategory[activeCategory];

  const { columns, rowHeight } = useContactSheetLayout(sheetSize.width, sheetSize.height, GRID_GAP);

  const lightbox = useLightbox();
  const photoSrcs = useMemo(() => allPhotos.map((photo) => photo.src), [allPhotos]);
  const imagesLoaded = useImagePreload(photoSrcs);
  // Skip waiting on preload if the fetch itself failed — nothing to load
  const imagesReady = error !== null || (!isLoading && imagesLoaded);

  const handleSelectCategory = (category: CategoryFilter) => {
    setActiveCategory(category);
    setHoveredIndex(null);
    lightbox.reset();
  };

  const hoveredPhoto = hoveredIndex !== null ? photos[hoveredIndex] : null;
  const selectedPhoto = lightbox.selectedIndex !== null ? photos[lightbox.selectedIndex] : null;

  return (
    <div className={`stage ${lightsOn ? "stage-lights-on" : ""}`} ref={stageRef} onMouseMove={onMouseMove}>
      <LoadingScreen accentColor={ACCENT_COLOR} imagesReady={imagesReady} />

      <TopBar
        siteName="(Katelyn Luu)"
        lightsOn={lightsOn}
        onToggleLights={() => setLightsOn((prev) => !prev)}
        categories={CATEGORIES}
        categoryLabels={CATEGORY_LABELS}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        activeLink={activeLink}
        onOpenLink={setActiveLink}
      />

      {error && imagesReady && <div className="stage-error">Couldn't load photos — {error}</div>}

      <ContactSheet
        containerRef={sheetRef}
        photos={photos}
        columns={columns}
        rowHeight={rowHeight}
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
        boundsWidth={stageSize.width}
        boundsHeight={stageSize.height}
      />

      <Lightbox photo={selectedPhoto} isOpen={lightbox.isOpen} onClose={lightbox.close} />

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
