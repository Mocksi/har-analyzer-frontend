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

    // Recharts requires data points to have a unique x-axis value
    return data.map(point => ({
      x: Number(point.timestamp), // Use 'x' instead of 'name' or 'timestamp'
      y: Number(point.value)      // Use 'y' instead of 'value'
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