import React from 'react';
import './LoadingState.css';

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading analysis results...</p>
    </div>
  );
}

export default LoadingState; 