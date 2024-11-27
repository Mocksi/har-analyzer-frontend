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
  const [timeRange, setTimeRange] = useState('1h');
  const [detailLevel, setDetailLevel] = useState('summary');

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--light-grey)',
          font: { family: 'Spline Sans Mono' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'var(--dark-grey)' },
        ticks: { color: 'var(--light-grey)' }
      },
      y: {
        grid: { color: 'var(--dark-grey)' },
        ticks: { color: 'var(--light-grey)' }
      }
    },
    transitions: {
      zoom: {
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    }
  };

  if (!metric || Object.keys(metric).length === 0) {
    return null;
  }

  return (
    <div className="metric-drilldown">
      <div className="drilldown-header">
        <h3>{metric.name} Details</h3>
        <div className="drilldown-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          
          <div className="detail-level-toggle">
            <button
              className={`toggle-btn ${detailLevel === 'summary' ? 'active' : ''}`}
              onClick={() => setDetailLevel('summary')}
            >
              Summary
            </button>
            <button
              className={`toggle-btn ${detailLevel === 'detailed' ? 'active' : ''}`}
              onClick={() => setDetailLevel('detailed')}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      <div className="drilldown-content">
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
        
        <div className="metric-details">
          <div className="detail-card">
            <h4>Current Value</h4>
            <p className="detail-value">{metric.currentValue}</p>
          </div>
          <div className="detail-card">
            <h4>Trend</h4>
            <p className="detail-value">{metric.trend}</p>
          </div>
          <div className="detail-card">
            <h4>Threshold</h4>
            <p className="detail-value">{metric.threshold}</p>
          </div>
        </div>
      </div>
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