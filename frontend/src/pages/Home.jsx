import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../store/productSlice";
import "../components/Card.css";
import TerminalWidget from "../components/TerminalWidget";
import InventoryChart from "../components/InventoryChart";

import { useAuth } from "../hooks/useAuth";
import ParticleBackground from "../components/ParticleBackground";

export default function Home() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (user) {
      dispatch(getProducts({ page: 1, limit: 1000 })); // Fetch all for stats
    }
  }, [dispatch, user]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePosition({ x, y });
  };

  if (user) {
    return (
      <div className="hero-section" onMouseMove={handleMouseMove} style={{ overflowX: "hidden" }}>
        <ParticleBackground />
        <div className="scanline"></div>
        <div className="vignette"></div>
        
        <div className="glitch-wrapper" style={{ marginTop: "-5rem", width: "100%", padding: "0 1rem" }}>
          <div className="typing-container" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", borderRight: "none", animation: "none", whiteSpace: "normal", textAlign: "center" }}>
            WELCOME_BACK_COMMANDER
          </div>
        </div>

        <div className="feature-grid" style={{ marginTop: "2rem", maxWidth: "1000px" }}>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <TiltCard 
              title="[ ACCESS_INVENTORY ]" 
              desc="Manage product database, update stock levels, and audit assets." 
              delay={0} 
            />
          </Link>
          <Link to="/products/add" style={{ textDecoration: "none" }}>
            <TiltCard 
              title="[ NEW_ENTRY ]" 
              desc="Register new hardware or software assets into the system." 
              delay={0.1} 
            />
          </Link>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <TiltCard 
              title="[ SYSTEM_ANALYTICS ]" 
              desc="View real-time performance metrics and inventory valuation." 
              delay={0.2} 
            />
          </Link>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <TiltCard 
              title="[ SECURITY_PROTOCOLS ]" 
              desc="Configure user permissions, update credentials, and view audit logs." 
              delay={0.3} 
            />
          </Link>
        </div>

        <div className="dashboard-widgets" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "3rem", width: "100%", maxWidth: "1000px", padding: "0 1rem", opacity: 0, animation: "fadeInUp 1s ease 0.5s forwards" }}>
          <InventoryAnalyticsPanel products={products} />
          <RecentActivityPanel products={products} />
        </div>

        <div style={{ marginTop: "3rem", paddingBottom: "4rem", opacity: 0.5, fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "center" }}>
          <p>CURRENT_SESSION_ID: {user?.id?.substring(0, 8).toUpperCase() || "UNKNOWN"}</p>
          <p>SECURITY_CLEARANCE: LEVEL_5</p>
        </div>

        <StatusTicker />
      </div>
    );
  }

  return (
    <div className="hero-section" onMouseMove={handleMouseMove} style={{ overflowX: "hidden" }}>
      <div className="scanline"></div>
      <div className="vignette"></div>
      
      {/* Dynamic Background Elements */}
      <div className="floating-data" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
      <div className="floating-data" style={{ top: '60%', left: '80%', animationDelay: '2s' }}></div>
      <div className="floating-data" style={{ top: '80%', left: '30%', animationDelay: '4s' }}></div>

      <div className="glitch-wrapper" style={{ width: "100%", padding: "0 1rem", display: "flex", justifyContent: "center" }}>
        <Typewriter 
          phrases={[
            "INITIALIZING_SYSTEM...",
            "ESTABLISHING_UPLINK...",
            "ACCESSING_ARCHIVES...",
            "PRODUCT_NEXUS_ONLINE"
          ]} 
        />
      </div>
      
      <p style={{ 
        fontFamily: "var(--font-mono)", 
        fontSize: "clamp(1rem, 3vw, 1.2rem)", 
        color: "var(--text-secondary)", 
        maxWidth: "600px", 
        marginBottom: "2rem", 
        lineHeight: "1.6",
        opacity: 0,
        animation: "fadeInUp 1s ease 1.5s forwards",
        transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
        padding: "0 1rem"
      }}>
        ADVANCED_INVENTORY_MANAGEMENT_PROTOCOL_V1.0
      </p>

      <div className="cta-buttons" style={{ transform: `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)`, flexWrap: "wrap", justifyContent: "center", width: "100%", padding: "0 1rem" }}>
        <Link to="/login" className="btn accent" style={{ padding: "1rem 3rem", fontSize: "1.2rem", textDecoration: "none", fontWeight: "bold", position: 'relative', overflow: 'hidden', width: "100%", maxWidth: "300px", textAlign: "center" }}>
          <span className="btn-glitch-effect"></span>
          INITIALIZE_LOGIN
        </Link>
        <Link to="/register" className="btn muted" style={{ padding: "1rem 3rem", fontSize: "1.2rem", textDecoration: "none", width: "100%", maxWidth: "300px", textAlign: "center" }}>
          NEW_USER_REGISTRATION
        </Link>
      </div>

      <div className="feature-grid" style={{ opacity: 0, animation: "fadeInUp 1s ease 3s forwards" }}>
        <TiltCard title="[ SECURE_ACCESS ]" desc="Enterprise-grade JWT authentication with encrypted data transmission." delay={0} />
        <TiltCard title="[ ANALYTICS_CORE ]" desc="Real-time data visualization and inventory tracking metrics." delay={0.2} />
        <TiltCard title="[ CLOUD_SYNC ]" desc="Seamless asset management with distributed cloud storage integration." delay={0.4} />
      </div>

      <div className="system-modules" style={{ marginTop: "4rem", textAlign: "left", width: "100%", maxWidth: "800px", padding: "0 1rem", opacity: 0, animation: "fadeInUp 1s ease 4s forwards" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-primary)", paddingBottom: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
          {">"} SYSTEM_MODULES_CHECK
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", fontFamily: "var(--font-mono)" }}>
          <ModuleItem name="REACT_CORE_V19" status="ACTIVE" />
          <ModuleItem name="REDUX_STATE" status="OPTIMIZED" />
          <ModuleItem name="NODE_SERVER" status="RUNNING" />
          <ModuleItem name="MONGODB_CLUSTER" status="CONNECTED" />
          <ModuleItem name="JWT_SECURITY" status="ENFORCED" />
          <ModuleItem name="CLOUDINARY_CDN" status="LINKED" />
        </div>
      </div>

      <TerminalWidget />
      <StatusTicker />
    </div>
  );
}

