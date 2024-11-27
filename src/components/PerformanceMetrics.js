import React from 'react';

function PerformanceMetrics({ metrics }) {
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
    <div className="metrics-container">
      <div className="metric-card">
        <h4>Overview</h4>
        <ul>
          <li>Total Requests: {metrics.totalRequests}</li>
          <li>Total Load Time: {formatTime(metrics.totalTime)}</li>
          <li>Total Size: {formatSize(metrics.httpMetrics.totalSize)}</li>
          <li>Unique Domains: {metrics.domains.size}</li>
        </ul>
      </div>
      
      <div className="metric-card">
        <h4>HTTP Metrics</h4>
        <ul>
          <li>Requests: {metrics.httpMetrics.requests}</li>
          <li>Average Response Time: {formatTime(metrics.httpMetrics.totalTime / metrics.httpMetrics.requests)}</li>
          <li>Cache Hit Rate: {((metrics.httpMetrics.cacheHits / (metrics.httpMetrics.cacheHits + metrics.httpMetrics.cacheMisses)) * 100).toFixed(2)}%</li>
        </ul>
      </div>

      {metrics.websocketMetrics.connections > 0 && (
        <div className="metric-card">
          <h4>WebSocket Metrics</h4>
          <ul>
            <li>Connections: {metrics.websocketMetrics.connections}</li>
            <li>Messages: {metrics.websocketMetrics.messageCount}</li>
            <li>Duration: {formatTime(metrics.websocketMetrics.connectionDuration)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default PerformanceMetrics; 