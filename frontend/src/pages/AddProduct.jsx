import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";
import "../components/Card.css";
import { useDropzone } from 'react-dropzone';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await createProduct(data);
      navigate("/products");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="slide-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2 className="terminal-header" style={{ marginBottom: "2rem", textAlign: "center" }}>ADD_NEW_PRODUCT</h2>
      <form onSubmit={handleSubmit} className="form-container" style={{ display: "grid", gap: "1.5rem", background: "var(--bg-card)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border-primary)", boxShadow: "var(--shadow-primary)" }}>
        <div className="form-grid">
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "1px" }}>PRODUCT_NAME</label>
            <input
              type="text"
              name="name"
              placeholder="ENTER_NAME"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              style={{ width: "100%", padding: "0.75rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-secondary)", borderRadius: "8px", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "1px" }}>PRICE</label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
              className="input-field"
              style={{ width: "100%", padding: "0.75rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-secondary)", borderRadius: "8px", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            />
          </div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "1px" }}>CATEGORY</label>
            <input
              type="text"
              name="category"
              placeholder="CATEGORY"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
              style={{ width: "100%", padding: "0.75rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-secondary)", borderRadius: "8px", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "1px" }}>SUBCATEGORY</label>
            <input
              type="text"
              name="subcategory"
              placeholder="SUBCATEGORY"
              value={formData.subcategory}
              onChange={handleChange}
              required
              className="input-field"
              style={{ width: "100%", padding: "0.75rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-secondary)", borderRadius: "8px", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
            />
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "1px" }}>DESCRIPTION</label>
          <textarea
            name="description"
            placeholder="PRODUCT_DESCRIPTION..."
            value={formData.description}
            onChange={handleChange}
            required
            className="input-field"
            rows="4"
            style={{ width: "100%", padding: "0.75rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-secondary)", borderRadius: "8px", color: "var(--text-primary)", fontFamily: "var(--font-mono)", resize: "vertical" }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "1px" }}>PRODUCT_IMAGE</label>
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''}`} 
            style={{ 
              border: '2px dashed var(--border-primary)', 
              padding: '2rem', 
              textAlign: 'center', 
              cursor: 'pointer', 
              borderRadius: '8px', 
              background: isDragActive ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-tertiary)',
              transition: 'all 0.3s ease'
            }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CLICK_TO_CHANGE</p>
              </div>
            ) : (
              <div style={{ padding: '1rem' }}>
                <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {isDragActive ? "DROP_IMAGE_HERE..." : "DRAG_&_DROP_IMAGE"}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>OR_CLICK_TO_BROWSE</p>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn accent full-width"
          style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            fontSize: "1.1rem", 
            fontWeight: "bold", 
            letterSpacing: "1px",
            width: "100%"
          }}
        >
          SAVE_PRODUCT
        </button>
      </form>
    </div>
  );
}
