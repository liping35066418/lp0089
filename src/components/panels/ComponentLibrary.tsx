import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BarChart3, FileText, Image } from 'lucide-react';
import type { ElementType, ThemeType } from '../../types';
import { getThemeColors } from '../theme/themes';

interface DraggableComponentProps {
  type: ElementType;
  label: string;
  description: string;
  icon: React.ReactNode;
  theme: ThemeType;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  label,
  description,
  icon,
  theme,
}) => {
  const colors = getThemeColors(theme);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `component-${type}`,
    data: {
      type: 'component',
      elementType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '12px 14px',
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        userSelect: 'none',
      }}
      className="hover:shadow-md"
    >
      <div
        style={{
          width: 36,
          height: 36,
          backgroundColor: colors.accent + '20',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: colors.text,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: colors.textSecondary,
            fontSize: 11,
            opacity: 0.8,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

interface ComponentLibraryProps {
  theme: ThemeType;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ theme }) => {
  const colors = getThemeColors(theme);

  const components: Array<{
    type: ElementType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'chart',
      label: '实验数据图表',
      description: '折线图、柱状图、散点图',
      icon: <BarChart3 size={18} />,
    },
    {
      type: 'text',
      label: '文字结论',
      description: '标题、段落、列表文本',
      icon: <FileText size={18} />,
    },
    {
      type: 'image',
      label: '实验组图片',
      description: '实验照片、显微图像',
      icon: <Image size={18} />,
    },
  ];

  return (
    <div
      style={{
        width: 260,
        backgroundColor: '#1f1f1f',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '16px 18px',
          borderBottom: '1px solid #333',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            margin: 0,
            fontFamily: "'Noto Serif SC', serif",
            letterSpacing: 0.5,
          }}
        >
          组件库
        </h2>
        <p
          style={{
            color: '#888',
            fontSize: 11,
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          拖拽组件到画布添加
        </p>
      </div>

      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {components.map((comp) => (
          <DraggableComponent
            key={comp.type}
            type={comp.type}
            label={comp.label}
            description={comp.description}
            icon={comp.icon}
            theme={theme}
          />
        ))}
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #333',
          backgroundColor: '#1a1a1a',
        }}
      >
        <div
          style={{
            color: '#666',
            fontSize: 10,
            lineHeight: 1.5,
          }}
        >
          <div style={{ marginBottom: 4 }}>💡 操作提示:</div>
          <div>• 拖拽组件到画布添加</div>
          <div>• 点击选中后可调整大小</div>
          <div>• 双击文字/图片可编辑内容</div>
          <div>• Delete 键删除选中元素</div>
        </div>
      </div>
    </div>
  );
};
