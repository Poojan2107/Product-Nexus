import { Search, Bell, Plus, User, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onPlusClick, onMenuToggle }) {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };
  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)/80',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '300px' }}>
        <button 
          onClick={onMenuToggle}
          style={{ display: window.innerWidth <= 768 ? 'block' : 'none', color: 'var(--text-primary)', padding: '0.25rem' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search inventory (Ctrl+K)..." 
            className="input desktop-only"
            style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: window.innerWidth <= 768 ? 'none' : 'block' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={onPlusClick} style={{ padding: '0.5rem 1rem', height: '32px' }}>
          <Plus size={16} />
          <span style={{ fontSize: '0.8rem' }}>New Asset</span>
        </button>
        <button style={{ 
          position: 'relative', 
          color: 'var(--text-secondary)',
          padding: '0.5rem',
          borderRadius: '50%',
          transition: 'background-color var(--transition-fast)'
        }}
        onClick={() => addNotification('System nominal. No unread alerts.', 'success')}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-color)',
            borderRadius: '50%'
          }}></span>
        </button>
        
        <button 
          onClick={() => navigate('/settings')}
          style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--text-primary)',
          fontWeight: '600',
          fontSize: '0.875rem',
          cursor: 'pointer',
          padding: 0
        }}>
          {user ? getInitials(user.name) : <User size={16} />}
        </button>
      </div>
    </header>
  );
}
