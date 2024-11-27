import React from 'react';
import PropTypes from 'prop-types';
import './PersonaSwitcher.css';

export function PersonaSwitcher({ currentPersona, onPersonaChange }) {
  const personas = [
    { id: 'developer', label: 'Developer', icon: '👨‍💻' },
    { id: 'qa', label: 'QA Professional', icon: '🔍' },
    { id: 'business', label: 'Business', icon: '📊' }
  ];

  return (
    <div className="persona-switcher">
      {personas.map(persona => (
        <button
          key={persona.id}
          className={`persona-button ${currentPersona === persona.id ? 'active' : ''}`}
          onClick={() => onPersonaChange(persona.id)}
        >
          <span className="persona-icon">{persona.icon}</span>
          <span className="persona-label">{persona.label}</span>
        </button>
      ))}
    </div>
  );
}

PersonaSwitcher.propTypes = {
  currentPersona: PropTypes.string.isRequired,
  onPersonaChange: PropTypes.func.isRequired
};

export default PersonaSwitcher; 