import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ResultChart = ({ candidates }) => {
  const barData = {
    labels: candidates.map(c => c.name),
    datasets: [{
      label: 'Votes',
      data: candidates.map(c => c.vote_count || 0),
      backgroundColor: '#6366f1',
      borderRadius: 8,
    }]
  };

  const pieData = {
    labels: candidates.map(c => c.name),
    datasets: [{
      data: candidates.map(c => c.vote_count || 0),
      backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'],
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Bar Chart</h3>
        <Bar data={barData} options={options} />
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Pie Chart</h3>
        <Pie data={pieData} options={options} />
      </div>
    </div>
  );
};

export default ResultChart;