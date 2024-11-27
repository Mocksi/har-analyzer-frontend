import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './InsightsPanel.css';

export function InsightsPanel({ insights }) {
  const [severityFilter, setSeverityFilter] = useState('all');
  
  if (!insights || !insights.length) {
    return (
      <div className="insights-panel empty">
        <p>No insights available yet. Analysis may still be in progress.</p>
      </div>
    );
  }

  const filteredInsights = severityFilter === 'all'
    ? insights
    : insights.filter(insight => insight.severity === severityFilter);

  const severityCounts = insights.reduce((acc, insight) => {
    acc[insight.severity] = (acc[insight.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3>Performance Insights</h3>
        <div className="severity-filters">
          <button
            className={`filter-btn ${severityFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSeverityFilter('all')}
          >
            All ({insights.length})
          </button>
          {Object.entries(severityCounts).map(([severity, count]) => (
            <button
              key={severity}
              className={`filter-btn ${severity} ${severityFilter === severity ? 'active' : ''}`}
              onClick={() => setSeverityFilter(severity)}
            >
              {severity} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="insights-grid">
        {filteredInsights.map((insight, index) => {
          const isExpired = new Date(insight.expires_at) < new Date();
          
          return (
            <div 
              key={index} 
              className={`insight-card ${insight.severity} ${isExpired ? 'expired' : ''}`}
            >
              <div className="insight-header">
                <span className="severity-badge">
                  {insight.severity.toUpperCase()}
                </span>
                <span className="expiry-time">
                  {isExpired 
                    ? 'Expired'
                    : `Expires ${formatDistanceToNow(new Date(insight.expires_at))}`
                  }
                </span>
              </div>
              <p className="insight-message">{insight.message}</p>
              {insight.recommendation && (
                <div className="recommendation">
                  <strong>Recommendation:</strong>
                  <p>{insight.recommendation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InsightsPanel; 