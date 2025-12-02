import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../store/dashboardSlice";
import { useAuth } from "../hooks/useAuth";
import { Bar, Pie, Line } from "react-chartjs-2";
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

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Products per Category",
        data: Object.values(categoryCounts),
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  const priceData = {
    labels: Object.keys(priceRanges),
    datasets: [
      {
        label: "Products in Price Range",
        data: Object.values(priceRanges),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const priceLineData = {
    labels: products.map((p) => p.name.substring(0, 10)),
    datasets: [
      {
        label: "Product Prices",
        data: products.map((p) => Number(p.price)),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <div className="container">
      {/* Active filters summary */}
      <div className="terminal" style={{ marginBottom: "1rem", padding: "0.75rem" }}>
        <div>FILTERS: {[
          filters.search ? `search="${filters.search}"` : null,
          filters.minPrice ? `min=${filters.minPrice}` : null,
          filters.maxPrice ? `max=${filters.maxPrice}` : null,
          filters.sortBy ? `sort=${filters.sortBy}` : null,
        ].filter(Boolean).join(" | ") || 'none'}</div>
      </div>
      <h2 className="page-title">ANALYTICS_DASHBOARD.exe</h2>
      <div className="stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "2rem", width: "100%" }}>
        <div className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>TOTAL_PRODUCTS</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>{totalProducts}</p>
        </div>
        <div className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>TOTAL_VALUE</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>₹{totalValue.toFixed(2)}</p>
        </div>
        <div className="stat-card" style={{ padding: "1.5rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", color: "var(--text-primary)", borderRadius: "16px", textAlign: "center", boxShadow: "var(--shadow-secondary)" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>AVERAGE_PRICE</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, fontFamily: "var(--font-mono)", color: "var(--accent-primary)" }}>₹{avgPrice.toFixed(2)}</p>
        </div>
      </div>
      <div className="charts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", width: "100%", padding: "0 1rem" }}>
        <div className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRODUCTS_BY_CATEGORY</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Pie data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRICE_RANGES</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Bar data={priceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="chart-card" style={{ padding: "1rem", border: "2px solid var(--border-primary)", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-secondary)", gridColumn: "1 / -1", overflow: "hidden" }}>
          <h3 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>PRODUCT_PRICES</h3>
          <div style={{ height: "300px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Line data={priceLineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
