import React, { useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, ExternalLink, RefreshCw } from 'lucide-react';
import { useBoardStore } from '../../store/useBoardStore';
import { ThemeSelector } from '../theme/ThemeSelector';
import type { ThemeType } from '../../types';

interface ToolbarProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ theme, onThemeChange }) => {
  const { zoom, setZoom, resetLayout, title, setTitle, syncToRenderServer } = useBoardStore();
  const [renderUrl, setRenderUrl] = useState('http://localhost:8839/render');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleZoomIn = () => {
    setZoom(Math.min(1.5, zoom + 0.1));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.2, zoom - 0.1));
  };

  const handleFitScreen = () => {
    setZoom(0.55);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncToRenderServer();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const openRenderWindow = () => {
    window.open(renderUrl, '_blank', 'width=1200,height=900');
  };

  return (
    <div
      style={{
        height: 52,
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: `linear-gradient(135deg, ${theme === 'physics' ? '#3B82F6' : '#22C55E'}, ${theme === 'physics' ? '#1E40AF' : '#15803D'})`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          学
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '2px 0',
              borderBottom: '1px solid transparent',
              fontFamily: "'Noto Serif SC', serif",
              transition: 'border-color 0.2s',
            }}
            className="focus:border-b-blue-500"
            placeholder="输入展板标题..."
          />
          <div
            style={{
              fontSize: 10,
              color: '#666',
              marginTop: 2,
            }}
          >
            学术展板可视化编辑器
          </div>
        </div>
      </div>

      <div className="h-8 w-px bg-gray-700" />

      <ThemeSelector currentTheme={theme} onThemeChange={onThemeChange} />

      <div className="h-8 w-px bg-gray-700" />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          backgroundColor: '#252525',
          padding: '4px',
          borderRadius: 4,
          border: '1px solid #333',
        }}
      >
        <button
          onClick={handleZoomOut}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'all 0.2s',
          }}
          className="hover:bg-gray-700 hover:text-white"
          title="缩小"
        >
          <ZoomOut size={14} />
        </button>
        <div
          style={{
            minWidth: 48,
            textAlign: 'center',
            fontSize: 11,
            color: '#fff',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '0 4px',
          }}
        >
          {(zoom * 100).toFixed(0)}%
        </div>
        <button
          onClick={handleZoomIn}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'all 0.2s',
          }}
          className="hover:bg-gray-700 hover:text-white"
          title="放大"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={handleFitScreen}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'all 0.2s',
          }}
          className="hover:bg-gray-700 hover:text-white"
          title="适应屏幕"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      <div className="h-8 w-px bg-gray-700" />

      <button
        onClick={handleSync}
        disabled={isSyncing}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: 3,
          color: isSyncing ? '#666' : '#ccc',
          fontSize: 12,
          cursor: isSyncing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
        className="hover:border-blue-500 hover:text-white disabled:opacity-50"
        title="同步到渲染服务器"
      >
        <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
        同步
      </button>

      <button
        onClick={openRenderWindow}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: 3,
          color: '#ccc',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        className="hover:border-green-500 hover:text-white"
        title="在新窗口打开渲染预览"
      >
        <ExternalLink size={12} />
        预览
      </button>

      <button
        onClick={resetLayout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: 3,
          color: '#ff6b6b',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        className="hover:border-red-500 hover:bg-red-500/10"
        title="重置布局"
      >
        <RotateCcw size={12} />
        重置
      </button>
    </div>
  );
};
