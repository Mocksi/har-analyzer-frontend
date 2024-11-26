import React from 'react';
import './MetricsPanel.css';

export function MetricsPanel({ metrics, persona }) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    return ms > 1000 ? `${(ms/1000).toFixed(2)}s` : `${ms.toFixed(0)}ms`;
  };

  const renderMetricsByPersona = () => {
    switch(persona) {
      case 'Developer':
        return (
          <>
            <div className="metric-card">
              <h4>Performance</h4>
              <ul>
                <li>Slowest Requests: {metrics.performance.slowRequests.length}</li>
                <li>Average Response Time: {formatTime(metrics.performance.avgResponseTime)}</li>
                <li>Cache Hit Ratio: {(metrics.performance.cacheHitRatio * 100).toFixed(1)}%</li>
              </ul>
            </div>
            <div className="metric-card">
              <h4>API Usage</h4>
              <ul>
                <li>Total API Calls: {metrics.api.totalCalls}</li>
                <li>Unique Endpoints: {Object.keys(metrics.api.endpoints).length}</li>
                <li>Error Rate: {(metrics.api.errorRate * 100).toFixed(1)}%</li>
              </ul>
            </div>
          </>
        );

      case 'Business Analyst':
        return (
          <>
            <div className="metric-card">
              <h4>User Experience</h4>
              <ul>
                <li>Page Load Time: {formatTime(metrics.ux.pageLoadTime)}</li>
                <li>Time to Interactive: {formatTime(metrics.ux.timeToInteractive)}</li>
                <li>Error Count: {metrics.ux.errorCount}</li>
              </ul>
            </div>
            <div className="metric-card">
              <h4>Business Impact</h4>
              <ul>
                <li>Conversion Points: {metrics.business.conversionPoints}</li>
                <li>User Journey Steps: {metrics.business.userJourneySteps}</li>
              </ul>
            </div>
          </>
        );

      case 'Security Analyst':
        return (
          <>
            <div className="metric-card">
              <h4>Security Overview</h4>
              <ul>
                <li>Insecure Requests: {metrics.security.insecureRequests}</li>
                <li>Authentication Issues: {metrics.security.authIssues}</li>
                <li>Data Exposure Risks: {metrics.security.dataExposureRisks}</li>
              </ul>
            </div>
            <div className="metric-card">
              <h4>Compliance</h4>
              <ul>
                <li>GDPR Concerns: {metrics.security.gdprConcerns}</li>
                <li>PII Exposure: {metrics.security.piiExposure ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <div 
      className="metrics-panel" 
      role="region" 
      aria-label={`${persona} Metrics Overview`}
    >
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="metric-card"
            role="article"
            aria-labelledby={`metric-title-${index}`}
          >
            <h4 id={`metric-title-${index}`}>{metric.title}</h4>
            <div 
              className="metric-value"
              aria-label={`${metric.title} value: ${metric.value}`}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 