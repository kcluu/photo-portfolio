import { useMemo } from "react";
import type { CellRect } from "../types";

const TARGET_ASPECT = 4 / 3;
const MIN_COLUMNS = 3;
const MAX_COLUMNS = 14;

interface GridShape {
  columns: number;
  rows: number;
}

interface ContactSheetLayout {
  columns: number;
  rows: number;
  // How many grid columns each cell should span, in item order
  spans: number[];
  // The pixel position/size each cell would occupy, in item order
  rects: CellRect[];
}

// Picks the column/row count whose cells land closest to a 4:3 ratio
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

const computeSpans = (count: number, columns: number): number[] => {
  const spans = Array<number>(count).fill(1);
  const fullRows = Math.floor(count / columns);
  const remainder = count - fullRows * columns;

  if (remainder > 0) {
    const baseSpan = Math.floor(columns / remainder);
    const extraSpan = columns % remainder;

    for (let slot = 0; slot < remainder; slot++) {
      const span = baseSpan + (slot < extraSpan ? 1 : 0);
      spans[fullRows * columns + slot] = span;
    }
  }

  return spans;
};

const computeRects = (
  spans: number[],
  columns: number,
  columnWidth: number,
  rowHeight: number,
  gap: number,
  topOffset: number,
): CellRect[] => {
  const rects: CellRect[] = [];
  let columnCursor = 0;
  let rowCursor = 0;

  for (const span of spans) {
    rects.push({
      left: columnCursor * (columnWidth + gap),
      top: topOffset + rowCursor * (rowHeight + gap),
      width: span * columnWidth + (span - 1) * gap,
      height: rowHeight,
    });

    columnCursor += span;
    if (columnCursor >= columns) {
      columnCursor = 0;
      rowCursor += 1;
    }
  }

  return rects;
};

export const useContactSheetLayout = (
  count: number,
  width: number,
  height: number,
  gap: number,
  topOffset: number,
): ContactSheetLayout =>
  useMemo(() => {
    const safeCount = Math.max(1, count);

    if (width === 0 || height === 0) {
      return { columns: safeCount, rows: 1, spans: Array(count).fill(1), rects: [] };
    }

    const { columns, rows } = chooseGridShape(safeCount, width, height, gap);
    const columnWidth = (width - (columns - 1) * gap) / columns;
    const rowHeight = (height - (rows - 1) * gap) / rows;
    const spans = computeSpans(count, columns);
    const rects = computeRects(spans, columns, columnWidth, rowHeight, gap, topOffset);

    return { columns, rows, spans, rects };
  }, [count, width, height, gap, topOffset]);
