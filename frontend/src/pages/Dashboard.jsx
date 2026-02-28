import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../store/productSlice";
import { TrendingUp, Package, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Edit2, Trash2, PlusCircle, Download } from "lucide-react";
import { getActivities } from "../services/api";
import InventoryChart from "../components/InventoryChart";
import { exportToCSV } from "../utils/exportToCSV";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getProducts({ page: 1, limit: 1000 }));
      try {
        const data = await getActivities(6);
        setActivities(data);
      } catch (err) {
        console.error("Failed to fetch activities");
      }
    };
    fetchData();
    document.addEventListener('assets-updated', fetchData);
    return () => document.removeEventListener('assets-updated', fetchData);
  }, [dispatch]);

  const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0);
  const totalItems = products.length;

  const stats = [
    { title: "Total Revenue", value: `$${totalValue.toLocaleString()}`, change: "+14.5%", isPositive: true, icon: <DollarSign size={20} /> },
    { title: "Active Inventory", value: totalItems.toLocaleString(), change: "+2.3%", isPositive: true, icon: <Package size={20} /> },
    { title: "System Health", value: "99.9%", change: "Stable", isPositive: true, icon: <Activity size={20} /> },
    { title: "Monthly Growth", value: "24.1%", change: "-1.2%", isPositive: false, icon: <TrendingUp size={20} /> },
  ];

  if (loading) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <div className="skeleton" style={{ height: '40px', width: '250px', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '20px', width: '300px' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card skeleton" style={{ height: '120px' }} />
          ))}
        </div>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="card skeleton" style={{ minHeight: '400px' }} />
          <div className="card skeleton" style={{ minHeight: '400px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Real-time inventory and system metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => exportToCSV(products)}>
            <Download size={16} /> Download Report
          </button>
          <button className="btn btn-primary" onClick={() => dispatch(getProducts({ page: 1, limit: 1000 }))}>
            Sync Database
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
                {stat.title}
              </span>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                {stat.value}
              </span>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '500',
                color: stat.isPositive ? 'var(--success-color)' : 'var(--danger-color)',
                backgroundColor: stat.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '0.25rem 0.5rem', borderRadius: '4px'
              }}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>Asset Valuation Trend</h3>
            <select className="input" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer' }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
            <InventoryChart />
          </div>
        </div>

        {/* Recent Activity Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.length > 0 ? activities.map((log, i) => (
              <div key={log._id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: i < activities.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  backgroundColor: log.action === 'CREATE' ? 'rgba(16, 185, 129, 0.1)' : log.action === 'DELETE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, 
                  color: log.action === 'CREATE' ? 'var(--success-color)' : log.action === 'DELETE' ? 'var(--danger-color)' : '#3b82f6'
                }}>
                  {log.action === 'CREATE' ? <PlusCircle size={18} /> : log.action === 'DELETE' ? <Trash2 size={18} /> : <Edit2 size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.details}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No recent activity found.</p>
            )}
          </div>
          
          {activities.length > 0 && (
            <button className="btn" style={{ width: '100%', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
              View All Activity
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
