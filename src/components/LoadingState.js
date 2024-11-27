import React from 'react';
import './LoadingState.css';

export function LoadingState({ retryCount, maxRetries }) {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Analyzing HAR file... {retryCount > 0 && `(Attempt ${retryCount}/${maxRetries})`}</p>
      <p className="loading-subtext">
        {retryCount > 5 ? 'This might take a minute for large files...' : 'Just a moment...'}
      </p>
    </div>
  );
}

export default LoadingState; 