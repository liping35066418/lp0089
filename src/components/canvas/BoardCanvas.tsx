import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { BoardElementComponent } from './BoardElement';
import { Ruler } from './Ruler';
import { useBoardStore } from '../../store/useBoardStore';
import {
  mmToPx,
  pxToMm,
  snapToGrid as snapToGridFn,
  BOARD_WIDTH_MM,
  BOARD_HEIGHT_MM,
} from '../../utils/unitConversion';
import { getThemeColors, applyTheme } from '../theme/themes';
import type { BoardElement, ElementType } from '../../types';

const GRID_SIZE_MM = 5;

export const BoardCanvas: React.FC = () => {
  const {
    elements,
    theme,
    zoom,
    selectedElementId,
    style,
    title,
    selectElement,
    updateElement,
    deleteElement,
    addElement,
    syncToRenderServer,
    setViewportSize,
    needCenter,
    clearNeedCenter,
  } = useBoardStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeElementType, setActiveElementType] = useState<ElementType | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  const colors = getThemeColors(theme);

  useEffect(() => {
    applyTheme(theme);
    const timer = setTimeout(() => {
      syncToRenderServer();
    }, 100);
    return () => clearTimeout(timer);
  }, [theme, syncToRenderServer]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setViewportSize(rect.width, rect.height);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [setViewportSize]);

  useEffect(() => {
    if (!needCenter) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const boardTotalW = boardWidthPx + 28 + 28;
    const boardTotalH = boardHeightPx + 28 + 28;
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const targetScrollLeft = Math.max(0, (boardTotalW - cw) / 2);
    const targetScrollTop = Math.max(0, (boardTotalH - ch) / 2);

    requestAnimationFrame(() => {
      container.scrollTo({ left: targetScrollLeft, top: targetScrollTop, behavior: 'smooth' });
      clearNeedCenter();
    });
  }, [needCenter, boardWidthPx, boardHeightPx, clearNeedCenter]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
      distance: 5,
    },
  }),
    useSensor(KeyboardSensor)
  );

  const gridSizePx = useMemo(() => {
    const gridPx = mmToPx(GRID_SIZE_MM) * zoom;
    return [gridPx, gridPx] as [number, number];
  }, [zoom]);

  const boardWidthPx = mmToPx(BOARD_WIDTH_MM) * zoom;
  const boardHeightPx = mmToPx(BOARD_HEIGHT_MM) * zoom;

  const gridPattern = useMemo(() => {
    const size = mmToPx(GRID_SIZE_MM) * zoom;
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${colors.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)
          `,
          backgroundSize: `${size}px ${size}px, ${size}px ${size}px`,
          pointerEvents: 'none',
          opacity: showGrid ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
    );
  }, [zoom, colors.grid, showGrid]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const data = active.data.current;
    if (data?.type === 'component') {
      setActiveElementType(data.elementType as ElementType);
    } else {
      setActiveElementType(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveElementType(null);

    if (!over) return;

    const activeData = active.data.current;

    if (activeData?.type === 'component') {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const dropX = event.activatorEvent.clientX - canvasRect.left;
      const dropY = event.activatorEvent.clientY - canvasRect.top;

      const xMm = snapToGridFn(pxToMm(dropX / zoom), GRID_SIZE_MM);
      const yMm = snapToGridFn(pxToMm(dropY / zoom), GRID_SIZE_MM);

      addElement(activeData.elementType as ElementType, xMm, yMm);
    } else if (activeData?.type === 'element') {
      const { delta } = event;
      const element = activeData.element as BoardElement;

      const dxMm = snapToGridFn(pxToMm(delta.x / zoom), GRID_SIZE_MM);
      const dyMm = snapToGridFn(pxToMm(delta.y / zoom), GRID_SIZE_MM);

      const newX = Math.max(0, Math.min(BOARD_WIDTH_MM - element.width, element.x + dxMm));
      const newY = Math.max(0, Math.min(BOARD_HEIGHT_MM - element.height, element.y + dyMm));

      updateElement(active.id as string, { x: newX, y: newY });
    }
  };

  const handleCanvasClick = () => {
    selectElement(null);
  };

  const activeElement = elements.find((el) => el.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <div ref={scrollContainerRef} className="flex-1 overflow-auto bg-[#1a1a1a] p-4 relative">
        <div className="flex flex-col items-start">
          <div className="flex items-start">
            <div className="flex flex-col">
              <div className="h-7 w-7 bg-[#2a2a2a] border-b border-r border-[#444] flex-shrink-0" />
              <Ruler type="vertical" length={BOARD_HEIGHT_MM} zoom={zoom} />
            </div>
            <div className="flex flex-col">
              <Ruler type="horizontal" length={BOARD_WIDTH_MM} zoom={zoom} />
              <div
                ref={canvasRef}
                style={{
                  position: 'relative',
                  width: boardWidthPx,
                  height: boardHeightPx,
                  backgroundColor: style.backgroundColor,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  transition: 'background-color 0.3s',
                  cursor: 'default',
                }}
                onClick={handleCanvasClick}
              >
                {gridPattern}

                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: `${16 * zoom}px`,
                    backgroundColor: colors.accent,
                    color: 'white',
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: `${24 * zoom}px`,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: `${70 * zoom}px`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  {elements.map((element) => (
                    <BoardElementComponent
                      key={element.id}
                      element={element}
                      theme={theme}
                      zoom={zoom}
                      isSelected={selectedElementId === element.id}
                      gridSize={GRID_SIZE_MM}
                      onSelect={() => selectElement(element.id)}
                      onUpdate={(updates) => updateElement(element.id, updates)}
                      onDelete={() => deleteElement(element.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span>
            展板尺寸: {BOARD_WIDTH_MM} × {BOARD_HEIGHT_MM} mm
          </span>
          <span>|</span>
          <span>缩放: {(zoom * 100).toFixed(0)}%</span>
          <span>|</span>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showGrid ? '隐藏网格' : '显示网格'}
          </button>
          <span>|</span>
          <span>
            元素数量: {elements.length}
          </span>
        </div>
      </div>

      <DragOverlay>
        {activeId && activeElement && activeElementType === null && (
          <div
            style={{
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            <BoardElementComponent
              element={activeElement}
              theme={theme}
              zoom={zoom}
              isSelected={false}
              gridSize={GRID_SIZE_MM}
              onSelect={() => {}}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}
        {activeElementType && (
          <div
            style={{
              width: 100,
              height: 80,
              backgroundColor: colors.surface,
              border: `2px dashed ${colors.accent}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text,
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            {activeElementType === 'chart' ? '📊 图表' : activeElementType === 'text' ? '📝 文本' : '🖼️ 图片'}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
