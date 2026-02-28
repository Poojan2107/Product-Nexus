import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Laptop, Server } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { items: products } = useSelector((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryData = [
    products.filter(p => (p.category || '').toLowerCase().includes('kitchen')).length || 10,
    products.filter(p => (p.category || '').toLowerCase().includes('fitness')).length || 8,
    products.filter(p => (p.category || '').toLowerCase().includes('wellness')).length || 5,
    products.filter(p => (p.category || '').toLowerCase().includes('entertainment')).length || 15
  ];

  const doughnutData = {
    labels: ['Kitchen Appliances', 'Fitness Gear', 'Wellness', 'Entertainment'],
    datasets: [
      {
        data: categoryData,
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const lineData = {
    labels: ['2023', '2024', '2025', '2026'],
    datasets: [
      {
        label: 'Purchase Value',
        data: [120000, 145000, 160000, 190000],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
      },
      {
        label: 'Current Value (Depreciated)',
        data: [120000, 110000, 95000, 82000],
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a1a1aa'
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#a1a1aa' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#a1a1aa' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#a1a1aa' }
      }
    }
  };

  if (!mounted) return <div className="page-container"><div className="skeleton" style={{height:'400px'}}/></div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hardware Analytics</h1>
          <p className="page-subtitle">Understand what you own. IT tracks company equipment over years to predict budgets.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px' }}>
              <Laptop size={24} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Why track assets?</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            When a company hires 100 employees, they buy 100 laptops ($200,000). If an employee leaves, IT needs to know exactly which laptop to take back. This system stops multi-thousand dollar laptops from "vanishing".
          </p>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>
              <Server size={24} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Hardware Audits</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Accountants use data from this very dashboard to write-off business expenses for taxes every April. You created the database that proves to the IRS what the company owns.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Hardware Depreciation ($)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Computers lose value over time. IT uses this chart to budget for next year's replacements.</p>
          <div style={{ flex: 1 }}>
            <Line options={chartOptions} data={lineData} />
          </div>
        </div>

        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Device Allocation</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>What hardware is currently in the building?</p>
          <div style={{ flex: 1, position: 'relative' }}>
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>
      
    </div>
  );
}
