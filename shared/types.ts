export type ThemeType = 'physics' | 'biology';

export type ElementType = 'chart' | 'text' | 'image';

export type ChartType = 'bar' | 'line' | 'scatter';

export type BorderStyle = 'solid' | 'dashed' | 'none';

export type FontWeight = 'normal' | 'bold';

export type ImageScale = 'cover' | 'contain';

export interface BoardStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fontFamily: string;
  titleColor: string;
  textColor: string;
  accentColor: string;
}

export interface ChartContent {
  chartType: ChartType;
  title: string;
  xLabel: string;
  yLabel: string;
  data: Array<{ x: number; y: number; group?: string }>;
}

export interface TextContent {
  title: string;
  content: string;
  fontSize: number;
  fontWeight: FontWeight;
}

export interface ImageContent {
  src: string;
  caption: string;
  scale: ImageScale;
}

export interface BoardElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: ChartContent | TextContent | ImageContent;
  style: {
    borderStyle: BorderStyle;
    borderColor: string;
    borderWidth: number;
    backgroundColor: string;
    padding: number;
  };
}

export interface BoardState {
  id: string;
  title: string;
  theme: ThemeType;
  width: number;
  height: number;
  elements: BoardElement[];
  selectedElementId: string | null;
  zoom: number;
  style: BoardStyle;
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    background: string;
    surface: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    grid: string;
  };
  fonts: {
    title: string;
    body: string;
    data: string;
  };
}
