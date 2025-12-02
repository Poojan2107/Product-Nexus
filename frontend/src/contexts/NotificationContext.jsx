import { createContext, useContext, useState } from "react";

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
      <div className="notifications" style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification ${n.type}`}
            style={{
              background: n.type === "success" ? "#4caf50" : "#f44336",
              color: "white",
              padding: "1rem",
              marginBottom: "0.5rem",
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              textTransform: "none",
              letterSpacing: "0",
            }}
            onClick={() => removeNotification(n.id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span>{n.message}</span>
              {n.actionLabel && (
                <button
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof n.onAction === "function") n.onAction(n);
                    removeNotification(n.id);
                  }}
                >
                  {n.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
