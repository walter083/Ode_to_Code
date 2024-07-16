import React, { useMemo, useState } from 'react';

const BarGraph = ({
  width = 800,
  height = 500,
  data,
  barColor = '#FF5733',
  backgroundColor = '#2a2a2a',
  highlightColor = '#FF8C66',
  showValues = true,
  showLabels = true,
  showTitle = false,
  title = 'Bar Graph',
  fontFamily = 'Arial, sans-serif',
  titleFontSize = 24,
  labelFontSize = 12,
  valueFontSize = 14,
  barSpacing = 0.2,
  animationDuration = 1000,
  yAxisLabel = 'Value',
  xAxisLabel = 'Category',
  showGridLines = true,
  gridLineColor = '#444',
  axisColor = '#888',
  axisLabelColor = '#888',
  axisTitleColor = '#888',
  gradientIntensity = 0.7,
  gradientStartColor,
  gradientMiddleColor,
  gradientEndColor,
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const scaleFactor = graphHeight / maxValue;

  const barWidth = graphWidth / data.length / (1 + barSpacing);

  function getCssVariableValue(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }

  const bars = useMemo(() => 
    data.map((d, i) => ({
      x: padding.left + i * (barWidth * (1 + barSpacing)),
      y: height - padding.bottom - d.value * scaleFactor,
      width: barWidth,
      height: d.value * scaleFactor,
      value: d.value,
      label: d.label,
    })),
    [data, barWidth, barSpacing, height, padding.bottom, padding.left, scaleFactor]
  );

  const yAxisTicks = useMemo(() => {
    const tickCount = 5;
    return Array.from({ length: tickCount }, (_, i) => ({
      value: maxValue * (i / (tickCount - 1)),
      y: height - padding.bottom - (maxValue * (i / (tickCount - 1)) * scaleFactor),
    }));
  }, [maxValue, height, padding.bottom, scaleFactor]);

  const gradientId = 'barGradient';

  const startColor = gradientStartColor || `${barColor}cc`;
  const middleColor = gradientMiddleColor || `${barColor}66`;
  const endColor = gradientEndColor || `${barColor}00`;

  return (
    <div className="graph-container" style={{ backgroundColor, fontFamily }}>
      {showTitle && <h2 className="graph-title">{title}</h2>}
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="50%" stopColor={middleColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>

        {showGridLines && yAxisTicks.map(tick => (
          <line
            key={tick.value}
            x1={padding.left}
            y1={tick.y}
            x2={width - padding.right}
            y2={tick.y}
            stroke={gridLineColor}
            strokeDasharray="5,5"
          />
        ))}
        
        {bars.map((bar, index) => (
          <g key={index}>
            <rect
              x={bar.x}
              y={height - padding.bottom}
              width={bar.width}
              height={0}
              fill={hoveredBar === index ? highlightColor : `url(#${gradientId})`}
              className="bar"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <animate
                attributeName="height"
                from="0"
                to={bar.height}
                dur={`${animationDuration}ms`}
                fill="freeze"
              />
              <animate
                attributeName="y"
                from={height - padding.bottom}
                to={bar.y}
                dur={`${animationDuration}ms`}
                fill="freeze"
              />
            </rect>
          </g>
        ))}
        
        {showValues && bars.map((bar, index) => (
          <text
            key={index}
            x={bar.x + bar.width / 2}
            y={bar.y - 5}
            textAnchor="middle"
            fill={axisLabelColor}
            fontSize={valueFontSize}
            opacity={0}
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur={`${animationDuration}ms`}
              fill="freeze"
            />
            {bar.value}
          </text>
        ))}
        
        {showLabels && bars.map((bar, index) => (
          <text
            key={index}
            x={bar.x + bar.width / 2}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fill={axisLabelColor}
            fontSize={labelFontSize}
          >
            {bar.label}
          </text>
        ))}
        
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke={axisColor}
          strokeWidth={2}
        />
        
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke={axisColor}
          strokeWidth={2}
        />
        
        {yAxisTicks.map(tick => (
          <text
            key={tick.value}
            x={padding.left - 10}
            y={tick.y}
            textAnchor="end"
            fill={axisLabelColor}
            fontSize={labelFontSize}
          >
            {tick.value.toFixed(0)}
          </text>
        ))}
        
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fill={axisTitleColor}
          fontSize={labelFontSize + 2}
        >
          {xAxisLabel}
        </text>
        
        <text
          x={-height / 2}
          y={20}
          textAnchor="middle"
          fill={axisTitleColor}
          fontSize={labelFontSize + 2}
          transform="rotate(-90)"
        >
          {yAxisLabel}
        </text>
      </svg>
      <style jsx>{`
         .graph-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 90vh;
          color: var(--color-light);
          padding: 2rem;
          background-color: ${getCssVariableValue('--color-primary')} !important;
        }
        .graph-title {
          font-size: ${titleFontSize}px;
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .graph-content {
          position: relative;
          width: 100%;
          max-width: ${width}px;
          height: ${height}px;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 3px solid ${getCssVariableValue('--color-dark')} !important;
          box-shadow:  20px 20px 60px #0a0b0a,
    -20px -20px 60px #121412;
        }
        .bar {
          transition: fill 0.3s ease !important;
        }
      `}</style>
    </div>
  );
};

export default BarGraph;