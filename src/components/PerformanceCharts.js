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
  // Add more detailed checks
  if (!metrics) {
    return <div className="charts-loading">Loading metrics...</div>;
  }

  // Ensure timeseries exists and is an array
  const timeseriesData = Array.isArray(metrics.timeseries) ? metrics.timeseries : [];
  
  // Transform and validate data
  const chartData = timeseriesData
    .filter(point => point && typeof point.timestamp !== 'undefined' && typeof point.responseTime !== 'undefined')
    .map(point => ({
      timestamp: point.timestamp,
      value: Number(point.responseTime) || 0
    }));

  console.log('Chart data:', chartData); // Debug log

  return (
    <div className="charts-container">
      <div className="chart">
        <h3>Response Times Over Time</h3>
        {chartData.length > 0 ? (
          <TimeSeriesChart data={chartData} />
        ) : (
          <div className="no-data">No timeline data available</div>
        )}
      </div>
    </div>
  );
}

export default PerformanceCharts; 