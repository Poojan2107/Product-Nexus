import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AssetDrawer from "./AssetDrawer";
import { useState, useEffect } from "react";

export default function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenDrawer = (e) => {
      setEditingAsset(e.detail?.asset || null);
      setIsDrawerOpen(true);
    };
    document.addEventListener('open-asset-drawer', handleOpenDrawer);
    return () => document.removeEventListener('open-asset-drawer', handleOpenDrawer);
  }, []);

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="desktop-only"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }}
        />
      )}
      
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="layout-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', marginLeft: '260px', transition: 'margin 0.3s ease' }}>
        <Topbar onPlusClick={() => { setEditingAsset(null); setIsDrawerOpen(true); }} onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="layout-content" style={{ flex: 1, padding: '2rem 1rem', overflowY: 'auto' }}>
          <Outlet context={{ openDrawer: (asset = null) => { setEditingAsset(asset); setIsDrawerOpen(true); } }} />
        </main>
      </div>
      {isDrawerOpen && <AssetDrawer 
        isOpen={isDrawerOpen} 
        assetToEdit={editingAsset} 
        onClose={() => setIsDrawerOpen(false)} 
        onSuccess={() => {
          setIsDrawerOpen(false);
          document.dispatchEvent(new CustomEvent('assets-updated'));
        }} 
      />}
    </div>
  );
}
