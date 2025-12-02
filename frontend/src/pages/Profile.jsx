import { useAuth } from "../hooks/useAuth";
import "../components/Card.css";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="slide-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2 className="terminal-header" style={{ marginBottom: "2rem", textAlign: "center" }}>USER_PROFILE_CONFIG</h2>
      
      <div className="card" style={{ padding: "2rem", display: "grid", gap: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", borderBottom: "1px solid var(--border-secondary)", paddingBottom: "2rem" }}>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "var(--bg-secondary)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            border: "2px solid var(--accent-primary)",
            fontSize: "2.5rem",
            color: "var(--accent-primary)"
          }}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{user?.name || "COMMANDER"}</h3>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>ID: {user?.id}</p>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>ROLE: ADMINISTRATOR</p>
            <div style={{ marginTop: "0.5rem", display: "inline-block", padding: "0.25rem 0.5rem", background: "rgba(0, 255, 65, 0.1)", color: "#00ff41", borderRadius: "4px", fontSize: "0.8rem" }}>
              ● SECURITY_CLEARANCE_ACTIVE
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <h4 style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem" }}>ACCOUNT_DETAILS</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", alignItems: "center" }}>
            <label style={{ color: "var(--text-secondary)" }}>EMAIL_ADDRESS:</label>
            <input type="text" value={user?.email} disabled className="terminal-input" style={{ opacity: 0.7 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", alignItems: "center" }}>
            <label style={{ color: "var(--text-secondary)" }}>PASSWORD:</label>
            <input type="password" value="********" disabled className="terminal-input" style={{ opacity: 0.7 }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
           <button className="btn muted" onClick={logout}>TERMINATE_SESSION</button>
           <button className="btn accent">UPDATE_CREDENTIALS</button>
        </div>
      </div>
    </div>
  );
}
