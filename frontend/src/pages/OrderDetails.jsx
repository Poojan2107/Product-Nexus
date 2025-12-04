import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails, deliverOrder } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "../components/Card.css";

export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const deliverHandler = async () => {
    try {
      await deliverOrder(order._id);
      setOrder({ ...order, isDelivered: true, status: 'Delivered', deliveredAt: Date.now() });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">LOADING_TRANSACTION_DATA...</div>;
  if (error) return <div className="error">ERROR: {error}</div>;

  return (
    <div className="container slide-in">
      <h2 className="terminal-header" style={{ marginBottom: "2rem" }}>TRANSACTION_RECEIPT: {order._id}</h2>
      
      <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>SHIPPING_COORDINATES</h3>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", marginBottom: "1rem" }}>
              <strong style={{ color: "var(--text-secondary)" }}>NAME:</strong> {order.user.name} <br />
              <strong style={{ color: "var(--text-secondary)" }}>EMAIL:</strong> {order.user.email} <br />
              <strong style={{ color: "var(--text-secondary)" }}>ADDRESS:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div style={{ background: "rgba(0, 255, 65, 0.1)", color: "#00ff41", padding: "1rem", borderRadius: "4px" }}>
                DELIVERED_AT: {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div style={{ background: "rgba(255, 51, 51, 0.1)", color: "#ff3333", padding: "1rem", borderRadius: "4px" }}>
                STATUS: PENDING_DELIVERY
              </div>
            )}
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>PAYMENT_METHOD</h3>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", marginBottom: "1rem" }}>
              METHOD: {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div style={{ background: "rgba(0, 255, 65, 0.1)", color: "#00ff41", padding: "1rem", borderRadius: "4px" }}>
                PAID_AT: {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div style={{ background: "rgba(255, 51, 51, 0.1)", color: "#ff3333", padding: "1rem", borderRadius: "4px" }}>
                STATUS: PAYMENT_PENDING (MOCK)
              </div>
            )}
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>MANIFEST_ITEMS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {order.orderItems.map((item, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border-secondary)", paddingBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                    <Link to={`/shop/product/${item.product}`} style={{ color: "var(--text-primary)", textDecoration: "none" }}>
                      {item.name}
                    </Link>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)" }}>
                    {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "100px" }}>
          <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>ORDER_SUMMARY</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontFamily: "var(--font-mono)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>ITEMS</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>SHIPPING</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>TAX (18%)</span>
              <span>₹{order.taxPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-primary)", paddingTop: "1rem", fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
              <span>TOTAL</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>

          {user && user.role === 'admin' && !order.isDelivered && (
            <button 
              className="btn accent full-width" 
              style={{ marginTop: "2rem", justifyContent: "center" }}
              onClick={deliverHandler}
            >
              MARK_AS_DELIVERED
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
