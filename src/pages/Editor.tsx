import React, { useEffect } from 'react';
import { Toolbar } from '../components/panels/Toolbar';
import { ComponentLibrary } from '../components/panels/ComponentLibrary';
import { PropertyPanel } from '../components/panels/PropertyPanel';
import { BoardCanvas } from '../components/canvas/BoardCanvas';
import { useBoardStore } from '../store/useBoardStore';
import type { ThemeType } from '../types';

const Editor: React.FC = () => {
  const { theme, setTheme, syncToRenderServer } = useBoardStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      syncToRenderServer();
    }, 500);
    return () => clearTimeout(timer);
  }, [syncToRenderServer]);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#141414' }}
    >
      <Toolbar theme={theme} onThemeChange={handleThemeChange} />
      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary theme={theme} />
        <BoardCanvas />
        <PropertyPanel theme={theme} />
      </div>
    </div>
  );
};

export default Editor;
