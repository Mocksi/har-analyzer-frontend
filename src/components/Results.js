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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 12;

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${currentPersona}`
      );
      
      if (response.data) {
        const metrics = response.data.metrics || {};
        metrics.selected = metrics.selected || {};
        metrics.primary = metrics.primary || {};
        metrics.timeseries = metrics.timeseries || [];
        
        setData({
          ...response.data,
          metrics
        });
        setError(null);
        return true;
      }
      
      setRetryCount(prev => prev + 1);
      return false;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch results');
      return true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
    
    const startPolling = async () => {
      const shouldStop = await fetchResults();
      
      if (!shouldStop && retryCount < MAX_RETRIES) {
        intervalId = setInterval(async () => {
          const shouldStop = await fetchResults();
          if (shouldStop || retryCount >= MAX_RETRIES) {
            clearInterval(intervalId);
          }
        }, 5000);
      }
    };

    startPolling();
    return () => intervalId && clearInterval(intervalId);
  }, [jobId, currentPersona]);

  if (retryCount >= MAX_RETRIES) {
    return <ErrorState error={{ message: 'Analysis timed out. Please try again.' }} />;
  }

  if (loading && !data) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchResults} />;
  if (!data || !data.metrics) return null;

  const filteredData = {
    metrics: {
      ...data.metrics,
      selected: data.metrics.selected || {},
      primary: data.metrics.primary || {},
      timeseries: data.metrics.timeseries || []
    },
    insights: data.insights,
    error: data.error
  };

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
