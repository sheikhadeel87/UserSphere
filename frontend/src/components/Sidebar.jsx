import React, { useState } from "react";
import { useAuth } from '../context/AuthContext'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar, FaUsers, FaChartLine, FaCity, FaBox, FaCog, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: <FaChartBar />, path: "/" },
  { label: "Users", icon: <FaUsers />, path: "/users" },
  { label: "Analytics", icon: <FaChartLine />, path: "/graphicalView" },
  { label: "Cities", icon: <FaCity />, path: "/cities" },
  { label: "Reports", icon: <FaBox />, path: "/reports" },
];

const managementItems = [
  { label: "Settings", icon: <FaCog />, path: "/settings" },
  { label: "Notifications", icon: <FaBell />, path: "/notifications" },
  { label: "Profile", icon: <FaUserCircle />, path: "/profile" },
];

const sidebarStyle = (collapsed, mobileOpen) => ({
  width: collapsed ? 70 : 260,
  background: "var(--sidebar-bg)",
  borderRight: "1px solid var(--sidebar-border)",
  height: "100vh",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  zIndex: 100,
  position: "fixed",
});

const isMobile = window.innerWidth < 768;


const logoStyle = (collapsed) => ({
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  fontWeight: 700,
  fontSize: 22,
  letterSpacing: 1,
  paddingLeft: collapsed ? 0 : 10,
  borderBottom: "1px solid var(--sidebar-border)",
  marginBottom: 8,
  color: "var(--text)",
  transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
});

const navSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginTop: 16,
};

const navItemStyle = (active, collapsed) => ({
  display: "flex",
  alignItems: "center",
  gap: collapsed ? 0 : 16,
  padding: collapsed ? "12px 0" : "12px 24px",
  color: active ? "var(--accent)" : "var(--muted)",
  background: active ? "linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)" : "transparent",
  borderLeft: active ? "4px solid var(--accent)" : "4px solid transparent",
  fontWeight: active ? 600 : 500,
  fontSize: 16,
  cursor: "pointer",
  borderRadius: "0 24px 24px 0",
  transition: "all 0.25s ease",
  minHeight: 44,
  justifyContent: collapsed ? "center" : "flex-start",
  boxShadow: "none",
});


const sectionLabelStyle = (collapsed) => ({
  fontSize: 13,
  color: "var(--muted)",
  fontWeight: 600,
  margin: collapsed ? "16px 0 0 0" : "16px 0 0 24px",
  letterSpacing: 1,
  textTransform: "uppercase",
  textAlign: collapsed ? "center" : "left",
  width: "100%",
  transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
});

const bottomSectionStyle = (collapsed) => ({
  marginTop: "auto",
  marginBottom: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: collapsed ? "center" : "flex-start",
});

const collapseBtnStyle = (collapsed) => ({
  background: "none",
  border: "none",
  color: "var(--muted)",
  fontSize: 22,
  cursor: "pointer",
  margin: collapsed ? "16px 0" : "0px 0 10px 30px",
  alignSelf: collapsed ? "center" : "flex-end",
  transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
});

function Sidebar({collapsed, setCollapsed}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

//   const location = useLocation();

  return (
    <aside style={sidebarStyle(collapsed, isMobile ? mobileOpen : true)}>
      {/* Logo Section – same as Navbar */}
      <div className="sidebar-logo-wrap" style={logoStyle(collapsed)}>
        <NavLink to="/" className="navbar-brand sidebar-brand" style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 8, flex: 1, minWidth: 0 }}>
          <span className="navbar-brand-icon" style={{ marginLeft: collapsed ? 4 : 0 }}>◇</span>
          {!collapsed && <span className="navbar-brand-text">UserSphere</span>}
        </NavLink>

      {/* Collapse Button – hidden on small screens (navbar has its own hamburger) */}
      <button
  type="button"
  className="sidebar-collapse-btn"
  style={collapseBtnStyle(collapsed)}
  onClick={() => setCollapsed(c => !c)}
  title={collapsed ? "Expand" : "Collapse"}
  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
>
  <i className="bi bi-list" style={{ fontSize: "20px" }}></i>
</button>
</div>
      {/* Main Navigation */}
      <div style={sectionLabelStyle(collapsed)}>MAIN</div>
      <nav style={navSectionStyle}>
  {navItems.map(item => (
    <NavLink
      key={item.label}
      to={item.path}
      style={{ textDecoration: "none" }}
    >
      {({ isActive }) => (
        <div className="sidebar-nav-item" style={navItemStyle(isActive, collapsed)}
        title={collapsed ? item.label : ""}
        >
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </div>
      )}
    </NavLink>
  ))}
</nav>
      {/* Management Section */}
      <div style={sectionLabelStyle(collapsed)}>ADMIN</div>
      <nav style={navSectionStyle}>
  {managementItems.map(item => (
    <NavLink
      key={item.label}
      to={item.path}
      style={{ textDecoration: "none" }}
    >
      {({ isActive }) => (
        <div className="sidebar-nav-item" style={navItemStyle(isActive, collapsed)}
        title={collapsed ? item.label : ""}
        >
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </div>
      )}
    </NavLink>
  ))}
</nav>
      {/* Bottom Section */}
      {/* <div style={bottomSectionStyle(collapsed)}>
        <div style={navItemStyle(false, collapsed)}>
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </div>
      </div> */}
      <div style={navItemStyle(false, collapsed)} 
      onClick={() => { logout(); navigate('/login'); }}>
        <FaSignOutAlt />
        {!collapsed && <span>Logout</span>}
      </div>
    </aside>
  );
}

export default Sidebar;
