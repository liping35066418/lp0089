import React from 'react';
import { Atom, Leaf } from 'lucide-react';
import type { ThemeType } from '../../types';
import { themes } from './themes';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themeOptions: Array<{
    type: ThemeType;
    icon: React.ReactNode;
    label: string;
  }> = [
    {
      type: 'physics',
      icon: <Atom size={16} />,
      label: '物理主题',
    },
    {
      type: 'biology',
      icon: <Leaf size={16} />,
      label: '生物主题',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 mr-1">主题:</span>
      {themeOptions.map((opt) => {
        const isActive = currentTheme === opt.type;
        const colors = themes[opt.type].colors;
        return (
          <button
            key={opt.type}
            onClick={() => onThemeChange(opt.type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              backgroundColor: isActive ? colors.accent : '#2a2a2a',
              border: `1px solid ${isActive ? colors.accent : '#444'}`,
              borderRadius: 3,
              color: isActive ? '#fff' : '#ccc',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            className="hover:opacity-90"
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: colors.accent,
                flexShrink: 0,
              }}
            />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
