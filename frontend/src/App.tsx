import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Component & Pages
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Playground from './pages/Playground'; // Bhai, clusters ki jagah ab ye aayega

export type SystemStatus = 'idle' | 'initializing' | 'active' | 'offline';

const AnimatedRoutes = ({ systemStatus, setSystemStatus }: { systemStatus: SystemStatus, setSystemStatus: (s: SystemStatus) => void }) => {
  const location = useLocation();
  const isActive = systemStatus === 'active';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing systemStatus={systemStatus} setSystemStatus={setSystemStatus} />} />
        
        {/* Protected System Routes */}
        <Route path="/dashboard" element={isActive ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/playground" element={isActive ? <Playground /> : <Navigate to="/" replace />} />
        <Route path="/incidents" element={isActive ? <Incidents /> : <Navigate to="/" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('idle');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:8000/health");
        if (!response.ok) throw new Error();
      } catch (err) {
        console.warn("Aura Engine: Waiting for connection...");
      }
    };
    checkBackend();
  }, []);

  return (
    <Router>
      <div className="min-h-screen relative bg-[#020617]">
        <div className="galactic-bg" />
        <Navbar systemStatus={systemStatus} />
        
        <main className="relative z-10">
          <AnimatedRoutes systemStatus={systemStatus} setSystemStatus={setSystemStatus} />
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