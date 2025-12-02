import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function CommandTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "info", text: "PRODUCT_NEXUS_CLI_V1.0 [ONLINE]" },
    { type: "info", text: "TYPE 'help' FOR COMMANDS" },
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Toggle with Ctrl+K or Backtick
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === "k") || e.key === "`") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    let response = { type: "success", text: "COMMAND_EXECUTED" };

    switch (command) {
      case "help":
        setHistory((prev) => [
          ...prev,
          { type: "input", text: `> ${cmd}` },
          { type: "info", text: "AVAILABLE COMMANDS:" },
          { type: "info", text: "  goto <page>   : NAVIGATE (home, products, add, profile)" },
          { type: "info", text: "  search <term> : SEARCH INVENTORY" },
          { type: "info", text: "  clear         : CLEAR TERMINAL" },
          { type: "info", text: "  logout        : TERMINATE SESSION" },
          { type: "info", text: "  close         : HIDE TERMINAL" },
        ]);
        return;

      case "clear":
        setHistory([]);
        return;

      case "close":
        setIsOpen(false);
        return;

      case "goto":
        if (!args) {
          response = { type: "error", text: "ERROR: MISSING ARGUMENT. TRY 'goto products'" };
        } else {
          const page = args.toLowerCase();
          if (page === "home" || page === "dashboard") navigate("/");
          else if (page === "products" || page === "list") navigate("/products");
          else if (page === "add" || page === "new") navigate("/products/add");
          else if (page === "profile" || page === "settings") navigate("/profile");
          else {
            response = { type: "error", text: `ERROR: UNKNOWN DESTINATION '${page}'` };
          }
        }
        break;

      case "search":
        if (!args) {
          response = { type: "error", text: "ERROR: MISSING SEARCH TERM" };
        } else {
          // Navigate to products with search query (requires ProductList to handle URL params, 
          // but for now we'll just go there and user can type. 
          // Ideally we'd dispatch a search action or use URL params)
          // Let's just navigate for now.
          navigate("/products"); 
          // In a real app, we'd pass ?search=args
          response = { type: "success", text: `INITIATING_SEARCH_PROTOCOL: "${args}"... (Please enter in search bar)` };
        }
        break;

      case "logout":
        logout();
        setIsOpen(false);
        response = { type: "warning", text: "SESSION_TERMINATED" };
        break;

      default:
        response = { type: "error", text: `ERROR: UNKNOWN COMMAND '${command}'` };
    }

    setHistory((prev) => [
      ...prev,
      { type: "input", text: `> ${cmd}` },
      response
    ]);
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(5px)"
    }} onClick={() => setIsOpen(false)}>
      <div style={{
        width: "800px",
        height: "500px",
        background: "#0a0a0a",
        border: "1px solid #333",
        borderRadius: "8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-mono)",
        overflow: "hidden"
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          background: "#1a1a1a",
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ color: "#fff", fontSize: "0.9rem" }}>COMMAND_PROMPT_ADMIN</span>
          <span style={{ color: "#666", fontSize: "0.8rem" }}>[ESC] TO CLOSE</span>
        </div>

        {/* Output */}
        <div style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          color: "#ccc",
          fontSize: "0.9rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          {history.map((line, i) => (
            <div key={i} style={{ 
              color: line.type === "error" ? "#ff3333" : line.type === "warning" ? "#ffcc00" : line.type === "input" ? "#fff" : "#ccc",
              paddingLeft: line.type === "input" ? "0" : "1rem"
            }}>
              {line.text}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div style={{
          padding: "1rem",
          borderTop: "1px solid #333",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#00ff41" }}>{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSubmit}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              flex: 1,
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              outline: "none"
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
