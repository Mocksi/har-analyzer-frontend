import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './InsightsPanel.css';

export function InsightsPanel({ metrics, insights, error, persona, onPersonaChange }) {
  const [activeTab, setActiveTab] = useState('performance');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Helper function to filter insights by category
  function filterInsightsByCategory(insights, category) {
    if (!insights) return [];
    return insights.filter(insight => 
      insight.category === category || 
      insight.categories?.includes(category)
    );
  }

  // Helper function to calculate error rate
  function calculateErrorRate(metrics) {
    if (!metrics?.httpMetrics?.statusCodes) return 0;
    
    const totalRequests = metrics.httpMetrics.requests;
    if (totalRequests === 0) return 0;

    const errorRequests = Object.entries(metrics.httpMetrics.statusCodes)
      .reduce((sum, [status, count]) => {
        return status >= 400 ? sum + count : sum;
      }, 0);

    return errorRequests / totalRequests;
  }

  const tabs = {
    performance: {
      label: 'Performance',
      insights: filterInsightsByCategory(insights, 'performance'),
      metrics: getPerformanceMetrics(metrics)
    },
    security: {
      label: 'Security',
      insights: filterInsightsByCategory(insights, 'security'),
      metrics: getSecurityMetrics(metrics)
    },
    errors: {
      label: 'Errors',
      insights: filterInsightsByCategory(insights, 'error'),
      metrics: getErrorMetrics(metrics)
    },
    cache: {
      label: 'Cache',
      insights: filterInsightsByCategory(insights, 'cache'),
      metrics: getCacheMetrics(metrics)
    }
  };

  const personas = [
    { id: 'developer', label: 'Developer' },
    { id: 'qa', label: 'QA Professional' },
    { id: 'business', label: 'Business/Sales' }
  ];

  // Helper functions to extract specific metrics
  function getPerformanceMetrics(metrics) {
    if (!metrics) return null;
    return {
      httpStats: {
        avgResponseTime: metrics.httpMetrics.totalTime / metrics.httpMetrics.requests,
        slowestRequests: metrics.httpMetrics.slowestRequests,
        largestRequests: metrics.httpMetrics.largestRequests
      },
      wsStats: {
        messageCount: metrics.websocketMetrics.messageCount,
        avgMessageSize: metrics.websocketMetrics.averageMessageSize,
        connectionDuration: metrics.websocketMetrics.connectionDuration
      }
    };
  }

  function getSecurityMetrics(metrics) {
    if (!metrics) return null;
    return {
      insecureRequests: metrics.httpMetrics.securityIssues,
      protocolUsage: {
        http: metrics.httpMetrics.requests,
        websocket: metrics.websocketMetrics.connections
      }
    };
  }

  function getErrorMetrics(metrics) {
    if (!metrics) return null;
    return {
      statusCodes: metrics.httpMetrics.statusCodes,
      wsErrors: metrics.websocketMetrics.errors,
      errorRate: calculateErrorRate(metrics)
    };
  }

  function getCacheMetrics(metrics) {
    if (!metrics) return null;
    return {
      hits: metrics.httpMetrics.cacheHits,
      misses: metrics.httpMetrics.cacheMisses,
      hitRate: metrics.httpMetrics.cacheHits / 
        (metrics.httpMetrics.cacheHits + metrics.httpMetrics.cacheMisses)
    };
  }

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3>AI Analysis</h3>
        <div className="persona-selector">
          {personas.map(p => (
            <button
              key={p.id}
              className={`persona-button ${persona === p.id ? 'active' : ''}`}
              onClick={() => onPersonaChange(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="insights-tabs">
        {Object.entries(tabs).map(([key, tab]) => (
          <button
            key={key}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="insights-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <MetricsDisplay metrics={tabs[activeTab].metrics} type={activeTab} />
            <div className="insights-grid">
              {tabs[activeTab].insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </>
        )}
      </div>
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
        <span className="severity-badge">{insight.severity.toUpperCase()}</span>
        <span className="category-badge">{insight.category}</span>
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
}

export default InsightsPanel; 