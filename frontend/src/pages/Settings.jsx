import { useState } from "react";
import { User, Bell, Shield, Database, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure your enterprise administrative preferences.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'profile', icon: <User size={18} />, label: 'Profile Settings' },
            { id: 'notifications', icon: <Bell size={18} />, label: 'Alerts & Webhooks' },
            { id: 'security', icon: <Shield size={18} />, label: 'Security (SSO/SAML)' },
            { id: 'database', icon: <Database size={18} />, label: 'Database Backup' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                backgroundColor: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: '500', textAlign: 'left', transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card" style={{ minHeight: '500px' }}>
          
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Administrator Profile</h3>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
                </div>
                <div>
                  <button className="btn btn-secondary">Upload Avatar</button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input" defaultValue={user?.name || "System Admin"} />
                </div>
                <div>
                  <label className="label">Email Address (Identity)</label>
                  <input type="email" className="input" defaultValue={user?.email || "admin@nexus.com"} disabled />
                </div>
                <div>
                  <label className="label">Role</label>
                  <input type="text" className="input" defaultValue="Super Administrator" disabled />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input type="text" className="input" defaultValue="IT Operations" />
                </div>
              </div>
              
              <button className="btn btn-primary" style={{ marginTop: '2rem' }}>Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Alerts & Webhooks</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Where is this used? Large companies integrate this tool with Slack or Microsoft Teams so that when an asset is deleted, it pings the security channel automatically.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>Slack Webhook Integration</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send hardware activity logs to #it-ops</div>
                  </div>
                  <button className="btn btn-secondary">Configure</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>Email Alerts</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify me when inventory total drops below 10 items</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer', transform: 'scale(1.2)' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Security (SSO)</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Enterprise IT needs tools to integrate with Okta, Azure AD, or Google Workspace so employees use one password for everything.</p>
              
              <button className="btn btn-secondary" style={{ marginBottom: '2rem' }}>Configure Single Sign-On (SSO)</button>
              
              <h4 style={{ fontWeight: '600', color: 'var(--danger-color)', marginBottom: '1rem' }}>Danger Zone</h4>
              <div style={{ border: '1px solid var(--danger-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Permanently delete all tracking data for your organization.</p>
                <button className="btn btn-danger"><Trash2 size={16} /> Wipe Database</button>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Database Snapshot</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Force a manual backup of the MongoDB state for compliance.</p>
              
              <button className="btn btn-primary">Generate Backup Node</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
