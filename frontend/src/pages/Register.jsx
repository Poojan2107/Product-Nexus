import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserPlus } from "lucide-react";

export default function Register() {
  const { registerWithEmail, user } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    try {
      setLoading(true);
      await registerWithEmail(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '2rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '48px', height: '48px', backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '12px', margin: '0 auto 1.5rem auto',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            color: 'var(--text-primary)', border: '1px solid var(--border-color)'
          }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Request Access
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Create a new administrator account
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger-color)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="input"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@nexus.com"
              className="input"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
