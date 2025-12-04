import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../store/dashboardSlice";
import { getAnalytics } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Bar, Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const { filters } = useSelector((state) => state.products);
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getDashboardStats(filters));
      if (user.role === 'admin') {
        getAnalytics().then(setOrderStats).catch(console.error);
      }
    }
  }, [dispatch, user, filters]);

  if (loading) return <div className="loading">LOADING_DASHBOARD...</div>;
  if (error) return <div className="container terminal">{error}</div>;

  const { totalProducts, totalValue, avgPrice, categoryCounts, priceRanges, products } = stats;

  const monochromeColors = [
    "rgba(255, 255, 255, 1.0)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.6)",
    "rgba(255, 255, 255, 0.4)",
    "rgba(255, 255, 255, 0.2)",
    "transparent"
  ];

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Products per Category",
        data: Object.values(categoryCounts),
        backgroundColor: monochromeColors,
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const priceData = {
    labels: Object.keys(priceRanges),
    datasets: [
      {
        label: "Products in Price Range",
        data: Object.values(priceRanges),
        backgroundColor: "#d4d4d4",
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const salesData = orderStats ? {
    labels: orderStats.dailySales.map(d => d._id),
    datasets: [
      {
        label: "Daily Revenue (₹)",
        data: orderStats.dailySales.map(d => d.sales),
        borderColor: "#00ff41",
        backgroundColor: "rgba(0, 255, 65, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ]
  } : null;

  return (
    <motion.div 
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="page-title" variants={itemVariants}>COMMAND_CENTER_ANALYTICS</motion.h2>
      
      {/* Order Stats (Revenue) */}
      {orderStats && (
        <motion.div className="stats stats-grid" variants={containerVariants} style={{ marginBottom: "2rem" }}>
          <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--accent-primary)", background: "rgba(0, 255, 65, 0.05)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "0 0 20px rgba(0, 255, 65, 0.1)" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-primary)" }}>TOTAL_REVENUE</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "#fff" }}>₹{orderStats.totalRevenue.toFixed(2)}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>TOTAL_ORDERS</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-secondary)" }}>{orderStats.totalOrders}</p>
          </motion.div>
        </motion.div>
      )}

      {/* Product Stats */}
      <motion.div className="stats stats-grid" variants={containerVariants}>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>INVENTORY_SIZE</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{totalProducts}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>ASSET_VALUE</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>₹{totalValue.toFixed(2)}</p>
        </motion.div>
      </motion.div>

      <motion.div className="charts charts-grid" variants={containerVariants}>
        {/* Sales Chart */}
        {salesData && (
          <motion.div variants={itemVariants} className="chart-card chart-full-width" style={{ padding: "1rem", border: "2px solid var(--accent-primary)", background: "rgba(0,0,0,0.5)", borderRadius: "16px", boxShadow: "0 0 15px rgba(0, 255, 65, 0.1)", overflow: "hidden" }}>
            <h3 style={{ color: "var(--accent-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>REVENUE_VELOCITY (7 DAYS)</h3>
            <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
              <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "rgba(255,255,255,0.1)" } }, x: { grid: { color: "rgba(255,255,255,0.1)" } } } }} />
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>ASSET_DISTRIBUTION</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Pie data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRICE_SEGMENTS</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Bar data={priceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
