import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders } from "../services/api";
import "../components/Card.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="slide-in" style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <h2 className="terminal-header" style={{ marginBottom: "2rem", textAlign: "center" }}>USER_PROFILE_CONFIG</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* User Info Card */}
        <div className="card" style={{ padding: "2rem", height: "fit-content" }}>
          <div className="profile-header" style={{ flexDirection: "column", textAlign: "center", gap: "1rem" }}>
            <div style={{ 
              width: "120px", 
              height: "120px", 
              borderRadius: "50%", 
              background: "var(--bg-secondary)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "2px solid var(--accent-primary)",
              fontSize: "3rem",
              color: "var(--accent-primary)",
              margin: "0 auto"
            }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{user?.name || "OPERATIVE"}</h3>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>ID: {user?.id?.substring(0, 8)}...</p>
              <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>ROLE: {user?.role?.toUpperCase()}</p>
              <div style={{ marginTop: "1rem", display: "inline-block", padding: "0.25rem 0.5rem", background: "rgba(0, 255, 65, 0.1)", color: "#00ff41", borderRadius: "4px", fontSize: "0.8rem" }}>
                ● SECURITY_CLEARANCE_ACTIVE
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>EMAIL_ADDRESS</label>
              <div className="terminal-input" style={{ opacity: 0.8 }}>{user?.email}</div>
            </div>
            <button className="btn muted full-width" onClick={logout}>TERMINATE_SESSION</button>
          </div>
        </div>

        {/* Order History */}
        <div className="card" style={{ padding: "2rem" }}>
          <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1.5rem", color: "var(--text-muted)" }}>ACQUISITION_LOGS</h3>
          
          {loading ? (
            <div className="loading">LOADING_LOGS...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              NO_ACQUISITIONS_FOUND. <Link to="/shop" style={{ color: "var(--accent-primary)" }}>INITIATE_PROCUREMENT</Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-secondary)", textAlign: "left" }}>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>ID</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>DATE</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>TOTAL</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>STATUS</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "1rem" }}>{order._id.substring(0, 8)}...</td>
                      <td style={{ padding: "1rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "1rem" }}>₹{order.totalPrice}</td>
                      <td style={{ padding: "1rem" }}>
                        {order.isDelivered ? (
                          <span style={{ color: "#00ff41" }}>DELIVERED</span>
                        ) : (
                          <span style={{ color: "var(--accent-secondary)" }}>PROCESSING</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <Link to={`/order/${order._id}`} className="btn muted" style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem", textDecoration: "none" }}>
                          VIEW
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
