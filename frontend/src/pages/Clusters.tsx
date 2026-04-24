import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, ShieldCheck, Box, Zap, 
  Activity, Share2, Globe, Server, 
  Cpu, HardDrive, Network 
} from 'lucide-react';

const Clusters = () => {
  // --- SYNC WITH DASHBOARD STATE ---
  const [isSystemCrashing, setIsSystemCrashing] = useState(false);
  const [loadMetrics, setLoadMetrics] = useState({ cpu: 42, mem: 68, net: 12 });

  useEffect(() => {
    // 1. Check if the Dashboard triggered an incident
    const activeIncident = sessionStorage.getItem('activeIncident') === 'true';
    setIsSystemCrashing(activeIncident);

    // 2. Simulate live resource fluctuations (Synced feel)
    const interval = setInterval(() => {
      setLoadMetrics(prev => ({
        cpu: activeIncident ? Math.floor(70 + Math.random() * 10) : Math.floor(40 + Math.random() * 5),
        mem: activeIncident ? Math.floor(85 + Math.random() * 5) : Math.floor(65 + Math.random() * 3),
        net: activeIncident ? Math.floor(5 + Math.random() * 3) : Math.floor(12 + Math.random() * 4),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="pt-32 px-10 pb-20 max-w-[1600px] mx-auto min-h-screen relative"
    >
      <div className="fixed inset-0 bg-digital-mesh opacity-10 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 text-[#bef35e] mb-4 font-mono text-[10px] tracking-[0.4em] uppercase">
            <Server size={14} /> Infrastructure_Live_Map
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">
            Cluster_Topology
          </h2>
          <div className="flex items-center gap-4 mt-4">
             <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isSystemCrashing ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-[#bef35e] text-[#bef35e] bg-[#bef35e]/5'}`}>
                Status: {isSystemCrashing ? 'Degraded_Performance' : 'Systems_Nominal'}
             </div>
             <span className="text-zinc-600 font-mono text-[10px]">REGION: us-east-1 // AWS_EKS</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-4">
            <button className="aura-card-modern px-6 py-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">
                Export_Manifest
            </button>
            <div className="aura-card-modern px-6 py-2 text-[10px] font-black uppercase text-[#bef35e] border-[#bef35e]/20">
                Live_Sync: Active
            </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 relative z-10">
        
        {/* --- LEFT: DYNAMIC TOPOLOGY MESH --- */}
        <div className="col-span-12 lg:col-span-9 aura-card-modern min-h-[650px] relative overflow-hidden bg-black/40 flex items-center justify-center border-white/5">
           
           {/* SVG Traffic Lines */}
           <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isSystemCrashing ? "#ef4444" : "#bef35e"} stopOpacity="0" />
                  <stop offset="50%" stopColor={isSystemCrashing ? "#ef4444" : "#bef35e"} stopOpacity="1" />
                  <stop offset="100%" stopColor={isSystemCrashing ? "#ef4444" : "#bef35e"} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Lines connecting to center */}
              <TrafficLine x1="50%" y1="50%" x2="25%" y2="30%" isDown={false} />
              <TrafficLine x1="50%" y1="50%" x2="75%" y2="30%" isDown={false} />
              <TrafficLine x1="50%" y1="50%" x2="50%" y2="75%" isDown={isSystemCrashing} />
           </svg>

           {/* Central Controller (Ingress) */}
           <PodNode icon={<Share2 size={24}/>} label="Ingress-Nginx" color="border-zinc-800" sub="Edge_Gateway" />

           {/* Top Left: DB Node */}
           <div className="absolute top-[22%] left-[20%]">
             <PodNode icon={<Database size={20}/>} label="Redis-Cache" color="border-zinc-800" sub="Healthy" />
           </div>

           {/* Top Right: Auth Service */}
           <div className="absolute top-[22%] right-[20%]">
             <PodNode icon={<Box size={20}/>} label="Auth-Service" color="border-zinc-800" sub="Healthy" verified />
           </div>

           {/* Bottom Center: The failing node (If crash triggered) */}
           <div className="absolute bottom-[18%] left-[44%]">
             <PodNode 
                icon={<Zap size={20}/>} 
                label="Payment-API" 
                color={isSystemCrashing ? "border-red-500 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : "border-zinc-800"} 
                sub={isSystemCrashing ? "Critical_Failure" : "Healthy"} 
                pulse={isSystemCrashing} 
             />
           </div>

           {/* Topology Legend */}
           <div className="absolute bottom-8 left-10 flex items-center gap-8 bg-black/60 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-xl">
                <LegendItem color="bg-[#bef35e]" label="QA_Verified" />
                <LegendItem color="bg-red-500" label="Active_Anomaly" />
                <LegendItem color="bg-zinc-700" label="Cluster_Pod" />
           </div>
        </div>

        {/* --- RIGHT: LIVE RESOURCE ALLOCATION --- */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
            
            <div className="aura-card-modern p-8 border-white/5">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-8 tracking-[0.3em] flex items-center gap-2">
                    <Activity size={14} /> Resource_Telemetry
                </h3>
                <div className="space-y-8">
                    <LiveStat label="CPU Reservoir" value={loadMetrics.cpu} color={isSystemCrashing ? "bg-red-500" : "bg-[#bef35e]"} />
                    <LiveStat label="Memory Pressure" value={loadMetrics.mem} color={isSystemCrashing ? "bg-orange-500" : "bg-[#bef35e]"} />
                    <LiveStat label="IO Throughput" value={loadMetrics.net} color="bg-indigo-500" />
                </div>
            </div>

            <div className={`aura-card-modern p-8 border-white/5 transition-all duration-700 ${isSystemCrashing ? 'bg-red-500/5 border-red-500/20' : 'bg-gradient-to-br from-indigo-500/5 to-transparent'}`}>
                <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-8 tracking-[0.3em] flex items-center gap-2">
                    <ShieldCheck size={14} /> Compliance_Engine
                </h3>
                <div className="space-y-4 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-zinc-600 uppercase italic">Test_Suite</span>
                        <span className={isSystemCrashing ? "text-red-500" : "text-[#bef35e]"}>
                          {isSystemCrashing ? "[ 1 FAILING ]" : "[ 142 PASSED ]"}
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-zinc-600 uppercase italic">Code_Integrity</span>
                        <span className="text-white">{isSystemCrashing ? "82.4%" : "100.0%"}</span>
                    </div>
                    <div className="pt-4">
                       <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-tighter">
                          {isSystemCrashing 
                            ? "Awaiting automated hotfix via AI investigation lab..." 
                            : "No security vulnerabilities or regressions detected."}
                       </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </motion.div>
  );
};

/* --- SUB-COMPONENTS --- */

const PodNode = ({ icon, label, color, sub, verified, pulse }: any) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }}
    className={`p-8 bg-black/60 backdrop-blur-2xl border-2 ${color} rounded-[2.5rem] flex flex-col items-center gap-4 relative cursor-crosshair transition-all duration-500`}
  >
    {pulse && (
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-500 rounded-[2.5rem] blur-xl"
        />
    )}
    <div className={`p-4 rounded-2xl bg-white/5 ${pulse ? 'text-red-500 animate-pulse' : 'text-white'}`}>
      {icon}
    </div>
    <div className="text-center relative z-10">
      <p className="text-sm font-black text-white uppercase tracking-tight">{label}</p>
      <p className={`text-[8px] font-bold uppercase mt-1 tracking-widest ${pulse ? 'text-red-500' : 'text-zinc-600'}`}>
        {sub}
      </p>
    </div>
    {verified && (
        <div className="absolute -top-2 -right-2 bg-[#bef35e] p-2 rounded-full shadow-[0_0_15px_#bef35e]">
            <ShieldCheck size={12} className="text-black" />
        </div>
    )}
  </motion.div>
);

const TrafficLine = ({ x1, y1, x2, y2, isDown }: any) => (
    <motion.line 
        x1={x1} y1={y1} x2={x2} y2={y2} 
        stroke={isDown ? "#ef4444" : "#bef35e"} 
        strokeWidth="1" 
        strokeDasharray="4,4" 
        animate={{ strokeDashoffset: [0, -20] }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
        opacity={isDown ? "0.6" : "0.1"} 
    />
);

const LiveStat = ({ label, value, color }: any) => (
    <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-zinc-600 italic">{label}</span>
            <span className="text-white">{value}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                animate={{ width: `${value}%` }} 
                className={`h-full ${color} shadow-[0_0_10px_currentColor]`} 
            />
        </div>
    </div>
);

const LegendItem = ({ color, label }: any) => (
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{label}</span>
    </div>
);

export default Clusters;