import React from 'react';
import PropTypes from 'prop-types';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './PerformanceCharts.css';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function PerformanceCharts({ metrics, persona }) {
  if (!metrics) return null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Spline Sans Mono, monospace'
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const statusCodeData = {
    labels: Object.keys(metrics.statusDistribution || {}),
    datasets: [{
      label: 'Status Codes',
      data: Object.values(metrics.statusDistribution || {}),
      backgroundColor: [
        '#4CAF50', // 2xx
        '#FFC107', // 3xx
        '#FF9800', // 4xx
        '#F44336'  // 5xx
      ]
    }]
  };

  const timingData = {
    labels: (metrics.slowestRequests || [])
      .map(req => new URL(req.url).pathname.split('/').slice(-1)[0]),
    datasets: [{
      label: 'Response Time (ms)',
      data: (metrics.slowestRequests || []).map(req => req.time),
      backgroundColor: '#2196F3'
    }]
  };

  return (
    <div className="performance-charts">
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Status Code Distribution</h3>
        </div>
        <div style={{ height: '300px' }}>
          <Pie data={statusCodeData} options={chartOptions} />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Slowest Requests</h3>
        </div>
        <div style={{ height: '300px' }}>
          <Bar data={timingData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

PerformanceCharts.propTypes = {
  metrics: PropTypes.shape({
    statusDistribution: PropTypes.object,
    slowestRequests: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      time: PropTypes.number
    }))
  }),
  persona: PropTypes.string.isRequired
};

export default PerformanceCharts; 