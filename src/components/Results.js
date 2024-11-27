// src/Results.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PersonaSwitcher from './PersonaSwitcher';
import SearchAndFilter from './SearchAndFilter';
import MetricsDrilldown from './MetricsDrilldown';
import MetricsPanel from './MetricsPanel';
import PerformanceCharts from './PerformanceCharts';
import { InsightsPanel } from './InsightsPanel';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import './Results.css';
import { filterDataBySearchAndFilters } from '../utils/dataUtils';
import PerformanceMetrics from './PerformanceMetrics';
import { PERSONA_CONFIGS } from '../config/personas';

export function Results() {
  const { jobId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPersona, setCurrentPersona] = useState('developer');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/results/${jobId}`);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [jobId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <ErrorState error="No data available" />;

  return (
    <div className="results-container">
      <PersonaSwitcher 
        currentPersona={currentPersona} 
        onPersonaChange={setCurrentPersona} 
      />
      <PerformanceMetrics metrics={data.metrics} />
      <PerformanceCharts metrics={data.metrics} />
      <MetricsDrilldown 
        metric={data.metrics.primary} 
        timeseriesData={data.metrics.timeseries} 
      />
      <InsightsPanel 
        insights={data.insights}
        metrics={data.metrics}
        persona={currentPersona}
      />
    </div>
  );
}

export default Results;
