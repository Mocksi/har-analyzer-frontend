// src/Results.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PersonaSwitcher from './PersonaSwitcher';
import SearchAndFilter from './SearchAndFilter';
import MetricsDrilldown from './MetricsDrilldown';
import MetricsPanel from './MetricsPanel';
import PerformanceCharts from './PerformanceCharts';
import InsightsPanel from './InsightsPanel';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import './Results.css';
import { filterDataBySearchAndFilters } from '../utils/dataUtils';

export function Results() {
  const { jobId } = useParams();
  const [currentPersona, setCurrentPersona] = useState('developer');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${currentPersona}`
      );
      
      if (response.data) {
        // Store in localStorage for persistence
        localStorage.setItem(`results-${jobId}`, JSON.stringify(response.data));
        
        setData(response.data);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      if (err.response?.status === 404) {
        // Try to get from localStorage
        const cachedData = localStorage.getItem(`results-${jobId}`);
        if (cachedData) {
          setData(JSON.parse(cachedData));
          setError(null);
          return true;
        }
      }
      setError(err.response?.data?.error || 'Failed to fetch results');
      return true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from cache first
    const cachedData = localStorage.getItem(`results-${jobId}`);
    if (cachedData) {
      setData(JSON.parse(cachedData));
      setLoading(false);
    }
    
    fetchResults();
  }, [jobId, currentPersona]);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={fetchResults} />;
  if (!data) return null;

  return (
    <div className="results-container">
      <PersonaSwitcher
        currentPersona={currentPersona}
        onPersonaChange={setCurrentPersona}
      />
      
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      <MetricsPanel 
        metrics={filteredData.metrics} 
      />
      
      <PerformanceCharts 
        metrics={filteredData.metrics}
        persona={currentPersona}
      />
      
      <MetricsDrilldown 
        metric={filteredData.metrics.selected || filteredData.metrics.primary || {}}
        timeseriesData={filteredData.metrics.timeseries}
      />
      
      <InsightsPanel 
        insights={filteredData.insights} 
        error={filteredData.error}
      />
    </div>
  );
}

export default Results;
