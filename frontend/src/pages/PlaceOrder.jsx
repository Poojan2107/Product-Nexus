import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { clearCart } from "../store/cartSlice";
import "../components/Card.css";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 10000 ? 0 : 500); // Free shipping over 10k
  const taxPrice = addDecimals(Number((0.18 * itemsPrice).toFixed(2))); // 18% GST
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const orderData = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      };

      await createOrder(orderData);
      dispatch(clearCart());
      // For now, redirect to home or a success page. Ideally /order/:id
      alert("TRANSACTION_SUCCESSFUL: ORDER_INITIATED");
      navigate("/shop");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container slide-in">
      <h2 className="terminal-header" style={{ marginBottom: "2rem" }}>TRANSACTION_PROTOCOL (REVIEW)</h2>
      
      <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>SHIPPING_COORDINATES</h3>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}<br />
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>PAYMENT_METHOD</h3>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
              METHOD: {cart.paymentMethod}
            </p>
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>MANIFEST_ITEMS</h3>
            {cart.cartItems.length === 0 ? (
              <p>MANIFEST_EMPTY</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {cart.cartItems.map((item, index) => (
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
            )}
          </div>

        </div>

        <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "100px" }}>
          <h3 style={{ borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>ORDER_SUMMARY</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontFamily: "var(--font-mono)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>ITEMS</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>SHIPPING</span>
              <span>₹{shippingPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>TAX (18%)</span>
              <span>₹{taxPrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-primary)", paddingTop: "1rem", fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
              <span>TOTAL</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button 
            className="btn accent full-width" 
            style={{ marginTop: "2rem", justifyContent: "center" }}
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0}
          >
            CONFIRM_TRANSACTION
          </button>
        </div>
      </div>
    </div>
  );
}
