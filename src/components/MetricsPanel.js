import React from 'react';
import PropTypes from 'prop-types';
import './MetricsPanel.css';

export function MetricsPanel({ metrics, persona }) {
  if (!metrics) return null;

  const formatMetric = (value, type) => {
    switch(type) {
      case 'time':
        return `${value.toFixed(2)}ms`;
      case 'size':
        return `${(value / 1024).toFixed(2)}KB`;
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      default:
        return value;
    }
  };

  return (
    <div className="metrics-panel">
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>HTTP Metrics</h4>
          <p>Total Requests: {metrics.totalRequests}</p>
          <p>Average Response Time: {formatMetric(metrics.httpMetrics.totalTime / metrics.httpMetrics.requests, 'time')}</p>
          <p>Cache Hit Rate: {formatMetric(metrics.httpMetrics.cacheHits / (metrics.httpMetrics.cacheHits + metrics.httpMetrics.cacheMisses), 'percentage')}</p>
        </div>
        
        {metrics.websocketMetrics.connections > 0 && (
          <div className="metric-card">
            <h4>WebSocket Metrics</h4>
            <p>Total Messages: {metrics.websocketMetrics.messageCount}</p>
            <p>Sent: {metrics.websocketMetrics.sentMessages}</p>
            <p>Received: {metrics.websocketMetrics.receivedMessages}</p>
          </div>
        )}
      </div>
    </div>
  );
}

MetricsPanel.propTypes = {
  metrics: PropTypes.object.isRequired,
  persona: PropTypes.string
};

export default MetricsPanel; 