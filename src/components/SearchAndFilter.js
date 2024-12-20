import React from 'react';
import PropTypes from 'prop-types';
import './SearchAndFilter.css';

export function SearchAndFilter({ 
  searchTerm, 
  onSearchChange, 
  activeFilters, 
  onFilterChange,
  activeCategory,
  onCategoryChange 
}) {
  return (
    <div className="search-filter">
      <div className="category-buttons">
        {['Performance', 'Security', 'Errors', 'Cache'].map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category.toLowerCase() ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.toLowerCase())}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="search-filter-container">
        <div className="search-wrapper">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search metrics and insights..."
            className="search-input"
          />
        </div>
        
        <div className="filter-tags">
          {['Performance', 'Security', 'Errors', 'Cache'].map(filter => (
            <button
              key={filter}
              className={`filter-tag ${activeFilters.includes(filter) ? 'active' : ''}`}
              onClick={() => onFilterChange(
                activeFilters.includes(filter)
                  ? activeFilters.filter(f => f !== filter)
                  : [...activeFilters, filter]
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

SearchAndFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  activeCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default SearchAndFilter; 