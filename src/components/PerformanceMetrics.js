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

  const getPathname = (url) => {
    try {
      return new URL(url).pathname;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="metrics-container">
      <div className="metric-card">
        <h4>Overview</h4>
        <ul>
          <li>Total Requests: {metrics.totalRequests}</li>
          <li>Total Load Time: {formatTime(metrics.totalTime)}</li>
          <li>Total Size: {formatSize(metrics.totalSize)}</li>
          <li>Unique Domains: {metrics.domains.length}</li>
        </ul>
      </div>
      
      <div className="metric-card">
        <h4>Slowest Requests</h4>
        <ul>
          {metrics.slowestRequests.map((req, index) => (
            <li key={index}>
              {getPathname(req.url)} - {formatTime(req.time)}
            </li>
          ))}
        </ul>
      </div>

      <div className="metric-card">
        <h4>Largest Requests</h4>
        <ul>
          {metrics.largestRequests.map((req, index) => (
            <li key={index}>
              {getPathname(req.url)} - {formatSize(req.size)}
            </li>
          ))}
        </ul>
      </div>

      {metrics.errors.length > 0 && (
        <div className="metric-card error-card">
          <h4>Errors</h4>
          <ul>
            {metrics.errors.map((error, index) => (
              <li key={index}>
                {error.status} {error.statusText} - {getPathname(error.url)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PerformanceMetrics; 