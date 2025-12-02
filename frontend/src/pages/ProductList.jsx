import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct, setFilters, setPage, removeProductOptimistic } from "../store/productSlice";
import "../components/Card.css";
import { useAuth } from "../hooks/useAuth";
import ProductItem from "../components/ProductItem.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNotification } from "../contexts/NotificationContext";
import * as ReactWindow from 'react-window';
import { motion, AnimatePresence } from "framer-motion";

export default function ProductList() {
  const { user, initializing } = useAuth();
  const dispatch = useDispatch();
  const { items: products, loading, error, currentPage, totalPages, filters } = useSelector((state) => state.products);
  const { addNotification } = useNotification();
  const searchInputRef = useRef(null);
  
  const [search, setSearch] = useState(filters.search);
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [sortBy, setSortBy] = useState(filters.sortBy);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setFilters({ search, minPrice, maxPrice, sortBy }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search, minPrice, maxPrice, sortBy, dispatch]);

  useEffect(() => {
    if (!initializing && user) {
      dispatch(getProducts({ ...filters, page: currentPage }));
    }
  }, [dispatch, user, initializing, filters, currentPage]);

  const handleDelete = async (id) => {
    // Optimistic UI: Remove immediately from UI
    dispatch(removeProductOptimistic(id));
    
    let timeoutId;

    // Delay actual deletion to allow UNDO
    addNotification({
      message: "PRODUCT_REMOVED. UNDO?",
      type: "success",
      actionLabel: "UNDO",
      ttl: 5000,
      onAction: () => {
        // Cancel deletion
        clearTimeout(timeoutId);
        // Restore list (fetch from server to be safe, or we could have a restore action)
        dispatch(getProducts({ ...filters, page: currentPage }));
      },
    });

    timeoutId = setTimeout(() => {
      dispatch(deleteProduct(id));
    }, 5000);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 20, 10);
    const applied = [
      search ? `search="${search}"` : null,
      minPrice ? `min=${minPrice}` : null,
      maxPrice ? `max=${maxPrice}` : null,
      sortBy ? `sort=${sortBy}` : null,
    ].filter(Boolean).join(" | ");
    const total = products.length;
    doc.text(`Filters: ${applied || 'none'}`, 20, 16);
    doc.text(`Items: ${total}`, 20, 22);
    const tableColumn = ["Name", "Price", "Category", "Subcategory", "Description"];
    const tableRows = [];

    products.forEach((product) => {
      const productData = [
        product.name,
        `Rs. ${Number(product.price).toFixed(2)}`,
        product.category,
        product.subcategory,
        product.description,
      ];
      tableRows.push(productData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 28 });
    doc.save("products.pdf");
  };

  // Listen for CLI-triggered export event
  useEffect(() => {
    const handler = () => exportPDF();
    window.addEventListener('trigger-export-pdf', handler);
    return () => window.removeEventListener('trigger-export-pdf', handler);
  }, [products, search, minPrice, maxPrice, sortBy]);

  // Keyboard shortcuts: '/' focuses search, 'e' exports PDF
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea';
      if (!typing && e.key === '/') {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      } else if (!typing && (e.key === 'e' || e.key === 'E')) {
        exportPDF();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exportPDF]);

  if (error) return <div className="container terminal">{error}</div>;

  return (
    <motion.div 
      className="slide-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="control-panel">
        <div className="control-panel-header">
           {/* Search & Sort */}
           <div className="control-panel-search">
              <input 
                type="text" 
                placeholder="🔍 SEARCH_DATABASE..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="terminal-input"
                style={{ flex: 1 }}
                ref={searchInputRef}
              />
           </div>
           {/* Actions */}
           <div className="control-panel-actions">
              <button className="btn muted" onClick={exportPDF}>DOWNLOAD_REPORT</button>
              <Link className="btn accent" to="/products/add">+ NEW_ENTRY</Link>
           </div>
        </div>

        <div className="control-panel-filters">
           <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>FILTERS:</span>
           <input 
             type="number" 
             placeholder="MIN_$$" 
             value={minPrice}
             onChange={(e) => setMinPrice(e.target.value)}
             className="terminal-input filter-input"
           />
           <span style={{ color: "var(--text-muted)" }} className="filter-divider">-</span>
           <input 
             type="number" 
             placeholder="MAX_$$" 
             value={maxPrice}
             onChange={(e) => setMaxPrice(e.target.value)}
             className="terminal-input filter-input"
           />
           <div className="filter-divider" style={{ width: "1px", height: "24px", background: "var(--border-secondary)", margin: "0 1rem" }}></div>
           <select 
             value={sortBy} 
             onChange={(e) => setSortBy(e.target.value)}
             className="terminal-input sort-select"
           >
             <option value="name">SORT: NAME (A-Z)</option>
             <option value="price-asc">SORT: PRICE (LOW-HIGH)</option>
             <option value="price-desc">SORT: PRICE (HIGH-LOW)</option>
           </select>
        </div>
      </div>

      {loading && products.length === 0 ? (
         <div className="card-grid">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="card-item">
               <div className="card">
                 <Skeleton height={150} baseColor="#202020" highlightColor="#444" />
                 <Skeleton count={3} baseColor="#202020" highlightColor="#444" style={{ marginTop: '1rem' }} />
               </div>
             </div>
           ))}
         </div>
      ) : products.length === 0 ? (
        <div className="empty-state-container">
          <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>∅</div>
          <h2 style={{ color: "var(--text-primary)", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>NO_DATA_FOUND</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontFamily: "var(--font-mono)" }}>The inventory database is currently empty.</p>
          <Link className="btn accent" to="/products/add">INITIALIZE_FIRST_PRODUCT</Link>
        </div>
      ) : (
        <>
          {products.length > 50 ? (
            <div style={{ height: 600 }}>
              <ReactWindow.FixedSizeList height={600} itemCount={products.length} itemSize={300} width={'100%'}>
                {({ index, style }) => (
                  <div style={style}>
                    <ProductItem key={products[index]._id} product={products[index]} onDelete={handleDelete} />
                  </div>
                )}
              </ReactWindow.FixedSizeList>
            </div>
          ) : (
            <motion.div 
              className="card-grid"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              <AnimatePresence mode="popLayout">
                {products.map((p) => (
                  <motion.div
                    key={p._id}
                    layout
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  >
                    <ProductItem product={p} onDelete={handleDelete} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="btn muted"
              disabled={currentPage === 1}
              onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))}
            >
              PREV
            </button>
            <span style={{ display: "flex", alignItems: "center", fontFamily: "var(--font-mono)" }}>
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              className="btn muted"
              disabled={currentPage === totalPages}
              onClick={() => dispatch(setPage(Math.min(totalPages, currentPage + 1)))}
            >
              NEXT
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
