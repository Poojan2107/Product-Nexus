import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Form.css";

export default function Login() {
  const { loginWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("EMAIL AND PASSWORD REQUIRED");
      return;
    }
    try {
      setLoading(true);
      await loginWithEmail(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card matrix">
      <h2 className="form-title">USER_LOGIN.exe</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
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
          {loading ? "AUTHENTICATING..." : "SIGN_IN"}
        </button>
      </form>
      {/* Google sign-in removed for local-only mode */}
      <p className="form-foot">
        NO_ACCOUNT? <Link to="/register">REGISTER_HERE</Link>
      </p>
    </div>
  );
}
