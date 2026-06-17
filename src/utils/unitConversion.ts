export const DPI = 96;
export const MM_PER_INCH = 25.4;

export const mmToPx = (mm: number, dpi: number = DPI): number => {
  return (mm / MM_PER_INCH) * dpi;
};

export const pxToMm = (px: number, dpi: number = DPI): number => {
  return (px * MM_PER_INCH) / dpi;
};

export const snapToGrid = (value: number, gridSize: number = 5): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const BOARD_WIDTH_MM = 900;
export const BOARD_HEIGHT_MM = 1200;

export const getBoardDimensions = (zoom: number = 1) => {
  const widthPx = mmToPx(BOARD_WIDTH_MM);
  const heightPx = mmToPx(BOARD_HEIGHT_MM);
  return {
    width: widthPx * zoom,
    height: heightPx * zoom,
    widthPx,
    heightPx,
  };
};
