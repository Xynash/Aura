import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';

const Navbar = ({ systemStatus }: { systemStatus: string }) => {
  const isActive = systemStatus === 'active';

  return (
    <nav className={`fixed top-0 w-full z-[100] nav-standard transition-all duration-500 ${!isActive ? 'bg-black/20' : 'bg-black/40'}`}>
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-[#bef35e] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(190,243,94,0.4)] transition-transform group-hover:rotate-12">
            <Activity size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-white font-sans">Aura</span>
        </Link>

        <div className={`hidden md:flex items-center gap-10 transition-opacity duration-500 ${!isActive ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <NavLink to="/" className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}>Features</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}>Dashboard</NavLink>
          <NavLink to="/playground" className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}>Playground</NavLink>
          <NavLink to="/incidents" className={({isActive}) => `text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#bef35e]' : 'text-zinc-500 hover:text-white'}`}>Lab</NavLink>
        </div>

        <div className="flex items-center gap-4">
            {!isActive && (
                 <div className="hidden lg:flex items-center gap-2 px-4 py-2 border border-white/5 rounded-full bg-white/5">
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">System_Locked</span>
                 </div>
            )}
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