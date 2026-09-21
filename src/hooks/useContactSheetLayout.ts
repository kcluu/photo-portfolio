import { useMemo } from "react";

const TARGET_ASPECT = 1;
const MIN_COLUMNS = 3;
const MAX_COLUMNS = 14;
const TARGET_ROWS = 3;

interface ContactSheetLayout {
  columns: number;
  rowHeight: number;
}

// Picks the column count whose cells land closest to square against a row
// height of `height / rows`, independent of how many photos there are
const chooseColumnsForRows = (rows: number, width: number, height: number, gap: number): number => {
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

export const useContactSheetLayout = (width: number, height: number, gap: number): ContactSheetLayout =>
  useMemo(() => {
    if (width === 0 || height === 0) {
      return { columns: MIN_COLUMNS, rowHeight: 0 };
    }

    const columns = chooseColumnsForRows(TARGET_ROWS, width, height, gap);
    const rowHeight = (height - (TARGET_ROWS - 1) * gap) / TARGET_ROWS;

    return { columns, rowHeight };
  }, [width, height, gap]);
