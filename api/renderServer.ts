import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import type { BoardState } from '../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8839;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

let currentBoardState: BoardState | null = null;

app.get('/render', (req, res) => {
  const html = generateRenderHTML(currentBoardState);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.post('/api/render/update', (req, res) => {
  currentBoardState = req.body as BoardState;
  res.json({ success: true });
});

app.get('/api/render/state', (req, res) => {
  res.json(currentBoardState);
});

function generateRenderHTML(board: BoardState | null): string {
  if (!board) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>展板渲染</title>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; font-family: sans-serif; }
            .empty { color: #999; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="empty">等待展板数据...</div>
        </body>
      </html>
    `;
  }

  const dpi = 96;
  const mmToPx = (mm: number) => (mm / 25.4) * dpi;
  const scale = 0.5;

  const boardWidth = mmToPx(board.width);
  const boardHeight = mmToPx(board.height);

  const themeColors = {
    bg: board.style.backgroundColor || (board.theme === 'physics' ? '#0F172A' : '#F7F3E9'),
    surface: board.theme === 'physics' ? '#1E293B' : '#FEFDFB',
    accent: board.style.accentColor || (board.theme === 'physics' ? '#3B82F6' : '#22C55E'),
    text: board.style.textColor || (board.theme === 'physics' ? '#F1F5F9' : '#14532D'),
    border: board.style.borderColor || (board.theme === 'physics' ? '#475569' : '#86EFAC'),
  };

  const fonts = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');
  `;

  let elementsHTML = '';
  
  for (const element of board.elements) {
    const x = mmToPx(element.x) * scale;
    const y = mmToPx(element.y) * scale;
    const w = mmToPx(element.width) * scale;
    const h = mmToPx(element.height) * scale;

    const borderStyle = element.style.borderStyle !== 'none' 
      ? `border: ${element.style.borderWidth * scale}px ${element.style.borderStyle} ${element.style.borderColor};` 
      : '';

    const baseStyle = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${w}px;
      height: ${h}px;
      background: ${element.style.backgroundColor || 'transparent'};
      padding: ${element.style.padding * scale}px;
      box-sizing: border-box;
      ${borderStyle}
      overflow: hidden;
      font-family: 'Noto Sans SC', sans-serif;
      color: ${board.style.textColor || themeColors.text};
    `;

    if (element.type === 'text') {
      const content = element.content as { title: string; content: string; fontSize: number; fontWeight: string };
      elementsHTML += `
        <div style="${baseStyle}">
          <h3 style="margin: 0 0 8px 0; font-family: 'Noto Serif SC', serif; font-size: ${content.fontSize * scale}px; font-weight: ${content.fontWeight}; color: ${themeColors.accent};">${content.title}</h3>
          <div style="font-size: ${(content.fontSize * 0.7) * scale}px; line-height: 1.6; white-space: pre-wrap;">${content.content}</div>
        </div>
      `;
    } else if (element.type === 'chart') {
      const chart = element.content as { chartType: string; title: string; xLabel: string; yLabel: string; data: Array<{x: number; y: number; group?: string}> };
      const chartSVG = generateChartSVG(chart, w, h, scale, themeColors);
      elementsHTML += `
        <div style="${baseStyle}">
          <h4 style="margin: 0 0 8px 0; font-family: 'Noto Serif SC', serif; font-size: ${14 * scale}px; color: ${themeColors.accent};">${chart.title}</h4>
          ${chartSVG}
        </div>
      `;
    } else if (element.type === 'image') {
      const img = element.content as { src: string; caption: string; scale: string };
      elementsHTML += `
        <div style="${baseStyle} display: flex; flex-direction: column;">
          <div style="flex: 1; overflow: hidden;">
            <img src="${img.src}" style="width: 100%; height: 100%; object-fit: ${img.scale};" />
          </div>
          <div style="font-size: ${11 * scale}px; text-align: center; padding-top: 4px; color: ${themeColors.text}; opacity: 0.8;">${img.caption}</div>
        </div>
      `;
    }
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>展板渲染 - ${board.title}</title>
        <style>${fonts}</style>
        <style>
          * { margin: 0; padding: 0; }
          body { 
            margin: 0; 
            padding: 20px; 
            display: flex; 
            justify-content: center; 
            align-items: flex-start; 
            min-height: 100vh; 
            background: #e5e5e5;
          }
          .board {
            position: relative;
            width: ${boardWidth * scale}px;
            height: ${boardHeight * scale}px;
            background: ${board.style.backgroundColor || themeColors.bg};
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transform-origin: top center;
          }
          .board-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: ${20 * scale}px;
            background: ${themeColors.accent};
            color: white;
            font-family: 'Noto Serif SC', serif;
            font-size: ${28 * scale}px;
            font-weight: bold;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="board">
          <div class="board-header">${board.title}</div>
          <div style="position: absolute; top: ${80 * scale}px; left: 0; right: 0; bottom: 0;">
            ${elementsHTML}
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateChartSVG(
  chart: { chartType: string; title: string; xLabel: string; yLabel: string; data: Array<{x: number; y: number; group?: string}> },
  width: number,
  height: number,
  scale: number,
  colors: { bg: string; surface: string; accent: string; text: string; border: string }
): string {
  const padding = 40 * scale;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2 - 30 * scale;

  if (chart.data.length === 0) {
    return `<div style="display: flex; align-items: center; justify-content: center; height: ${chartH}px; color: ${colors.text}; opacity: 0.5; font-size: ${12 * scale}px;">暂无数据</div>`;
  }

  const xVals = chart.data.map(d => d.x);
  const yVals = chart.data.map(d => d.y);
  const xMin = Math.min(...xVals);
  const xMax = Math.max(...xVals);
  const yMin = Math.min(...yVals);
  const yMax = Math.max(...yVals);
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const toX = (x: number) => padding + ((x - xMin) / xRange) * chartW;
  const toY = (y: number) => padding + chartH - ((y - yMin) / yRange) * chartH;

  let svgContent = '';

  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartH / 4) * i;
    const val = yMax - (yRange / 4) * i;
    svgContent += `<line x1="${padding}" y1="${y}" x2="${padding + chartW}" y2="${y}" stroke="${colors.border}" stroke-width="0.5" opacity="0.3"/>`;
    svgContent += `<text x="${padding - 5 * scale}" y="${y + 4 * scale}" text-anchor="end" fill="${colors.text}" font-size="${10 * scale}px" font-family="'JetBrains Mono', monospace">${val.toFixed(1)}</text>`;
  }

  for (let i = 0; i <= 4; i++) {
    const x = padding + (chartW / 4) * i;
    const val = xMin + (xRange / 4) * i;
    svgContent += `<line x1="${x}" y1="${padding}" x2="${x}" y2="${padding + chartH}" stroke="${colors.border}" stroke-width="0.5" opacity="0.3"/>`;
    svgContent += `<text x="${x}" y="${padding + chartH + 15 * scale}" text-anchor="middle" fill="${colors.text}" font-size="${10 * scale}px" font-family="'JetBrains Mono', monospace">${val.toFixed(1)}</text>`;
  }

  svgContent += `<text x="${padding + chartW / 2}" y="${padding + chartH + 28 * scale}" text-anchor="middle" fill="${colors.text}" font-size="${11 * scale}px">${chart.xLabel}</text>`;
  svgContent += `<text x="${10 * scale}" y="${padding + chartH / 2}" text-anchor="middle" fill="${colors.text}" font-size="${11 * scale}px" transform="rotate(-90, ${10 * scale}, ${padding + chartH / 2})">${chart.yLabel}</text>`;

  if (chart.chartType === 'bar') {
    const barWidth = Math.max(4 * scale, chartW / chart.data.length * 0.6);
    chart.data.forEach((d, i) => {
      const x = toX(d.x) - barWidth / 2;
      const y = toY(d.y);
      const h = padding + chartH - y;
      svgContent += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${colors.accent}" opacity="0.8"/>`;
    });
  } else if (chart.chartType === 'line') {
    let pathD = '';
    chart.data.forEach((d, i) => {
      const x = toX(d.x);
      const y = toY(d.y);
      pathD += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    svgContent += `<path d="${pathD}" fill="none" stroke="${colors.accent}" stroke-width="${2 * scale}"/>`;
    chart.data.forEach(d => {
      const x = toX(d.x);
      const y = toY(d.y);
      svgContent += `<circle cx="${x}" cy="${y}" r="${3 * scale}" fill="${colors.accent}"/>`;
    });
  } else {
    chart.data.forEach(d => {
      const x = toX(d.x);
      const y = toY(d.y);
      svgContent += `<circle cx="${x}" cy="${y}" r="${4 * scale}" fill="${colors.accent}" opacity="0.7"/>`;
    });
  }

  return `<svg width="${width}" height="${height - 30 * scale}" style="display: block;">${svgContent}</svg>`;
}

const server = app.listen(PORT, () => {
  console.log(`Render server ready on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

export default app;
