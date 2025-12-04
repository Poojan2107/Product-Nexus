import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import "../components/Card.css";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">LOADING_TRANSACTION_LOGS...</div>;
  if (error) return <div className="error">ERROR: {error}</div>;

  return (
    <div className="container slide-in">
      <h2 className="terminal-header" style={{ marginBottom: "2rem" }}>GLOBAL_TRANSACTION_LOGS</h2>
      
      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-secondary)", textAlign: "left" }}>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>ID</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>USER</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>DATE</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>TOTAL</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>STATUS</th>
              <th style={{ padding: "1rem", color: "var(--text-muted)" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem" }}>{order._id.substring(0, 8)}...</td>
                <td style={{ padding: "1rem" }}>{order.user && order.user.name}</td>
                <td style={{ padding: "1rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "1rem" }}>₹{order.totalPrice}</td>
                <td style={{ padding: "1rem" }}>
                  {order.isDelivered ? (
                    <span style={{ color: "#00ff41" }}>DELIVERED</span>
                  ) : (
                    <span style={{ color: "var(--accent-secondary)" }}>PENDING</span>
                  )}
                </td>
                <td style={{ padding: "1rem" }}>
                  <button className="btn muted" style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}>
                    DETAILS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
