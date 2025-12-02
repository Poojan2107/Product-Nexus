import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand">
          PRODUCT_APP.exe
        </Link>
        <nav className="navlinks">
          {user && (
            <>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-inactive"
                }
                style={({ isActive }) => ({
                  color: isActive ? "#000000" : "#ffffff",
                  border: "2px solid #ffffff",
                  background: isActive ? "#ffffff" : "transparent",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  minWidth: "120px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                })}
              >
                PRODUCTS
              </NavLink>
              <NavLink
                to="/products/add"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-inactive"
                }
                style={({ isActive }) => ({
                  color: isActive ? "#000000" : "#ffffff",
                  border: "2px solid #ffffff",
                  background: isActive ? "#ffffff" : "transparent",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  minWidth: "120px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                })}
              >
                ADD_PRODUCT
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-inactive"
                }
                style={({ isActive }) => ({
                  color: isActive ? "#000000" : "#ffffff",
                  border: "2px solid #ffffff",
                  background: isActive ? "#ffffff" : "transparent",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  minWidth: "120px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                })}
              >
                DASHBOARD
              </NavLink>
            </>
          )}
        </nav>
        <div className="authbox">
          {user ? (
            <>
              <span className="welcome">
                USER: {user.displayName || user.email}
              </span>
              <Link className="btn muted" to="/profile">
                PROFILE
              </Link>

              <button className="btn muted" onClick={handleLogout}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">
                LOGIN
              </Link>
              <Link className="btn accent" to="/register">
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
