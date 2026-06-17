import React from 'react';
import type { ChartContent, ThemeType } from '../../types';
import { getThemeColors } from '../theme/themes';

interface ChartElementProps {
  content: ChartContent;
  width: number;
  height: number;
  theme: ThemeType;
  isPreview?: boolean;
}

export const ChartElement: React.FC<ChartElementProps> = ({
  content,
  width,
  height,
  theme,
  isPreview = false,
}) => {
  const colors = getThemeColors(theme);
  const scale = isPreview ? 1 : 1;
  const padding = 30 * scale;
  const titleHeight = 24 * scale;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2 - titleHeight - 30 * scale;

  if (content.data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.text,
          opacity: 0.5,
          fontSize: 12,
        }}
      >
        暂无数据
      </div>
    );
  }

  const xVals = content.data.map((d) => d.x);
  const yVals = content.data.map((d) => d.y);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals);
  const yMax = Math.max(...yVals);
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const toX = (x: number) => padding + ((x - xMin) / xRange) * chartW;
  const toY = (y: number) => padding + titleHeight + chartH - ((y - yMin) / yRange) * chartH;

  let chartContent = '';
  const dataPoints: string[] = [];

  if (content.chartType === 'bar') {
    const barWidth = Math.max(6, chartW / content.data.length * 0.6);
    content.data.forEach((d) => {
      const x = toX(d.x) - barWidth / 2;
      const y = toY(d.y);
      const h = padding + titleHeight + chartH - y;
      dataPoints.push(
        `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${colors.accent}" opacity="0.85"/>`
      );
    });
  } else if (content.chartType === 'line') {
    let pathD = '';
    content.data.forEach((d, i) => {
      const x = toX(d.x);
      const y = toY(d.y);
      pathD += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      dataPoints.push(`<circle cx="${x}" cy="${y}" r="${3 * scale}" fill="${colors.accent}"/>`);
    });
    dataPoints.unshift(`<path d="${pathD}" fill="none" stroke="${colors.accent}" stroke-width="${2 * scale}"/>`);
  } else {
    content.data.forEach((d) => {
      const x = toX(d.x);
      const y = toY(d.y);
      dataPoints.push(`<circle cx="${x}" cy="${y}" r="${4 * scale}" fill="${colors.accent}" opacity="0.7"/>`);
    });
  }

  const gridLines: string[] = [];
  for (let i = 0; i <= 4; i++) {
    const y = padding + titleHeight + (chartH / 4) * i;
    const val = yMax - (yRange / 4) * i;
    gridLines.push(
      `<line x1="${padding}" y1="${y}" x2="${padding + chartW}" y2="${y}" stroke="${colors.border}" stroke-width="0.5" opacity="0.3"/>`
    );
    gridLines.push(
      `<text x="${padding - 4 * scale}" y="${y + 3 * scale}" text-anchor="end" fill="${colors.text}" font-size="${10 * scale}px" font-family="'JetBrains Mono', monospace">${val.toFixed(1)}</text>`
    );
  }

  for (let i = 0; i <= 4; i++) {
    const x = padding + (chartW / 4) * i;
    const val = xMin + (xRange / 4) * i;
    gridLines.push(
      `<line x1="${x}" y1="${padding + titleHeight}" x2="${x}" y2="${padding + titleHeight + chartH}" stroke="${colors.border}" stroke-width="0.5" opacity="0.3"/>`
    );
    gridLines.push(
      `<text x="${x}" y="${padding + titleHeight + chartH + 12 * scale}" text-anchor="middle" fill="${colors.text}" font-size="${10 * scale}px" font-family="'JetBrains Mono', monospace">${val.toFixed(1)}</text>`
    );
  }

  const svg = `
    <svg width="${width}" height="${height}" style="display: block;">
      <text x="${padding}" y="${padding + 8 * scale}" fill="${colors.accent}" font-size="${13 * scale}px" font-family="'Noto Serif SC', serif" font-weight="bold">${content.title}</text>
      ${gridLines.join('')}
      <text x="${padding + chartW / 2}" y="${padding + titleHeight + chartH + 24 * scale}" text-anchor="middle" fill="${colors.text}" font-size="${10 * scale}px">${content.xLabel}</text>
      <text x="${10 * scale}" y="${padding + titleHeight + chartH / 2}" text-anchor="middle" fill="${colors.text}" font-size="${10 * scale}px" transform="rotate(-90, ${10 * scale}, ${padding + titleHeight + chartH / 2})">${content.yLabel}</text>
      ${dataPoints.join('')}
    </svg>
  `;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
