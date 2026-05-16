import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const tierBg = {
  High:   'rgba(16, 185, 129, 0.7)',
  Medium: 'rgba(245, 158, 11, 0.7)',
  Low:    'rgba(239, 68, 68, 0.7)',
};

const tierBorder = {
  High:   'rgba(16, 185, 129, 1)',
  Medium: 'rgba(245, 158, 11, 1)',
  Low:    'rgba(239, 68, 68, 1)',
};

export default function MatchScoreChart({ data }) {
  if (!data || data.length === 0) return null;

  const top10 = data.slice(0, 10);

  const chartData = {
    labels: top10.map((c) => c.name.split(' ')[0]),
    datasets: [
      {
        label: 'Match Score (%)',
        data: top10.map((c) => c.matchScore),
        backgroundColor: top10.map((c) => tierBg[c.tier] || 'rgba(99,102,241,0.7)'),
        borderColor: top10.map((c) => tierBorder[c.tier] || 'rgba(99,102,241,1)'),
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,21,40,0.95)',
        borderColor: 'rgba(99,102,241,0.3)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (ctx) => ` Score: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (v) => `${v}%`,
        },
      },
    },
  };

  return (
    <div className="card fade-in-delay-2" style={{ marginTop: '1.5rem' }}>
      <h2 className="card-title">
        <BarChart2 size={20} color="var(--accent-light)" />
        Match Score Chart
      </h2>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {[['High', '#10b981'], ['Medium', '#f59e0b'], ['Low', '#ef4444']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {label} Match
          </div>
        ))}
      </div>
    </div>
  );
}
