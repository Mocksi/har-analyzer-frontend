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

  const processData = (rawData) => {
    if (!rawData || !rawData.metrics) {
      console.log('Invalid raw data:', rawData);
      return null;
    }

    // Ensure metrics has required structure with explicit defaults
    const metrics = {
      domains: [],
      timeseries: [],
      requestsByType: {},
      primary: {
        errorRate: 0,
        totalSize: 0,
        totalRequests: 0,
        avgResponseTime: 0
      },
      selected: {
        errorRequests: 0,
        largestRequests: [],
        slowestRequests: []
      },
      ...rawData.metrics,
      // Ensure timeseries is always an array
      timeseries: Array.isArray(rawData.metrics?.timeseries) 
        ? rawData.metrics.timeseries 
        : []
    };

    console.log('Processed metrics:', metrics);

    return {
      metrics,
      insights: Array.isArray(rawData.insights) ? rawData.insights : []
    };
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${currentPersona}`
      );
      
      console.log('Response:', response.data);

      if (response.data.status === 'processing') {
        console.log('Job still processing...');
        setRetryCount(prev => prev + 1);
        return false;
      }
      
      if (response.data.metrics) {
        const processedData = processData(response.data);
        if (processedData) {
          setData(processedData);
          setError(null);
          setLoading(false);
          return true;
        }
      }

      setError('Invalid response format');
      return false;
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error.message);
      return false;
    }
  };

  const handlePersonaChange = async (newPersona) => {
    setCurrentPersona(newPersona);
    setLoading(true);
    setRetryCount(0);
    setData(null);
    
    localStorage.removeItem(`results-${jobId}-${newPersona}`);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${newPersona}`
      );
      
      if (response.data && response.data.metrics) {
        localStorage.setItem(`results-${jobId}-${newPersona}`, JSON.stringify(response.data));
        setData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching results for new persona:', error);
      setError(error.response?.data?.error || 'Failed to fetch results');
    }
  };

  // Update cache key to include persona
  const getCacheKey = () => `results-${jobId}-${currentPersona}`;

  // Update useEffect to use persona-specific cache
  useEffect(() => {
    let intervalId;
    
    const startPolling = async () => {
      setLoading(true);
      
      // Try to load from cache first
      const cachedData = localStorage.getItem(getCacheKey());
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (parsed.metrics) {
          setData(parsed);
          setLoading(false);
        }
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
