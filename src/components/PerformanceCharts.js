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
  // Add defensive check for data
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="no-data">No timeline data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp"
          tickFormatter={(timestamp) => {
            try {
              return new Date(timestamp).toLocaleTimeString();
            } catch (e) {
              return 'Invalid time';
            }
          }}
        />
        <YAxis />
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
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PerformanceCharts({ metrics, persona }) {
  if (!metrics) {
    return <div className="charts-loading">Loading metrics...</div>;
  }

  // Ensure timeseries exists and is an array
  const timeseriesData = Array.isArray(metrics.timeseries) ? metrics.timeseries : [];
  
  // Transform and validate data - only include points with valid timestamps and responseTime
  const chartData = timeseriesData
    .filter(point => point && typeof point.timestamp === 'number' && typeof point.responseTime === 'number')
    .map(point => ({
      timestamp: point.timestamp,
      value: point.responseTime
    }));

  console.log('Transformed chart data:', chartData); // Debug the data structure

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