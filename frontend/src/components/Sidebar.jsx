import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PackageSearch, Settings, ShieldAlert, LogOut, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const navItems = [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { label: "Inventory", path: "/products", icon: <PackageSearch size={20} /> },
    { label: "Analytics", path: "/analytics", icon: <ShieldAlert size={20} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={20} /> }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      position: isMobile ? 'fixed' : 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 50,
      transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ marginBottom: '3rem', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          letterSpacing: '-0.025em',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--accent-color)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '14px' }}>P</div>
          ProductNexus
        </h1>
        {isMobile && (
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <li key={item.path}>
                <Link to={item.path} onClick={() => isMobile && onClose()} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                  fontWeight: '500',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if(!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if(!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Built & Engineered By</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
             <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success-color)', fontFamily: 'var(--font-mono)' }}>POOJAN 😎</span>
          </div>
        </div>
        <button 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            width: '100%',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontWeight: '500',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            e.currentTarget.style.color = 'var(--danger-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
