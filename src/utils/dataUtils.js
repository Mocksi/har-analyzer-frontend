import axios from 'axios';

export async function fetchAnalysisResults(jobId, persona) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/results/${jobId}?persona=${persona}`
  );
  return response.data;
}

export function filterDataBySearchAndFilters(data, searchTerm, activeFilters) {
  if (!searchTerm && (!activeFilters || activeFilters.length === 0)) {
    return data;
  }

  // Implement your filtering logic here
  return data;
} 