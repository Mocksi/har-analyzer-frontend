import React from 'react';
import PropTypes from 'prop-types';
import { PERSONA_CONFIGS } from '../config/personas';
import { formatMetric, getMetricType } from '../utils/metricUtils';
import './MetricsPanel.css';

export function MetricsPanel({ metrics, persona }) {
  if (!metrics) return null;

  const personaConfig = PERSONA_CONFIGS[persona];
  
  const getRelevantMetrics = () => {
    switch(persona) {
      case 'developer':
        return {
          responseTime: metrics.httpMetrics.totalTime / metrics.httpMetrics.requests,
          bundleSize: metrics.totalSize,
          errorRate: metrics.httpMetrics.errorRate
        };
      case 'qa':
        return {
          errorRate: metrics.httpMetrics.errorRate,
          testCoverage: metrics.httpMetrics.coverage,
          userFlows: metrics.flowMetrics
        };
      case 'salesEngineer':
        return {
          performance: metrics.primary.avgResponseTime,
          reliability: (1 - metrics.httpMetrics.errorRate) * 100,
          userExperience: metrics.experienceScore
        };
      default:
        return metrics;
    }
  };

  const relevantMetrics = getRelevantMetrics();

  return (
    <div className="metrics-panel">
      <div className="metrics-grid">
        {Object.entries(relevantMetrics).map(([key, value]) => (
          <div key={key} className="metric-card">
            <h4>{key}</h4>
            <p>{formatMetric(value, getMetricType(key))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

MetricsPanel.propTypes = {
  metrics: PropTypes.object.isRequired,
  persona: PropTypes.string
};

export default MetricsPanel; 