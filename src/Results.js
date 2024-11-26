// src/Results.js

import React, { useState, useEffect } from 'react';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { SearchAndFilter } from './components/SearchAndFilter';
import { MetricsDrilldown } from './components/MetricsDrilldown';
import { MetricsPanel } from './components/MetricsPanel';
import { PerformanceCharts } from './components/PerformanceCharts';
import { InsightsPanel } from './components/InsightsPanel';
import { useDataRefresh } from './hooks/useDataRefresh';
import './Results.css';

function Results() {
  const [currentPersona, setCurrentPersona] = useState('developer');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const { data, loading, error, refresh } = useDataRefresh(
    () => fetchAnalysisResults(id, currentPersona),
    30000
  );

  const filteredData = React.useMemo(() => {
    if (!data) return null;
    
    return filterDataBySearchAndFilters(data, searchTerm, activeFilters);
  }, [data, searchTerm, activeFilters]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;

  return (
    <div className="results-container">
      <header className="results-header">
        <h1>Analysis Results</h1>
        <PersonaSwitcher 
          currentPersona={currentPersona}
          onPersonaChange={setCurrentPersona}
        />
      </header>

      <SearchAndFilter
        onSearch={setSearchTerm}
        onFilter={setActiveFilters}
      />

      <div className="results-content">
        <MetricsPanel 
          metrics={filteredData?.metrics}
          persona={currentPersona}
          onMetricSelect={setSelectedMetric}
        />

        {selectedMetric && (
          <MetricsDrilldown
            metric={selectedMetric}
            timeseriesData={data.timeseriesData[selectedMetric.id]}
            onClose={() => setSelectedMetric(null)}
          />
        )}

        <PerformanceCharts 
          data={filteredData?.metrics}
          persona={currentPersona}
        />

        <InsightsPanel 
          insights={filteredData?.insights}
          persona={currentPersona}
        />
      </div>
    </div>
  );
}

export default Results;
