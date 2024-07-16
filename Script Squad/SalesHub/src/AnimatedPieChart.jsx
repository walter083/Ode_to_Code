import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const AnimatedPieChart = ({
  data,
  width = 500,
  height = 500,
  title = 'Sample Pie Chart',
  fontFamily = 'Arial, sans-serif',
  titleFontSize = 24,
  labelFontSize = 12,
  labelColor = 'white',
  showPercentage = true,
  percentageFontSize = 14,
  percentageColor = 'white',
  sliceSpacing = 2,
  showTitle = false,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartSize = Math.min(width, height) - 80;
  const radius = chartSize / 2;
  const center = { x: width / 2, y: height / 2 };

  let startAngle = 0;

  return (
    <div className="chart-container">
      {showTitle && <h2 className="chart-title">{title}</h2>}
      <svg width={width} height={height}>
        <g className="pie-slices" transform={`translate(${center.x}, ${center.y})`}>
          {data.map((item, index) => {
            const percentage = item.value / total;
            const endAngle = startAngle + percentage * 360;

            const startX = Math.cos((startAngle * Math.PI) / 180) * radius;
            const startY = Math.sin((startAngle * Math.PI) / 180) * radius;
            const endX = Math.cos((endAngle * Math.PI) / 180) * radius;
            const endY = Math.sin((endAngle * Math.PI) / 180) * radius;

            const largeArcFlag = percentage > 0.5 ? 1 : 0;

            const pathData = [
              `M ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'L 0 0',
            ].join(' ');

            const middleAngle = startAngle + (percentage * 360) / 2;
            const labelX = Math.cos((middleAngle * Math.PI) / 180) * (radius * 0.6);
            const labelY = Math.sin((middleAngle * Math.PI) / 180) * (radius * 0.6);

            const slice = (
              <g key={index} className="slice" onMouseEnter={() => setHoveredSlice(index)} onMouseLeave={() => setHoveredSlice(null)}>
                <path
                  d={pathData}
                  fill={item.color}
                  stroke="var(--color-primary)"
                  strokeWidth={sliceSpacing}
                  className="slice-path"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fill={labelColor}
                  fontSize={labelFontSize}
                  className="slice-label"
                >
                  {item.label}
                </text>
                {showPercentage && (
                  <text
                    x={labelX}
                    y={labelY + labelFontSize + 5}
                    textAnchor="middle"
                    fill={percentageColor}
                    fontSize={percentageFontSize}
                    className="slice-percentage"
                  >
                    {(percentage * 100).toFixed(1)}%
                  </text>
                )}
              </g>
            );

            startAngle = endAngle;
            return slice;
          })}
        </g>
      </svg>
      {hoveredSlice !== null && (
        <div className="tooltip">
          <FaInfoCircle style={{ marginRight: '5px' }} />
          {data[hoveredSlice].label}: {((data[hoveredSlice].value / total) * 100).toFixed(1)}%
        </div>
      )}
      <style jsx>{`
        .chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          font-family: ${fontFamily};
          background-color: var(--color-primary);
          color: var(--color-light);
          padding: 2rem;
        }

        .pie-slices {
          box-shadow:  20px 20px 60px #0a0b0a,
    -20px -20px 60px #121412;
        }
        .chart-title {
          font-size: ${titleFontSize}px;
          font-weight: bold;
          margin-bottom: 1rem;
          color: var(--color-light);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slice-path {
          transition: transform 0.3s ease;
        }
        .slice:hover .slice-path {
          transform: scale(1.05);
        }
        .slice-label, .slice-percentage {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .slice:hover .slice-label, .slice:hover .slice-percentage {
          opacity: 1;
        }
        .tooltip {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.8);
          color: var(--color-light);
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
        @keyframes rotateIn {
          from { transform: rotate(-180deg) scale(0); opacity: 0; }
          to { transform: rotate(0) scale(1); opacity: 1; }
        }
        .slice {
          animation: rotateIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimatedPieChart;