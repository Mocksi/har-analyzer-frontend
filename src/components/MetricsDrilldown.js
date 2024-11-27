import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './MetricsDrilldown.css';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState error={{ message: 'Something went wrong' }} />;
    }
    return this.props.children;
  }
}

export function MetricsDrilldown({ metric = {}, timeseriesData = [] }) {
  if (!metric || Object.keys(metric).length === 0) {
    return null;
  }

  if (timeseriesData.length === 1) {
    const { currentValue, trend, threshold } = metric;
    return (
      <div className="metric-details">
        <div className="detail-card">
          <h4>Current Value</h4>
          <p className="detail-value">{currentValue || 'N/A'}</p>
        </div>
        <div className="detail-card">
          <h4>Trend</h4>
          <p className="detail-value">{trend || 'N/A'}</p>
        </div>
        <div className="detail-card">
          <h4>Threshold</h4>
          <p className="detail-value">{threshold || 'N/A'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="metric-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeseriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp"
            tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip 
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
    </div>
  );
}

MetricsDrilldown.propTypes = {
  metric: PropTypes.object,
  timeseriesData: PropTypes.array
};

MetricsDrilldown.defaultProps = {
  metric: {},
  timeseriesData: []
};

export default MetricsDrilldown; 