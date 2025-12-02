import { useState } from "react";
import { Link } from "react-router-dom";
import "./Card.css";

export default function ProductItem({ product, onDelete }) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteClick = (confirm) => {
    if (confirm) {
      onDelete(product._id);
      setIsConfirming(false);
    } else {
      setIsConfirming(!isConfirming);
      if (!isConfirming) { // If we are just starting confirmation
        setTimeout(() => setIsConfirming(false), 5000);
      }
    }
  };

  return (
    <div className="card-item">
      <div className="card">
        <div style={{ marginBottom: "0.5rem", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-tertiary)", borderRadius: "8px", overflow: "hidden" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>NO_IMAGE</div>
          )}
        </div>
        <div className="row">
          <h3>{product.name}</h3>
          <span className="price">₹{Number(product.price).toFixed(2)}</span>
        </div>
        <div className="row muted">
          <span>
            {product.category} / {product.subcategory}
          </span>
        </div>
        <p className="desc">{product.description}</p>
        <div className="card-actions">
          <Link to={`/products/edit/${product._id}`} className="btn muted" style={{ marginRight: '0.5rem', textDecoration: 'none' }}>
            EDIT
          </Link>
          {isConfirming ? (
            <>
              <button
                className="btn danger"
                onClick={() => handleDeleteClick(true)}
              >
                CONFIRM
              </button>
              <button
                className="btn muted"
                onClick={() => handleDeleteClick(false)}
              >
                CANCEL
              </button>
            </>
          ) : (
            <button
              className="btn danger"
              onClick={() => handleDeleteClick(false)}
              key="delete-btn"
            >
              DELETE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
