import React from 'react';
import { PERSONA_CONFIGS } from '../config/personas';
import './InsightsPanel.css';

export function InsightsPanel({ metrics, insights, persona }) {
  if (!insights) return <div className="insights-panel">No insights available</div>;

  const { baseInsights, personaInsights } = insights;
  const personaConfig = PERSONA_CONFIGS[persona];

  // Combine and filter insights based on persona configuration
  const relevantInsights = [
    ...baseInsights.filter(insight => 
      personaConfig.insights.includes(insight.category.toLowerCase())
    ),
    ...(personaInsights[persona] || [])
  ];

  return (
    <div className="insights-panel">
      {relevantInsights.map((insight, index) => (
        <div key={index} className={`insight-box ${insight.severity}`}>
          <div className="insight-header">
            <span className="category-badge">{insight.category}</span>
            <span className="severity-badge">{insight.severity}</span>
          </div>
          <h3 className="insight-title">{insight.title}</h3>
          <p>{insight.content}</p>
          
          {insight.recommendations && (
            <div className="insight-recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {insight.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default InsightsPanel; 