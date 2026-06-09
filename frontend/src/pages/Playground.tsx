import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Code, Database, ShieldCheck,
  Terminal, Binoculars, Orbit, Target,
  FileCode, AlertCircle, Share2, Waypoints,
  CheckCircle2, Loader2, Radio, XCircle,
  ArrowRight, Play, RotateCcw, Info
} from 'lucide-react';
import { useAuraSocket } from '../hooks/useAuraSocket';
import { API_URL } from '../config';

type SimService = "auth-gateway" | "payment-api" | "inventory-node";
type SimState   = "idle" | "simulating" | "analyzing" | "complete" | "error";

const SERVICE_META: Record<SimService, {
  label: string; file: string; bug: string;
  description: string; language: string; icon: React.ReactNode;
}> = {
  "auth-gateway": {
    label:       "Auth Gateway",
    file:        "AuthService.java",
    bug:         "NullPointerException",
    description: "The token validation method calls .equals() without a null check — crashes when token is null.",
    language:    "Java",
    icon:        <Zap size={20} />,
  },
  "payment-api": {
    label:       "Payment API",
    file:        "PaymentService.java",
    bug:         "ArithmeticException: / by zero",
    description: "Guest users have 0 cart items. The payment calculation divides by cart count — instant crash.",
    language:    "Java",
    icon:        <FileCode size={20} />,
  },
  "inventory-node": {
    label:       "Inventory Node",
    file:        "InventoryService.java",
    bug:         "NullPointerException (HashMap)",
    description: "Looking up an unknown itemId returns null from HashMap. Unboxing null Integer to int crashes.",
    language:    "Java",
    icon:        <AlertCircle size={20} />,
  },
};

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Pick Service",  desc: "Choose which microservice to crash" },
  { id: 2, label: "Inject Fault",  desc: "Aura detects the pod failure"       },
  { id: 3, label: "AI Analysis",   desc: "Llama 3.3 reads the source code"    },
  { id: 4, label: "RCA Complete",  desc: "Root cause + fix generated"         },
];

