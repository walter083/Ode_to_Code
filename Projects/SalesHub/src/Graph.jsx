// import React, { useEffect, useState } from 'react';
// import { db } from './firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import AnimatedLineGraph from './AnimatedLineGraph';
// import BarGraph from './AnimatedBarGraph';
// import AnimatedScatterPlot from './AnimatedScatterPlot';
// import AnimatedPieChart from './AnimatedPieChart';

// function Graph() {
//   const [salesData, setSalesData] = useState([]);

//   useEffect(() => {
//     const fetchSalesPerformanceData = async () => {
//       const salesPerformanceCollection = collection(db, 'Sales Performance Data');
//       try {
//         const querySnapshot = await getDocs(salesPerformanceCollection);
//         const fetchedSalesData = [];
//         querySnapshot.forEach((doc) => {
//           fetchedSalesData.push({ id: doc.id, ...doc.data() });
//         });
//         setSalesData(fetchedSalesData);
//         console.log('Sales Performance Data:', fetchedSalesData);
//       } catch (error) {
//         console.error('Error fetching Sales Performance Data:', error);
//       }
//     };

//     fetchSalesPerformanceData();
//   }, []);

//   // Helper function to parse numeric values
//   const parseNumericValue = (value) => {
//     if (typeof value === 'string') {
//       return parseFloat(value.replace(/[^0-9.-]+/g, ''));
//     }
//     return value;
//   };

//   // Prepare data for line graph (Actual sales over time)
//   const lineGraphData = salesData.map((item, index) => ({
//     x: item['Date'] || index,
//     y: parseNumericValue(item['Actual sales']),
//   })).filter(item => !isNaN(item.y));

//   // Prepare data for bar graph (Comparison to target)
//   const barGraphData = salesData.map((item, index) => ({
//     label: `${index + 1}`, // Use numbers instead of dates or IDs
//     value: parseNumericValue(item['Comparison to target']),
//   })).filter(item => !isNaN(item.value));

//   // Prepare data for scatter plot (Average deal size vs Conversion rate)
//   const scatterPlotData = salesData.map((item) => ({
//     x: parseNumericValue(item['Average deal size']),
//     y: parseNumericValue(item['Conversion rate']),
//     label: `Date: ${item['Date']}\nAvg Deal Size: $${parseNumericValue(item['Average deal size']).toFixed(2)}\nConversion Rate: ${parseNumericValue(item['Conversion rate']).toFixed(2)}%`,
//   })).filter(item => !isNaN(item.x) && !isNaN(item.y));

//   // Prepare data for pie chart (Pipeline status)
//   const pieChartData = salesData.reduce((acc, item) => {
//     const pipelineStatus = item['Pipeline status'];
//     if (pipelineStatus) {
//       const [leads, status] = pipelineStatus.split(' ');
//       const value = parseInt(leads);
//       if (!isNaN(value)) {
//         acc.push({ 
//           label: status, 
//           value: value, 
//           color: `hsl(${Math.random() * 360}, 70%, 50%)`,
//           tooltipLabel: `${status}: ${value} leads`
//         });
//       }
//     }
//     return acc;
//   }, []);

//   return (
//     <div className='graph-container'>
//       <h2>Sales Performance Graphs</h2>
//       <div className="graph-grid">
//         {lineGraphData.length > 0 && (
//           <div className="graph">
//             {/* <h3>Actual Sales Over Time</h3> */}
//             <AnimatedLineGraph
//               data={lineGraphData}
//               width={400}
//               height={300}
//               xAxisLabel="Date"
//               yAxisLabel="Actual Sales ($)"
//               lineColor="#4CAF50"
//             />
//           </div>
//         )}
  
//         {barGraphData.length > 0 && (
//           <div className="graph">
//             {/* <h3>Comparison to Target</h3> */}
//             <BarGraph
//               data={barGraphData}
//               width={400}
//               height={300}
//               barColor="#2196F3"
//               xAxisLabel="Date"
//               yAxisLabel="Percentage Achieved"
//             />
//           </div>
//         )}
  
//         {scatterPlotData.length > 0 && (
//           <div className="graph">
//             {/* <h3>Average Deal Size vs Conversion Rate</h3> */}
//             <AnimatedScatterPlot
//               data={scatterPlotData}
//               width={400}
//               height={300}
//               xAxisLabel="Average Deal Size ($)"
//               yAxisLabel="Conversion Rate (%)"
//             />
//           </div>
//         )}
  
//         {pieChartData.length > 0 && (
//           <div className="graph">
//             {/* <h3>Pipeline Status (Number of Leads)</h3> */}
//             <AnimatedPieChart
//               data={pieChartData}
//               width={400}
//               height={300}
//               showPercentage={true}
//             />
//           </div>
//         )}
//       </div>
  
