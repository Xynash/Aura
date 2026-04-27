import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, AlertCircle, Code, Send, 
  ShieldCheck, ArrowLeft, Loader2, Search, 
  CheckCircle2, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Incidents = () => {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isErrorActive, setIsErrorActive] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{type: 'bot' | 'user', text: string}[]>([]);

  // --- ASYNC LOGIC: FETCH FROM PYTHON BACKEND ---
  const runInvestigation = async () => {
    setIsErrorActive(true);
    setAnalysisStep(1); // Intercepting...

    try {
      // Step 2 visual trigger
      setTimeout(() => setAnalysisStep(2), 1500);

      // Call the FastAPI Backend
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pod_name: "payment-api-x2",
          file_name: "AuthService.java",
          line_number: 8,
          error_log: "java.lang.NullPointerException: Cannot invoke String.equals(Object) because token is null"
        })
      });

      if (!response.ok) throw new Error("Backend Offline");

      const data = await response.json();
      setAnalysisData(data);
      
      setAnalysisStep(3); // AI Reasoning Done
      setTimeout(() => setAnalysisStep(4), 1000); // QA Validation Done

      setChatMessages([{ 
        type: 'bot', 
        text: `System analysis complete for ${data.pod}. I have pinpointed the NullPointerException and verified the logic patch.` 
      }]);

    } catch (error) {
      console.error("Integration Error:", error);
      setIsErrorActive(false);
      alert("Please ensure Python backend (main.py) is running on port 8000!");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('activeIncident') === 'true') {
      runInvestigation();
    }
  }, []);

  // --- 1. THE "SCANNING" IDLE VIEW ---
  if (!isErrorActive) {
    return (
      <div className="pt-32 px-10 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-[600px] h-[600px] bg-[#bef35e]/5 rounded-full blur-3xl pointer-events-none"
         />
         <div className="relative z-10 text-center space-y-8 max-w-2xl">
            <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-2 border-dashed border-[#bef35e]/20 rounded-full animate-spin-slow" />
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
                <button onClick={runInvestigation} className="px-8 py-3 bg-[#bef35e] text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(190,243,94,0.3)] hover:scale-105 transition-all">
                   Force Manual Scan
                </button>
            </div>
         </div>
      </div>
    );
  }

  // --- 2. THE ACTIVE INVESTIGATION VIEW (DATA DRIVEN) ---
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-10 pb-20 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex justify-between items-end mb-12">
        <div>
          <Link to="/dashboard" className="text-[#bef35e] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4 hover:opacity-70 transition-all font-mono">
            <ArrowLeft size={14} /> Back_To_Console
          </Link>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">Investigation_Lab</h2>
          <div className="flex items-center gap-4 mt-4">
             <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">ID: AURA-9921-X</span>
             <div className="h-1 w-1 rounded-full bg-zinc-800" />
             <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                <AlertCircle size={12} /> {analysisStep < 4 ? 'Status: AI_Investigating' : 'Status: Fix_Ready'}
             </div>
          </div>
        </div>
        
        <div className="flex gap-3 mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
                <div className={`h-1.5 w-16 rounded-full transition-all duration-700 ${analysisStep >= s ? 'bg-[#bef35e] shadow-[0_0_10px_#bef35e]' : 'bg-white/5'}`} />
                <span className={`text-[8px] font-bold uppercase tracking-tighter ${analysisStep >= s ? 'text-[#bef35e]' : 'text-zinc-700'}`}>Step 0{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {analysisStep < 3 ? (
              <div className="aura-card-modern p-32 flex flex-col items-center justify-center text-center border-white/5 bg-white/[0.02]">
                <Loader2 className="text-[#bef35e] animate-spin mb-6" size={48} />
                <p className="font-mono text-xs uppercase tracking-[0.4em] text-zinc-500 animate-pulse">
                  {analysisStep === 1 ? 'Intercepting Kubernetes V1Event...' : 'Synthesizing Source-Aware Logic via AST...'}
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="aura-card-modern p-10 bg-gradient-to-br from-[#bef35e]/5 to-transparent border-white/5">
                <div className="flex items-center gap-2 text-[#bef35e] mb-10 font-black uppercase tracking-widest text-[10px]">
                  <Cpu size={16} className="animate-pulse" /> Automated_Post_Mortem
                </div>
                
                {/* --- REAL AI MARKDOWN CONTENT --- */}
                <div className="prose prose-invert max-w-none font-sans text-zinc-300 leading-relaxed overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
                  <ReactMarkdown>{analysisData?.root_cause_analysis}</ReactMarkdown>
                </div>
              </motion.div>
            )}

            {analysisStep >= 4 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="aura-card-modern p-0 overflow-hidden border-[#bef35e]/20">
                <div className="bg-zinc-900/50 px-8 py-5 border-b border-white/5 flex justify-between items-center font-mono">
                  <span className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-2">
                    <Code size={14} /> Source_Context: AuthService.java
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#bef35e]/10 text-[#bef35e] uppercase shadow-[0_0_15px_rgba(190,243,94,0.1)]">
                    QA_{analysisData?.qa_validation?.status}
                  </span>
                </div>
                
                {/* REAL EXTRACTED CODE FROM BACKEND */}
                <div className="p-10 font-mono text-xs leading-relaxed bg-black/40 text-[#bef35e]/80 overflow-x-auto">
                  <pre><code>{analysisData?.extracted_logic}</code></pre>
                </div>

                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                   <button className="flex-1 bg-[#bef35e] text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_10px_40px_rgba(190,243,94,0.2)] hover:brightness-110 transition-all">
                     Apply Hotfix & Sync to GitHub
                   </button>
                   <button onClick={() => setIsErrorActive(false)} className="px-8 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5">Reject</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-12 lg:col-span-4 aura-card-modern flex flex-col min-h-[750px] border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Terminal size={14} /> Neural_Assistant
            </h3>
            <span className="text-[8px] font-bold text-[#bef35e] animate-pulse">LIVE_SYNC</span>
          </div>

          <div className="flex-1 p-8 space-y-6 overflow-y-auto font-mono text-[11px]">
            {chatMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
                <div className="max-w-[95%] p-5 rounded-2xl bg-white/5 border border-white/5 text-zinc-300 leading-relaxed shadow-xl">
                  <div className="flex items-center gap-2 mb-3 opacity-40 uppercase text-[8px] font-black">
                    <Cpu size={10} /> Aura_Core
                  </div>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {analysisData && (
                <div className="p-5 rounded-2xl bg-[#bef35e]/5 border border-[#bef35e]/10 text-[#bef35e] text-[10px]">
                    [QA_VERDICT]: {analysisData.qa_validation.report}
                </div>
            )}
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5">
            <input 
                type="text" 
                placeholder={analysisStep < 4 ? "Aura is analyzing logic..." : "Ask a technical question..."}
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