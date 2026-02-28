import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { getProducts } from "../store/productSlice";
import { Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import { deleteProduct } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../contexts/NotificationContext";

export default function InventoryList() {
  const { addNotification } = useNotification();
  const dispatch = useDispatch();
  const { openDrawer } = useOutletContext();
  const { items: products, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchAssets = () => dispatch(getProducts({ page: 1, limit: 100 }));
    fetchAssets();
    document.addEventListener('assets-updated', fetchAssets);
    return () => document.removeEventListener('assets-updated', fetchAssets);
  }, [dispatch]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" 
      ? true 
      : statusFilter === "IN_STOCK" ? p.stock > 0 : p.stock === 0;
      
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(id);
        document.dispatchEvent(new CustomEvent('assets-updated'));
        addNotification(`Asset "${name}" successfully deleted.`, "success");
      } catch (err) {
        addNotification(err.message || 'Failed to delete asset', "error");
      }
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">View, add, and manage your products.</p>
        </div>
        <button className="btn btn-primary" onClick={openDrawer}>
          <Plus size={18} />
          New Product
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products by name or category..." 
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Product Name</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Stock</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Price</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredProducts.map((p, idx) => (
                    <motion.tr 
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      style={{ 
                        borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid var(--border-color)',
                        transition: 'background-color 0s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '4px', backgroundColor: 'var(--bg-accent)',
                            backgroundImage: p.image && p.image !== 'no-image.jpg' ? `url(${p.image})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-color)'
                          }} />
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{p.category || '—'}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)' }}>{p.stock || 0}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>${p.price?.toLocaleString()}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: (p.stock > 0) ? 'var(--success-color)' : 'var(--danger-color)',
                          backgroundColor: (p.stock > 0) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                        }}>
                          {p.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => openDrawer(p)} className="btn" style={{ padding: '0.375rem', color: 'var(--text-secondary)' }} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(p._id, p.name)} className="btn" style={{ padding: '0.375rem', color: 'var(--text-secondary)' }} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination stub */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span>Showing {filteredProducts.length} results</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.5rem' }} disabled>Previous</button>
            <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
