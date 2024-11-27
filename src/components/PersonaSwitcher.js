import React from 'react';
import PropTypes from 'prop-types';
import './PersonaSwitcher.css';

const PERSONAS = [
  { id: 'developer', label: 'Developer', icon: '⚡' },
  { id: 'analyst', label: 'Business Analyst', icon: '📊' },
  { id: 'security', label: 'Security Analyst', icon: '🔒' }
];

export function PersonaSwitcher({ currentPersona, onPersonaChange }) {
  return (
    <div className="persona-switcher" role="radiogroup" aria-label="Select persona">
      {PERSONAS.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`persona-option ${currentPersona === id ? 'active' : ''}`}
          onClick={() => onPersonaChange(id)}
          aria-checked={currentPersona === id}
          role="radio"
        >
          <span className="persona-icon">{icon}</span>
          <span className="persona-label">{label}</span>
        </button>
      ))}
    </div>
  );
}

PersonaSwitcher.propTypes = {
  currentPersona: PropTypes.string.isRequired,
  onPersonaChange: PropTypes.func.isRequired
}; 