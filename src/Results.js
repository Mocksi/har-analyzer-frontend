// src/Results.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { SearchAndFilter } from './components/SearchAndFilter';
import { MetricsDrilldown } from './components/MetricsDrilldown';
import { MetricsPanel } from './components/MetricsPanel';
import { PerformanceCharts } from './components/PerformanceCharts';
import { InsightsPanel } from './components/InsightsPanel';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import './Results.css';
import { filterDataBySearchAndFilters } from './utils/dataUtils';

function Results() {
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
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(async () => {
      try {
        await fetchResults();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch results');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [jobId, currentPersona]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchResults} />;
  if (!data) return null;

  const filteredData = filterDataBySearchAndFilters(data, searchTerm, activeFilters);

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

      <MetricsPanel metrics={filteredData.metrics} />
      
      <PerformanceCharts 
        metrics={filteredData.metrics}
        persona={currentPersona}
      />
      
      <MetricsDrilldown 
        metric={filteredData.metrics.selected || filteredData.metrics.primary}
        timeseriesData={filteredData.metrics.timeseries}
      />
      
      <InsightsPanel insights={filteredData.insights} />
    </div>
  );
}

export default Results;
