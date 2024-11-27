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
        localStorage.setItem(`results-${jobId}`, JSON.stringify(response.data));
        setData(response.data);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      if (err.response?.status === 404) {
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

  // Filter and structure the data
  const filteredData = {
    metrics: {
      ...data.metrics,
      selected: data.metrics?.selected || {},
      primary: data.metrics?.primary || {},
      timeseries: data.metrics?.timeseries || [],
      requestsByType: data.metrics?.requestsByType || {},
      statusCodes: data.metrics?.statusCodes || {},
      domains: data.metrics?.domains || []
    },
    insights: data.insights,
    error: data.error
  };

  // Apply search and filters if needed
  const filterDataBySearchAndFilters = (data, searchTerm, filters) => {
    // Add your filtering logic here if needed
    return data;
  };

  const filteredAndSearchedData = filterDataBySearchAndFilters(filteredData, searchTerm, activeFilters);

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
        metrics={filteredAndSearchedData.metrics} 
      />
      
      <PerformanceCharts 
        metrics={filteredAndSearchedData.metrics}
        persona={currentPersona}
      />
      
      <MetricsDrilldown 
        metric={filteredAndSearchedData.metrics.selected || filteredAndSearchedData.metrics.primary || {}}
        timeseriesData={filteredAndSearchedData.metrics.timeseries}
      />
      
      <InsightsPanel 
        insights={filteredAndSearchedData.insights} 
        error={filteredAndSearchedData.error}
      />
    </div>
  );
}

export default Results;
