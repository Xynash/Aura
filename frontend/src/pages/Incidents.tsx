import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Cpu, Code, Send,
  ShieldCheck, ArrowLeft, Loader2, Search,
  CheckCircle2, Zap, GitBranch, ShieldAlert,
  ExternalLink, Radio, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuraSocket } from '../hooks/useAuraSocket';

const Incidents = () => {
  const [analysisStep,        setAnalysisStep]        = useState(0);
  const [isErrorActive,       setIsErrorActive]       = useState(false);
  const [analysisData,        setAnalysisData]        = useState<any>(null);
  const [chatInput,           setChatInput]           = useState('');
  const [chatMessages,        setChatMessages]        = useState<any[]>([]);
  const [isRemediating,       setIsRemediating]       = useState(false);
  const [terminalLines,       setTerminalLines]       = useState<string[]>([]);
  const [remediationComplete, setRemediationComplete] = useState(false);
  const [isLiveMode,          setIsLiveMode]          = useState(false);
  const [liveStatusText,      setLiveStatusText]      = useState('');
  const [qaResult,            setQaResult]            = useState<any>(null);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useAuraSocket((event: any) => {
    if (event.type === "incident_detected") {
      setIsLiveMode(true);
      setIsErrorActive(true);
      setAnalysisStep(2);
      setQaResult(null);
      setRemediationComplete(false);
      setTerminalLines([]);
      setLiveStatusText(`Autonomous detection · pod ${event.pod} · reason: ${event.reason}`);
      setChatMessages([{
        type: 'bot',
        text: `🚨 AUTONOMOUS ALERT: Pod "${event.pod}" failed (${event.reason}). AI analysis initiated without human trigger.`
      }]);
      sessionStorage.setItem('activeIncident', 'true');
      sessionStorage.setItem('targetService',  event.pod);
    }

    if (event.type === "rca_complete") {
      setIsLiveMode(true);
      setAnalysisData({
        pod:                 event.pod,
        root_cause_analysis: event.root_cause_analysis,
        extracted_logic:     event.extracted_logic,
        active_node:         event.active_node,
        source_file:         event.source_file,
        method:              event.method,
      });
      setAnalysisStep(4);
      setLiveStatusText(`RCA complete · ${event.source_file} · node ${event.active_node}`);
      setChatMessages(prev => [...prev, {
        type: 'bot',
        text: `Neural link via ${event.active_node}. Autonomous analysis complete. Source-aware patch generated for ${event.source_file}.`
      }]);
    }
  });

  // ── Manual investigation ──────────────────────────────────────────────────
  const runInvestigation = async () => {
    setIsErrorActive(true);
    setIsLiveMode(false);
    setAnalysisStep(1);
    setQaResult(null);
    setRemediationComplete(false);
    setTerminalLines([]);
    try {
      setTimeout(() => setAnalysisStep(2), 1200);
      const res  = await fetch("http://localhost:8000/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pod_name:    sessionStorage.getItem('targetService') || "auth-gateway",
          file_name:   "AuthService.java",
          line_number: 8,
          error_log:   "java.lang.NullPointerException",
        })
      });
      const data = await res.json();
      setAnalysisData(data);
      setAnalysisStep(3);
      setTimeout(() => setAnalysisStep(4), 1000);
      setChatMessages([{
        type: 'bot',
        text: `Neural link via ${data.active_node}. Analysis complete for ${data.source_file || 'AuthService.java'}.`
      }]);
    } catch {
      console.error("Backend offline");
      setIsErrorActive(false);
    }
  };

  // ── Mount: check for pre-loaded autonomous RCA ────────────────────────────
  useEffect(() => {
    const autoRCA = sessionStorage.getItem('autoRCA');
    if (autoRCA) {
      try {
        const parsed = JSON.parse(autoRCA);
        setIsLiveMode(true);
        setIsErrorActive(true);
        setAnalysisData(parsed);
        setAnalysisStep(4);
        setLiveStatusText(`Autonomous RCA loaded · ${parsed.source_file || parsed.pod}`);
        setChatMessages([{
          type: 'bot',
          text: `Neural link via ${parsed.active_node}. Autonomous analysis complete.`
        }]);
        return;
      } catch { /* fall through */ }
    }
    if (sessionStorage.getItem('activeIncident') === 'true') {
      runInvestigation();
    }
  }, []);

  // ── Chat ──────────────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    try {
      const res  = await fetch("http://localhost:8000/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          user_input: userMsg,
          context:    analysisData?.root_cause_analysis || ""
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { type: 'bot', text: data.response }]);
    } catch { console.error("Chat Error"); }
  };

  // ── Remediation ───────────────────────────────────────────────────────────
  const handleRemediation = async () => {
    setIsRemediating(true);
    setTerminalLines(["> Initializing Aura Subspace Remediation Protocol..."]);
    try {
      const res  = await fetch("http://localhost:8000/remediate");
      const data = await res.json();

      // Show QA result
      if (data.qa) setQaResult(data.qa);

      if (data.status === "SUCCESS" && data.steps) {
        for (const step of data.steps) {
          await new Promise(r => setTimeout(r, 600));
          setTerminalLines(prev => [...prev, step]);
        }
        setRemediationComplete(true);
        sessionStorage.setItem('activeIncident', 'false');
        sessionStorage.removeItem('autoRCA');
      } else if (data.status === "BLOCKED") {
        setTerminalLines(prev => [
          ...prev,
          `❌ QA BLOCKED: ${data.reason}`,
          "> Fix rejected — safety violation detected."
        ]);
        setIsRemediating(false);
      } else {
        setTerminalLines(prev => [...prev, "❌ ERROR: GitHub API sequence failed."]);
        setIsRemediating(false);
      }
    } catch {
      setTerminalLines(prev => [...prev, "❌ CRITICAL: Backend link failed."]);
    }
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!isErrorActive) {
    return (
      <div className="pt-32 px-10 min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="galactic-bg" />
        <Search className="text-[#bef35e] animate-pulse mb-8" size={60} />
        <h2 className="text-4xl font-black italic text-white uppercase mb-4">Scanning_Mesh</h2>
        <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-10">
          Watcher armed · delete a pod or trigger manually
        </p>
        <button
          onClick={runInvestigation}
          className="bg-[#bef35e] text-black px-10 py-4 rounded-xl font-black uppercase text-xs shadow-[0_0_30px_rgba(190,243,94,0.3)] hover:scale-105 transition-all"
        >
          Start Manual Scan
        </button>
      </div>
    );
  }

  const sourceFile = analysisData?.source_file || "AuthService.java";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-10 pb-20 max-w-[1700px] mx-auto min-h-screen relative">
      <div className="galactic-bg" />

      {/* Live badge */}
      <AnimatePresence>
        {isLiveMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-red-950/90 border border-red-500/30 rounded-xl px-5 py-3 backdrop-blur"
          >
            <Radio size={12} className="text-red-400 animate-pulse" />
            <span className="text-red-400 text-[9px] font-black uppercase tracking-widest">Live · Autonomous</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <IncidentMetric label="Incident_Severity" value="CRITICAL"                                         color="text-red-500"     icon={<ShieldAlert size={14}/>} />
        <IncidentMetric label="Active_Node"        value={analysisData?.active_node || "SYNCING..."}        color="text-[#bef35e]"   icon={<Zap size={14}/>} />
        <IncidentMetric label="Source"             value={isLiveMode ? "AUTONOMOUS" : "MANUAL_SCAN"}        color={isLiveMode ? "text-red-400" : "text-indigo-400"} icon={<Cpu size={14}/>} />
        <IncidentMetric label="QA_Status"          value={remediationComplete ? "STABILIZED" : qaResult ? (qaResult.passed ? "PASSED" : "BLOCKED") : "Pending"} color={remediationComplete ? "text-emerald-400" : qaResult?.passed === false ? "text-red-400" : "text-emerald-400"} icon={<ShieldCheck size={14}/>} />
      </div>

      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4">
          <Link to="/dashboard" className="text-[#bef35e] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:opacity-70 transition-all font-mono">
            <ArrowLeft size={14} /> Back_To_Console
          </Link>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">Investigation_Lab</h2>
          {isLiveMode && liveStatusText && (
            <p className="text-[9px] font-mono text-red-500/70 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping inline-block" />
              {liveStatusText}
            </p>
          )}
        </div>
        <div className="flex gap-6 pt-10">
          {['Intercept', 'Synthesize', 'Reason', 'Validate'].map((label, i) => (
            <div key={label} className="flex flex-col items-end gap-2">
              <div className={`h-1 w-24 rounded-full transition-all duration-1000 ${analysisStep >= i + 1 ? 'bg-[#bef35e] shadow-[0_0_15px_#bef35e]' : 'bg-white/5'}`} />
              <span className={`text-[8px] font-bold uppercase tracking-tighter ${analysisStep >= i + 1 ? 'text-[#bef35e]' : 'text-zinc-700'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">

            {/* Loading */}
            {analysisStep < 3 ? (
              <div className="aura-card-modern p-40 flex flex-col items-center justify-center text-center bg-black/40 border-white/5">
                <Loader2 className="text-[#bef35e] animate-spin mb-6" size={60} />
                <p className="font-mono text-sm uppercase tracking-[0.5em] text-[#bef35e] animate-pulse">
                  {isLiveMode ? 'Autonomous_Neural_Cycles_Running...' : 'Running_Neural_Cycles...'}
                </p>
              </div>
            ) : (
              /* RCA Report */
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className={`aura-card-modern p-10 bg-gradient-to-br to-transparent border-[#bef35e]/20 ${isLiveMode ? 'from-red-950/10' : 'from-[#bef35e]/5'}`}
              >
                <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                  <div className={`p-3 rounded-xl shadow-[0_0_20px_rgba(190,243,94,0.4)] ${isLiveMode ? 'bg-red-500 text-white' : 'bg-[#bef35e] text-black'}`}>
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                      {isLiveMode ? 'Autonomous_RCA_Report' : 'Automated_RCA_Report'}
                    </h3>
                    {isLiveMode && (
                      <p className="text-[9px] text-red-400 font-mono mt-1 uppercase tracking-widest">
                        Zero human intervention · watcher triggered · {sourceFile}
                      </p>
                    )}
                  </div>
                </div>
                <div className="prose prose-invert max-w-none font-sans text-zinc-300 leading-relaxed overflow-y-auto max-h-[500px] pr-6 custom-scrollbar text-lg">
                  <ReactMarkdown>{analysisData?.root_cause_analysis}</ReactMarkdown>
                </div>
              </motion.div>
            )}

            {/* Source + Remediation */}
            {analysisStep >= 4 && (
              <div className="grid grid-cols-1 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  className="aura-card-modern p-0 overflow-hidden border-[#bef35e]/20"
                >
                  {/* Source header — dynamic file name */}
                  <div className="bg-zinc-900/80 px-8 py-6 border-b border-white/5 flex justify-between items-center font-mono text-[10px]">
                    <span className="font-black text-zinc-400 uppercase flex items-center gap-2">
                      <Code size={14} /> Source: {sourceFile}
                    </span>
                    <div className="flex items-center gap-3">
                      {/* QA badge */}
                      {qaResult ? (
                        <span className={`px-4 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 ${qaResult.passed ? 'bg-[#bef35e]/10 text-[#bef35e]' : 'bg-red-500/10 text-red-400'}`}>
                          {qaResult.passed
                            ? <><CheckCircle2 size={10} /> QA_PASSED</>
                            : <><XCircle size={10} /> QA_BLOCKED</>
                          }
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full bg-[#bef35e]/10 text-[#bef35e] font-black uppercase tracking-widest">
                          QA_SECURED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Source code */}
                  <div className="p-10 font-mono text-xs leading-relaxed bg-black/60 text-[#bef35e]/70 overflow-x-auto border-b border-white/5">
                    <pre><code>{analysisData?.extracted_logic}</code></pre>
                  </div>

                  {/* QA score bar */}
                  {qaResult && (
                    <div className="px-10 py-4 bg-black/40 border-b border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">QA Safety Score</span>
                        <span className={`text-[9px] font-black ${qaResult.score >= 75 ? 'text-[#bef35e]' : 'text-red-400'}`}>{qaResult.score}/100</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${qaResult.score}%` }}
                          transition={{ duration: 1 }}
                          className={`h-1 rounded-full ${qaResult.score >= 75 ? 'bg-[#bef35e]' : 'bg-red-500'}`}
                        />
                      </div>
                      {qaResult.report && (
                        <p className="text-[9px] text-zinc-600 font-mono mt-2">{qaResult.report}</p>
                      )}
                    </div>
                  )}

                  {/* Remediation button */}
                  <div className="p-8 bg-white/[0.01]">
                    {!remediationComplete ? (
                      <button
                        onClick={handleRemediation}
                        disabled={isRemediating}
                        className="w-full bg-[#bef35e] text-black py-5 rounded-2xl font-black uppercase text-xs shadow-[0_0_50px_rgba(190,243,94,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isRemediating ? "Initializing GitHub Node..." : "Apply Hotfix & Auto-Heal ⚡"}
                      </button>
                    ) : (
                      <div className="p-6 bg-[#bef35e]/10 border border-[#bef35e]/30 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CheckCircle2 className="text-[#bef35e]" size={24} />
                          <div>
                            <p className="text-[#bef35e] font-black uppercase text-xs">Fix_Committed_Successfully</p>
                            <p className="text-zinc-500 text-[10px] font-mono italic">PR created. Awaiting Senior SRE review.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(analysisData?.pr_url || "https://github.com/Xynash/aura-target-app/pulls", "_blank")}
                          className="bg-[#bef35e] text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all"
                        >
                          Check Branch <ExternalLink size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Terminal */}
                <AnimatePresence>
                  {isRemediating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="aura-card-modern bg-[#020617] border-white/10 overflow-hidden shadow-2xl"
                    >
                      <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Terminal size={12} /> git_remediation_shell
                        </span>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/20" />
                          <div className="w-2 h-2 rounded-full bg-[#bef35e]" />
                        </div>
                      </div>
                      <div className="p-6 font-mono text-[10px] space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {terminalLines.map((line, i) => (
                          <div key={i} className={
                            line.startsWith('>') ? 'text-[#bef35e]'
                            : line.includes('✅') || line.includes('PR') ? 'text-[#bef35e] font-bold'
                            : line.includes('❌') ? 'text-red-400'
                            : 'text-zinc-500'
                          }>{line}</div>
                        ))}
                        {!remediationComplete && <div className="w-2 h-3 bg-[#bef35e] animate-pulse inline-block ml-1" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sidebar ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Chat */}
          <div className="aura-card-modern flex flex-col min-h-[600px] border-white/5 bg-black/40">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-widest">
                <Terminal size={14} /> Neural_Assistant
              </h3>
              <span className={`text-[8px] font-bold animate-pulse ${isLiveMode ? 'text-red-400' : 'text-[#bef35e]'}`}>
                {isLiveMode ? 'Live_Autonomous' : 'Live_Sync'}
              </span>
            </div>
            <div className="flex-1 p-8 space-y-6 overflow-y-auto font-mono text-[11px] custom-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-5 rounded-2xl ${msg.type === 'bot' ? 'bg-white/5 border border-white/5 text-zinc-300' : 'bg-[#bef35e] text-black font-bold'}`}>
                    <div className="flex items-center gap-2 mb-2 opacity-40 uppercase text-[8px] font-black tracking-widest">
                      {msg.type === 'bot' ? 'Aura_Core' : 'SRE_Operator'}
                    </div>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-black/40 border-t border-white/5">
              <div className="relative">
                <input
                  type="text" value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={analysisStep < 4 ? "Core analyzing..." : "Ask Aura about the fix..."}
                  disabled={analysisStep < 4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs focus:border-[#bef35e] outline-none transition-all placeholder:text-zinc-800"
                />
                <button onClick={handleSendMessage} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bef35e] opacity-60 hover:opacity-100">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="aura-card-modern p-8 space-y-6 border-white/5">
            <h4 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-widest">
              <GitBranch size={14} /> Hotfix_Pipeline
            </h4>
            <div className="space-y-6">
              <PipelineStep num="01" label="Create Hotfix Branch" active={isRemediating} />
              <PipelineStep num="02" label="Sync Logic Patch"     active={terminalLines.length > 3} />
              <PipelineStep num="03" label="Awaiting Approval"    active={remediationComplete} />
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
    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black ${active ? 'bg-[#bef35e] text-black border-[#bef35e] shadow-[0_0_15px_#bef35e]' : 'border-zinc-800 text-zinc-500'}`}>
      {num}
    </div>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
  </div>
);

export default Incidents;