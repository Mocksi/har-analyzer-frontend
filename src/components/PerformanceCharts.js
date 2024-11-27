import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import './PerformanceCharts.css';

function TimeSeriesChart({ data }) {
  try {
    // More thorough defensive checks
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('Invalid or empty data:', data);
      return <div className="no-data">No timeline data available</div>;
    }

    // Validate and transform data for Recharts
    const validData = data.map(point => ({
      ...point,
      // Ensure timestamp is a valid number
      timestamp: Number(point.timestamp),
      // Ensure value is a valid number
      value: Number(point.value || 0)
    })).filter(point => 
      !isNaN(point.timestamp) && 
      !isNaN(point.value)
    );

    if (validData.length === 0) {
      console.log('No valid data points found:', data);
      return <div className="no-data">No valid data points available</div>;
    }

    // Sort data by timestamp
    validData.sort((a, b) => a.timestamp - b.timestamp);

    console.log('Chart data after validation:', validData);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={validData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(timestamp) => {
              try {
                return new Date(timestamp).toLocaleTimeString();
              } catch (e) {
                return 'Invalid time';
              }
            }}
          />
          <YAxis 
            type="number"
            domain={['auto', 'auto']}
          />
          <RechartsTooltip
            labelFormatter={(timestamp) => {
              try {
                return new Date(timestamp).toLocaleString();
              } catch (e) {
                return 'Invalid time';
              }
            }}
            formatter={(value) => `${Number(value).toFixed(2)}ms`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  } catch (error) {
    console.error('Error rendering chart:', error);
    return <div className="no-data">Error rendering chart</div>;
  }
}

export function PerformanceCharts({ metrics, persona }) {
  // Add defensive check for metrics
  if (!metrics) {
    console.log('No metrics provided');
    return <div className="charts-loading">Loading metrics...</div>;
  }

  // Ensure timeseries exists and is an array with explicit logging
  const timeseriesData = metrics.timeseries;
  console.log('Raw timeseries data:', timeseriesData);

  if (!Array.isArray(timeseriesData)) {
    console.log('Timeseries is not an array:', timeseriesData);
    return <div className="no-data">Invalid timeline data format</div>;
  }

  // Transform and validate data with explicit logging
  const chartData = timeseriesData
    .filter(point => {
      const isValid = point && 
        typeof point.timestamp === 'number' && 
        typeof point.value === 'number';
      if (!isValid) {
        console.log('Invalid data point:', point);
      }
      return isValid;
    })
    .map(point => ({
      timestamp: point.timestamp,
      value: point.value
    }));

  console.log('Transformed chart data:', chartData);

  return (
    <div className="charts-container">
      <div className="chart">
        <h3>Response Times Over Time</h3>
        {chartData.length > 0 ? (
          <TimeSeriesChart data={chartData} />
        ) : (
          <div className="no-data">No valid timeline data available</div>
        )}
      </div>
    </div>
  );
}

export default PerformanceCharts; 