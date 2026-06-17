import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  BoardState,
  BoardElement,
  ThemeType,
  ElementType,
  ChartContent,
  TextContent,
  ImageContent,
  BoardStyle,
} from '../types';
import { BOARD_WIDTH_MM, BOARD_HEIGHT_MM } from '../utils/unitConversion';
import { themes } from '../components/theme/themes';

const getDefaultStyle = (theme: ThemeType): BoardStyle => {
  const colors = themes[theme].colors;
  return {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 0,
    fontFamily: themes[theme].fonts.body,
    titleColor: colors.accent,
    textColor: colors.text,
    accentColor: colors.accent,
  };
};

const generateSampleChartData = (): Array<{ x: number; y: number; group?: string }> => {
  return Array.from({ length: 10 }, (_, i) => ({
    x: i + 1,
    y: Math.round((Math.random() * 80 + 20) * 10) / 10,
  }));
};

const createSampleElements = (theme: ThemeType): BoardElement[] => {
  const colors = themes[theme].colors;
  return [
    {
      id: uuidv4(),
      type: 'text',
      x: 30,
      y: 30,
      width: 840,
      height: 120,
      content: {
        title: '研究背景与目的',
        content: '本研究旨在探索新型材料在极端条件下的物理特性，通过对比实验组与对照组的实验数据，揭示材料结构与性能之间的内在关联。研究采用最新的光谱分析技术，在纳米尺度上观测材料的相变过程。',
        fontSize: 18,
        fontWeight: 'normal',
      } as TextContent,
      style: {
        borderStyle: 'solid',
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: 'transparent',
        padding: 15,
      },
    },
    {
      id: uuidv4(),
      type: 'chart',
      x: 30,
      y: 170,
      width: 400,
      height: 280,
      content: {
        chartType: 'line',
        title: '温度-响应曲线',
        xLabel: '温度 (K)',
        yLabel: '响应强度',
        data: generateSampleChartData(),
      } as ChartContent,
      style: {
        borderStyle: 'solid',
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: colors.surface,
        padding: 15,
      },
    },
    {
      id: uuidv4(),
      type: 'chart',
      x: 450,
      y: 170,
      width: 420,
      height: 280,
      content: {
        chartType: 'bar',
        title: '各组数据对比',
        xLabel: '实验组',
        yLabel: '测量值',
        data: Array.from({ length: 6 }, (_, i) => ({
          x: i + 1,
          y: Math.round((Math.random() * 60 + 30) * 10) / 10,
        })),
      } as ChartContent,
      style: {
        borderStyle: 'solid',
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: colors.surface,
        padding: 15,
      },
    },
    {
      id: uuidv4(),
      type: 'image',
      x: 30,
      y: 470,
      width: 400,
      height: 300,
      content: {
        src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Scientific%20microscope%20image%20of%20nanomaterial%20structure%20with%20atomic%20lattice%20visualization&image_size=landscape_4_3',
        caption: '图1 实验组材料显微结构 (SEM × 50,000)',
        scale: 'cover',
      } as ImageContent,
      style: {
        borderStyle: 'solid',
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: 'transparent',
        padding: 10,
      },
    },
    {
      id: uuidv4(),
      type: 'image',
      x: 450,
      y: 470,
      width: 420,
      height: 300,
      content: {
        src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Control%20group%20sample%20comparison%20material%20science%20laboratory%20experiment&image_size=landscape_4_3',
        caption: '图2 对照组材料显微结构 (SEM × 50,000)',
        scale: 'cover',
      } as ImageContent,
      style: {
        borderStyle: 'solid',
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: 'transparent',
        padding: 10,
      },
    },
    {
      id: uuidv4(),
      type: 'text',
      x: 30,
      y: 790,
      width: 840,
      height: 150,
      content: {
        title: '实验结论',
        content: '1. 实验组材料在低温条件下表现出显著的超导特性，临界温度为89.2K\n2. 显微结构分析表明，晶粒细化是提升材料性能的关键因素\n3. 与对照组相比，实验组的响应强度提升了47.3%\n4. 实验结果与理论预测高度吻合，验证了模型的正确性',
        fontSize: 16,
        fontWeight: 'normal',
      } as TextContent,
      style: {
        borderStyle: 'dashed',
        borderColor: colors.accent,
        borderWidth: 2,
        backgroundColor: colors.surface,
        padding: 15,
      },
    },
    {
      id: uuidv4(),
      type: 'text',
      x: 30,
      y: 960,
      width: 840,
      height: 100,
      content: {
        title: '参考文献',
        content: '[1] Zhang, Y. et al. Nature Materials, 2024, 23(4): 456-463.\n[2] Li, M. & Wang, Q. Physical Review Letters, 2023, 131(12): 126602.',
        fontSize: 14,
        fontWeight: 'normal',
      } as TextContent,
      style: {
        borderStyle: 'none',
        borderColor: 'transparent',
        borderWidth: 0,
        backgroundColor: 'transparent',
        padding: 10,
      },
    },
  ];
};

