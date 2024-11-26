import React from 'react';
import { Bar, Pie, Line, Chart as ChartJS } from 'react-chartjs-2';
import {
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

ChartJS.register(
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

const darkTheme = {
  backgroundColor: 'var(--black)',
  borderColor: 'var(--dark-grey)',
  color: 'var(--light-grey)',
  font: {
    family: 'Spline Sans Mono, monospace'
  },
  grid: {
    color: 'var(--dark-grey)',
    borderColor: 'var(--dark-grey)',
    borderDash: [2, 2]
  },
  point: {
    backgroundColor: 'var(--primary-fixed)',
    borderColor: 'var(--black)'
  }
};

ChartJS.defaults.color = 'var(--light-grey)';
ChartJS.defaults.font.family = 'Spline Sans Mono, monospace';

export function PerformanceCharts({ metrics }) {
  const statusCodeData = {
    labels: Object.keys(metrics.api.statusDistribution),
    datasets: [{
      label: 'Status Codes',
      data: Object.values(metrics.api.statusDistribution),
      backgroundColor: [
        '#4CAF50', // 2xx
        '#FFC107', // 3xx
        '#FF9800', // 4xx
        '#F44336'  // 5xx
      ]
    }]
  };

  const timingData = {
    labels: metrics.performance.slowRequests.map(req => new URL(req.url).pathname),
    datasets: [{
      label: 'Response Time (ms)',
      data: metrics.performance.slowRequests.map(req => req.time),
      backgroundColor: '#2196F3'
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'var(--light-grey)',
          font: {
            family: 'Spline Sans Mono, sans-serif'
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'var(--dark-grey)'
        },
        ticks: {
          color: 'var(--light-grey)'
        }
      },
      y: {
        grid: {
          color: 'var(--dark-grey)'
        },
        ticks: {
          color: 'var(--light-grey)'
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <h3>Status Code Distribution</h3>
        <Pie data={statusCodeData} options={chartOptions} />
      </div>
      <div className="chart-wrapper">
        <h3>Slowest Requests</h3>
        <Bar data={timingData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PerformanceCharts; 