import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import "./Card.css";

export default function ShopItem({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
    }));
    // Optional: Show toast notification
    alert("ITEM_ADDED_TO_MANIFEST");
  };

  return (
    <div className="card-item">
      <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "0.5rem", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-tertiary)", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>NO_IMAGE</div>
          )}
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem", color: "#00ff41", border: "1px solid #00ff41" }}>
            IN_STOCK
          </div>
        </div>
        <div className="row">
          <h3 style={{ fontSize: "1.1rem" }}>{product.name}</h3>
          <span className="price" style={{ color: "var(--accent-secondary)" }}>₹{Number(product.price).toFixed(2)}</span>
        </div>
        <div className="row muted">
          <span style={{ fontSize: "0.8rem" }}>
            {product.category} / {product.subcategory}
          </span>
        </div>
        <p className="desc" style={{ flex: 1, fontSize: "0.9rem", opacity: 0.8 }}>{product.description.substring(0, 60)}...</p>
        <div className="card-actions" style={{ marginTop: "1rem" }}>
          <button 
            className="btn accent full-width" 
            onClick={handleAddToCart}
            style={{ width: "100%", justifyContent: "center" }}
          >
            [+] ADD_TO_MANIFEST
          </button>
        </div>
      </div>
    </div>
  );
}
