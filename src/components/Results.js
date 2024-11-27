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

const PERSONA_CONFIGS = {
  developer: {
    metrics: ['responseTime', 'bundleSize', 'codeOptimization'],
    insights: ['technical', 'performance'],
    charts: ['timeseriesDetailed', 'resourceBreakdown'],
    actionItems: ['codeLevel', 'optimization']
  },
  qa: {
    metrics: ['errorRates', 'userFlows', 'browserCompatibility'],
    insights: ['testing', 'reliability'],
    charts: ['errorPatterns', 'userJourneys'],
    actionItems: ['testCases', 'regressionPoints']
  },
  salesEngineer: {
    metrics: ['businessImpact', 'userExperience', 'competitiveEdge'],
    insights: ['business', 'customer'],
    charts: ['highLevel', 'comparison'],
    actionItems: ['roi', 'customerValue']
  }
};

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
  const [activeCategory, setActiveCategory] = useState('performance');
  const [siteInfo, setSiteInfo] = useState({
    domainName: '',
    timestamp: '',
    environment: '',
    reportId: ''
  });

  const processData = (rawData) => {
    if (!rawData || !rawData.metrics) {
      console.log('Invalid raw data:', rawData);
      return null;
    }

    // Extract site information
    const primaryDomain = rawData.metrics.domains?.[0] || 'Unknown Domain';
    const timestamp = new Date().toLocaleString();
    
    setSiteInfo({
      domainName: primaryDomain,
      timestamp: timestamp,
      environment: rawData.metrics.environment || 'Production',
      reportId: `HAR-${jobId}-${timestamp.split(',')[0].replace(/\//g, '')}`
    });

    // Ensure metrics has required structure with explicit defaults
    const metrics = {
      domains: Array.isArray(rawData.metrics.domains) 
        ? rawData.metrics.domains 
        : (rawData.metrics.domains instanceof Set 
          ? Array.from(rawData.metrics.domains) 
          : []),
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

  const filterByCategory = (data, category) => {
    switch(category.toLowerCase()) {
      case 'performance':
        return {
          ...data,
          insights: data.insights.filter(insight => 
            insight.category.toLowerCase().includes('performance') ||
            insight.category.toLowerCase().includes('speed') ||
            insight.category.toLowerCase().includes('timing')
          ),
          metrics: {
            ...data.metrics,
            selected: {
              ...data.metrics.selected,
              // Prioritize performance-related metrics
              slowestRequests: data.metrics.selected.slowestRequests || [],
              avgResponseTime: data.metrics.primary.avgResponseTime
            }
          }
        };
      
      case 'security':
        return {
          ...data,
          insights: data.insights.filter(insight =>
            insight.category.toLowerCase().includes('security') ||
            insight.category.toLowerCase().includes('vulnerability') ||
            insight.category.toLowerCase().includes('risk')
          ),
          metrics: {
            ...data.metrics,
            selected: {
              ...data.metrics.selected,
              // Highlight security-related metrics
              httpsCounts: data.metrics.requestsByType['https'] || 0,
              insecureRequests: data.metrics.requestsByType['http'] || 0
            }
          }
        };

      case 'errors':
        return {
          ...data,
          insights: data.insights.filter(insight =>
            insight.category.toLowerCase().includes('error') ||
            insight.category.toLowerCase().includes('failure') ||
            insight.severity === 'critical'
          ),
          metrics: {
            ...data.metrics,
            selected: {
              ...data.metrics.selected,
              // Focus on error metrics
              errorRequests: data.metrics.selected.errorRequests,
              statusCodes: data.metrics.statusCodes
            }
          }
        };

      case 'cache':
        return {
          ...data,
          insights: data.insights.filter(insight =>
            insight.category.toLowerCase().includes('cache') ||
            insight.category.toLowerCase().includes('performance')
          ),
          metrics: {
            ...data.metrics,
            selected: {
              ...data.metrics.selected,
              // Show cache-related metrics
              cacheHits: data.metrics.httpMetrics.cacheHits,
              cacheMisses: data.metrics.httpMetrics.cacheMisses
            }
          }
        };

      default:
        return data;
    }
  };

  const filteredAndSearchedData = filterByCategory(
    filterDataBySearchAndFilters(filteredData, searchTerm, activeFilters),
    activeCategory
  );

  // Add report header component
  const ReportHeader = () => (
    <div className="report-header">
      <div className="report-meta">
        <h1>{siteInfo.domainName} Performance Analysis</h1>
        <div className="report-details">
          <span>Report ID: {siteInfo.reportId}</span>
          <span>Generated: {siteInfo.timestamp}</span>
          <span>Environment: {siteInfo.environment}</span>
          <span>Analyzed by: {currentPersona.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
        </div>
      </div>
      <div className="report-summary">
        <h2>Executive Summary</h2>
        {currentPersona === 'salesEngineer' ? (
          <p>Business Impact Analysis for {siteInfo.domainName}</p>
        ) : currentPersona === 'developer' ? (
          <p>Technical Performance Report for {siteInfo.domainName}</p>
        ) : (
          <p>Quality Assurance Analysis for {siteInfo.domainName}</p>
        )}
      </div>
    </div>
  );

  // Persona-specific summary
  const getPersonaSummary = (metrics, insights) => {
    switch(currentPersona) {
      case 'developer':
        return {
          title: 'Technical Overview',
          summary: `Analysis of ${metrics.totalRequests} requests across ${metrics.domains.length} domains. 
                   Average response time: ${metrics.primary.avgResponseTime}ms.`
        };
      case 'qa':
        return {
          title: 'Quality Metrics',
          summary: `Error rate: ${(metrics.primary.errorRate * 100).toFixed(1)}%. 
                   ${metrics.selected.errorRequests} issues identified across ${metrics.domains.length} domains.`
        };
      case 'salesEngineer':
        return {
          title: 'Business Impact',
          summary: `Site performance analysis for ${siteInfo.domainName}. 
                   Key metrics indicate ${metrics.primary.errorRate < 0.01 ? 'stable' : 'attention needed'} performance.`
        };
      default:
        return { title: 'Analysis Summary', summary: '' };
    }
  };

  return (
    <div className="results-container">
      <ReportHeader />
      
      <div className="report-body">
        <PersonaSwitcher
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
          domain={siteInfo.domainName}
        />
        
        <div className="analysis-summary">
          {(() => {
            const { title, summary } = getPersonaSummary(filteredAndSearchedData.metrics, filteredAndSearchedData.insights);
            return (
              <>
                <h3>{title}</h3>
                <p>{summary}</p>
              </>
            );
          })()}
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          context={siteInfo}
        />

        <MetricsPanel 
          metrics={filteredAndSearchedData.metrics}
          domain={siteInfo.domainName}
          persona={currentPersona}
        />
        
        <PerformanceCharts 
          metrics={filteredAndSearchedData.metrics}
          persona={currentPersona}
          domain={siteInfo.domainName}
        />
        
        <MetricsDrilldown 
          metric={filteredAndSearchedData.metrics.selected || filteredAndSearchedData.metrics.primary || {}}
          timeseriesData={filteredAndSearchedData.metrics.timeseries}
          domain={siteInfo.domainName}
        />
        
        <InsightsPanel 
          insights={filteredAndSearchedData.insights}
          error={filteredAndSearchedData.error}
          context={siteInfo}
          persona={currentPersona}
        />
      </div>

      <div className="report-footer">
        <p>Generated by HAR Analyzer on {siteInfo.timestamp}</p>
        <p>Report ID: {siteInfo.reportId}</p>
      </div>
    </div>
  );
}

export default Results;
