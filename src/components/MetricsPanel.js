import React from 'react';
import PropTypes from 'prop-types';
import './MetricsPanel.css';

function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms/1000).toFixed(2)}s`;
  };

  return (
    <div className="metrics-panel">
      <div className="metric-card">
        <span className="metric-title">Total Requests</span>
        <div className="metric-value">{metrics.totalRequests || 0}</div>
      </div>

      <div className="metric-card">
        <span className="metric-title">Total Load Time</span>
        <div className="metric-value">
          {formatTime(metrics.totalTime || 0)}
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-title">Total Size</span>
        <div className="metric-value">
          {formatSize(metrics.totalSize || 0)}
        </div>
      </div>

      <div className="metric-card">
        <span className="metric-title">Success Rate</span>
        <div className="metric-value">
          {(((metrics.successfulRequests || 0) / 
            (metrics.totalRequests || 1)) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

MetricsPanel.propTypes = {
  metrics: PropTypes.shape({
    totalRequests: PropTypes.number,
    totalTime: PropTypes.number,
    totalSize: PropTypes.number,
    successfulRequests: PropTypes.number
  })
};

export default MetricsPanel; 