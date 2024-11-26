import React from 'react';
import './ErrorState.css';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state">
      <p>Error loading results: {error.message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
} 