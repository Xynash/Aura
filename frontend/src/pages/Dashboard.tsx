import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Cpu, Database, Zap, Code, 
  Terminal, ShieldCheck, Activity, 
  Share2, ArrowUpRight, Search, Layout,
  FileSearch, Sparkles, Loader2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  // --- SYSTEM STATES ---
  const [hasCrash, setHasCrash] = useState(false); // Controls the "Simulated Event"
  const [reportStatus, setReportStatus] = useState('initializing');

  // --- DYNAMIC DATA ---
  const [metrics, setMetrics] = useState({ cycles: 840, throughput: 12.1, latency: 0.12 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasCrash) {
        // Healthy Metrics
        setMetrics({ cycles: 800 + Math.random()*50, throughput: 12 + Math.random(), latency: 0.10 + Math.random()*0.05 });
      } else {
        // Crash Metrics (Spiking)
        setMetrics({ cycles: 1200 + Math.random()*100, throughput: 4.2 + Math.random(), latency: 0.82 + Math.random()*0.1 });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [hasCrash]);

  const triggerCrash = () => {
    setHasCrash(true);
    setReportStatus('analyzing');
    // Save to session so the Incident page knows a crash happened
    sessionStorage.setItem('activeIncident', 'true');
  };

  return (
    <div className="pt-32 px-10 pb-20 max-w-[1600px] mx-auto relative min-h-screen">
      <div className="fixed inset-0 bg-digital-mesh pointer-events-none" />
      
      {/* 1. TOP ROW: LIVE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
        <MetricCard label="Reasoning Cycles" value={`${Math.floor(metrics.cycles)}/s`} icon={<Cpu />} />
        <MetricCard label="Node Throughput" value={`${metrics.throughput.toFixed(1)} GB/s`} icon={<Share2 />} />
        <MetricCard label="Current Latency" value={`< ${metrics.latency.toFixed(2)}s`} icon={<Zap />} color={hasCrash ? "text-red-500" : "text-[#bef35e]"} />
        <MetricCard label="QA Gatekeeper" value={hasCrash ? "Action Required" : "Secured"} icon={<ShieldCheck />} color={hasCrash ? "text-orange-500" : "text-indigo-400"} />
      </div>

      <div className="grid grid-cols-12 gap-8 relative z-10">
        
        {/* 2. THE NEURAL CLUSTER FORGE */}
        <div className="col-span-12 lg:col-span-8 aura-card-modern p-10 min-h-[500px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 p-8">
             <h2 className="text-3xl font-black tracking-tighter glow-text">Neural_Cluster_Mesh</h2>
             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 italic">
               {hasCrash ? "Critical Anomaly Detected" : "Cluster Status: Nominal"}
             </p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="absolute w-full h-full opacity-30">
               <motion.path d="M 200 200 Q 400 150 600 300" fill="none" stroke={hasCrash ? "#ef4444" : "#bef35e"} strokeWidth="0.5" className="neural-path" />
            </svg>
            <div className="relative w-full h-full">
              <FloatingNode icon={<Database />} color={hasCrash ? "bg-red-600" : "bg-blue-600"} label="K8s" top="25%" left="20%" />
              <FloatingNode icon={<Cpu />} color="bg-purple-600" label="Llama3" top="45%" left="45%" />
              <FloatingNode icon={<Code />} color="bg-[#bef35e]" label="Java" top="55%" left="75%" />
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
             {!hasCrash ? (
               <button onClick={triggerCrash} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500 transition-all">
                  Simulate Production Failure
               </button>
             ) : (
               <div className="space-y-1 animate-pulse">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Critical_Payload_Detected</p>
                  <p className="text-sm font-mono text-white">PAYMENT_API // EXCEPTION: NULL_POINTER</p>
               </div>
             )}
             <motion.button whileHover={{ rotate: 45 }} className={`p-4 rounded-2xl transition-all shadow-xl ${hasCrash ? "bg-red-500 text-white" : "bg-white/5 text-[#bef35e]"}`}>
                <ArrowUpRight />
             </motion.button>
          </div>
        </div>

        {/* 3. REASONING LOG */}
        <div className="col-span-12 lg:col-span-4 aura-card-modern p-8 flex flex-col border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-10 flex items-center gap-2">
            <Terminal size={14} /> Reasoning_Stream
          </h3>
          <div className="flex-1 space-y-8">
            {!hasCrash ? (
              <div className="h-full flex items-center justify-center text-zinc-700 font-mono text-[10px] uppercase tracking-widest italic text-center">
                Waiting for infrastructure <br/> events...
              </div>
            ) : (
              <>
                <LogStep active title="Interception" desc="Aura caught Cluster Event: CrashLoopBackOff." />
                <LogStep active title="Extraction" desc="Source link established via JGit/AST." />
                <LogStep active title="Inference" desc="Llama 3 generating logic-based diff." />
                <LogStep title="Verification" desc="Awaiting QA Automated regression." />
              </>
            )}
          </div>
          {hasCrash && (
            <button onClick={() => navigate('/incidents')} className="mt-10 bg-[#bef35e] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-center shadow-[0_10px_40px_rgba(190,243,94,0.3)] hover:scale-[1.02] transition-transform">
              INVESTIGATE_EVENT
            </button>
          )}
        </div>

        {/* 4. AI REPORT */}
        <div className="col-span-12 aura-card-modern p-10 border-white/5">
            {!hasCrash ? (
                <div className="text-center py-10">
                   <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.5em]">System Intelligence Idle // No Anomalies to report</p>
                </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   <div className="space-y-3">
                        <h4 className="text-[#bef35e] text-[10px] font-black uppercase tracking-widest">Inference Summary</h4>
                        <p className="text-sm text-zinc-300 italic">"The reasoning engine detected a logic failure in the Payment-API-X2 handshake. Patch ready."</p>
                   </div>
                   <div className="space-y-3 border-x border-white/5 px-10">
                        <h4 className="text-red-500 text-[10px] font-black uppercase tracking-widest">Incident Impact</h4>
                        <p className="text-sm text-zinc-300 italic">"Latency increased by 450%. Thread saturation detected in namespace us-east-1."</p>
                   </div>
                   <div className="space-y-3">
                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">QA Status</h4>
                        <p className="text-sm text-zinc-300 italic">"Integrity preserved. Automatic rollback enabled if remediation fails."</p>
                   </div>
               </div>
            )}
        </div>

        {/* 5. BOTTOM BENTO */}
        <div className="col-span-12 lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
           <BentoSmall icon={<Layout size={24}/>} title="Cluster Topology" desc="14 Microservices Active" />
           <BentoSmall icon={<Search size={24}/>} title="Global Search" desc="Logs, Commits, ASTs" />
           <BentoSmall 
            icon={<Activity size={24}/>} 
            title="Anomaly Pulse" 
            desc={hasCrash ? "1 Active Critical Error" : "0 Active Anomalies"} 
            color={hasCrash ? "text-red-500" : "text-[#bef35e]"} 
           />
        </div>
      </div>
    </div>
  );
};

