import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';

const Navbar = () => (
  <nav className="fixed top-0 w-full z-[100] nav-standard">
    <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
      {/* --- LOGO --- */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 bg-[#bef35e] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(190,243,94,0.4)] transition-transform group-hover:rotate-12">
          <Activity size={20} className="text-black" />
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase text-white">Aura</span>
      </Link>

      {/* --- NAVIGATION LINKS --- */}
      <div className="hidden md:flex items-center gap-10">
        <NavLink 
          to="/" 
          className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}
        >
          Features
        </NavLink>
        
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}
        >
          Dashboard
        </NavLink>

        <NavLink 
          to="/clusters" 
          className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}
        >
          Clusters
        </NavLink>

        <NavLink 
          to="/incidents" 
          className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}
        >
          Incidents
        </NavLink>
      </div>

      {/* --- ACTION BUTTON --- */}
      <Link 
        to="/dashboard" 
        className="bg-[#bef35e] text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(190,243,94,0.2)]"
      >
        Launch Engine <Zap size={14} fill="currentColor" />
      </Link>
    </div>
  </nav>
);

export default Navbar;