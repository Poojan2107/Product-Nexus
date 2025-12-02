import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../services/api";

export default function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="loading">LOADING_PRODUCT...</div>;
  if (error) return <div className="container terminal">{error}</div>;
  if (!product) return <div className="container terminal">PRODUCT_NOT_FOUND.exe</div>;

  return (
    <div className="container">
      <h2 className="page-title">{product.name}</h2>
      <div className="grid">
        <div className="col-6">
          <div className="container">
            {product.image && (
              <div style={{ marginBottom: "1rem" }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "300px" }} />
              </div>
            )}
            <p>
              <strong>PRICE:</strong> ₹{Number(product.price).toFixed(2)}
            </p>
            <p>
              <strong>CATEGORY:</strong> {product.category} /{" "}
              {product.subcategory}
            </p>
            <p>
              <strong>DESCRIPTION:</strong>
            </p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      <div className="spacer" />
      <div className="actions">
        <Link className="btn accent" to={`/products/${product._id}/edit`}>
          EDIT_PRODUCT
        </Link>
        <Link className="btn muted" to="/products">
          BACK_TO_PRODUCTS
        </Link>
      </div>
    </div>
  );
}
