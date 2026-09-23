import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { Partners } from './pages/Partners';
import { Systems } from './pages/Systems';
import { ModulePage } from './pages/ModulePage';
import { DgtlzRoute } from './pages/DgtlzRoute';
import { DgtlzPaygate } from './pages/DgtlzPaygate';
import AgentPage from './pages/AgentPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { RampungPage } from './pages/RampungPage';
import { YouthPage } from './pages/YouthPage';
import { siteOps } from './lib/deckApi';
import { Construction } from 'lucide-react';

function sessionKey() {
  try {
    let sid = sessionStorage.getItem('dgtlz_sid');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('dgtlz_sid', sid);
    }
    return sid;
  } catch {
    return 'anon';
  }
}

function MaintenanceScreen({ path }: { path: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
      <div className="border-2 border-neutral-900 bg-[#F4F3EF] px-6 py-8 max-w-md w-full">
        <Construction className="w-8 h-8 mx-auto text-electric-blue" />
        <h2 className="font-mono text-lg font-black tracking-widest uppercase mt-4">UNDER RECONSTRUCTION</h2>
        <p className="font-mono text-xs text-neutral-500 mt-2">
          MODUL <span className="text-neutral-900 font-bold">{path}</span> SEDANG KAMI TINGKATKAN. KEMBALI LAGI SEBENTAR LAGI.
        </p>
        <a href="/" className="inline-block mt-6 bg-neutral-900 text-white font-mono text-xs font-bold px-5 py-2.5 hover:bg-electric-blue transition-colors">
          BACK TO MAIN
        </a>
      </div>
    </div>
  );
}

function SiteController({ children }: { children: import('react').ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const lastPath = useRef('');
  const [siteConfig, setSiteConfig] = useState<Record<string, { status: string; nav: boolean }> | null>(null);
  const [maintenancePath, setMaintenancePath] = useState<string | null>(null);

  // Load site config once (public, no auth)
  useEffect(() => {
    siteOps.config().then((r) => setSiteConfig(r.site?.pages || {})).catch(() => setSiteConfig({}));
  }, []);

  // Maintenance guard: redirect dashboard users away from a page put under maintenance
  useEffect(() => {
    if (!siteConfig || !maintenancePath) return;
    if (location.pathname === maintenancePath) navigate('/');
  }, [location.pathname, siteConfig, maintenancePath, navigate]);

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;
    siteOps.track({ path, sid: sessionKey(), ref: document.referrer, device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop' }).catch(() => {});
  }, [location.pathname]);

  // While config loads, render children (fail-open)
  if (siteConfig === null) return <>{children}</>;
  const pageState = siteConfig[location.pathname];
  if (pageState?.status === 'MAINTENANCE') {
    if (location.pathname === '/dashboard') return <>{children}</>;
    return <MaintenanceScreen path={location.pathname} />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteController>
        <div className="min-h-screen selection:bg-electric-blue selection:text-white flex flex-col">
          <Navbar />
          <main className="pt-16 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/route" element={<DgtlzRoute />} />
              <Route path="/paygate" element={<DgtlzPaygate />} />
              <Route path="/agent" element={<AgentPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/systems" element={<Systems />} />
              <Route path="/systems/:slug" element={<ModulePage />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rampung" element={<RampungPage />} />
              <Route path="/youth" element={<YouthPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SiteController>
    </BrowserRouter>
  );
}
