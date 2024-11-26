export const exportResults = (result) => {
  const exportData = {
    summary: result.metrics,
    timestamp: result.created_at,
    persona: result.persona,
    insights: result.insights
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `har-analysis-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
} 