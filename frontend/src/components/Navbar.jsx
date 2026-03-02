import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChartBar, FaUsers, FaChartLine, FaCity, FaBox, FaBars, FaTimes, FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: FaChartBar, path: "/" },
  { label: "Users", icon: FaUsers, path: "/users" },
  { label: "Cities", icon: FaCity, path: "/cities" },
  { label: "Reports", icon: FaBox, path: "/reports" },
  { label: "Analytics", icon: FaChartLine, path: "/graphicalView" },
  {label: "Predictions", icon: FaChartLine, path: "/predictions"},
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        {/* <NavLink to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <span className="navbar-brand-icon">◇</span>
          <span className="navbar-brand-text">Users CRUD</span>
        </NavLink> */}

        {/* Desktop nav */}
        <nav className="navbar-nav">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `navbar-link ${isActive ? "navbar-link-active" : ""}`}
            >
              <Icon className="navbar-link-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right: theme toggle and profile */}
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          
          {isAuthenticated ? (
            <div className="navbar-profile" style={{ position: 'relative' }}>
              <div 
                className="navbar-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  border: '2px solid var(--accent)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 50,
                  right: 0,
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: 12,
                  minWidth: 180,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 100,
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>{user?.role}</div>
                  </div>
                  <button
                    onClick={() => { logout(); navigate('/login'); setShowDropdown(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="navbar-badge" style={{ cursor: 'pointer' }}>SignIn</NavLink>
              <NavLink to="/login" className="navbar-badge" style={{ cursor: 'pointer' }}>LogIn</NavLink>
            </>
          )}
        </div>


        {/* Mobile: theme toggle + hamburger (visible on small screens) */}
        <div className="navbar-mobile-controls">
          <button
            type="button"
            className="navbar-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`navbar-mobile ${mobileOpen ? "navbar-mobile-open" : ""}`}>
        <nav className="navbar-mobile-nav">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `navbar-mobile-link ${isActive ? "navbar-mobile-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="navbar-mobile-link-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
