import React from 'react';
import { mmToPx } from '../../utils/unitConversion';

interface RulerProps {
  type: 'horizontal' | 'vertical';
  length: number;
  zoom: number;
  offset?: number;
}

export const Ruler: React.FC<RulerProps> = ({ type, length, zoom, offset = 0 }) => {
  const ticks: React.ReactElement[] = [];
  const totalPx = mmToPx(length) * zoom;

  for (let mm = 0; mm <= length; mm += 10) {
    const px = mmToPx(mm) * zoom;
    const isMajor = mm % 50 === 0;
    const tickHeight = isMajor ? 12 : 6;
    const label = isMajor && mm > 0 ? `${mm}` : '';

    if (type === 'horizontal') {
      ticks.push(
        <div
          key={mm}
          style={{
            position: 'absolute',
            left: px,
            bottom: 0,
            width: 1,
            height: tickHeight,
            backgroundColor: '#666',
          }}
        />
      );
      if (label) {
        ticks.push(
          <div
            key={`label-${mm}`}
            style={{
              position: 'absolute',
              left: px,
              bottom: tickHeight + 2,
              transform: 'translateX(-50%)',
              fontSize: 9,
              color: '#999',
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        );
      }
    } else {
      ticks.push(
        <div
          key={mm}
          style={{
            position: 'absolute',
            top: px,
            right: 0,
            height: 1,
            width: tickHeight,
            backgroundColor: '#666',
          }}
        />
      );
      if (label) {
        ticks.push(
          <div
            key={`label-${mm}`}
            style={{
              position: 'absolute',
              top: px,
              right: tickHeight + 4,
              transform: 'translateY(-50%)',
              fontSize: 9,
              color: '#999',
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        );
      }
    }
  }

  if (type === 'horizontal') {
    return (
      <div
        style={{
          position: 'relative',
          height: 28,
          width: totalPx,
          backgroundColor: '#2a2a2a',
          borderBottom: '1px solid #444',
          flexShrink: 0,
          marginLeft: 28,
        }}
      >
        {ticks}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 28,
        height: totalPx,
        backgroundColor: '#2a2a2a',
        borderRight: '1px solid #444',
        flexShrink: 0,
      }}
    >
      {ticks}
    </div>
  );
};
