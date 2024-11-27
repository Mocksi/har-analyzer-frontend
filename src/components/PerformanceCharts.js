import React from 'react';
import PropTypes from 'prop-types';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './PerformanceCharts.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Create the TimeSeriesChart component
function TimeSeriesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp"
          tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
          formatter={(value) => `${value.toFixed(2)}ms`}
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

  const timeseriesData = metrics.timeseries || [];
  const domains = metrics.domains || [];
  const requestTypes = metrics.requestsByType || {};

  return (
    <div className="charts-container">
      <div className="chart">
        <h3>Response Times Over Time</h3>
        {timeseriesData.length > 0 ? (
          <TimeSeriesChart 
            data={timeseriesData.map(point => ({
              timestamp: point.timestamp,
              value: point.responseTime || 0
            }))} 
          />
        ) : (
          <div className="no-data">No timeline data available</div>
        )}
      </div>
    </div>
  );
}

PerformanceCharts.propTypes = {
  metrics: PropTypes.shape({
    statusDistribution: PropTypes.object,
    slowestRequests: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      time: PropTypes.number
    }))
  }),
  persona: PropTypes.string.isRequired
};

export default PerformanceCharts; 