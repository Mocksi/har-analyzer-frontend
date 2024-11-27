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
  const MAX_RETRIES = 30; // 30 retries = 2.5 minutes with 5s intervals

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${currentPersona}`
      );
      
      if (response.status === 202) {
        console.log('Job still processing...');
        setRetryCount(prev => prev + 1);
        return false;
      }
      
      if (response.data) {
        const cacheKey = `results-${jobId}-${currentPersona}`;
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        setData(response.data);
        setError(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.log('Error fetching results:', err.response?.status);
      if (err.response?.status === 404) {
        const cachedData = localStorage.getItem(`results-${jobId}`);
        if (cachedData) {
          console.log('Using cached data');
          setData(JSON.parse(cachedData));
          setError(null);
          return true;
        }
        // If no cached data and not max retries, continue polling
        if (retryCount < MAX_RETRIES) {
          console.log('No cache, continuing to poll');
          setRetryCount(prev => prev + 1);
          return false;
        }
      }
      setError(err.response?.data?.error || 'Failed to fetch results');
      return true; // Stop polling on other errors
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaChange = async (newPersona) => {
    setCurrentPersona(newPersona);
    setLoading(true);
    setRetryCount(0);
    
    // Clear existing data to show loading state
    setData(null);
    
    // Remove cached data for this job-persona combination
    localStorage.removeItem(`results-${jobId}-${newPersona}`);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${newPersona}`
      );
      
      if (response.data) {
        localStorage.setItem(`results-${jobId}-${newPersona}`, JSON.stringify(response.data));
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching results for new persona:', error);
      setError(error.response?.data?.error || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  // Update cache key to include persona
  const getCacheKey = () => `results-${jobId}-${currentPersona}`;

  // Update useEffect to use persona-specific cache
  useEffect(() => {
    let intervalId;
    
    const startPolling = async () => {
      // Try to load from cache first
      const cachedData = localStorage.getItem(getCacheKey());
      if (cachedData) {
        setData(JSON.parse(cachedData));
        setLoading(false);
      }

      // Start polling
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
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, currentPersona]); // currentPersona dependency triggers reload

  // Show timeout error if max retries reached
  if (retryCount >= MAX_RETRIES && !data) {
    return (
      <ErrorState 
        error={{ 
          message: 'Analysis is taking longer than expected. Please try refreshing the page.' 
        }} 
        onRetry={() => {
          setRetryCount(0);
          fetchResults();
        }}
      />
    );
  }

  if (loading && !data) return <LoadingState retryCount={retryCount} maxRetries={MAX_RETRIES} />;
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
        onPersonaChange={handlePersonaChange}
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
