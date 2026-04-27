import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, AlertCircle, Code, Send, 
  ShieldCheck, ArrowLeft, Loader2, Search, 
  CheckCircle2, Zap, Fingerprint, Activity,
  GitBranch, ShieldAlert, ChevronRight,
  Database, Timer, GitPullRequest, Laptop
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Incidents = () => {
  const navigate = useNavigate();
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isErrorActive, setIsErrorActive] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [isRemediating, setIsRemediating] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const gitCommands = [
    "> aura-cli initiate --hotfix system-auth",
    "📦 Preparing local environment for patch injection...",
    "> git checkout -b fix/npe-logic-142",
    "Switched to a new branch 'fix/npe-logic-142'",
    "> git apply patches/auth_handshake_npe.patch",
    "Applied patch to AuthService.java successfully.",
    "> git add src/main/java/io/aura/AuthService.java",
    "> git commit -m 'fix: implement Yoda condition null safety'",
    "[fix/npe-142 882af1] fix: implement Yoda condition null safety",
    "> git push origin fix/npe-logic-142",
    "Pushed to origin/fix/npe-logic-142",
    "🚀 Aura_Engine: Triggering Cluster Blue/Green Rollout...",
    "✅ Deployment Successful. Pod stabilized."
  ];

  const runInvestigation = async () => {
    setIsErrorActive(true);
    setAnalysisStep(1); 
    try {
      setTimeout(() => setAnalysisStep(2), 1200);
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pod_name: sessionStorage.getItem('targetService') || "payment-api",
          file_name: "AuthService.java",
          line_number: 8,
          error_log: "java.lang.NullPointerException"
        })
      });
      const data = await response.json();
      setAnalysisData(data);
      setAnalysisStep(3); 
      setTimeout(() => setAnalysisStep(4), 1000);
    } catch (error) { console.error("Backend offline"); }
  };

  const handleRemediation = async () => {
    setIsRemediating(true);
    setTerminalLines([]);
    for (let i = 0; i < gitCommands.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setTerminalLines(prev => [...prev, gitCommands[i]]);
    }
    setTimeout(() => {
      sessionStorage.setItem('activeIncident', 'false');
      sessionStorage.removeItem('targetService');
      alert("SYSTEM_HEALED: Automated hotfix deployed to Production.");
      navigate('/dashboard');
    }, 2000);
  };

  useEffect(() => {
    if (sessionStorage.getItem('activeIncident') === 'true') {
      runInvestigation();
    }
  }, []);

  if (!isErrorActive) {
    return (
      <div className="pt-32 px-10 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
         <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute w-[800px] h-[800px] bg-[#bef35e]/5 rounded-full blur-3xl pointer-events-none" />
         <div className="relative z-10 text-center space-y-12">
            <Search className="text-[#bef35e] mx-auto animate-pulse" size={60} />
            <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-4">Scanning_Cluster</h2>
            <button onClick={runInvestigation} className="px-10 py-4 bg-[#bef35e] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(190,243,94,0.3)] hover:scale-105 transition-all">Start Manual Investigation</button>
         </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-10 pb-20 max-w-[1700px] mx-auto min-h-screen">
      
      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <IncidentMetric label="Severity" value="CRITICAL" color="text-red-500" icon={<ShieldAlert size={14}/>}/>
        <IncidentMetric label="Analysis_Speed" value="0.82s" color="text-[#bef35e]" icon={<Zap size={14}/>}/>
        <IncidentMetric label="AI_Confidence" value="98.4%" color="text-indigo-400" icon={<Cpu size={14}/>}/>
        <IncidentMetric label="Verification" value="QA_OK" color="text-emerald-400" icon={<CheckCircle2 size={14}/>}/>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {analysisStep < 3 ? (
              <div className="aura-card-modern p-40 flex flex-col items-center justify-center text-center"><Loader2 className="text-[#bef35e] animate-spin mb-6" size={60} /><p className="font-mono text-sm uppercase tracking-[0.5em] text-[#bef35e] animate-pulse">Running_AI_Diagnostic_Cycles...</p></div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="aura-card-modern p-10 bg-gradient-to-br from-[#bef35e]/5 to-transparent border-[#bef35e]/20">
                <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                    <div className="p-3 bg-[#bef35e] text-black rounded-xl"><Cpu size={24} /></div>
                    <h3 className="text-xl font-bold text-white uppercase">Automated_RCA_Report</h3>
                </div>
                <div className="prose prose-invert max-w-none font-sans text-zinc-300 leading-relaxed overflow-y-auto max-h-[500px] pr-6 custom-scrollbar text-lg">
                  <ReactMarkdown>{analysisData?.root_cause_analysis}</ReactMarkdown>
                </div>
              </motion.div>
            )}

            {analysisStep >= 4 && (
              <div className="grid grid-cols-1 gap-6">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="aura-card-modern p-0 overflow-hidden border-[#bef35e]/20">
                    <div className="bg-zinc-900/80 px-8 py-5 border-b border-white/5 flex justify-between items-center font-mono text-[10px]">
                      <span className="font-black text-zinc-400 uppercase flex items-center gap-2"><Code size={14} /> Context_Link: AuthService.java</span>
                      <span className="px-4 py-1.5 rounded-full bg-[#bef35e]/10 text-[#bef35e] font-black">QA_PASSED</span>
                    </div>
                    <div className="p-10 font-mono text-xs leading-relaxed bg-black/60 text-[#bef35e]/70">
                      <pre><code>{analysisData?.extracted_logic}</code></pre>
                    </div>
                    {!isRemediating && (
                        <div className="p-8 bg-white/[0.01] border-t border-white/5">
                            <button onClick={handleRemediation} className="w-full bg-[#bef35e] text-black py-5 rounded-2xl font-black uppercase text-xs shadow-[0_0_50px_rgba(190,243,94,0.3)] hover:scale-[1.01] transition-all">Initialize Hotfix Remediation</button>
                        </div>
                    )}
                </motion.div>

                {/* INTEGRATED TERMINAL */}
                <AnimatePresence>
                  {isRemediating && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="aura-card-modern bg-[#020617] border-white/10 overflow-hidden">
                       <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center font-mono text-[9px] uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Terminal size={12}/> git_remediation_shell</span>
                          <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/20" /><div className="w-2 h-2 rounded-full bg-[#bef35e]" /></div>
                       </div>
                       <div className="p-6 font-mono text-[10px] space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {terminalLines.map((line, i) => (
                            <div key={i} className={line.startsWith('>') ? 'text-[#bef35e]' : line.startsWith('✅') ? 'text-[#bef35e] font-bold' : 'text-zinc-500'}>{line}</div>
                          ))}
                          <div className="w-2 h-3 bg-[#bef35e] animate-pulse inline-block ml-1" />
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="aura-card-modern flex flex-col min-h-[600px] border-white/5 bg-black/40">
            <div className="p-6 border-b border-white/5"><h3 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2"><Terminal size={14} /> Neural_Assistant</h3></div>
            <div className="flex-1 p-8 space-y-6 overflow-y-auto font-mono text-[11px] custom-scrollbar">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 italic">I have pinpointed the NullPointer on Line 8. The AuthService fails when the token object is null. I recommend Yoda conditions for safety.</div>
                {analysisData?.qa_validation && (
                    <div className="p-5 rounded-2xl bg-[#bef35e]/5 border border-[#bef35e]/10 text-[#bef35e] font-bold">[QA_VERDICT]: Regression tests passed. Fix is low-risk.</div>
                )}
            </div>
            <div className="p-6 bg-black/40 border-t border-white/5 flex gap-3">
                <input type="text" placeholder="Ask Aura about the logic..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs focus:border-[#bef35e] outline-none transition-all" />
                <button className="p-4 bg-[#bef35e] text-black rounded-xl"><Send size={16}/></button>
            </div>
          </div>
          <div className="aura-card-modern p-8 space-y-6 border-white/5">
             <h4 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2"><GitBranch size={14}/> Hotfix_Pipeline</h4>
             <div className="space-y-6">
                <PipelineStep num="01" label="Hotfix Branch" active={isRemediating} />
                <PipelineStep num="02" label="Sync Patches" active={terminalLines.length > 8} />
                <PipelineStep num="03" label="Stabilize K8s" active={terminalLines.length > 12} />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const IncidentMetric = ({ label, value, color, icon }: any) => (
    <div className="aura-card-modern p-5 flex items-center justify-between border-white/5 bg-black/20">
        <div>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</p>
        </div>
        <div className="p-2.5 bg-white/5 rounded-lg text-zinc-600">{icon}</div>
    </div>
);

const PipelineStep = ({ num, label, active }: any) => (
    <div className={`flex items-center gap-4 transition-all duration-500 ${active ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black ${active ? 'bg-[#bef35e] text-black border-[#bef35e] shadow-[0_0_15px_#bef35e]' : 'border-zinc-800 text-zinc-500'}`}>{num}</div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
    </div>
);

export default Incidents;