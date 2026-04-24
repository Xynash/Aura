import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, AlertCircle, Code, Send, 
  ShieldCheck, ArrowLeft, Loader2, Search, 
  Radar, Zap, Activity 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Incidents = () => {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isErrorActive, setIsErrorActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<{type: 'bot' | 'user', text: string}[]>([]);

  // Function to start the 6-second AI sequence
  const runInvestigation = () => {
    setIsErrorActive(true);
    const sequence = [
      { step: 1, delay: 1000 }, // Intercepting
      { step: 2, delay: 2500 }, // AST Extraction
      { step: 3, delay: 4500 }, // AI Reasoning
      { step: 4, delay: 6000 }, // Validation Complete
    ];

    sequence.forEach(({ step, delay }) => {
      setTimeout(() => setAnalysisStep(step), delay);
    });

    setTimeout(() => {
      setChatMessages([{ 
        type: 'bot', 
        text: "System analysis complete. I have identified a NullPointerException in the payment handshake. I have generated a verified hotfix. Would you like me to explain the logic?" 
      }]);
    }, 7000);
  };

  useEffect(() => {
    // Check if triggered from dashboard
    const active = sessionStorage.getItem('activeIncident');
    if (active === 'true') {
      runInvestigation();
    }
  }, []);

  // --- 1. THE "SCANNING" IDLE VIEW ---
  if (!isErrorActive) {
    return (
      <div className="pt-32 px-10 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
         {/* Background Pulse for Radar */}
         <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-[600px] h-[600px] bg-[#bef35e]/5 rounded-full blur-3xl pointer-events-none"
         />

         <div className="relative z-10 text-center space-y-8 max-w-2xl">
            <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-2 border-dashed border-[#bef35e]/20 rounded-full animate-spin-slow" />
                <div className="absolute inset-4 border border-[#bef35e]/10 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="text-[#bef35e] animate-pulse" size={40} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">Scanning_Cluster_State</h2>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.4em] leading-relaxed">
                   Aura is monitoring the Kafka event backbone. <br />
                   No anomalies detected in production-us-east-1.
                </p>
            </div>

            <div className="flex gap-4 justify-center pt-8">
                <Link to="/dashboard" className="px-8 py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                   Back to Console
                </Link>
                <button 
                  onClick={runInvestigation}
                  className="px-8 py-3 bg-[#bef35e] text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(190,243,94,0.3)] hover:scale-105 transition-all"
                >
                   Force Manual Scan
                </button>
            </div>
         </div>

         {/* Technical Labels */}
         <div className="absolute bottom-20 left-10 font-mono text-[8px] text-zinc-700 space-y-2 uppercase tracking-widest">
            <p>Node_Count: 24</p>
            <p>Protocol: gRPC/Secure</p>
            <p>AI_Core: Llama-3-70B-Ready</p>
         </div>
      </div>
    );
  }

  // --- 2. THE ACTIVE INVESTIGATION VIEW ---
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="pt-32 px-10 pb-20 max-w-[1600px] mx-auto min-h-screen relative"
    >
      {/* HEADER: Context & Status */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <Link to="/dashboard" className="text-[#bef35e] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4 hover:opacity-70 transition-all font-mono">
            <ArrowLeft size={14} /> Back_To_Console
          </Link>
          <h2 className="text-6xl font-black tracking-tighter text-white">
            Incident: <span className="text-[#bef35e]">PAYMENT_API_CRASH</span>
          </h2>
          <div className="flex items-center gap-4 mt-4">
             <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">ID: AURA-9921-X</span>
             <div className="h-1 w-1 rounded-full bg-zinc-800" />
             <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                <AlertCircle size={12} /> {analysisStep < 4 ? 'Status: AI_Investigating' : 'Status: Fix_Ready'}
             </div>
          </div>
        </div>
        
        {/* Real-time Step Progress Bars */}
        <div className="flex gap-3 mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
                <div className={`h-1 w-16 rounded-full transition-all duration-700 ${analysisStep >= s ? 'bg-[#bef35e] shadow-[0_0_10px_#bef35e]' : 'bg-white/5'}`} />
                <span className={`text-[8px] font-bold uppercase tracking-tighter ${analysisStep >= s ? 'text-[#bef35e]' : 'text-zinc-700'}`}>Step 0{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: THE ANALYSIS LAB */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {analysisStep >= 3 ? (
              <motion.div 
                key="report"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                className="aura-card-modern p-10 bg-gradient-to-br from-[#bef35e]/5 to-transparent border-white/5"
              >
                <div className="flex items-center gap-2 text-[#bef35e] mb-6 font-black uppercase tracking-widest text-[10px]">
                  <Cpu size={16} className="animate-spin-slow" /> Automated_Post_Mortem
                </div>
                <p className="text-2xl font-bold leading-tight mb-8">
                  "Critical Failure: <span className="text-red-500 underline decoration-red-500/30">NullPointerException</span> detected during JWT handshake. Aura traced this to an unhandled header read in the AuthService logic."
                </p>
                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5 font-mono">
                  <div>
                    <span className="text-zinc-600 block text-[10px] font-black uppercase mb-3 tracking-widest">Technical Root Cause</span>
                    <p className="text-zinc-300 text-xs italic leading-relaxed">
                      Method <code>validateToken()</code> attempts to access <code>getHeader("X-Auth")</code> without a null-safety check, causing a panic when requests arrive without the header.
                    </p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                        <span className="text-zinc-600 block text-[10px] font-black uppercase mb-1 tracking-widest">AI Confidence</span>
                        <p className="text-[#bef35e] font-black text-4xl italic">98.4%</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#bef35e] text-[10px] font-bold">
                        <ShieldCheck size={14} /> QA_REGRESSION_PASSED
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="aura-card-modern p-32 flex flex-col items-center justify-center text-center">
                <Loader2 className="text-[#bef35e] animate-spin mb-6" size={48} />
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-zinc-500 animate-pulse">
                  {analysisStep === 1 ? 'Intercepting Kubernetes V1Event...' : 'Performing Source-Aware AST Extraction...'}
                </p>
              </div>
            )}

            {analysisStep >= 4 && (
              <motion.div 
                key="code"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                className="aura-card-modern p-0 overflow-hidden border-white/5"
              >
                <div className="bg-zinc-900/50 px-8 py-5 border-b border-white/5 flex justify-between items-center font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-2">
                        <Code size={14} /> Logic_Patch: AuthService.java
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Commit: #882AF1</span>
                </div>
                <div className="p-10 font-mono text-xs leading-relaxed bg-black/40">
                  <pre className="text-zinc-600">
                    <code>
                      122 | String token = getHeader("X-Auth"); <br />
                      123 | <br />
                      <span className="text-red-400 bg-red-500/10 block w-full py-0.5">- 124 | if (token.equals(storedToken)) {'{'}</span>
                      <span className="text-[#bef35e] bg-[#bef35e]/10 block w-full py-0.5">+ 124 | if (token != null && token.equals(storedToken)) {'{'}</span>
                      125 | &nbsp;&nbsp; return true; <br />
                      126 | {'}'}
                    </code>
                  </pre>
                </div>
                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                   <button className="flex-1 bg-[#bef35e] text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_10px_40px_rgba(190,243,94,0.2)] hover:scale-[1.02] transition-all">
                     Apply Hotfix to Production
                   </button>
                   <button onClick={() => setIsErrorActive(false)} className="px-8 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-zinc-400">
                     Reject
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: CHAT ASSISTANT */}
        <div className="col-span-12 lg:col-span-4 aura-card-modern flex flex-col min-h-[750px] border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Terminal size={14} /> Neural_Assistant
            </h3>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#bef35e] rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-zinc-600 uppercase">Active</span>
            </div>
          </div>

          <div className="flex-1 p-8 space-y-8 overflow-y-auto font-mono text-[11px]">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                <Loader2 className="animate-spin mb-4" />
                <p className="italic uppercase tracking-widest text-[9px]">Awaiting Core Analysis...</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-2xl ${msg.type === 'bot' ? 'bg-white/5 border border-white/5 text-zinc-300' : 'bg-[#bef35e] text-black font-bold'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5">
            <input 
                type="text" 
                placeholder={analysisStep < 4 ? "Neural core initializing..." : "Query the logic model..."}
                disabled={analysisStep < 4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs focus:outline-none focus:border-[#bef35e] transition-all"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Incidents;