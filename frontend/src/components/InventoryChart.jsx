import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function InventoryChart() {
  const { items: products } = useSelector((state) => state.products);

  // Generate fake historical data based on the current products to make the chart look alive
  // In a real app, this would come from a backend time-series aggregation
  const totalItems = products.length;
  const currentTotalValue = products.reduce((sum, p) => sum + Number(p.price), 0);

  // Fake 7-day trend data
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Create an artificial upward trend ending at the actual current value
  const dataValues = [
    currentTotalValue * 0.85,
    currentTotalValue * 0.88,
    currentTotalValue * 0.90,
    currentTotalValue * 0.93,
    currentTotalValue * 0.96,
    currentTotalValue * 0.98,
    currentTotalValue,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Asset Valuation',
        data: dataValues,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          return gradient;
        },
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#71717a',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#71717a',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          callback: function(value) {
            return '$' + (value / 1000) + 'k';
          }
        },
        beginAtZero: false,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', padding: '1rem' }}>
      {products.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Awaiting Data Ingestion...
        </div>
      )}
    </div>
  );
}
