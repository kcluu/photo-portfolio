import { useMemo } from "react";
import type { CellRect } from "../types";

const TARGET_ASPECT = 1;
const MIN_COLUMNS = 3;
const MAX_COLUMNS = 14;

interface GridShape {
  columns: number;
  rows: number;
}

interface ContactSheetLayout {
  columns: number;
  rows: number;
  // The pixel position/size each cell would occupy, in item order
  rects: CellRect[];
}

// Picks the column/row count whose cells land closest to square
const chooseGridShape = (count: number, width: number, height: number, gap: number): GridShape => {
  let best: (GridShape & { aspectDiff: number }) | null = null;

  const maxColumns = Math.min(MAX_COLUMNS, count);
  const minColumns = Math.max(1, Math.min(MIN_COLUMNS, count));

  for (let columns = minColumns; columns <= Math.max(maxColumns, MIN_COLUMNS); columns++) {
    const rows = Math.ceil(count / columns);
    const columnWidth = (width - (columns - 1) * gap) / columns;
    const rowHeight = (height - (rows - 1) * gap) / rows;
    const aspectDiff = Math.abs(columnWidth / rowHeight - TARGET_ASPECT);

    if (best === null || aspectDiff < best.aspectDiff) {
      best = { columns, rows, aspectDiff };
    }
  }

  return best ?? { columns: minColumns, rows: count };
};

// Picks the column count whose cells land closest to square when the row
// count is fixed (e.g. "show exactly 3 rows"), independent of item count.
export const chooseColumnsForRows = (rows: number, width: number, height: number, gap: number): number => {
  if (width === 0 || height === 0 || rows <= 0) return MIN_COLUMNS;

  const rowHeight = (height - (rows - 1) * gap) / rows;
  let bestColumns = MIN_COLUMNS;
  let bestDiff = Infinity;

  for (let columns = MIN_COLUMNS; columns <= MAX_COLUMNS; columns++) {
    const columnWidth = (width - (columns - 1) * gap) / columns;
    const diff = Math.abs(columnWidth / rowHeight - TARGET_ASPECT);

    if (diff < bestDiff) {
      bestColumns = columns;
      bestDiff = diff;
    }
  }

  return bestColumns;
};

// Square cells all span a single column — stretching one across multiple
// columns (as the old last-row-fill logic did) would make it a rectangle.
const computeRects = (
  count: number,
  columns: number,
  columnWidth: number,
  rowHeight: number,
  gap: number,
  topOffset: number,
): CellRect[] =>
  Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      left: column * (columnWidth + gap),
      top: topOffset + row * (rowHeight + gap),
      width: columnWidth,
      height: rowHeight,
    };
  });

export const useContactSheetLayout = (
  count: number,
  width: number,
  height: number,
  gap: number,
  topOffset: number,
  // When set, the row count is fixed and columns are chosen to keep cells
  // square, instead of picking whichever columns/rows combo best fits `count`.
  fixedRows?: number,
): ContactSheetLayout =>
  useMemo(() => {
    const safeCount = Math.max(1, count);

    if (width === 0 || height === 0) {
      return { columns: safeCount, rows: fixedRows ?? 1, rects: [] };
    }

    const { columns, rows } = fixedRows
      ? { columns: chooseColumnsForRows(fixedRows, width, height, gap), rows: fixedRows }
      : chooseGridShape(safeCount, width, height, gap);
    const columnWidth = (width - (columns - 1) * gap) / columns;
    const rowHeight = (height - (rows - 1) * gap) / rows;
    const rects = computeRects(count, columns, columnWidth, rowHeight, gap, topOffset);

    return { columns, rows, rects };
  }, [count, width, height, gap, topOffset, fixedRows]);