//       <style jsx>{`
//         .graph-container {
//           width: 100%;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 2rem;
//           background-color: var(--color-primary);
//           color: var(--color-light);
//         }
//         .graph-grid {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: row;
//           width: 100%;
//           max-width: 900px;
//           max-height: 50vh;
//         }
//         .graph {
//           width: 50%;
//         }
//         h2, h3 {
//           text-align: center;
//           margin-bottom: 1rem;
//         }
//       `}</style>
//     </div>
//   );

// }

// export default Graph;
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import AnimatedLineGraph from './AnimatedLineGraph';
import BarGraph from './AnimatedBarGraph';
import AnimatedScatterPlot from './AnimatedScatterPlot';
import AnimatedPieChart from './AnimatedPieChart';
import './Graph.css';

function Graph() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesPerformanceData = async () => {
      const salesPerformanceCollection = collection(db, 'Sales Performance Data');
      try {
        const querySnapshot = await getDocs(salesPerformanceCollection);
        const fetchedSalesData = [];
        querySnapshot.forEach((doc) => {
          fetchedSalesData.push({ id: doc.id, ...doc.data() });
        });
        setSalesData(fetchedSalesData);
        console.log('Sales Performance Data:', fetchedSalesData);
      } catch (error) {
        console.error('Error fetching Sales Performance Data:', error);
      }
    };

    fetchSalesPerformanceData();
  }, []);

  // Helper function to parse numeric values
  const parseNumericValue = (value) => {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[^0-9.-]+/g, ''));
    }
    return value;
  };

  // Prepare data for graphs (same as before)
  const lineGraphData = salesData.map((item, index) => ({
    x: item['Date'] || index,
    y: parseNumericValue(item['Actual sales']),
  })).filter(item => !isNaN(item.y));

  const barGraphData = salesData.map((item, index) => ({
    label: `${index + 1}`,
    value: parseNumericValue(item['Comparison to target']),
  })).filter(item => !isNaN(item.value));

  const scatterPlotData = salesData.map((item) => ({
    x: parseNumericValue(item['Average deal size']),
    y: parseNumericValue(item['Conversion rate']),
    label: `Date: ${item['Date']}\nAvg Deal Size: $${parseNumericValue(item['Average deal size']).toFixed(2)}\nConversion Rate: ${parseNumericValue(item['Conversion rate']).toFixed(2)}%`,
  })).filter(item => !isNaN(item.x) && !isNaN(item.y));

  const pieChartData = salesData.reduce((acc, item) => {
    const pipelineStatus = item['Pipeline status'];
    if (pipelineStatus) {
      const [leads, status] = pipelineStatus.split(' ');
      const value = parseInt(leads);
      if (!isNaN(value)) {
        acc.push({ 
          label: status, 
          value: value, 
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          tooltipLabel: `${status}: ${value} leads`
        });
      }
    }
    return acc;
  }, []);

  return (
    <div className="graph-container">
      <h2>Sales Performance Graphs</h2>
      <div className="graph-grid">
        <div className="graph-row">
          {lineGraphData.length > 0 && (
            <div className="graph">
              <AnimatedLineGraph
                data={lineGraphData}
                width={550}
                height={300}
                xAxisLabel="Date"
                yAxisLabel="Actual Sales ($)"
                lineColor="#4CAF50"
              />
            </div>
          )}
          {barGraphData.length > 0 && (
            <div className="graph">
              <BarGraph
                data={barGraphData}
                width={550}
                height={300}
                barColor="#2196F3"
                xAxisLabel="Date"
                yAxisLabel="Percentage Achieved"
              />
            </div>
          )}
        </div>
        <div className="graph-row">
          {scatterPlotData.length > 0 && (
            <div className="graph">
              <AnimatedScatterPlot
                data={scatterPlotData}
                width={550}
                height={300}
                xAxisLabel="Average Deal Size ($)"
                yAxisLabel="Conversion Rate (%)"
              />
            </div>
          )}
          {pieChartData.length > 0 && (
            <div className="pie-graph">
              <AnimatedPieChart
                data={pieChartData}
                width={550}
                height={300}
                showPercentage={true}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .graph-container {
          width: 100%;
          max-height: 180vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background-color: var(--color-primary);
          color: var(--color-light);
          overflow-y: auto;
        }
        .graph-grid {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1500px;
        }
        .graph-row {
          display: flex;
          justify-content: center;
          margin-bottom: -10rem;
        }
        .graph, .pie-graph {
          width: 70%;
          max-width: 750px;
          margin: 0 1rem;
          max-height: 35rem !important;
        }
        .pie-graph {
          margin-top: 12rem !important;
          background-color: var(--color-light) !important;
        }
        h2 {
          text-align: center;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}

export default Graph;