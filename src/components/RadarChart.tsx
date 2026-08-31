import { theme } from 'antd';
import { useIsMobile } from '../hooks/useBreakpoint';

export interface RadarAxis {
  key: string;
  label: string;
  value: number;
  valueLabel: string;
}

interface RadarChartProps {
  axes: RadarAxis[];
  maxValue: number;
  ariaLabel: string;
}

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  };
}

function estimateTextWidth(text: string, fontSize: number): number {
  // Approximate Cyrillic/Latin mix width for SVG layout
  return text.length * fontSize * 0.62;
}

export function RadarChart({ axes, maxValue, ariaLabel }: RadarChartProps) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

  if (axes.length < 3) {
    return null;
  }

  const labelFontSize = isMobile ? 10 : 11;
  const valueFontSize = isMobile ? 9 : 10;
  const maxRadius = isMobile ? 78 : 105;
  const labelGap = isMobile ? 16 : 20;
  const levels = 4;
  const n = axes.length;
  const angleStep = (Math.PI * 2) / n;
  const safeMax = maxValue > 0 ? maxValue : 1;

  const maxLabelWidth = Math.max(
    ...axes.map((axis) => estimateTextWidth(axis.label, labelFontSize)),
    estimateTextWidth('00%', valueFontSize),
  );
  const labelBlockHeight = labelFontSize + valueFontSize + 8;

  // Extra room so side labels (textAnchor start/end) and top/bottom labels fit inside viewBox
  const padX = Math.ceil(maxLabelWidth + 12);
  const padY = Math.ceil(labelBlockHeight / 2 + 10);
  const width = Math.ceil((maxRadius + labelGap) * 2 + padX * 2);
  const height = Math.ceil((maxRadius + labelGap) * 2 + padY * 2);
  const cx = width / 2;
  const cy = height / 2;

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const r = (maxRadius * (i + 1)) / levels;
    return axes
      .map((_, idx) => {
        const p = polarPoint(cx, cy, r, idx * angleStep);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  });

  const axisLines = axes.map((_, idx) => {
    const end = polarPoint(cx, cy, maxRadius, idx * angleStep);
    return { x2: end.x, y2: end.y };
  });

  const dataPoints = axes.map((axis, idx) => {
    const value = Math.max(0, Math.min(safeMax, axis.value));
    const r = (maxRadius * value) / safeMax;
    return polarPoint(cx, cy, r, idx * angleStep);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const labels = axes.map((axis, idx) => {
    const angle = idx * angleStep;
    const p = polarPoint(cx, cy, maxRadius + labelGap, angle);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    let textAnchor: 'start' | 'middle' | 'end' = 'middle';
    if (sin > 0.4) textAnchor = 'start';
    else if (sin < -0.4) textAnchor = 'end';

    // Nudge top/bottom labels slightly outward so they don't sit on the axis tip
    let y = p.y;
    if (Math.abs(sin) <= 0.4) {
      y += cos > 0 ? -4 : 4;
    }

    return {
      key: axis.key,
      label: axis.label,
      x: p.x,
      y,
      valueLabel: axis.valueLabel,
      textAnchor,
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        padding: isMobile ? '8px 0 4px' : '12px 0 8px',
        overflow: 'visible',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
        style={{ maxWidth: '100%', height: 'auto', overflow: 'visible' }}
      >
        {gridPolygons.map((points) => (
          <polygon
            key={points}
            points={points}
            fill="none"
            stroke={token.colorBorderSecondary}
            strokeWidth={1}
          />
        ))}

        {axisLines.map((line) => (
          <line
            key={`${line.x2},${line.y2}`}
            x1={cx}
            y1={cy}
            x2={line.x2}
            y2={line.y2}
            stroke={token.colorBorderSecondary}
            strokeWidth={1}
          />
        ))}

        <polygon
          points={dataPolygon}
          fill={token.colorPrimary}
          fillOpacity={0.25}
          stroke={token.colorPrimary}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {dataPoints.map((p, idx) =>
          axes[idx].value > 0 ? (
            <circle
              key={axes[idx].key}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={token.colorPrimary}
            />
          ) : null,
        )}

        {labels.map(({ key, label, x, y, valueLabel, textAnchor }) => (
          <text
            key={key}
            x={x}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fill={token.colorText}
            fontSize={labelFontSize}
            fontWeight={500}
          >
            <tspan x={x} dy="-0.4em">
              {label}
            </tspan>
            <tspan
              x={x}
              dy="1.3em"
              fill={token.colorTextSecondary}
              fontSize={valueFontSize}
              fontWeight={600}
            >
              {valueLabel}
            </tspan>
          </text>
        ))}
      </svg>
    </div>
  );
}
