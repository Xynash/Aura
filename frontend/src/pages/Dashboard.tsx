import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Cpu, Database, Zap, Code, Terminal, ShieldCheck, Activity, 
  Share2, ArrowUpRight, Search, Layout, FileSearch, Sparkles, 
  Loader2, AlertCircle, HardDrive, Network, Layers, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isIncidentActive, setIsIncidentActive] = useState(false);
  const [activeService, setActiveService] = useState('N/A');
  const [metrics, setMetrics] = useState({ cycles: 0, throughput: 0, latency: 0 });

  useEffect(() => {
    const savedIncident = sessionStorage.getItem('activeIncident') === 'true';
    const savedService = sessionStorage.getItem('targetService');
    setIsIncidentActive(savedIncident);
    if (savedService) setActiveService(savedService);

    const interval = setInterval(() => {
      setMetrics({
        cycles: savedIncident ? 1200 + Math.random() * 50 : 800 + Math.random() * 20,
        throughput: savedIncident ? 4.2 + Math.random() * 0.5 : 14.1 + Math.random() * 0.8,
        latency: savedIncident ? 0.82 + Math.random() * 0.05 : 0.11 + Math.random() * 0.02
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerSimulation = () => {
    const services = ["auth-gateway", "payment-api", "inventory-node"];
    const target = services[Math.floor(Math.random() * services.length)];
    sessionStorage.setItem('activeIncident', 'true');
    sessionStorage.setItem('targetService', target);
    window.location.reload(); 
  };

  return (
    <div className="pt-32 px-10 pb-20 max-w-[1700px] mx-auto relative min-h-screen">
      <div className="fixed inset-0 bg-digital-mesh opacity-10 pointer-events-none" />
      
      {/* 1. TOP METRICS HUB */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
        <MetricCard label="Reasoning Cycles" value={`${Math.floor(metrics.cycles)}/s`} icon={<Cpu />} />
        <MetricCard label="Kafka_Event_Lag" value="0.02ms" icon={<Layers />} />
        <MetricCard label="Cluster Latency" value={`< ${metrics.latency.toFixed(2)}s`} icon={<Zap />} color={isIncidentActive ? "text-red-500" : "text-[#bef35e]"} />
        <MetricCard label="QA Gatekeeper" value={isIncidentActive ? "Action Required" : "Hardened"} icon={<ShieldCheck />} color={isIncidentActive ? "text-orange-500" : "text-indigo-400"} />
      </div>

      <div className="grid grid-cols-12 gap-6 relative z-10">
        
        {/* 2. NEURAL CLUSTER VISUALIZER */}
        <div className="col-span-12 lg:col-span-8 aura-card-modern p-10 min-h-[550px] relative overflow-hidden group border-white/5 bg-black/40">
          <div className="absolute top-0 left-0 p-8 z-20">
             <h2 className="text-3xl font-black tracking-tighter glow-text uppercase italic">Neural_Cluster_Mesh</h2>
             <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ${isIncidentActive ? 'text-red-500 animate-pulse' : 'text-[#bef35e]/60'}`}>
               {isIncidentActive ? `Anomaly: ${activeService.toUpperCase()}` : 'Infrastructure: Optimized'}
             </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center scale-110">
            <svg className="absolute w-full h-full opacity-20">
               <motion.path d="M 200 200 Q 400 150 600 300" fill="none" stroke={isIncidentActive ? "#ef4444" : "#bef35e"} strokeWidth="1" className="neural-path" />
            </svg>
            <div className="relative w-full h-full">
              <FloatingNode icon={<Database />} color={isIncidentActive ? "bg-red-600 shadow-red-500/50" : "bg-blue-600 shadow-blue-500/50"} label="K8s" top="20%" left="20%" />
              <FloatingNode icon={<Cpu />} color="bg-purple-600 shadow-purple-500/50" label="Llama3" top="40%" left="45%" />
              <FloatingNode icon={<Code />} color="bg-[#bef35e] shadow-[#bef35e]/50" label="AST" top="55%" left="75%" />
              <FloatingNode icon={<Network />} color="bg-indigo-600 shadow-indigo-500/50" label="Kafka" top="70%" left="25%" />
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-20">
             {!isIncidentActive ? (
               <button onClick={triggerSimulation} className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl">
                  Initialize Failure Simulation
               </button>
             ) : (
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Active_Incident_Report</p>
                  <p className="text-sm font-mono text-white flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    {activeService} // LOG_EXCEPTION: NULL_PTR
                  </p>
               </div>
             )}
             <motion.div whileHover={{ rotate: 45 }} className={`p-4 rounded-2xl ${isIncidentActive ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-white/5 text-[#bef35e]'} shadow-xl`}>
                <ArrowUpRight size={20} />
             </motion.div>
          </div>
        </div>

        {/* 3. REASONING HUD (SIDEBAR) */}
        <div className="col-span-12 lg:col-span-4 aura-card-modern p-8 flex flex-col border-white/5 bg-black/60">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-10 flex items-center gap-2">
            <Terminal size={14} /> Reasoning_Engine_Feed
          </h3>
          <div className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              {!isIncidentActive ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center opacity-20">
                   <Loader2 className="animate-spin mb-4" size={30}/>
                   <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Scanning_Streams</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <LogStep active title="Interception" desc={`Aura captured failure in ${activeService}.`} />
                  <LogStep active title="Extraction" desc="Source logic mapped via AST engine." />
                  <LogStep active title="Inference" desc="Llama 3.3 synthesizing remediation." />
                  <LogStep title="QA_Validation" desc="Safety suite verification pending." />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isIncidentActive && (
            <button onClick={() => navigate('/incidents')} className="mt-10 bg-[#bef35e] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-[0_10px_40px_rgba(190,243,94,0.3)] hover:scale-[1.02] transition-transform">
              Investigate_Incident_Lab
            </button>
          )}
        </div>

        {/* 4. AURA ENGINE PROTOCOL (DOCUMENTATION HUD) */}
        <div className="col-span-12 lg:col-span-8 aura-card-modern p-10 border-white/5 bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
           <div className="flex items-center gap-3 mb-8">
              <BookOpen size={18} className="text-indigo-400" />
              <h3 className="text-xl font-bold uppercase tracking-tighter italic">Aura_Engine_Protocol</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DocStep num="01" title="Detect" desc="Fabric8 watches K8s API events." />
              <DocStep num="02" title="Extract" desc="Recursive AST source linking." />
              <DocStep num="03" title="Reason" desc="Llama 3 context-aware analysis." />
              <DocStep num="04" title="Heal" desc="Automated hotfix via Git Pipeline." />
           </div>
        </div>

        {/* 5. AUXILIARY TELEMETRY */}
        <div className="col-span-12 lg:col-span-4 aura-card-modern p-10 border-white/5">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 tracking-widest flex items-center gap-2">
                <FileSearch size={14} /> Engine_Diagnostics
            </h3>
            <div className="space-y-4 font-mono text-[10px]">
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-600 uppercase">AST Cache Hit</span>
                    <span className="text-[#bef35e] font-bold">94.2%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-600 uppercase">API Handshake</span>
                    <span className="text-[#bef35e] font-bold">Secure_TLS</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-600 uppercase">Worker Threads</span>
                    <span className="text-white font-bold">2,048 Active</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, color = "text-white" }: any) => (
  <div className="aura-card-modern p-6 flex items-center justify-between border-white/5 hover:border-[#bef35e]/20 transition-all">
    <div>
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
    <div className="p-3 bg-white/5 rounded-2xl text-zinc-400">{icon}</div>
  </div>
);

const FloatingNode = ({ icon, color, label, top, left }: any) => (
  <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute flex flex-col items-center gap-3" style={{ top, left }}>
    <div className={`p-5 ${color} rounded-2xl shadow-2xl flex items-center justify-center text-white relative transition-all duration-500`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
  </motion.div>
);

const LogStep = ({ title, desc, active }: any) => (
  <div className={`flex gap-5 items-start ${active ? 'opacity-100' : 'opacity-20'}`}>
    <div className={`w-1 h-12 rounded-full transition-all duration-1000 ${active ? 'bg-[#bef35e] shadow-[0_0_15px_#bef35e]' : 'bg-zinc-800'}`} />
    <div className="pt-1"><h5 className="text-[11px] font-black uppercase text-white">{title}</h5><p className="text-[10px] text-zinc-500 font-medium italic">{desc}</p></div>
  </div>
);

const DocStep = ({ num, title, desc }: any) => (
    <div className="space-y-2">
        <span className="text-[#bef35e] font-mono text-xs font-black">[{num}]</span>
        <h4 className="text-xs font-black text-white uppercase">{title}</h4>
        <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">{desc}</p>
    </div>
);

export default Dashboard;