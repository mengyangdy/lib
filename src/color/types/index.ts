export type ColorPaletteNumber =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

export type ColorPalette = {
  hex: string;
  number: ColorPaletteNumber;
};

export type ColorPaletteFamily = {
  name: string;
  palettes: ColorPalette[];
};

export type ColorPaletteWithDelta = ColorPalette & {
  delta: number;
};

export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestLightnessPalette: ColorPaletteWithDelta;
  nearestPalette: ColorPaletteWithDelta;
};

export type ColorPaletteMatch = ColorPaletteFamily & {
  colorMap: Map<ColorPaletteNumber, ColorPalette>;
  main: ColorPalette;
  match: ColorPalette;
};

export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
