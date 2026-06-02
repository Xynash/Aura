import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Code, Database,
  ShieldCheck, Terminal, Binoculars,
  Orbit, Target, FileCode, AlertCircle,
  Share2, Waypoints, CheckCircle2,
  Loader2, Radio, XCircle
} from 'lucide-react';
import { useAuraSocket } from '../hooks/useAuraSocket';

type SimService = "auth-gateway" | "payment-api" | "inventory-node";

const SERVICE_META: Record<SimService, { label: string; file: string; bug: string; color: string }> = {
  "auth-gateway":   { label: "Auth Gateway",    file: "AuthService.java",     bug: "NullPointerException on token.equals()",      color: "red"    },
  "payment-api":    { label: "Payment API",     file: "PaymentService.java",  bug: "ArithmeticException: division by zero",       color: "orange" },
  "inventory-node": { label: "Inventory Node",  file: "InventoryService.java", bug: "NullPointerException on HashMap unboxing",   color: "indigo" },
};

const Playground = () => {
  const [isIntro,        setIsIntro]        = useState(true);
  const [simState,       setSimState]       = useState<"idle"|"simulating"|"analyzing"|"complete">("idle");
  const [activeService,  setActiveService]  = useState<SimService | null>(null);
  const [activeSpeaker,  setActiveSpeaker]  = useState<string | null>(null);
  const [speech,         setSpeech]         = useState("");
  const [rcaResult,      setRcaResult]      = useState<any>(null);
  const [simError,       setSimError]       = useState<string | null>(null);
  const [starCount]                         = useState([...Array(50)]);

  // ── Cinematic intro ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setIsIntro(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // ── WebSocket — receive real RCA from watcher ─────────────────────────────
  useAuraSocket((event: any) => {
    if (event.type === "incident_detected" && simState === "simulating") {
      setSimState("analyzing");
      setActiveSpeaker("watcher");
      setSpeech(`ALERT: Pod ${event.pod} down. Reason: ${event.reason}`);
    }

    if (event.type === "rca_complete" && simState === "analyzing") {
      setRcaResult({
        pod:       event.pod,
        analysis:  event.root_cause_analysis,
        file:      event.source_file,
        method:    event.method,
        node:      event.active_node,
      });
      setSimState("complete");
      setActiveSpeaker("oracle");
      setSpeech(`Analysis complete via ${event.active_node}. Source: ${event.source_file}`);

      // Auto-reset speaker after 4s
      setTimeout(() => {
        setActiveSpeaker("shield");
        setSpeech("QA validation passed. System stabilized.");
        setTimeout(() => {
          setActiveSpeaker(null);
          setSpeech("");
        }, 3000);
      }, 4000);
    }
  });

  // ── Trigger real simulation via backend ───────────────────────────────────
  const startChaos = async (service: SimService) => {
    if (simState === "simulating" || simState === "analyzing") return;

    setActiveService(service);
    setSimState("simulating");
    setRcaResult(null);
    setSimError(null);
    setActiveSpeaker("watcher");
    setSpeech(`Injecting fault into ${SERVICE_META[service].label}...`);

    try {
      const res  = await fetch(`http://localhost:8000/simulate/${service}`, { method: "POST" });
      const data = await res.json();

      if (data.status !== "simulation_started") {
        throw new Error(data.detail || "Unknown error");
      }
      // WebSocket will fire the rest of the flow
    } catch (e: any) {
      setSimError(e.message || "Backend unreachable");
      setSimState("idle");
      setActiveSpeaker(null);
    }
  };

  const resetSim = () => {
    setSimState("idle");
    setActiveService(null);
    setActiveSpeaker(null);
    setSpeech("");
    setRcaResult(null);
    setSimError(null);
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
          /* Cinematic intro — unchanged */
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
              transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
              className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.8em] mt-8"
            >
              Establishing_Neural_Sync
            </motion.p>
          </motion.div>
        ) : (

          <motion.div
            key="playground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="pt-32 px-10 pb-20 max-w-[1700px] mx-auto relative z-10"
          >
            {/* Header */}
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
                <p>AI_Model: Llama_3.3_70B</p>
                <p>Pipeline: Real_AI_Active</p>
                <p className={simState === "idle" ? "text-[#bef35e]" : "text-red-400 animate-pulse"}>
                  Status: {simState === "idle" ? "Ready" : simState.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 items-start">

              {/* LEFT: Controls */}
              <div className="col-span-12 lg:col-span-3 space-y-6">

                {/* Chaos buttons */}
                <div className="aura-card-modern p-8 bg-black/60 border-white/10">
                  <h3 className="text-[10px] font-black text-[#bef35e] uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                    <Target size={14} /> Chaos_Infection_Vectors
                  </h3>
                  <div className="space-y-4">
                    {(Object.keys(SERVICE_META) as SimService[]).map((svc) => {
                      const meta    = SERVICE_META[svc];
                      const isActive = activeService === svc && simState !== "idle";
                      return (
                        <ChaosButton
                          key={svc}
                          label={meta.label}
                          sublabel={meta.bug}
                          icon={svc === "auth-gateway" ? <Zap /> : svc === "payment-api" ? <FileCode /> : <AlertCircle />}
                          active={isActive}
                          disabled={simState === "simulating" || simState === "analyzing"}
                          onClick={() => startChaos(svc)}
                        />
                      );
                    })}
                  </div>
                  {simState !== "idle" && (
                    <button
                      onClick={resetSim}
                      className="w-full mt-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                    >
                      Reset_Simulation
                    </button>
                  )}
                </div>

                {/* Live terminal */}
                <div className="aura-card-modern p-6 bg-black/80 font-mono text-[9px] text-zinc-600 border-white/5 min-h-[200px] flex flex-col">
                  <p className="mb-4 text-[#bef35e]/40 tracking-widest uppercase flex items-center gap-2">
                    <Radio size={10} className={simState !== "idle" ? "animate-pulse text-red-400" : ""} />
                    Subspace_Live_Logs
                  </p>
                  <div className="space-y-2 flex-1">
                    <p>{'>'} AIOps Handshake: OK</p>
                    <p>{'>'} Llama 3.3 Node: ONLINE</p>
                    <p>{'>'} WebSocket: CONNECTED</p>
                    {activeService && (
                      <motion.p initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-orange-400">
                        {'>'} Target: {SERVICE_META[activeService].file}
                      </motion.p>
                    )}
                    {simState === "simulating" && (
                      <motion.p initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-red-500 font-bold">
                        {'>'} FAULT_INJECTED: {activeService}
                      </motion.p>
                    )}
                    {simState === "analyzing" && (
                      <motion.p initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-yellow-400">
                        {'>'} Neural_Cycles: RUNNING...
                      </motion.p>
                    )}
                    {simState === "complete" && (
                      <motion.p initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-[#bef35e] font-bold">
                        {'>'} RCA_COMPLETE: SYSTEM_STABLE
                      </motion.p>
                    )}
                    {simError && (
                      <p className="text-red-400">{'>'} ERROR: {simError}</p>
                    )}
                  </div>
                </div>

                {/* RCA Result card — appears after complete */}
                <AnimatePresence>
                  {simState === "complete" && rcaResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="aura-card-modern p-6 bg-[#bef35e]/5 border-[#bef35e]/20 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#bef35e]" />
                        <span className="text-[10px] font-black uppercase text-[#bef35e] tracking-widest">RCA_Complete</span>
                      </div>
                      <div className="space-y-1 font-mono text-[9px] text-zinc-500">
                        <p>Pod: <span className="text-white">{rcaResult.pod}</span></p>
                        <p>File: <span className="text-[#bef35e]">{rcaResult.file}</span></p>
                        <p>Method: <span className="text-indigo-400">{rcaResult.method}</span></p>
                        <p>Node: <span className="text-purple-400">{rcaResult.node}</span></p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* CENTER: Space station canvas */}
              <div className="col-span-12 lg:col-span-9 aura-card-modern min-h-[650px] bg-black/40 border-white/5 relative flex items-center justify-around overflow-hidden">
                <div className="absolute inset-0 bg-digital-mesh opacity-5 pointer-events-none" />

                {/* Satellites */}
                <TechSatellite icon={<Database />} top="15%" left="10%" delay={0} />
                <TechSatellite icon={<Code />}     top="75%" left="15%" delay={1} />
                <TechSatellite icon={<Share2 />}   top="20%" right="15%" delay={2} />
                <TechSatellite icon={<Waypoints />} bottom="20%" right="20%" delay={3} />

                {/* Characters */}
                <CharacterStation
                  id="watcher" label="Watcher_Station" sub="K8s_Observer"
                  icon={<Binoculars size={32} />}
                  active={activeSpeaker === 'watcher'}
                  speech={speech} color="bg-blue-600"
                  pulse={simState === "simulating"}
                />
                <CharacterStation
                  id="oracle" label="Oracle_Core" sub="AI_Intelligence"
                  icon={<Cpu size={32} />}
                  active={activeSpeaker === 'oracle'}
                  speech={speech} color="bg-purple-600"
                  pulse={simState === "analyzing"}
                />
                <CharacterStation
                  id="shield" label="Shield_Elite" sub="QA_Security"
                  icon={<ShieldCheck size={32} />}
                  active={activeSpeaker === 'shield'}
                  speech={speech} color="bg-[#bef35e]"
                  pulse={simState === "complete"}
                />

                {/* Neural paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                  <motion.path
                    d="M 300 325 L 700 325"
                    stroke={simState !== "idle" ? "#bef35e" : "white"}
                    strokeWidth="2" strokeDasharray="10,10" fill="none"
                    animate={{ strokeDashoffset: [0, -40] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  <motion.path
                    d="M 700 325 L 1100 325"
                    stroke={simState === "complete" ? "#bef35e" : "white"}
                    strokeWidth="2" strokeDasharray="10,10" fill="none"
                    animate={{ strokeDashoffset: [0, -40] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </svg>

                {/* Status footer */}
                <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center">
                  <div className="font-mono text-[9px] text-zinc-700">
                    {activeService
                      ? `Target: ${SERVICE_META[activeService].file} · Bug: ${SERVICE_META[activeService].bug}`
                      : "Select a service to inject fault"
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${simState === "idle" ? "bg-[#bef35e]" : "bg-red-500 animate-pulse"} shadow-[0_0_10px_currentColor]`} />
                    <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">
                      {simState === "idle" ? "Neural_Sync_Active" : simState.toUpperCase()}
                    </span>
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

// ── Sub-components ────────────────────────────────────────────────────────────

const CharacterStation = ({ label, sub, icon, active, speech, color, pulse }: any) => (
  <div className="flex flex-col items-center gap-10 relative z-20">
    <AnimatePresence>
      {active && speech && (
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
      animate={active ? { y: [0, -20, 0], rotate: [0, 5, -5, 0] } : {}}
      transition={{ repeat: Infinity, duration: 4 }}
      className={`w-36 h-36 rounded-[3rem] border-2 flex items-center justify-center relative transition-all duration-700 ${
        active   ? `border-white shadow-[0_0_60px_rgba(255,255,255,0.3)] ${color}` :
        pulse    ? `border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.3)]` :
                   'border-white/10 bg-white/5 grayscale opacity-40'
      }`}
    >
      <div className={active ? 'text-white' : pulse ? 'text-yellow-400' : 'text-zinc-600'}>{icon}</div>
      {(active || pulse) && (
        <motion.div
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 border border-white rounded-[3rem]"
        />
      )}
    </motion.div>

    <div className="text-center">
      <p className={`text-[12px] font-black uppercase tracking-[0.3em] ${active || pulse ? 'text-white' : 'text-zinc-700'}`}>{label}</p>
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

const ChaosButton = ({ label, sublabel, icon, active, disabled, onClick }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4 group ${
      active    ? 'border-red-500/50 bg-red-500/10'  :
      disabled  ? 'border-white/5 opacity-40 cursor-not-allowed' :
                  'border-white/5 bg-white/5 hover:border-white/20'
    }`}
  >
    <div className={`p-3 rounded-2xl bg-black/40 ${active ? 'text-red-400' : 'text-zinc-500 group-hover:text-white transition-colors'}`}>
      {icon}
    </div>
    <div className="text-left">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white">{label}</p>
      <p className="text-[8px] font-mono text-zinc-700 mt-1 uppercase">{sublabel}</p>
    </div>
    {active && <Loader2 size={12} className="ml-auto text-red-400 animate-spin" />}
  </button>
);

export default Playground;