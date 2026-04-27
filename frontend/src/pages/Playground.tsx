import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Zap, Code, Database, Bug, 
  ShieldCheck, Terminal, Search, 
  Bot, Binoculars, FlaskConical, 
  Activity, Ghost, MessageSquare, Power,
  Orbit, Rocket, Waypoints, Target,
  FileCode, Share2, AlertCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Playground = () => {
  const [isIntro, setIsIntro] = useState(true);
  const [chaosMode, setChaosMode] = useState<string | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [speech, setSpeech] = useState("");
  const [starCount] = useState([...Array(50)]);

  // Cinematic Intro Timing
  useEffect(() => {
    const timer = setTimeout(() => setIsIntro(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Chaos Simulation Logic
  const startChaos = async (type: string) => {
    setChaosMode(type);
    const script = [
      { char: 'watcher', text: "COMMAND! Sector 7 Node has vanished from the Mesh!", delay: 0 },
      { char: 'oracle', text: "Initializing Deep-Scan... Accessing Git-History repository.", delay: 2000 },
      { char: 'oracle', text: "Logic Anomaly localized. AuthService.java line 8: Missing parity check.", delay: 2000 },
      { char: 'shield', text: "Deploying QA-Interceptor... Validation: 100% SECURE.", delay: 2000 },
      { char: 'watcher', text: "Relink established. Production cluster is now STABLE. ✨", delay: 2000 },
    ];

    for (const line of script) {
      await new Promise(r => setTimeout(r, line.delay === 0 ? 0 : 2200));
      setActiveSpeaker(line.char);
      setSpeech(line.text);
    }
    
    setTimeout(() => {
      setChaosMode(null);
      setActiveSpeaker(null);
      setSpeech("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans">
      
      {/* --- 1. DYNAMIC STARFIELD BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="galactic-bg" />
        {starCount.map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: Math.random(), scale: Math.random() }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{ 
                width: '2px', height: '2px', 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isIntro ? (
          /* --- 2. CINEMATIC MOVIE INTRO --- */
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.5, filter: "blur(40px)" }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black"
          >
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "300px" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-[1px] bg-[#bef35e] mb-8 shadow-[0_0_20px_#bef35e]"
            />
            <motion.h1 
                initial={{ letterSpacing: "1.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.4em", opacity: 1 }}
                transition={{ duration: 2.5 }}
                className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter"
            >
                AURA_<span className="text-[#bef35e]">SUBSPACE</span>_LINK
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
                className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.8em] mt-8"
            >
                Establishing_Neural_Sync
            </motion.p>
          </motion.div>
        ) : (
          /* --- 3. MAIN INTERACTIVE PLAYGROUND --- */
          <motion.div 
            key="playground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="pt-32 px-10 pb-20 max-w-[1700px] mx-auto relative z-10"
          >
            {/* HEADER HUD */}
            <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
                <div>
                   <div className="flex items-center gap-3 text-[#bef35e] font-mono text-[10px] tracking-[0.6em] uppercase mb-4">
                      <Orbit size={14} className="animate-spin-slow" /> Experimental_Orchestration_Lab
                   </div>
                   <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase">
                      Intelligence_<span className="text-[#bef35e] glow-text">Playground</span>
                   </h2>
                </div>
                <div className="text-right font-mono text-[10px] text-zinc-500 space-y-2 uppercase tracking-widest">
                   <p>System_Latency: 0.002ms</p>
                   <p>AI_Model: Llama_3.3_70B</p>
                   <p className="text-[#bef35e]">Status: Optimized_Link</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* LEFT: CHAOS CONTROL PANEL */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <div className="aura-card-modern p-8 bg-black/60 border-white/10">
                        <h3 className="text-[10px] font-black text-[#bef35e] uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                           <Target size={14} /> Chaos_Infection_Vectors
                        </h3>
                        <div className="space-y-4">
                            <ChaosControl label="Trigger NullPointer" icon={<Zap />} onClick={() => startChaos('npe')} active={chaosMode === 'npe'} color="red" />
                            <ChaosControl label="Logic Corruption" icon={<FileCode />} onClick={() => startChaos('auth')} active={chaosMode === 'auth'} color="orange" />
                            <ChaosControl label="Memory Singularity" icon={<AlertCircle />} onClick={() => startChaos('oom')} active={chaosMode === 'oom'} color="indigo" />
                        </div>
                    </div>

                    <div className="aura-card-modern p-6 bg-black/80 font-mono text-[9px] text-zinc-600 border-white/5 h-48 flex flex-col">
                        <p className="mb-4 text-[#bef35e]/40 tracking-widest uppercase">Subspace_Live_Logs</p>
                        <div className="space-y-2 flex-1 overflow-hidden">
                            <p>{'>'} Initializing AIOps Handshake...</p>
                            <p>{'>'} Syncing with Llama 3.3 Node...</p>
                            <p>{'>'} Kafka event stream: [CONNECTED]</p>
                            {chaosMode && (
                                <motion.p 
                                    initial={{ x: -10, opacity: 0 }} 
                                    animate={{ x: 0, opacity: 1 }} 
                                    className="text-red-500 font-bold"
                                >
                                    {'>'} ALERT: {chaosMode.toUpperCase()}_FAULT_INJECTED
                                </motion.p>
                            )}
                        </div>
                    </div>
                </div>

                {/* CENTER: THE SPACE STATION CANVAS */}
                <div className="col-span-12 lg:col-span-9 aura-card-modern min-h-[650px] bg-black/40 border-white/5 relative flex items-center justify-around overflow-hidden group">
                    <div className="absolute inset-0 bg-digital-mesh opacity-5 pointer-events-none" />
                    
                    {/* Floating Tech Satellites */}
                    <TechSatellite icon={<Database />} top="15%" left="10%" delay={0} />
                    <TechSatellite icon={<Code />} top="75%" left="15%" delay={1} />
                    <TechSatellite icon={<Share2 />} top="20%" right="15%" delay={2} />
                    <TechSatellite icon={<Waypoints />} bottom="20%" right="20%" delay={3} />

                    {/* MAIN STATIONS (CHARACTERS) */}
                    <CharacterStation 
                        id="watcher"
                        label="Watcher_Station"
                        sub="DevOps_Vision"
                        icon={<Binoculars size={32}/>}
                        active={activeSpeaker === 'watcher'}
                        speech={speech}
                        color="bg-blue-600"
                        isError={chaosMode !== null && activeSpeaker === 'watcher'}
                    />

                    <CharacterStation 
                        id="oracle"
                        label="Oracle_Core"
                        sub="AI_Intelligence"
                        icon={<Cpu size={32}/>}
                        active={activeSpeaker === 'oracle'}
                        speech={speech}
                        color="bg-purple-600"
                    />

                    <CharacterStation 
                        id="shield"
                        label="Shield_Elite"
                        sub="QA_Security"
                        icon={<ShieldCheck size={32}/>}
                        active={activeSpeaker === 'shield'}
                        speech={speech}
                        color="bg-[#bef35e]"
                    />

                    {/* Neural Connection Paths */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                        <motion.path 
                            d="M 300 325 L 500 325 L 700 325" 
                            stroke="white" strokeWidth="2" strokeDasharray="10,10" fill="none"
                            animate={{ strokeDashoffset: [0, -40] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                        <motion.path 
                            d="M 700 325 L 900 325 L 1100 325" 
                            stroke="white" strokeWidth="2" strokeDasharray="10,10" fill="none"
                            animate={{ strokeDashoffset: [0, -40] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    </svg>

                    <div className="absolute bottom-8 right-10 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#bef35e] shadow-[0_0_10px_#bef35e]" />
                           <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Neural_Sync_Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                           <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Sector_Safe</span>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- REUSABLE SPACE COMPONENTS --- */

const CharacterStation = ({ label, sub, icon, active, speech, color, isError }: any) => (
  <div className="flex flex-col items-center gap-10 relative z-20">
    <AnimatePresence>
      {active && (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.8 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-32 w-56 bg-white p-5 rounded-[2rem] rounded-bl-none shadow-[0_20px_60px_rgba(255,255,255,0.2)]"
        >
            <p className="text-black font-black text-[10px] leading-tight uppercase tracking-tight italic">"{speech}"</p>
            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>

    <motion.div 
      animate={active ? { 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{ repeat: Infinity, duration: 4 }}
      className={`w-36 h-36 rounded-[3rem] border-2 flex items-center justify-center relative transition-all duration-700 ${
        active ? `border-white shadow-[0_0_60px_rgba(255,255,255,0.3)] ${color}` : 
        isError ? 'border-red-500 bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 
        'border-white/10 bg-white/5 grayscale opacity-40'
      }`}
    >
      <div className={active ? 'text-white' : isError ? 'text-red-500' : 'text-zinc-600'}>{icon}</div>
      {active && (
          <motion.div 
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 border border-white rounded-[3rem]"
          />
      )}
    </motion.div>

    <div className="text-center">
       <p className={`text-[12px] font-black uppercase tracking-[0.3em] ${active ? 'text-white' : 'text-zinc-700'}`}>{label}</p>
       <p className="text-[9px] font-mono text-zinc-800 mt-2 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

const TechSatellite = ({ icon, top, left, right, bottom, delay }: any) => (
    <motion.div 
        animate={{ y: [0, -30, 0], rotate: 360, opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay }}
        className="absolute text-zinc-700"
        style={{ top, left, right, bottom }}
    >
        {icon}
    </motion.div>
);

const ChaosControl = ({ label, icon, onClick, active, color }: any) => {
  const activeStyles: any = {
    red: 'border-red-500/50 bg-red-500/10 text-red-500',
    orange: 'border-orange-500/50 bg-orange-500/10 text-orange-500',
    indigo: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-500'
  };

  return (
    <button 
        onClick={onClick}
        className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 group bg-white/5 ${
            active ? 'border-[#bef35e] bg-[#bef35e]/10' : 'border-white/5 hover:border-white/20'
        }`}
    >
        <div className={`p-3 rounded-2xl bg-black/40 ${active ? 'text-[#bef35e]' : 'text-zinc-500 group-hover:text-white transition-colors'}`}>
            {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white">
            {label}
        </span>
    </button>
  );
};

export default Playground;