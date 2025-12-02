import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilters, setPage } from "../store/productSlice";
import { useAuth } from "../hooks/useAuth";
import "./TerminalWidget.css";

export default function TerminalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "info", content: "Welcome to Nexus_CLI v1.0" },
    { type: "info", content: "Type 'help' for available commands." },
  ]);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim();
    const newHistory = [...history, { type: "user", content: `> ${cmd}` }];

    const lc = cleanCmd.toLowerCase();
    const tokens = lc.split(/\s+/);

    switch (tokens[0]) {
      case "help":
        newHistory.push({
          type: "info",
          content:
            "AVAILABLE COMMANDS:\n  login                - Access system\n  register             - Create user\n  list [filters]       - Go to products with filters\n  export pdf           - Export product list PDF\n  goto [route]         - Navigate to route (dashboard/products/home)\n  status               - Check backend status\n  logout               - Sign out\n  about                - System info\n  clear                - Clear screen\n  date                 - System time\n  exit                 - Close terminal",
        });
        break;
      case "login":
        newHistory.push({ type: "success", content: "Redirecting to login..." });
        setTimeout(() => navigate("/login"), 1000);
        break;
      case "register":
        newHistory.push({ type: "success", content: "Initiating registration..." });
        setTimeout(() => navigate("/register"), 1000);
        break;
      case "list": {
        // Parse filters: e.g., list search=foo min=10 max=100 sort=price-desc
        const args = cleanCmd.split(/\s+/).slice(1);
        const parsed = {};
        args.forEach((arg) => {
          const [k, v] = arg.split("=");
          if (!k || v === undefined) return;
          if (["search", "min", "minprice"].includes(k.toLowerCase())) parsed.minPrice = v;
          if (["max", "maxprice"].includes(k.toLowerCase())) parsed.maxPrice = v;
          if (k.toLowerCase() === "search") parsed.search = v;
          if (k.toLowerCase() === "sort") parsed.sortBy = v;
        });
        dispatch(setFilters(parsed));
        dispatch(setPage(1));
        newHistory.push({ type: "success", content: "Navigating to PRODUCTS with filters..." });
        navigate("/products");
        break;
      }
      case "export": {
        if (tokens[1] === "pdf") {
          newHistory.push({ type: "success", content: "Exporting PDF..." });
          // Let ProductList listen and handle the export
          window.dispatchEvent(new CustomEvent("trigger-export-pdf"));
          navigate("/products");
        } else {
          newHistory.push({ type: "error", content: "Usage: export pdf" });
        }
        break;
      }
      case "goto": {
        const route = tokens[1] || "";
        if (["/dashboard", "dashboard"].includes(route)) {
          navigate("/dashboard");
          newHistory.push({ type: "success", content: "Navigating to DASHBOARD..." });
        } else if (["/products", "products"].includes(route)) {
          navigate("/products");
          newHistory.push({ type: "success", content: "Navigating to PRODUCTS..." });
        } else if (["/", "home"].includes(route)) {
          navigate("/");
          newHistory.push({ type: "success", content: "Navigating to HOME..." });
        } else {
          newHistory.push({ type: "error", content: "Unknown route. Try: dashboard/products/home" });
        }
        break;
      }
      case "status": {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/status`)
          .then((r) => r.json())
          .then((d) => {
            setHistory([...newHistory, { type: "info", content: `STATUS: ${d.message}` }]);
          })
          .catch((e) => {
            setHistory([...newHistory, { type: "error", content: `STATUS_ERROR: ${e.message}` }]);
          });
        setInput("");
        return;
      }
      case "logout": {
        logout()
          .then(() => {
            newHistory.push({ type: "success", content: "Logged out." });
            navigate("/");
          })
          .catch((e) => {
            newHistory.push({ type: "error", content: `Logout failed: ${e.message}` });
          });
        break;
      }
      case "about":
        newHistory.push({
          type: "info",
          content: "Product Nexus is a state-of-the-art inventory management system built on the MERN stack.",
        });
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "date":
        newHistory.push({ type: "info", content: new Date().toString() });
        break;
      case "exit":
        setIsOpen(false);
        break;
      case "":
        break;
      default:
        newHistory.push({ type: "error", content: `Command not found: ${lc}` });
    }

    setHistory(newHistory);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  if (!isOpen) {
    return (
      <button className="terminal-toggle" onClick={() => setIsOpen(true)}>
        {">_"}
      </button>
    );
  }

  return (
    <div className="terminal-widget">
      <div className="terminal-header">
        <span>NEXUS_CLI</span>
        <button onClick={() => setIsOpen(false)}>X</button>
      </div>
      <div className="terminal-body">
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="terminal-input-area">
        <span>{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Type command..."
        />
      </div>
    </div>
  );
}
