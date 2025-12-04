import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../store/cartSlice";
import "../components/Card.css";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container slide-in">
      <h2 className="terminal-header" style={{ marginBottom: "2rem" }}>MANIFEST_LOG (CART)</h2>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-secondary)" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>MANIFEST_EMPTY</p>
          <Link to="/shop" className="btn accent">INITIATE_ACQUISITION</Link>
        </div>
      ) : (
        <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: "flex", gap: "1rem", background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border-secondary)" }}>
                <div style={{ width: "80px", height: "80px", background: "#000", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Link to={`/shop/product/${item.product}`} style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>
                    {item.name}
                  </Link>
                  <div style={{ color: "var(--accent-secondary)", marginTop: "0.25rem" }}>₹{item.price}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <select 
                    value={item.qty} 
                    onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                    className="terminal-input"
                    style={{ padding: "0.25rem", width: "60px" }}
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn danger" 
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    [X]
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bg-card)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-primary)", position: "sticky", top: "100px" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>ORDER_SUMMARY</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>ITEMS:</span>
              <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
              <span>TOTAL:</span>
              <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
            </div>
            <button 
              className="btn accent full-width" 
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              style={{ width: "100%", justifyContent: "center" }}
            >
              PROCEED_TO_CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
