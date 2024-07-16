import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const AnimatedScatterPlot = ({
  data,
  width = 800,
  height = 500,
  title = 'Animated Scatter Plot',
  fontFamily = 'Arial, sans-serif',
  backgroundColor = '#2a2a2a',
  titleFontSize = 24,
  titleColor = '#888',
  axisColor = '#888',
  axisLabelColor = '#888',
  axisLabelFontSize = 12,
  defaultPointColor = '#FF5733',
  pointSize = 5,
  pointHoverSize = 8,
  animationDuration = 1000,
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis',
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
  showGridLines = true,
  gridLineColor = '#444',
  showTooltip = true,
  tooltipBackgroundColor = 'rgba(40, 40, 40, 0.9)',
  tooltipTextColor = 'white',
  xAxisRange,
  yAxisRange,
  gradientIntensity = 0.7,
  gradientColors,
  showTitle = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const svgRef = useRef(null);

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xMin = xAxisRange ? xAxisRange[0] : Math.min(...data.map(d => d.x));
  const xMax = xAxisRange ? xAxisRange[1] : Math.max(...data.map(d => d.x));
  const yMin = yAxisRange ? yAxisRange[0] : Math.min(...data.map(d => d.y));
  const yMax = yAxisRange ? yAxisRange[1] : Math.max(...data.map(d => d.y));

  const xScale = (x) => (x - xMin) / (xMax - xMin) * chartWidth;
  const yScale = (y) => chartHeight - (y - yMin) / (yMax - yMin) * chartHeight;

  const xTicks = 5;
  const yTicks = 5;

  const adjustColorOpacity = (color, opacity) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const gradientColorStops = useMemo(() => {
    if (gradientColors) {
      return gradientColors.map((color, index) => ({
        offset: `${index * 50}%`,
        stopColor: color,
      }));
    }
    return [
      { offset: '0%', stopColor: adjustColorOpacity(defaultPointColor, gradientIntensity) },
      { offset: '50%', stopColor: adjustColorOpacity(defaultPointColor, gradientIntensity * 0.6) },
      { offset: '100%', stopColor: adjustColorOpacity(defaultPointColor, 0) },
    ];
  }, [defaultPointColor, gradientIntensity, gradientColors]);

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const points = svg.querySelectorAll('.point');
      
      points.forEach((point, index) => {
        point.animate(
          [
            { opacity: 0, transform: 'scale(0)' },
            { opacity: 1, transform: 'scale(1)' }
          ],
          {
            duration: animationDuration,
            delay: index * 50,
            fill: 'forwards',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }
        );
      });
    }
  }, [data, animationDuration]);

  const getCssVariableValue = (variableName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  };

  return (
    <div className="scatter-plot-container" style={{ fontFamily, backgroundColor: getCssVariableValue('--color-primary') }}>
      <h2 className="scatter-plot-title" style={{ display: !showTitle ? 'none' : 'block' }}>{title}</h2>
      <div className="scatter-plot-content">
        <svg ref={svgRef} className="scatter-plot-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="pointGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              {gradientColorStops.map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.stopColor} />
              ))}
            </radialGradient>
          </defs>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid lines */}
            {showGridLines && [...Array(xTicks)].map((_, i) => (
              <line
                key={`x-grid-${i}`}
                x1={chartWidth * (i / (xTicks - 1))}
                y1={0}
                x2={chartWidth * (i / (xTicks - 1))}
                y2={chartHeight}
                className="grid-line"
              />
            ))}
            {showGridLines && [...Array(yTicks)].map((_, i) => (
              <line
                key={`y-grid-${i}`}
                x1={0}
                y1={chartHeight * (i / (yTicks - 1))}
                x2={chartWidth}
                y2={chartHeight * (i / (yTicks - 1))}
                className="grid-line"
              />
            ))}

            {/* X-axis */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} className="axis" />
            <text x={chartWidth / 2} y={chartHeight + 40} className="axis-title">{xAxisLabel}</text>
            
            {/* Y-axis */}
            <line x1={0} y1={0} x2={0} y2={chartHeight} className="axis" />
            <text x={-40} y={chartHeight / 2} className="axis-title" transform={`rotate(-90, -40, ${chartHeight / 2})`}>{yAxisLabel}</text>
            
            {/* Axis ticks and labels */}
            {[...Array(xTicks)].map((_, i) => (
              <g key={`x-tick-${i}`}>
                <line
                  x1={chartWidth * (i / (xTicks - 1))}
                  y1={chartHeight}
                  x2={chartWidth * (i / (xTicks - 1))}
                  y2={chartHeight + 5}
                  className="axis"
                />
                <text
                  x={chartWidth * (i / (xTicks - 1))}
                  y={chartHeight + 20}
                  className="axis-label"
                >
                  {(xMin + (xMax - xMin) * (i / (xTicks - 1))).toFixed(1)}
                </text>
              </g>
            ))}
            {[...Array(yTicks)].map((_, i) => (
              <g key={`y-tick-${i}`}>
                <line
                  x1={-5}
                  y1={chartHeight * (i / (yTicks - 1))}
                  x2={0}
                  y2={chartHeight * (i / (yTicks - 1))}
                  className="axis"
                />
                <text
                  x={-10}
                  y={chartHeight * (i / (yTicks - 1))}
                  className="axis-label"
                >
                  {(yMax - (yMax - yMin) * (i / (yTicks - 1))).toFixed(1)}
                </text>
              </g>
            ))}

            {/* Data points */}
            {data.map((point, index) => (
              <circle
                key={index}
                className="point"
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={hoveredPoint === point ? pointHoverSize : pointSize}
                fill={point.color || "url(#pointGradient)"}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </g>
        </svg>
        
        {showTooltip && hoveredPoint && (
          <div className="tooltip">
            <FaInfoCircle style={{ marginRight: '5px' }} />
            {hoveredPoint.label || `(${hoveredPoint.x.toFixed(2)}, ${hoveredPoint.y.toFixed(2)})`}
          </div>
        )}
      </div>
      <style jsx>{`
        .scatter-plot-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 90vh;
          color: var(--color-light);
          padding: 2rem;
        }
        .scatter-plot-title {
          font-size: ${titleFontSize}px;
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          color: ${titleColor};
        }
        .scatter-plot-content {
          position: relative;
          width: 100%;
          max-width: ${width}px;
          height: ${height}px;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 3px solid ${getCssVariableValue('--color-dark')};
          box-shadow: 20px 20px 60px #0a0b0a, -20px -20px 60px #121412;
        }
        .scatter-plot-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .axis {
          stroke: ${axisColor};
          stroke-width: 1;
        }
        .axis-label {
          fill: ${axisLabelColor};
          font-size: ${axisLabelFontSize}px;
          text-anchor: middle;
        }
        .axis-title {
          fill: ${axisLabelColor};
          font-size: ${axisLabelFontSize + 2}px;
          text-anchor: middle;
        }
        .grid-line {
          stroke: ${gridLineColor};
          stroke-width: 1;
          stroke-dasharray: 4 4;
        }
        .point {
          transition: r 0.3s ease;
          filter: drop-shadow(0 2px 4px ${defaultPointColor}80);
        }
        .tooltip {
          position: absolute;
          background-color: ${tooltipBackgroundColor};
          color: ${tooltipTextColor};
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          pointer-events: none;
          top: 10px;
          right: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedScatterPlot;