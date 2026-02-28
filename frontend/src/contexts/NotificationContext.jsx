import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const NotificationContext = createContext();

const NOTIFICATION_TIMEOUT = 5000;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (messageOrOptions, type = "success") => {
    const id = Date.now();
    let opts = {};
    if (typeof messageOrOptions === "string") {
      opts = { message: messageOrOptions, type };
    } else {
      opts = messageOrOptions || {};
      if (!opts.type) opts.type = type;
    }
    const ttl = typeof opts.ttl === "number" ? opts.ttl : NOTIFICATION_TIMEOUT;
    setNotifications((prev) => [...prev, { id, ...opts }]);
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, ttl);
    return { id, timer };
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-lg)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                minWidth: "300px",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", backgroundColor: n.type === "success" ? "var(--success-color)" : "var(--danger-color)" }} />
              
              <div style={{ color: n.type === "success" ? "var(--success-color)" : "var(--danger-color)" }}>
                {n.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: '500' }}>{n.message}</span>
              </div>
              
              <button 
                onClick={() => removeNotification(n.id)}
                style={{ color: "var(--text-muted)", padding: "0.25rem", borderRadius: "4px" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
