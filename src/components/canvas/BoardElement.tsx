import React, { useRef, useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { BoardElement as BoardElementType, ThemeType } from '../../types';
import { RESIZE_HANDLES } from '../../types';
import { mmToPx, snapToGrid, clamp, BOARD_WIDTH_MM, BOARD_HEIGHT_MM } from '../../utils/unitConversion';
import { ChartElement } from '../elements/ChartElement';
import { TextElement } from '../elements/TextElement';
import { ImageElement } from '../elements/ImageElement';
import { getThemeColors } from '../theme/themes';

interface BoardElementProps {
  element: BoardElementType;
  theme: ThemeType;
  zoom: number;
  isSelected: boolean;
  gridSize: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<BoardElementType>) => void;
  onDelete: () => void;
}

export const BoardElementComponent: React.FC<BoardElementProps> = ({
  element,
  theme,
  zoom,
  isSelected,
  gridSize,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; el: BoardElementType } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const colors = getThemeColors(theme);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    disabled: isEditing || isResizing !== null,
    data: {
      type: 'element',
      element,
    },
  });

  const xPx = mmToPx(element.x) * zoom;
  const yPx = mmToPx(element.y) * zoom;
  const wPx = mmToPx(element.width) * zoom;
  const hPx = mmToPx(element.height) * zoom;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: xPx,
    top: yPx,
    width: wPx,
    height: hPx,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isSelected ? 10 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: element.style.backgroundColor || 'transparent',
    padding: element.style.padding * zoom,
    boxSizing: 'border-box',
    border:
      element.style.borderStyle !== 'none'
        ? `${element.style.borderWidth * zoom}px ${element.style.borderStyle} ${element.style.borderColor}`
        : 'none',
    overflow: 'hidden',
    transition: isDragging ? 'none' : 'box-shadow 0.2s',
    boxShadow: isSelected ? `0 0 0 2px ${colors.accent}, 0 0 0 4px ${colors.accent}40` : 'none',
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStart || !isResizing) return;

      const dx = (e.clientX - resizeStart.x) / zoom;
      const dy = (e.clientY - resizeStart.y) / zoom;
      const dxMm = (dx * 25.4) / 96;
      const dyMm = (dy * 25.4) / 96;

      let newX = resizeStart.el.x;
      let newY = resizeStart.el.y;
      let newWidth = resizeStart.el.width;
      let newHeight = resizeStart.el.height;

      if (isResizing.includes('e')) {
        newWidth = snapToGrid(Math.max(30, resizeStart.el.width + dxMm), gridSize);
      }
      if (isResizing.includes('w')) {
        const widthChange = snapToGrid(dxMm, gridSize);
        newWidth = Math.max(30, resizeStart.el.width - widthChange);
        if (newWidth >= 30) {
          newX = resizeStart.el.x + widthChange;
        }
      }
      if (isResizing.includes('s')) {
        newHeight = snapToGrid(Math.max(30, resizeStart.el.height + dyMm), gridSize);
      }
      if (isResizing.includes('n')) {
        const heightChange = snapToGrid(dyMm, gridSize);
        newHeight = Math.max(30, resizeStart.el.height - heightChange);
        if (newHeight >= 30) {
          newY = resizeStart.el.y + heightChange;
        }
      }

      newX = clamp(newX, 0, BOARD_WIDTH_MM - newWidth);
      newY = clamp(newY, 0, BOARD_HEIGHT_MM - newHeight);
      newWidth = Math.min(newWidth, BOARD_WIDTH_MM - newX);
      newHeight = Math.min(newHeight, BOARD_HEIGHT_MM - newY);

      onUpdate({ x: newX, y: newY, width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      setResizeStart(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, zoom, gridSize, onUpdate]);

  const handleResizeStart = (e: React.MouseEvent, position: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(position);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      el: { ...element },
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text' || element.type === 'image') {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!isEditing) {
        onDelete();
      }
    }
  };

  const handleContentUpdate = (content: Partial<any>) => {
    onUpdate({ content: { ...element.content, ...content } });
  };

  const renderContent = () => {
    const innerWidth = mmToPx(element.width) * zoom - element.style.padding * zoom * 2;
    const innerHeight = mmToPx(element.height) * zoom - element.style.padding * zoom * 2;

    if (element.type === 'chart') {
      return (
        <ChartElement
          content={element.content as any}
          width={innerWidth}
          height={innerHeight}
          theme={theme}
        />
      );
    }
    if (element.type === 'text') {
      return (
        <TextElement
          content={element.content as any}
          width={innerWidth}
          height={innerHeight}
          theme={theme}
          isEditing={isEditing}
          onUpdate={handleContentUpdate}
        />
      );
    }
    if (element.type === 'image') {
      return (
        <ImageElement
          content={element.content as any}
          width={innerWidth}
          height={innerHeight}
          theme={theme}
          isEditing={isEditing}
          onUpdate={handleContentUpdate}
        />
      );
    }
    return null;
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        elementRef.current = node;
      }}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
        if (!isEditing) {
          setIsEditing(false);
        }
      }}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      {...(!isEditing && !isResizing ? listeners : {})}
      {...attributes}
    >
      <div style={{ width: '100%', height: '100%' }}>{renderContent()}</div>

      {isSelected && !isEditing && (
        <>
          {RESIZE_HANDLES.map((handle) => (
            <div
              key={handle.position}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                backgroundColor: colors.accent,
                border: `2px solid ${colors.background}`,
                borderRadius: 1,
                cursor: handle.cursor,
                zIndex: 20,
                ...(handle.position.includes('n') && { top: -4 }),
                ...(handle.position.includes('s') && { bottom: -4 }),
                ...(handle.position.includes('w') && { left: -4 }),
                ...(handle.position.includes('e') && { right: -4 }),
                ...(handle.position === 'n' && { left: '50%', transform: 'translateX(-50%)' }),
                ...(handle.position === 's' && { left: '50%', transform: 'translateX(-50%)' }),
                ...(handle.position === 'w' && { top: '50%', transform: 'translateY(-50%)' }),
                ...(handle.position === 'e' && { top: '50%', transform: 'translateY(-50%)' }),
              }}
              onMouseDown={(e) => handleResizeStart(e, handle.position)}
            />
          ))}
        </>
      )}
    </div>
  );
};
