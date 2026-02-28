import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { Search, Monitor, PackagePlus, FileText, Settings, LogOut, Code } from "lucide-react";
import { exportToCSV } from "../utils/exportToCSV";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { items: products } = useSelector((state) => state.products);

  const commands = [
    { id: "nav-dash", icon: <Monitor size={18} />, title: "Go to Dashboard", subtitle: "Overview metrics", action: () => navigate("/") },
    { id: "nav-inv", icon: <Code size={18} />, title: "Go to Inventory", subtitle: "View all assets", action: () => navigate("/products") },
    { id: "add-asset", icon: <PackagePlus size={18} />, title: "Add New Asset", subtitle: "Register hardware/license", action: () => { 
        document.dispatchEvent(new CustomEvent('open-asset-drawer')); 
        navigate("/products"); 
      } 
    },
    { id: "export", icon: <FileText size={18} />, title: "Export Inventory Report", subtitle: "Download as CSV", action: () => { exportToCSV(products); setIsOpen(false); } },
    { id: "settings", icon: <Settings size={18} />, title: "System Settings", subtitle: "Admin configuration", action: () => navigate("/settings") },
    { id: "logout", icon: <LogOut size={18} />, title: "Terminate Session", subtitle: "Sign out securely", action: () => { logout(); setIsOpen(false); } },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(input.toLowerCase()) || 
    cmd.subtitle.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          if (filteredCommands[selectedIndex].id !== 'add-asset') {
             setIsOpen(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      setInput("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "12vh",
      backdropFilter: "blur(4px)"
    }} onClick={() => setIsOpen(false)}>
      
      <div className="animate-fade-in" style={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg), 0 0 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Input Area */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-primary)"
        }}>
          <Search size={22} style={{ color: "var(--text-muted)", marginRight: "1rem" }} />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or search..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "1.125rem",
              outline: "none",
              fontFamily: "var(--font-family)"
            }}
          />
          <div style={{ display: 'flex', gap: '0.25rem' }}>
             <kbd style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>ESC</kbd>
          </div>
        </div>

        {/* Results Area */}
        <div style={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: "0.5rem"
        }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              No commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => { cmd.action(); setIsOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: idx === selectedIndex ? "var(--bg-tertiary)" : "transparent",
                  color: idx === selectedIndex ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "background-color 0s",
                }}
              >
                <div style={{ 
                  marginRight: "1rem", 
                  color: idx === selectedIndex ? "var(--text-primary)" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {cmd.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: idx === selectedIndex ? "600" : "500", fontSize: "0.9375rem" }}>
                    {cmd.title}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {cmd.subtitle}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div>Nexus OS Command Line</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span><kbd style={{ fontFamily: 'inherit' }}>↑↓</kbd> to navigate</span>
            <span><kbd style={{ fontFamily: 'inherit' }}>↵</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