/* --- SHARED COMPONENTS --- */
const MetricCard = ({ label, value, icon, color = "text-white" }: any) => (
    <div className="aura-card-modern p-6 flex items-center justify-between border-white/5">
      <div>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-2xl text-[#bef35e]">{icon}</div>
    </div>
);

const FloatingNode = ({ icon, color, label, top, left }: any) => (
    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute flex flex-col items-center gap-3" style={{ top, left }}>
      <div className={`p-5 ${color} rounded-2xl shadow-2xl flex items-center justify-center text-white relative`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</span>
    </motion.div>
);

const LogStep = ({ title, desc, active }: any) => (
    <div className={`flex gap-5 items-start ${active ? 'opacity-100' : 'opacity-20'}`}>
      <div className={`w-1 h-12 rounded-full transition-all duration-1000 ${active ? 'bg-[#bef35e] shadow-[0_0_15px_#bef35e]' : 'bg-zinc-800'}`} />
      <div>
        <h5 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h5>
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1 italic">{desc}</p>
      </div>
    </div>
);

const BentoSmall = ({ icon, title, desc, color = "text-[#bef35e]" }: any) => (
    <div className="aura-card-modern p-10 flex flex-col items-center justify-center text-center border-white/5">
      <div className={`${color} mb-5`}>{icon}</div>
      <h4 className="text-lg font-bold text-white uppercase tracking-tighter">{title}</h4>
      <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">{desc}</p>
    </div>
);

export default Dashboard;