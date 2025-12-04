import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../store/productSlice";
import ShopItem from "../components/ShopItem";
import "../components/Card.css";

export default function Shop() {
  const dispatch = useDispatch();
  const { items: products, isLoading, isError, message } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: 100 }));
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="container slide-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h2 className="terminal-header" style={{ margin: 0 }}>DIGITAL_ASSET_MARKETPLACE</h2>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="SEARCH_ASSETS..." 
            className="terminal-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: "250px" }}
          />
          <select 
            className="terminal-input" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">ALL_CATEGORIES</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">LOADING_MARKET_DATA...</div>
      ) : isError ? (
        <div className="error">ERROR: {message}</div>
      ) : (
        <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {filteredProducts.map((product) => (
            <ShopItem key={product._id} product={product} />
          ))}
        </div>
      )}
      
      {filteredProducts.length === 0 && !isLoading && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          NO_ASSETS_FOUND_MATCHING_CRITERIA
        </div>
      )}
    </div>
  );
}
