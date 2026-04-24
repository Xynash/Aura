import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Component & Pages
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Clusters from './pages/Clusters'; // <--- 1. Import the new Clusters page

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/clusters" element={<Clusters />} /> {/* <--- 2. Add the route here */}
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Make sure .nebula-glow is defined in your index.css */}
        <div className="nebula-glow" />
        
        <Navbar />
        
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;