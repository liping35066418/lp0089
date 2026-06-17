import React from 'react';
import type { TextContent, ThemeType } from '../../types';
import { getThemeColors } from '../theme/themes';

interface TextElementProps {
  content: TextContent;
  width: number;
  height: number;
  theme: ThemeType;
  isEditing?: boolean;
  onUpdate?: (content: Partial<TextContent>) => void;
}

export const TextElement: React.FC<TextElementProps> = ({
  content,
  width,
  height,
  theme,
  isEditing = false,
  onUpdate,
}) => {
  const colors = getThemeColors(theme);
  const scale = 1;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate?.({ title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate?.({ content: e.target.value });
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
          value={content.title}
          onChange={handleTitleChange}
          style={{
            width: '100%',
            fontFamily: "'Noto Serif SC', serif",
            fontSize: `${content.fontSize * scale}px`,
            fontWeight: content.fontWeight,
            color: colors.accent,
            background: 'transparent',
            border: 'none',
            borderBottom: `1px dashed ${colors.border}`,
            outline: 'none',
            padding: '2px 0',
          }}
        />
        <textarea
          value={content.content}
          onChange={handleContentChange}
          style={{
            flex: 1,
            width: '100%',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: `${content.fontSize * 0.7 * scale}px`,
            lineHeight: 1.6,
            color: colors.text,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            whiteSpace: 'pre-wrap',
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
        overflow: 'hidden',
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 8,
          fontFamily: "'Noto Serif SC', serif",
          fontSize: `${content.fontSize * scale}px`,
          fontWeight: content.fontWeight,
          color: colors.accent,
          lineHeight: 1.3,
          flexShrink: 0,
        }}
      >
        {content.title}
      </h3>
      <div
        style={{
          flex: 1,
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: `${content.fontSize * 0.7 * scale}px`,
          lineHeight: 1.6,
          color: colors.text,
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {content.content}
      </div>
    </div>
  );
};
