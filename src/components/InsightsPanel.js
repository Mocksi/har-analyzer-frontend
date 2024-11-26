import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function InsightsPanel({ insights }) {
  const [filteredInsights, setFilteredInsights] = useState(insights);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    const filtered = insights.filter(insight => {
      const isExpired = new Date(insight.expires_at) < new Date();
      if (!showExpired && isExpired) return false;
      if (severityFilter !== 'all' && insight.severity !== severityFilter) return false;
      return true;
    });
    setFilteredInsights(filtered);
  }, [insights, severityFilter, showExpired]);

  const renderFilterControls = () => (
    <div className="insights-filters">
      <div className="filter-group">
        <label>Severity:</label>
        <select 
          value={severityFilter} 
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(e) => setShowExpired(e.target.checked)}
          />
          Show Expired
        </label>
      </div>
    </div>
  );

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3>Key Insights</h3>
        {renderFilterControls()}
      </div>
      
      {filteredInsights.length === 0 ? (
        <div className="no-insights">
          No insights match your current filters
        </div>
      ) : (
        filteredInsights.map((insight, index) => {
          const isExpired = new Date(insight.expires_at) < new Date();
          
          return (
            <div key={index} className={`insight-card ${isExpired ? 'expired' : ''}`}>
              <div className="insight-header">
                <span className={`insight-severity ${insight.severity}`}>
                  {insight.severity.toUpperCase()}
                </span>
                <span className="insight-expiry">
                  {isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(insight.expires_at))}`}
                </span>
              </div>
              <p className="insight-message">{insight.message}</p>
              {insight.recommendation && (
                <p className="insight-recommendation">
                  Recommendation: {insight.recommendation}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
} 