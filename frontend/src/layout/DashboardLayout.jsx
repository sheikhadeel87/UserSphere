import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const SMALL_SCREEN_BREAKPOINT = 900;

function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(() => typeof window !== "undefined" && window.innerWidth <= SMALL_SCREEN_BREAKPOINT);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SMALL_SCREEN_BREAKPOINT}px)`);
    const handle = () => setIsSmallScreen(mql.matches);
    mql.addEventListener("change", handle);
    handle();
    return () => mql.removeEventListener("change", handle);
  }, []);

  const effectiveCollapsed = collapsed || isSmallScreen;
  const sidebarWidth = effectiveCollapsed ? 70 : 240;
  const mainContentMaxWidth = effectiveCollapsed ? 1500 : "100%";

  return (
    <div className="dashboard-layout" style={{ display: "flex", flexDirection: "row", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="dashboard-sidebar" style={{
        width: sidebarWidth,
        minHeight: "100vh",
        transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
        flexShrink: 0,
      }}>
        <Sidebar collapsed={effectiveCollapsed} setCollapsed={setCollapsed} />
      </div>
      <div
        className="dashboard-main"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        }}
      >
        <Navbar onMenuToggle={() => setCollapsed((c) => !c)} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflowX: "hidden" }}>
          <div
            className="dashboard-content"
            style={{
              width: "100%",
              maxWidth: mainContentMaxWidth,
              margin: "0 auto",
              background: "var(--card)",
              border: "1.5px solid var(--line)",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {children}
          </div>
        </div>
        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '16px',
          color: 'var(--muted)',
          fontSize: '13px',
          borderTop: '1px solid var(--line)',
          background: 'var(--card)',
        }}>
          © 2026 UserSphere v1.0 .Built with MERN Stack.Developed by M.Adeel
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;
