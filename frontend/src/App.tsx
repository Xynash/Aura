import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Playground from './pages/Playground';
import { useAuraSocket, AuraEvent } from './hooks/useAuraSocket';

export type SystemStatus = 'idle' | 'initializing' | 'active' | 'offline';

// ── Watcher status type ───────────────────────────────────────────────────────
export type WatcherStatus = 'connecting' | 'armed' | 'simulation' | 'offline';

const AnimatedRoutes = ({
  systemStatus,
  setSystemStatus,
}: {
  systemStatus: SystemStatus;
  setSystemStatus: (s: SystemStatus) => void;
}) => {
  const location = useLocation();
  const isActive = systemStatus === 'active';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing systemStatus={systemStatus} setSystemStatus={setSystemStatus} />} />
        <Route path="/dashboard"  element={isActive ? <Dashboard />  : <Navigate to="/" replace />} />
        <Route path="/playground" element={isActive ? <Playground /> : <Navigate to="/" replace />} />
        <Route path="/incidents"  element={isActive ? <Incidents />  : <Navigate to="/" replace />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [systemStatus,   setSystemStatus]   = useState<SystemStatus>('idle');
  const [watcherStatus,  setWatcherStatus]  = useState<WatcherStatus>('connecting');
  const [incidentCount,  setIncidentCount]  = useState(0);

  // ── WebSocket — drive watcher dot + incident badge from here ──────────────
  useAuraSocket((event: AuraEvent) => {
    if (event.type === "connected") {
      // If namespace returned — real K8s. Otherwise simulation mode.
      setWatcherStatus(event.namespace ? 'armed' : 'simulation');
    }
    if (event.type === "incident_detected") {
      setIncidentCount(prev => prev + 1);
      setWatcherStatus('armed');
    }
    if (event.type === "rca_complete") {
      // RCA done — keep count until user visits incidents
    }
  });

  // ── Backend health check on mount ─────────────────────────────────────────
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8000/health");
        if (!res.ok) throw new Error();
      } catch {
        console.warn("Aura Engine: Waiting for connection...");
        setWatcherStatus('offline');
      }
    };
    checkBackend();
  }, []);

  // ── Clear incident badge when user visits /incidents ──────────────────────
  const clearIncidentCount = () => setIncidentCount(0);

  return (
    <Router>
      <div className="min-h-screen relative bg-[#020617]">
        <div className="galactic-bg" />

        <Navbar
          systemStatus={systemStatus}
          watcherStatus={watcherStatus}
          incidentCount={incidentCount}
          onIncidentsVisit={clearIncidentCount}
        />

        <main className="relative z-10">
          <AnimatedRoutes
            systemStatus={systemStatus}
            setSystemStatus={setSystemStatus}
          />
        </main>

        {systemStatus === 'offline' && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-red-500/10 border border-red-500/50 px-6 py-3 rounded-2xl backdrop-blur-xl">
            <p className="text-red-500 font-mono text-[10px] uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              Connection_Lost: Python Backend Unreachable
            </p>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;