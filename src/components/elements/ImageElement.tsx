import React from 'react';
import type { ImageContent, ThemeType } from '../../types';
import { getThemeColors } from '../theme/themes';

interface ImageElementProps {
  content: ImageContent;
  width: number;
  height: number;
  theme: ThemeType;
  isEditing?: boolean;
  onUpdate?: (content: Partial<ImageContent>) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({
  content,
  width,
  height,
  theme,
  isEditing = false,
  onUpdate,
}) => {
  const colors = getThemeColors(theme);
  const scale = 1;

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate?.({ caption: e.target.value });
  };

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate?.({ src: e.target.value });
  };

  if (isEditing && onUpdate) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          color: colors.text,
        }}
      >
        <input
          type="text"
          value={content.src}
          onChange={handleSrcChange}
          placeholder="图片URL"
          style={{
            width: '100%',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: `${10 * scale}px`,
            color: colors.text,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            padding: '4px 6px',
            outline: 'none',
          }}
        />
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            background: colors.surface,
            borderRadius: 2,
          }}
        >
          <img
            src={content.src}
            alt={content.caption}
            style={{
              width: '100%',
              height: '100%',
              objectFit: content.scale,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RlZGVkZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+5Zu+54mH5Liq5pWw5o2u5LiH6LWb5Y+WPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>
        <input
          type="text"
          value={content.caption}
          onChange={handleCaptionChange}
          placeholder="图注"
          style={{
            width: '100%',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: `${11 * scale}px`,
            color: colors.text,
            background: 'transparent',
            border: 'none',
            borderBottom: `1px dashed ${colors.border}`,
            textAlign: 'center',
            padding: '2px 0',
            outline: 'none',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: colors.text,
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          background: colors.surface,
          borderRadius: 2,
        }}
      >
        <img
          src={content.src}
          alt={content.caption}
          style={{
            width: '100%',
            height: '100%',
            objectFit: content.scale,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RlZGVkZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+5Zu+54mH5Liq5pWw5o2u5LiH6LWb5Y+WPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
      </div>
      {content.caption && (
        <div
          style={{
            fontSize: `${11 * scale}px`,
            textAlign: 'center',
            paddingTop: 6,
            color: colors.text,
            opacity: 0.85,
            fontFamily: "'Noto Sans SC', sans-serif",
            flexShrink: 0,
          }}
        >
          {content.caption}
        </div>
      )}
    </div>
  );
};