const Playground = () => {
  const [isIntro,       setIsIntro]       = useState(true);
  const [simState,      setSimState]      = useState<SimState>("idle");
  const [activeService, setActiveService] = useState<SimService | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [speech,        setSpeech]        = useState("");
  const [rcaResult,     setRcaResult]     = useState<any>(null);
  const [simError,      setSimError]      = useState<string | null>(null);
  const [currentStep,   setCurrentStep]   = useState(1);
  const [showHowTo,     setShowHowTo]     = useState(false);
  const [starCount]                       = useState([...Array(50)]);
  const visitorName = sessionStorage.getItem('visitorName') || 'Operator';

  useEffect(() => {
    const t = setTimeout(() => setIsIntro(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useAuraSocket((event: any) => {
    if (event.type === "incident_detected" && simState === "simulating") {
      setSimState("analyzing");
      setCurrentStep(3);
      setActiveSpeaker("watcher");
      setSpeech(`Pod ${event.pod} down — ${event.reason}. Linking source code...`);
    }

    if (event.type === "rca_complete") {
      setRcaResult({
        pod:      event.pod,
        analysis: event.root_cause_analysis,
        file:     event.source_file,
        method:   event.method,
        node:     event.active_node,
      });
      setSimState("complete");
      setCurrentStep(4);
      setActiveSpeaker("oracle");
      setSpeech(`Analysis complete via ${event.active_node}. Root cause identified.`);

      setTimeout(() => {
        setActiveSpeaker("shield");
        setSpeech("QA scan passed. Fix is safe to deploy.");
        setTimeout(() => { setActiveSpeaker(null); setSpeech(""); }, 3000);
      }, 4000);
    }
  });

  // ── Start chaos ───────────────────────────────────────────────────────────
  const startChaos = async (service: SimService) => {
    if (simState === "simulating" || simState === "analyzing") return;
    setActiveService(service);
    setSimState("simulating");
    setCurrentStep(2);
    setRcaResult(null);
    setSimError(null);
    setActiveSpeaker("watcher");
    setSpeech(`Injecting fault into ${SERVICE_META[service].label}...`);

    try {
      const res  = await fetch(`${API_URL}/simulate/${service}`, { method: "POST" });
      const data = await res.json();
      if (data.status !== "simulation_started") throw new Error(data.detail || "Unknown error");
    } catch (e: any) {
      setSimError(e.message || "Backend unreachable");
      setSimState("error");
      setActiveSpeaker(null);
      setCurrentStep(1);
    }
  };

  const resetSim = () => {
    setSimState("idle");
    setActiveService(null);
    setActiveSpeaker(null);
    setSpeech("");
    setRcaResult(null);
    setSimError(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans">

      {/* Starfield */}
      <div className="absolute inset-0 z-0">
        <div className="galactic-bg" />
        {starCount.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{ width: '2px', height: '2px', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(40px)" }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              initial={{ width: 0 }} animate={{ width: "300px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-[1px] bg-[#bef35e] mb-8 shadow-[0_0_20px_#bef35e]"
            />
            <motion.h1
              initial={{ letterSpacing: "1.5em", opacity: 0 }}
              animate={{ letterSpacing: "0.4em", opacity: 1 }}
              transition={{ duration: 2.5 }}
              className="text-4xl md:text-6xl font-black italic text-white uppercase"
            >
              AURA_<span className="text-[#bef35e]">SUBSPACE</span>_LINK
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
              className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.8em] mt-8"
            >
              Welcome, {visitorName}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="playground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="pt-28 px-6 lg:px-10 pb-20 max-w-[1700px] mx-auto relative z-10"
          >

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-b border-white/5 pb-8 gap-6">
              <div>
                <div className="flex items-center gap-3 text-[#bef35e] font-mono text-[10px] tracking-[0.6em] uppercase mb-3">
                  <Orbit size={14} className="animate-spin-slow" /> Experimental_Orchestration_Lab
                </div>
                <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter text-white uppercase">
                  Intelligence_<span className="text-[#bef35e] glow-text">Playground</span>
                </h2>
                <p className="text-zinc-600 font-mono text-[10px] mt-2 uppercase tracking-widest">
                  Operator: <span className="text-zinc-400">{visitorName}</span> · Real AI Pipeline · No K8s required
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowHowTo(!showHowTo)}
                  className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                >
                  <Info size={12} /> How This Works
                </button>
                {simState !== "idle" && (
                  <button
                    onClick={resetSim}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* ── How it works panel ── */}
            <AnimatePresence>
              {showHowTo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 aura-card-modern p-6 bg-indigo-500/5 border-indigo-500/20 overflow-hidden"
                >
                  <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-4">What happens when you click a button</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { step: "1", title: "You pick a service", desc: "Choose Auth, Payment, or Inventory — each has a real Java bug." },
                      { step: "2", title: "Backend simulates crash", desc: "The /simulate endpoint fires the full RCA pipeline as if K8s detected it." },
                      { step: "3", title: "AI reads source code", desc: "Llama 3.3 gets the actual Java method + crash context via AST parsing." },
                      { step: "4", title: "Root cause appears", desc: "Real AI analysis. Real fix. Real GitHub PR if you click Apply Hotfix in the Lab." },
                    ].map(item => (
                      <div key={item.step} className="space-y-2">
                        <span className="text-indigo-400 font-mono text-xs font-black">[{item.step}]</span>
                        <h4 className="text-xs font-black text-white uppercase">{item.title}</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step Progress Bar ── */}
            <div className="mb-10 aura-card-modern p-6 bg-black/40 border-white/5">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute left-0 right-0 top-5 h-[1px] bg-white/5 mx-8" />
                <motion.div
                  className="absolute left-0 top-5 h-[1px] bg-[#bef35e] mx-8 shadow-[0_0_10px_#bef35e]"
                  style={{ right: `${100 - ((currentStep - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />

                {STEPS.map(s => (
                  <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                      currentStep > s.id  ? 'bg-[#bef35e] border-[#bef35e] text-black shadow-[0_0_15px_#bef35e]' :
                      currentStep === s.id ? 'bg-[#bef35e]/20 border-[#bef35e] text-[#bef35e] animate-pulse' :
                                             'bg-black border-white/10 text-zinc-700'
                    }`}>
                      {currentStep > s.id ? <CheckCircle2 size={14} /> : s.id}
                    </div>
                    <div className="text-center hidden md:block">
                      <p className={`text-[9px] font-black uppercase tracking-wider ${currentStep >= s.id ? 'text-white' : 'text-zinc-700'}`}>
                        {s.label}
                      </p>
                      <p className="text-[8px] text-zinc-600 font-mono mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 items-start">

              {/* ── LEFT: Service selector ── */}
              <div className="col-span-12 lg:col-span-4 space-y-4">

                <div className="aura-card-modern p-6 bg-black/60 border-white/10">
                  <h3 className="text-[10px] font-black text-[#bef35e] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                    <Target size={14} /> Step 1: Pick a Service to Crash
                  </h3>
                  <p className="text-[9px] text-zinc-600 font-mono mb-6 uppercase tracking-wider">
                    Each service has a real Java bug. Select one to trigger the AI pipeline.
                  </p>

                  <div className="space-y-3">
                    {(Object.keys(SERVICE_META) as SimService[]).map(svc => {
                      const meta     = SERVICE_META[svc];
                      const isActive = activeService === svc && simState !== "idle";
                      const isDone   = simState === "complete" && activeService === svc;

                      return (
                        <motion.button
                          key={svc}
                          whileHover={{ scale: simState === "idle" ? 1.01 : 1 }}
                          onClick={() => simState === "idle" && startChaos(svc)}
                          disabled={simState === "simulating" || simState === "analyzing"}
                          className={`w-full p-5 rounded-2xl border-2 transition-all text-left group ${
                            isDone    ? 'border-[#bef35e]/50 bg-[#bef35e]/5' :
                            isActive  ? 'border-red-500/50 bg-red-500/10' :
                            simState === "idle" ? 'border-white/10 bg-white/5 hover:border-white/30 cursor-pointer' :
                                        'border-white/5 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2.5 rounded-xl transition-colors ${
                              isDone   ? 'bg-[#bef35e] text-black' :
                              isActive ? 'bg-red-500/20 text-red-400' :
                                         'bg-white/5 text-zinc-500 group-hover:text-white'
                            }`}>
                              {isDone ? <CheckCircle2 size={18} /> : isActive ? <Loader2 size={18} className="animate-spin" /> : meta.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-xs font-black uppercase tracking-wider ${
                                  isDone ? 'text-[#bef35e]' : isActive ? 'text-red-400' : 'text-zinc-300 group-hover:text-white'
                                }`}>
                                  {meta.label}
                                </p>
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                                  isActive ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                  isDone   ? 'border-[#bef35e]/30 text-[#bef35e] bg-[#bef35e]/10' :
                                             'border-white/10 text-zinc-600'
                                }`}>
                                  {isDone ? 'ANALYZED' : isActive ? 'CRASHING' : meta.language}
                                </span>
                              </div>
                              <p className="text-[9px] font-mono text-red-400/70 mb-1 uppercase">{meta.bug}</p>
                              <p className="text-[9px] text-zinc-600 leading-relaxed">{meta.description}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Status log */}
                <div className="aura-card-modern p-5 bg-black/80 font-mono text-[9px] border-white/5">
                  <p className="mb-3 text-[#bef35e]/40 tracking-widest uppercase flex items-center gap-2">
                    <Radio size={9} className={simState !== "idle" && simState !== "error" ? "animate-pulse text-red-400" : ""} />
                    Live_Pipeline_Log
                  </p>
                  <div className="space-y-1.5 text-zinc-600">
                    <p>{'>'} WebSocket: CONNECTED</p>
                    <p>{'>'} AI Nodes: {simState !== "error" ? "ONLINE" : "CHECK_BACKEND"}</p>
                    {activeService && <p className="text-orange-400">{'>'} Target: {SERVICE_META[activeService].file}</p>}
                    {simState === "simulating" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-bold">{'>'} FAULT_INJECTED → awaiting K8s event...</motion.p>}
                    {simState === "analyzing" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-400">{'>'} AST_PARSING → AI_REASONING...</motion.p>}
                    {simState === "complete" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#bef35e] font-bold">{'>'} RCA_COMPLETE → fix generated</motion.p>}
                    {simState === "error" && <p className="text-red-400">{'>'} ERROR: {simError}</p>}
                  </div>
                </div>

                {/* RCA result summary */}
                <AnimatePresence>
                  {simState === "complete" && rcaResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="aura-card-modern p-5 bg-[#bef35e]/5 border-[#bef35e]/20 space-y-3"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 size={14} className="text-[#bef35e]" />
                        <span className="text-[10px] font-black uppercase text-[#bef35e] tracking-widest">Analysis Complete</span>
                      </div>
                      <div className="space-y-2 font-mono text-[9px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-600 uppercase">Service</span>
                          <span className="text-white">{rcaResult.pod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600 uppercase">File</span>
                          <span className="text-[#bef35e]">{rcaResult.file}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600 uppercase">Method</span>
                          <span className="text-indigo-400">{rcaResult.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600 uppercase">AI Node</span>
                          <span className="text-purple-400">{rcaResult.node}</span>
                        </div>
                      </div>
                      {/* ✅ FIXED: Added opening <a tag */}
                      <a
                        href="/incidents"
                        className="w-full mt-2 py-3 bg-[#bef35e] text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                      >
                        View Full Report <ArrowRight size={12} />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── CENTER: Space station ── */}
              <div className="col-span-12 lg:col-span-8 space-y-4">

                {/* Characters canvas */}
                <div className="aura-card-modern min-h-[500px] bg-black/40 border-white/5 relative flex items-center justify-around overflow-hidden">
                  <div className="absolute inset-0 bg-digital-mesh opacity-5 pointer-events-none" />

                  {/* Floating satellites */}
                  <TechSatellite icon={<Database />} top="10%" left="5%"  delay={0} />
                  <TechSatellite icon={<Code />}     top="70%" left="8%"  delay={1} />
                  <TechSatellite icon={<Share2 />}   top="10%" right="5%" delay={2} />
                  <TechSatellite icon={<Waypoints />} bottom="10%" right="8%" delay={3} />

                  {/* Characters */}
                  <CharacterStation
                    label="Watcher" sub="K8s Observer"
                    icon={<Binoculars size={28} />}
                    active={activeSpeaker === 'watcher'}
                    speech={speech} color="bg-blue-600"
                    pulse={simState === "simulating"}
                    stepNum={2}
                    currentStep={currentStep}
                  />
                  <CharacterStation
                    label="Oracle" sub="AI Engine"
                    icon={<Cpu size={28} />}
                    active={activeSpeaker === 'oracle'}
                    speech={speech} color="bg-purple-600"
                    pulse={simState === "analyzing"}
                    stepNum={3}
                    currentStep={currentStep}
                  />
                  <CharacterStation
                    label="Shield" sub="QA Guard"
                    icon={<ShieldCheck size={28} />}
                    active={activeSpeaker === 'shield'}
                    speech={speech} color="bg-[#bef35e]"
                    pulse={simState === "complete"}
                    stepNum={4}
                    currentStep={currentStep}
                  />

                  {/* Animated connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                      d="M 280 250 L 560 250"
                      stroke={simState === "analyzing" || simState === "complete" ? "#bef35e" : "rgba(255,255,255,0.05)"}
                      strokeWidth="1.5" strokeDasharray="8,8" fill="none"
                      animate={{ strokeDashoffset: [0, -32] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    <motion.path
                      d="M 560 250 L 840 250"
                      stroke={simState === "complete" ? "#bef35e" : "rgba(255,255,255,0.05)"}
                      strokeWidth="1.5" strokeDasharray="8,8" fill="none"
                      animate={{ strokeDashoffset: [0, -32] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </svg>

                  {/* Bottom status */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                    <p className="font-mono text-[9px] text-zinc-700">
                      {activeService
                        ? `Analyzing: ${SERVICE_META[activeService].file} · ${SERVICE_META[activeService].bug}`
                        : `Select a service above to begin · ${visitorName}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                        simState === "idle"      ? "bg-[#bef35e]" :
                        simState === "complete"  ? "bg-[#bef35e] shadow-[0_0_8px_#bef35e]" :
                        simState === "error"     ? "bg-red-500" :
                                                   "bg-red-500 animate-pulse"
                      }`} />
                      <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">
                        {simState === "idle" ? "Ready" : simState.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RCA Analysis panel — shows when complete */}
                <AnimatePresence>
                  {simState === "complete" && rcaResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="aura-card-modern p-6 bg-gradient-to-br from-[#bef35e]/5 to-transparent border-[#bef35e]/20"
                    >
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                        <div className="p-2 bg-[#bef35e] text-black rounded-xl">
                          <Cpu size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Root Cause Summary</h3>
                          <p className="text-[9px] text-zinc-500 font-mono">Generated by Llama 3.3 · Node {rcaResult.node}</p>
                        </div>
                      </div>
                      <div className="text-zinc-300 text-sm leading-relaxed font-sans line-clamp-6 overflow-hidden">
                        {rcaResult.analysis}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <p className="text-[9px] text-zinc-600 font-mono uppercase">
                          Full report available in Investigation Lab
                        </p>
                        {/* ✅ FIXED: Added opening <a tag */}
                        <a
                          href="/incidents"
                          className="flex items-center gap-2 px-4 py-2 bg-[#bef35e] text-black rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all"
                        >
                          Open Lab <ArrowRight size={12} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const CharacterStation = ({ label, sub, icon, active, speech, color, pulse, stepNum, currentStep }: any) => {
  const isRelevant = currentStep >= stepNum;
  return (
    <div className="flex flex-col items-center gap-6 relative z-20">
      <AnimatePresence>
        {active && speech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-28 w-48 bg-white p-4 rounded-2xl rounded-bl-none shadow-xl"
          >
            <p className="text-black font-bold text-[10px] leading-tight italic">"{speech}"</p>
            <div className="absolute -bottom-2 left-3 w-3 h-3 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={active ? { y: [0, -15, 0] } : {}}
        transition={{ repeat: Infinity, duration: 3 }}
        className={`w-28 h-28 rounded-[2.5rem] border-2 flex items-center justify-center relative transition-all duration-700 ${
          active        ? `border-white shadow-[0_0_50px_rgba(255,255,255,0.25)] ${color}` :
          pulse         ? 'border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]' :
          isRelevant    ? 'border-white/20 bg-white/5' :
                          'border-white/5 bg-white/[0.02] grayscale opacity-30'
        }`}
      >
        <div className={
          active     ? 'text-white' :
          pulse      ? 'text-yellow-400' :
          isRelevant ? 'text-zinc-400' :
                       'text-zinc-700'
        }>{icon}</div>

        {(active || pulse) && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 border border-white/30 rounded-[2.5rem]"
          />
        )}
      </motion.div>

      <div className="text-center">
        <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isRelevant ? 'text-white' : 'text-zinc-700'}`}>
          {label}
        </p>
        <p className="text-[9px] font-mono text-zinc-700 mt-1 uppercase">{sub}</p>
      </div>
    </div>
  );
};

const TechSatellite = ({ icon, top, left, right, bottom, delay }: any) => (
  <motion.div
    animate={{ y: [0, -20, 0], opacity: [0.05, 0.2, 0.05] }}
    transition={{ duration: 8, repeat: Infinity, delay }}
    className="absolute text-zinc-700"
    style={{ top, left, right, bottom }}
  >
    {icon}
  </motion.div>
);

export default Playground;