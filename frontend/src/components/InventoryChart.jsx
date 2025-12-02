import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InventoryChart() {
  const { items: products } = useSelector((state) => state.products);

  // Calculate category distribution
  const categoryCounts = products.reduce((acc, product) => {
    const cat = product.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(categoryCounts);
  const dataValues = Object.values(categoryCounts);

  // Generate monochrome/terminal-white colors
  const colors = [
    '#ffffff', // Pure White
    '#d4d4d4', // Light Gray
    '#a3a3a3', // Medium Gray
    '#737373', // Dark Gray
    '#525252', // Darker Gray
    '#262626', // Almost Black
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: '# of Products',
        data: dataValues,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#000000',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e0e0e0', // Light gray text
          font: {
            family: "'Share Tech Mono', monospace", // Match app font
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.95)', // Dark background
        titleColor: '#ffffff', // White title
        bodyColor: '#cccccc', // Gray body
        borderColor: '#333333', // Subtle border
        borderWidth: 1,
        titleFont: {
          family: "'Share Tech Mono', monospace",
        },
        bodyFont: {
          family: "'Share Tech Mono', monospace",
        },
      },
    },
  };

  return (
    <div style={{ height: '200px', width: '100%' }}>
      {products.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          NO_DATA_AVAILABLE
        </div>
      )}
    </div>
  );
}
