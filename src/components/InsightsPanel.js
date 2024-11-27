import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './InsightsPanel.css';

export function InsightsPanel({ metrics, insights, persona }) {
  if (!insights || insights.length === 0) {
    return <div>No insights available</div>;
  }

  const filteredInsights = insights.filter(insight => {
    switch(persona) {
      case 'developer':
        return insight.category === 'Performance' || insight.category === 'Cache';
      case 'qa':
        return insight.category === 'Errors' || insight.category === 'Security';
      case 'salesEngineer':
        return true; // Show all insights
      default:
        return true;
    }
  });

  return (
    <div className="insights-panel">
      {filteredInsights.map((insight, index) => (
        <div key={index} className={`insight-box ${insight.severity}`}>
          <h3>{insight.category}</h3>
          <p>{insight.content}</p>
        </div>
      ))}
    </div>
  );
}

function MetricsDisplay({ metrics, type }) {
  if (!metrics) return null;

  const displays = {
    performance: (
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>HTTP Performance</h4>
          <p>Avg Response Time: {metrics.httpStats.avgResponseTime.toFixed(2)}ms</p>
          <p>Slowest Requests: {metrics.httpStats.slowestRequests.length}</p>
        </div>
        <div className="metric-card">
          <h4>WebSocket Performance</h4>
          <p>Messages: {metrics.wsStats.messageCount}</p>
          <p>Avg Size: {(metrics.wsStats.avgMessageSize / 1024).toFixed(2)}KB</p>
        </div>
      </div>
    ),
    security: (
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Security Issues</h4>
          <p>Insecure Requests: {metrics.insecureRequests.length}</p>
          <p>Protocol Distribution:</p>
          <ul>
            <li>HTTP: {metrics.protocolUsage.http}</li>
            <li>WebSocket: {metrics.protocolUsage.websocket}</li>
          </ul>
        </div>
      </div>
    ),
    errors: (
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Error Distribution</h4>
          <p>Error Rate: {(metrics.errorRate * 100).toFixed(2)}%</p>
          <p>WebSocket Errors: {metrics.wsErrors.length}</p>
        </div>
      </div>
    ),
    cache: (
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Cache Performance</h4>
          <p>Hit Rate: {(metrics.hitRate * 100).toFixed(2)}%</p>
          <p>Hits: {metrics.hits}</p>
          <p>Misses: {metrics.misses}</p>
        </div>
      </div>
    )
  };

  return displays[type] || null;
}

function InsightCard({ insight }) {
  return (
    <div className={`insight-card ${insight.severity}`}>
      <div className="insight-header">
        <span className="severity-badge">{insight.severity}</span>
        <span className="category-badge">{insight.category}</span>
      </div>
      
      <h3 className="insight-title">{insight.message}</h3>
      
      {insight.details && insight.details.length > 0 && (
        <div className="insight-details">
          <ul>
            {insight.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
      
      {insight.recommendations && insight.recommendations.length > 0 && (
        <div className="insight-recommendations">
          <h4>Recommendations:</h4>
          <ul>
            {insight.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default InsightsPanel; 