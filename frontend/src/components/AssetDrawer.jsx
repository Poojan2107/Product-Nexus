import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "../services/api";
import { useNotification } from "../contexts/NotificationContext";

export default function AssetDrawer({ isOpen, onClose, onSuccess, assetToEdit }) {
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: assetToEdit?.name || "",
    price: assetToEdit?.price || "",
    stock: assetToEdit?.stock || "",
    category: assetToEdit?.category || "",
    subcategory: assetToEdit?.subcategory || "",
    description: assetToEdit?.description || "",
    image: null,
  });
  const [preview, setPreview] = useState(assetToEdit?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((f) => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    }

    try {
      if (assetToEdit && assetToEdit._id) {
        await updateProduct(assetToEdit._id, data);
        addNotification(`Asset "${formData.name}" updated successfully.`, "success");
      } else {
        await createProduct(data);
        addNotification(`New asset "${formData.name}" added to inventory.`, "success");
      }
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setFormData({ name: "", price: "", stock: "", category: "", subcategory: "", description: "", image: null });
      setPreview(null);
    } catch (err) {
      setError(err.message || "Failed to create asset.");
      addNotification(err.message || "Failed to process asset.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        className="animate-fade-in"
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          zIndex: 1000
        }}
      />
      
      <div 
        style={{
          position: "fixed", top: 0, right: 0,
          width: "100%", maxWidth: "500px", height: "100%",
          backgroundColor: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg), -10px 0 30px rgba(0,0,0,0.3)",
          zIndex: 1001,
          display: "flex", flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <div style={{
          padding: "1.5rem", borderBottom: "1px solid var(--border-color)",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-primary)" }}>{assetToEdit ? 'Edit Asset' : 'New Asset Entry'}</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{assetToEdit ? 'Update hardware or software details.' : 'Register hardware or software licenses.'}</p>
          </div>
          <button 
            onClick={onClose}
            style={{ color: "var(--text-secondary)", padding: "0.5rem", borderRadius: "50%" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {error && (
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger-color)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "1.5rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
            </div>
          )}

          <form id="asset-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div>
              <label className="label">Asset Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. MacBook Pro M3" className="input" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Valuation (Price)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>$</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="input" style={{ paddingLeft: "1.75rem" }} required />
                </div>
              </div>
              <div>
                <label className="label">Initial Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" className="input" required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Hardware" className="input" required />
              </div>
              <div>
                <label className="label">Subcategory</label>
                <input type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="Laptops" className="input" required />
              </div>
            </div>

            <div>
              <label className="label">Specifications / Notes</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows="3" placeholder="Serial numbers, specs..." required />
            </div>

            <div>
              <label className="label">Asset Image Reference</label>
              <div 
                {...getRootProps()} 
                style={{
                  border: "1px dashed var(--border-hover)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isDragActive ? "rgba(255,255,255,0.05)" : "var(--bg-tertiary)",
                  transition: "all var(--transition-fast)"
                }}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <img src={preview} alt="Preview" style={{ height: "100px", borderRadius: "var(--radius-sm)", objectFit: "cover" }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Click to change image</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                    <UploadCloud size={24} />
                    <span style={{ fontSize: "0.875rem" }}>Drag & drop image here, or click to browse</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", gap: "1rem", backgroundColor: "var(--bg-primary)" }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button type="submit" form="asset-form" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : assetToEdit ? "Update Asset" : "Save Asset"}
          </button>
        </div>
      </div>
    </>
  );
}
