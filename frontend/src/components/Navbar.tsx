import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
type WatcherStatus = 'connecting' | 'armed' | 'simulation' | 'offline';

// ── Watcher dot config ────────────────────────────────────────────────────────
const WATCHER_CONFIG: Record<WatcherStatus, { color: string; pulse: boolean; label: string }> = {
  connecting: { color: 'bg-yellow-500',   pulse: true,  label: 'Connecting...'    },
  armed:      { color: 'bg-[#bef35e]',    pulse: true,  label: 'Watcher_Armed'    },
  simulation: { color: 'bg-indigo-400',   pulse: false, label: 'Simulation_Mode'  },
  offline:    { color: 'bg-red-500',      pulse: false, label: 'Watcher_Offline'  },
};

interface NavbarProps {
  systemStatus:     string;
  watcherStatus:    WatcherStatus;
  incidentCount:    number;
  onIncidentsVisit: () => void;
}

const Navbar = ({
  systemStatus,
  watcherStatus,
  incidentCount,
  onIncidentsVisit,
}: NavbarProps) => {
  const isActive = systemStatus === 'active';
  const navigate = useNavigate();
  const watcher  = WATCHER_CONFIG[watcherStatus];

  const handleLabClick = () => {
    onIncidentsVisit();
    navigate('/incidents');
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] nav-standard transition-all duration-500 ${!isActive ? 'bg-black/20' : 'bg-black/40'}`}>
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-[#bef35e] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(190,243,94,0.4)] transition-transform group-hover:rotate-12">
            <Activity size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-white font-sans">Aura</span>
        </Link>

        {/* ── Nav links ── */}
        <div className={`hidden md:flex items-center gap-10 transition-opacity duration-500 ${!isActive ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`
            }
          >
            Features
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/playground"
            className={({ isActive }) =>
              `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`
            }
          >
            Playground
          </NavLink>

          {/* ── LAB link with incident badge ── */}
          <button
            onClick={handleLabClick}
            className="relative text-xs font-bold uppercase tracking-widest transition-all text-zinc-500 hover:text-white flex items-center gap-2"
          >
            Lab

            {/* Red badge — only shows when incidents > 0 */}
            <AnimatePresence>
              {incidentCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{  scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-4 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                >
                  <span className="text-[8px] font-black text-white leading-none">
                    {incidentCount > 9 ? '9+' : incidentCount}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

        </div>

        {/* ── Right side: watcher dot + launch button ── */}
        <div className="flex items-center gap-4">

          {/* Watcher status dot — always visible when system active */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 border border-white/5 rounded-full bg-white/5"
            >
              {/* Dot */}
              <div className="relative flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${watcher.color}`} />
                {watcher.pulse && (
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`absolute w-1.5 h-1.5 rounded-full ${watcher.color}`}
                  />
                )}
              </div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">
                {watcher.label}
              </span>
            </motion.div>
          )}

          {/* System locked pill — shows when not active */}
          {!isActive && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 border border-white/5 rounded-full bg-white/5">
              <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">
                System_Locked
              </span>
            </div>
          )}

          {/* Launch button */}
          <Link
            to="/dashboard"
            className={`bg-[#bef35e] text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isActive ? 'Launch Console' : 'Locked'} <Zap size={14} fill="currentColor" />
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
