import axios from 'axios';

export async function fetchAnalysisResults(jobId, persona) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${persona}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Analysis not found');
    }
    throw new Error('Failed to fetch analysis results');
  }
}

export function filterDataBySearchAndFilters(data, searchTerm, activeFilters) {
  if (!data) return null;
  if (!searchTerm && (!activeFilters || !activeFilters.length)) return data;

  let filteredData = { ...data };
  
  if (filteredData.insights) {
    filteredData.insights = filteredData.insights.filter(insight => {
      const matchesSearch = !searchTerm || 
        insight.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = !activeFilters.length || 
        activeFilters.includes(insight.severity);
      return matchesSearch && matchesFilters;
    });
  }
  
  return filteredData;
} 