import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../store/dashboardSlice";
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

  useEffect(() => {
    if (user) {
      dispatch(getDashboardStats(filters));
    }
  }, [dispatch, user, filters]);

  if (loading) return <div className="loading">LOADING_DASHBOARD...</div>;
  if (error) return <div className="container terminal">{error}</div>;

  const { totalProducts, totalValue, avgPrice, categoryCounts, priceRanges, products } = stats;

  const monochromeColors = [
    "rgba(255, 255, 255, 1.0)",  // Solid White
    "rgba(255, 255, 255, 0.8)",  // 80% White
    "rgba(255, 255, 255, 0.6)",  // 60% White
    "rgba(255, 255, 255, 0.4)",  // 40% White
    "rgba(255, 255, 255, 0.2)",  // 20% White
    "transparent"                // Wireframe (Border only)
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

  const priceLineData = {
    labels: products.map((p) => p.name.substring(0, 10)),
    datasets: [
      {
        label: "Product Prices",
        data: products.map((p) => Number(p.price)),
        borderColor: "#ffffff",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
      },
    ],
  };

  return (
    <motion.div 
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="page-title" variants={itemVariants}>ANALYTICS_DASHBOARD.exe</motion.h2>
      
      <motion.div className="stats stats-grid" variants={containerVariants}>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>TOTAL_PRODUCTS</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>{totalProducts}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>TOTAL_VALUE</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>₹{totalValue.toFixed(2)}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>AVERAGE_PRICE</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>₹{avgPrice.toFixed(2)}</p>
        </motion.div>
      </motion.div>

      <motion.div className="charts charts-grid" variants={containerVariants}>
        <motion.div variants={itemVariants} className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRODUCTS_BY_CATEGORY</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Pie data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRICE_RANGES</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Bar data={priceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="chart-card chart-full-width" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRODUCT_PRICES</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Line data={priceLineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
