import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../store/cartSlice";
import { fetchProduct } from "../services/api";
import "../components/Card.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: Number(qty),
    }));
    navigate("/cart");
  };

  if (loading) return <div className="loading">LOADING_ASSET_DATA...</div>;
  if (!product) return <div className="error">ASSET_NOT_FOUND</div>;

  return (
    <div className="container slide-in">
      <button onClick={() => navigate(-1)} className="btn muted" style={{ marginBottom: "1rem" }}>
        {"<"} RETURN_TO_MARKET
      </button>

      <div className="form-grid" style={{ alignItems: "start" }}>
        <div style={{ background: "var(--bg-tertiary)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-secondary)", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "1.5rem" }}>NO_IMAGE_AVAILABLE</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h2 className="terminal-header" style={{ marginBottom: "0.5rem" }}>{product.name}</h2>
            <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              <span>ID: {product._id.substring(0, 8)}...</span>
              <span>|</span>
              <span>CAT: {product.category.toUpperCase()}</span>
            </div>
          </div>

          <div style={{ fontSize: "2rem", color: "var(--accent-secondary)", fontWeight: "bold" }}>
            ₹{Number(product.price).toFixed(2)}
          </div>

          <div style={{ background: "var(--bg-card)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-primary)" }}>
            <p style={{ lineHeight: "1.6", color: "var(--text-primary)", marginBottom: "1.5rem" }}>
              {product.description}
            </p>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <label style={{ color: "var(--text-secondary)" }}>QUANTITY:</label>
              <select 
                value={qty} 
                onChange={(e) => setQty(e.target.value)}
                className="terminal-input"
                style={{ width: "80px" }}
              >
                {[...Array(10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn accent full-width" 
              onClick={handleAddToCart}
              style={{ width: "100%", justifyContent: "center", padding: "1rem", fontSize: "1.1rem" }}
            >
              [+] ADD_TO_MANIFEST
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "4px" }}>
              STATUS: <span style={{ color: "#00ff41" }}>IN_STOCK</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "4px" }}>
              DELIVERY: <span style={{ color: "var(--text-primary)" }}>INSTANT_TRANSFER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
