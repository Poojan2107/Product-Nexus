import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__header">
          <Link to="/" className="brand" onClick={closeMenu}>
            PRODUCT_APP.exe
          </Link>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? "CLOSE [X]" : "MENU [=]"}
          </button>
        </div>

        <div className={`navbar__content ${isMenuOpen ? "open" : ""}`}>
          <nav className="navlinks">
            {user && (
              <>
                <NavLink
                  to="/products"
                  className={({ isActive }) => isActive ? "nav-active" : "nav-inactive"}
                  onClick={closeMenu}
                >
                  PRODUCTS
                </NavLink>
                <NavLink
                  to="/products/add"
                  className={({ isActive }) => isActive ? "nav-active" : "nav-inactive"}
                  onClick={closeMenu}
                >
                  ADD_PRODUCT
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => isActive ? "nav-active" : "nav-inactive"}
                  onClick={closeMenu}
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
                <Link className="btn muted" to="/profile" onClick={closeMenu}>
                  PROFILE
                </Link>

                <button className="btn muted" onClick={handleLogout}>
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link className="btn" to="/login" onClick={closeMenu}>
                  LOGIN
                </Link>
                <Link className="btn accent" to="/register" onClick={closeMenu}>
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
