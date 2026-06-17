import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight, Palette, Type, Square } from 'lucide-react';
import { useBoardStore } from '../../store/useBoardStore';
import type { BoardElement, BorderStyle, FontWeight, ChartType, ImageScale } from '../../types';
import { getThemeColors } from '../theme/themes';

interface PropertyPanelProps {
  theme: 'physics' | 'biology';
}

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
  accentColor: string;
}> = ({ label, value, onChange, accentColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    <label style={{ flex: 1, color: '#ccc', fontSize: 12 }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 28,
          height: 24,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 70,
          padding: '4px 6px',
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          background: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: 2,
          color: '#fff',
          outline: 'none',
        }}
      />
    </div>
  </div>
);

const SelectInput: React.FC<{
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    <label style={{ flex: 1, color: '#ccc', fontSize: 12 }}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '4px 8px',
        fontSize: 11,
        background: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: 2,
        color: '#fff',
        outline: 'none',
        minWidth: 100,
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const NumberInput: React.FC<{
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}> = ({ label, value, min = 0, max = 1000, step = 1, unit = '', onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    <label style={{ flex: 1, color: '#ccc', fontSize: 12 }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: 60,
          padding: '4px 6px',
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          background: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: 2,
          color: '#fff',
          outline: 'none',
          textAlign: 'right',
        }}
      />
      {unit && <span style={{ color: '#888', fontSize: 11, minWidth: 20 }}>{unit}</span>}
    </div>
  </div>
);

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accentColor: string;
}> = ({ title, icon, defaultOpen = true, children, accentColor }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          backgroundColor: '#252525',
          border: '1px solid #333',
          borderRadius: 3,
          cursor: 'pointer',
          marginBottom: isOpen ? 8 : 0,
        }}
      >
        <div style={{ color: accentColor, display: 'flex' }}>{icon}</div>
        <span
          style={{
            flex: 1,
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <div style={{ color: '#888', display: 'flex' }}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderTop: 'none',
            borderRadius: '0 0 3px 3px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ theme }) => {
  const {
    selectedElementId,
    elements,
    updateElement,
    updateElementStyle,
    deleteElement,
    style: boardStyle,
    updateBoardStyle,
  } = useBoardStore();

  const colors = getThemeColors(theme);
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleElementStyleChange = (key: keyof BoardElement['style'], value: any) => {
    if (selectedElementId) {
      updateElementStyle(selectedElementId, { [key]: value });
    }
  };

  const handleContentChange = (key: string, value: any) => {
    if (selectedElementId) {
      updateElement(selectedElementId, {
        content: { ...selectedElement!.content, [key]: value },
      } as Partial<BoardElement>);
    }
  };

  if (!selectedElement) {
    return (
      <div
        style={{
          width: 300,
          backgroundColor: '#1f1f1f',
          borderLeft: '1px solid #333',
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
            属性面板
          </h2>
        </div>

        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <Section title="展板样式" icon={<Palette size={14} />} accentColor={colors.accent}>
            <ColorInput
              label="背景颜色"
              value={boardStyle.backgroundColor}
              onChange={(c) => updateBoardStyle({ backgroundColor: c })}
              accentColor={colors.accent}
            />
            <ColorInput
              label="标题颜色"
              value={boardStyle.titleColor}
              onChange={(c) => updateBoardStyle({ titleColor: c })}
              accentColor={colors.accent}
            />
            <ColorInput
              label="文字颜色"
              value={boardStyle.textColor}
              onChange={(c) => updateBoardStyle({ textColor: c })}
              accentColor={colors.accent}
            />
            <ColorInput
              label="强调颜色"
              value={boardStyle.accentColor}
              onChange={(c) => updateBoardStyle({ accentColor: c })}
              accentColor={colors.accent}
            />
          </Section>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 120,
              color: '#666',
              fontSize: 12,
              textAlign: 'center',
              padding: '20px',
            }}
          >
            选择画布元素以编辑其属性
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 300,
        backgroundColor: '#1f1f1f',
        borderLeft: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '16px 18px',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
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
            属性面板
          </h2>
          <p
            style={{
              color: '#888',
              fontSize: 11,
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            {selectedElement.type === 'chart'
              ? '图表元素'
              : selectedElement.type === 'text'
                ? '文本元素'
                : '图片元素'}
          </p>
        </div>
        <button
          onClick={() => deleteElement(selectedElement.id)}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: 3,
            color: '#ff6b6b',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="hover:bg-red-500/20"
          title="删除元素"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
        <Section title="位置与大小" icon={<Square size={14} />} accentColor={colors.accent}>
          <NumberInput
            label="X 坐标"
            value={selectedElement.x}
            unit="mm"
            onChange={(v) => updateElement(selectedElement.id, { x: v })}
          />
          <NumberInput
            label="Y 坐标"
            value={selectedElement.y}
            unit="mm"
            onChange={(v) => updateElement(selectedElement.id, { y: v })}
          />
          <NumberInput
            label="宽度"
            value={selectedElement.width}
            min={30}
            unit="mm"
            onChange={(v) => updateElement(selectedElement.id, { width: v })}
          />
          <NumberInput
            label="高度"
            value={selectedElement.height}
            min={30}
            unit="mm"
            onChange={(v) => updateElement(selectedElement.id, { height: v })}
          />
        </Section>

        {selectedElement.type === 'text' && (
          <Section title="文本内容" icon={<Type size={14} />} accentColor={colors.accent}>
            <NumberInput
              label="字体大小"
              value={(selectedElement.content as any).fontSize}
              min={8}
              max={72}
              unit="pt"
              onChange={(v) => handleContentChange('fontSize', v)}
            />
            <SelectInput
              label="字体粗细"
              value={(selectedElement.content as any).fontWeight}
              options={[
                { value: 'normal', label: '常规' },
                { value: 'bold', label: '粗体' },
              ]}
              onChange={(v) => handleContentChange('fontWeight', v as FontWeight)}
            />
          </Section>
        )}

        {selectedElement.type === 'chart' && (
          <Section title="图表类型" icon={<Palette size={14} />} accentColor={colors.accent}>
            <SelectInput
              label="图表类型"
              value={(selectedElement.content as any).chartType}
              options={[
                { value: 'line', label: '折线图' },
                { value: 'bar', label: '柱状图' },
                { value: 'scatter', label: '散点图' },
              ]}
              onChange={(v) => handleContentChange('chartType', v as ChartType)}
            />
          </Section>
        )}

        {selectedElement.type === 'image' && (
          <Section title="图片设置" icon={<Palette size={14} />} accentColor={colors.accent}>
            <SelectInput
              label="填充方式"
              value={(selectedElement.content as any).scale}
              options={[
                { value: 'cover', label: '覆盖填充' },
                { value: 'contain', label: '完整包含' },
              ]}
              onChange={(v) => handleContentChange('scale', v as ImageScale)}
            />
          </Section>
        )}

        <Section title="边框样式" icon={<Square size={14} />} accentColor={colors.accent}>
          <SelectInput
            label="边框类型"
            value={selectedElement.style.borderStyle}
            options={[
              { value: 'none', label: '无' },
              { value: 'solid', label: '实线' },
              { value: 'dashed', label: '虚线' },
            ]}
            onChange={(v) => handleElementStyleChange('borderStyle', v as BorderStyle)}
          />
          {selectedElement.style.borderStyle !== 'none' && (
            <>
              <NumberInput
                label="边框宽度"
                value={selectedElement.style.borderWidth}
                min={0}
                max={10}
                unit="px"
                onChange={(v) => handleElementStyleChange('borderWidth', v)}
              />
              <ColorInput
                label="边框颜色"
                value={selectedElement.style.borderColor}
                onChange={(c) => handleElementStyleChange('borderColor', c)}
                accentColor={colors.accent}
              />
            </>
          )}
          <ColorInput
            label="背景颜色"
            value={selectedElement.style.backgroundColor}
            onChange={(c) => handleElementStyleChange('backgroundColor', c)}
            accentColor={colors.accent}
          />
          <NumberInput
            label="内边距"
            value={selectedElement.style.padding}
            min={0}
            max={50}
            unit="mm"
            onChange={(v) => handleElementStyleChange('padding', v)}
          />
        </Section>
      </div>
    </div>
  );
};