const createInitialState = (): BoardState => {
  const theme: ThemeType = 'physics';
  return {
    id: uuidv4(),
    title: '新型超导材料的物理特性研究',
    theme,
    width: BOARD_WIDTH_MM,
    height: BOARD_HEIGHT_MM,
    elements: createSampleElements(theme),
    selectedElementId: null,
    zoom: 0.55,
    style: getDefaultStyle(theme),
  };
};

interface BoardStore extends BoardState {
  setTheme: (theme: ThemeType) => void;
  setTitle: (title: string) => void;
  setZoom: (zoom: number) => void;
  selectElement: (id: string | null) => void;
  addElement: (type: ElementType, x: number, y: number) => void;
  updateElement: (id: string, updates: Partial<BoardElement>) => void;
  updateElementContent: (id: string, content: Partial<ChartContent | TextContent | ImageContent>) => void;
  updateElementStyle: (id: string, style: Partial<BoardElement['style']>) => void;
  deleteElement: (id: string) => void;
  updateBoardStyle: (style: Partial<BoardStyle>) => void;
  resetLayout: () => void;
  syncToRenderServer: () => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  ...createInitialState(),

  setTheme: (theme) => {
    const colors = themes[theme].colors;
    set({
      theme,
      style: {
        ...get().style,
        backgroundColor: colors.background,
        borderColor: colors.border,
        titleColor: colors.accent,
        textColor: colors.text,
        accentColor: colors.accent,
      },
      elements: get().elements.map(el => ({
        ...el,
        style: {
          ...el.style,
          borderColor: el.style.borderColor !== 'transparent' ? colors.border : el.style.borderColor,
          backgroundColor: el.style.backgroundColor === 'transparent' ? 'transparent' : colors.surface,
        },
      })),
    });
    get().syncToRenderServer();
  },

  setTitle: (title) => {
    set({ title });
    get().syncToRenderServer();
  },

  setZoom: (zoom) => set({ zoom }),

  selectElement: (id) => set({ selectedElementId: id }),

  addElement: (type, x, y) => {
    const theme = get().theme;
    const colors = themes[theme].colors;
    
    const baseElement = {
      id: uuidv4(),
      type,
      x,
      y,
      width: 200,
      height: 150,
      style: {
        borderStyle: 'solid' as const,
        borderColor: colors.border,
        borderWidth: 1,
        backgroundColor: 'transparent',
        padding: 10,
      },
    };

    let content: ChartContent | TextContent | ImageContent;
    
    if (type === 'chart') {
      content = {
        chartType: 'line',
        title: '新图表',
        xLabel: 'X轴',
        yLabel: 'Y轴',
        data: generateSampleChartData(),
      } as ChartContent;
    } else if (type === 'text') {
      content = {
        title: '新文本块',
        content: '在此输入文字内容...',
        fontSize: 16,
        fontWeight: 'normal',
      } as TextContent;
    } else {
      content = {
        src: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Scientific%20research%20diagram%20placeholder&image_size=square',
        caption: '图注',
        scale: 'cover',
      } as ImageContent;
    }

    const newElement: BoardElement = { ...baseElement, content };
    
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id,
    }));
    
    get().syncToRenderServer();
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
    get().syncToRenderServer();
  },

  updateElementContent: (id, content) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, content: { ...el.content, ...content } } : el
      ),
    }));
    get().syncToRenderServer();
  },

  updateElementStyle: (id, style) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, style: { ...el.style, ...style } } : el
      ),
    }));
    get().syncToRenderServer();
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
    get().syncToRenderServer();
  },

  updateBoardStyle: (style) => {
    set((state) => ({
      style: { ...state.style, ...style },
    }));
    get().syncToRenderServer();
  },

  resetLayout: () => {
    set(createInitialState());
    get().syncToRenderServer();
  },

  syncToRenderServer: async () => {
    const state = get();
    try {
      await fetch('http://localhost:8839/api/render/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
    } catch (e) {
      console.warn('Sync to render server failed:', e);
    }
  },
}));
