export const formatMetric = (value, type) => {
  if (value === undefined || value === null) return 'N/A';
  
  switch(type) {
    case 'time':
      return `${value.toFixed(2)}ms`;
    case 'size':
      return `${(value / 1024).toFixed(2)}KB`;
    case 'percentage':
      return `${(value * 100).toFixed(2)}%`;
    default:
      return value?.toFixed?.(2) ?? value;
  }
};

export const getMetricType = (key) => {
  const timeMetrics = ['responseTime', 'performance', 'loadTime'];
  const sizeMetrics = ['bundleSize', 'totalSize'];
  const percentageMetrics = ['errorRate', 'reliability', 'testCoverage'];

  if (timeMetrics.includes(key)) return 'time';
  if (sizeMetrics.includes(key)) return 'size';
  if (percentageMetrics.includes(key)) return 'percentage';
  return 'number';
}; 