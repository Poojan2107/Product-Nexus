import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Form.css";

export default function Register() {
  const { registerWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/products");
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
      setError("ALL_FIELDS_REQUIRED");
      return;
    }
    try {
      setLoading(true);
      await registerWithEmail(form.name, form.email, form.password);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card matrix">
      <h2 className="form-title">USER_REGISTRATION.exe</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          <span>USERNAME</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </label>
        <label>
          <span>EMAIL_ADDRESS</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="user@example.com"
          />
        </label>
        <label>
          <span>PASSWORD</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </label>
        <button className="btn accent" disabled={loading} type="submit">
          {loading ? "CREATING_ACCOUNT..." : "CREATE_ACCOUNT"}
        </button>
      </form>
      <p className="form-foot">
        ACCOUNT_EXISTS? <Link to="/login">LOGIN_HERE</Link>
      </p>
    </div>
  );
}
