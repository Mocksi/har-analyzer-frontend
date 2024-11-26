import React, { useState } from 'react';
import './SearchAndFilter.css';

export function SearchAndFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = (filter) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="search-filter-container">
      <div className="search-wrapper">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search metrics and insights..."
          className="search-input"
        />
      </div>
      
      <div className="filter-tags">
        {['Performance', 'Security', 'Errors', 'Cache'].map(filter => (
          <button
            key={filter}
            className={`filter-tag ${activeFilters.includes(filter) ? 'active' : ''}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
} 