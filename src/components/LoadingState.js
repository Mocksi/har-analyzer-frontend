import React from 'react';
import './LoadingState.css';

export function LoadingState() {
  return (
    <div className="loading-skeleton" aria-label="Loading content">
      <div className="skeleton-header"></div>
      <div className="skeleton-chart"></div>
      <div className="skeleton-metrics"></div>
    </div>
  );
} 