function ModuleItem({ name, status }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-secondary)" }}>
      <span style={{ color: "var(--text-secondary)" }}>{name}</span>
      <span style={{ color: "var(--text-primary)", fontSize: "0.8rem" }}>[{status}]</span>
    </div>
  );
}

function StatusTicker() {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "var(--bg-secondary)",
      borderTop: "1px solid var(--border-primary)",
      padding: "0.5rem",
      overflow: "hidden",
      whiteSpace: "nowrap",
      zIndex: 100
    }}>
      <div style={{ 
        display: "inline-block", 
        animation: "ticker 30s linear infinite", 
        color: "var(--text-muted)", 
        fontSize: "0.9rem",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}>
        SYSTEM_STATUS: NOMINAL /// ENCRYPTION: AES-256 /// UPTIME: 99.99% /// SERVER_REGION: AP-SOUTH-1 /// LAST_SYNC: JUST_NOW /// MEMORY_USAGE: OPTIMIZED /// SYSTEM_STATUS: NOMINAL /// ENCRYPTION: AES-256
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

function TiltCard({ title, desc, delay }) {
  const [transform, setTransform] = useState("");

  const handleMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
  };

  const handleLeave = () => {
    setTransform("perspective(1000px) rotateX(0) rotateY(0) scale(1)");
  };

  return (
    <div 
      className="feature-card" 
      onMouseMove={handleMove} 
      onMouseLeave={handleLeave}
      style={{ 
        transform: transform, 
        transition: transform ? "transform 0.1s ease-out" : "transform 0.5s ease",
        animationDelay: `${delay}s`
      }}
    >
      <h3 style={{ color: "var(--text-primary)", marginBottom: "1rem", fontSize: "1.5rem" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)" }}>{desc}</p>
    </div>
  );
}

function Typewriter({ phrases }) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(100);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, delta]);

  const tick = () => {
    let i = phraseIndex % phrases.length;
    let fullText = phrases[i];
    let updatedText = isDeleting 
      ? fullText.substring(0, text.length - 1) 
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(50); // Faster deletion
    }

    if (!isDeleting && updatedText === fullText) {
      // Finished typing phrase
      if (i === phrases.length - 1) {
        // Stop at the last phrase
        setDelta(9999999); // "Stop"
      } else {
        setDelta(2000); // Wait before deleting
        setIsDeleting(true);
      }
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setPhraseIndex(phraseIndex + 1);
      setDelta(100);
    }
  };

  return (
    <div className="typing-container glitch" data-text={text} style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)", textAlign: "center", whiteSpace: "normal" }}>
      {text}
    </div>
  );
}

function InventoryAnalyticsPanel({ products }) {
  const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0);
  const totalItems = products.length;
  const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

  return (
    <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-secondary)", padding: "1.5rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginBottom: "0.5rem", fontSize: "1rem", borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem" }}>
        {">"} INVENTORY_ANALYTICS
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>TOTAL_ASSETS</div>
          <div style={{ color: "var(--accent-primary)", fontSize: "1.8rem", fontWeight: "bold" }}>{totalItems}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>TOTAL_VALUE</div>
          <div style={{ color: "var(--accent-secondary)", fontSize: "1.5rem", fontWeight: "bold" }}>${totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: "200px", position: "relative" }}>
        <InventoryChart />
      </div>
    </div>
  );
}

function RecentActivityPanel({ products }) {
  // Generate logs from actual products
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
  return (
    <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-secondary)", padding: "1.5rem", borderRadius: "8px" }}>
      <h3 style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", marginBottom: "1rem", fontSize: "1rem", borderBottom: "1px solid var(--border-secondary)", paddingBottom: "0.5rem" }}>
        {">"} RECENT_ACTIVITY_LOG
      </h3>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {recentProducts.length > 0 ? recentProducts.map((p, i) => (
          <div key={p._id} style={{ display: "flex", gap: "0.5rem", opacity: 0.9, alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
              [{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
            </span>
            <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>NEW_ENTRY:</span>
            <span style={{ color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>
              {p.name.toUpperCase()}
            </span>
            <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>${p.price}</span>
          </div>
        )) : (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>NO_RECENT_ACTIVITY</div>
        )}
        
        <div style={{ marginTop: "1rem", borderTop: "1px dashed var(--border-secondary)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", opacity: 0.8 }}>
             <span style={{ color: "var(--text-muted)" }}>[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
             <span style={{ color: "var(--text-primary)" }}>SYSTEM_STATUS: ONLINE</span>
          </div>
        </div>
        <div style={{ marginTop: "0.5rem", color: "var(--text-primary)", animation: "blink 1s infinite" }}>_</div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color, isText }) {
  const width = isText ? "100%" : value;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
        <span>{label}</span>
        <span style={{ color: color }}>{value}</span>
      </div>
      {!isText && (
        <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
          <div style={{ width: width, height: "100%", background: color, borderRadius: "2px", boxShadow: `0 0 5px ${color}` }}></div>
        </div>
      )}
    </div>
  );
}
