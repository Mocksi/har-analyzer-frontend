import React from 'react';
import PropTypes from 'prop-types';
import ChartErrorBoundary from './ErrorBoundary';
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
  // Add PropTypes validation
  TimeSeriesChart.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired
      })
    ).isRequired
  };

  // Defensive data transformation
  const chartData = React.useMemo(() => {
    if (!Array.isArray(data)) {
      console.warn('TimeSeriesChart: Invalid data format', data);
      return [];
    }

    return data.map(point => ({
      x: Number(point.timestamp),
      y: Number(point.value)
    }));
  }, [data]);

  if (!chartData.length) {
    return <div>No timeline data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="x"
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={(x) => new Date(x).toLocaleTimeString()}
        />
        <YAxis 
          dataKey="y"
          type="number"
        />
        <RechartsTooltip
          labelFormatter={(x) => new Date(x).toLocaleString()}
          formatter={(value) => [`${value}ms`, 'Response Time']}
        />
        <Line 
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          isAnimationActive={false}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PerformanceCharts({ metrics }) {
  const { timeseries, primary } = metrics;

  if (timeseries.length === 1) {
    const { timestamp, value } = timeseries[0];
    return (
      <div className="performance-metrics">
        <h3>Response Time</h3>
        <p>{value.toFixed(2)} ms at {new Date(timestamp).toLocaleTimeString()}</p>
        <h3>Average Response Time</h3>
        <p>{primary.avgResponseTime.toFixed(2)} ms</p>
        <h3>Total Requests</h3>
        <p>{primary.totalRequests}</p>
        {/* Add more metrics as needed */}
      </div>
    );
  }

  // Existing chart rendering logic for multiple data points
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timeseries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp"
          tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
        />
        <YAxis />
        <RechartsTooltip 
          labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
          formatter={(value) => [`${value}ms`, 'Response Time']}
        />
        <Line 
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PerformanceCharts; 