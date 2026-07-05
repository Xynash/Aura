import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Cpu, Code, Terminal, CheckCircle,
  Search, Database, Zap, Activity, Globe, Play,
  Shield, User, Building2, ChevronRight, Fingerprint, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackVisitor } from '../lib/supabase';

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'aura_visitor_v1';

const techStack = [
  { name: "Kubernetes",   icon: <Database size={14}/> },
  { name: "Apache Kafka", icon: <Zap size={14}/> },
  { name: "Llama 3 AI",  icon: <Cpu size={14}/> },
  { name: "Java 21",     icon: <Code size={14}/> },
  { name: "AST Engine",  icon: <Terminal size={14}/> },
  { name: "Fabric8",     icon: <Globe size={14}/> },
  { name: "Spring Boot", icon: <Activity size={14}/> }
];

const ROLES = [
  "Software Engineer",
  "DevOps / SRE",
  "Engineering Manager",
  "Recruiter / HR",
  "Student",
  "Researcher",
  "Other"
];

// ── Visitor Gate ──────────────────────────────────────────────────────────────
const VisitorGate = ({
  onClearance,
  onSkip,
}: {
  onClearance: (token: string, name: string) => void;
  onSkip: () => void;
}) => {
  const [name,     setName]     = useState('');
  const [role,     setRole]     = useState('');
  const [company,  setCompany]  = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !role) return;
    setScanning(true);

    const token = `AURA-${name.replace(/\s+/g, '').toUpperCase().slice(0,4)}-${Date.now().toString(36).toUpperCase()}`;

    // Save to localStorage first — instant, no network dependency
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token, name, role, company, skipped: false, ts: Date.now()
    }));

    // Track in Supabase (non-blocking)
    trackVisitor({ name, role, company, token, skipped: false });

    await new Promise(r => setTimeout(r, 2000));
    onClearance(token, name);
  };

  const handleSkip = () => {
    // Store in localStorage so skip is remembered forever too
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: null, name: null, role: null, company: null,
      skipped: true, ts: Date.now()
    }));

    // Track skip in Supabase
    trackVisitor({ skipped: true });

    onSkip();
  };

  if (scanning) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center gap-8"
      >
        <div className="galactic-bg" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-2 border-[#bef35e] rounded-full"
        />
        <div className="text-center space-y-3">
          <p className="text-[#bef35e] font-black uppercase tracking-[0.4em] text-sm animate-pulse">
            Generating_Clearance_Token
          </p>
          <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
            Verifying identity matrix...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur flex items-center justify-center px-6"
    >
      <div className="galactic-bg" />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
      >
        Skip <X size={14} />
      </button>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-12 bg-[#bef35e] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(190,243,94,0.4)]">
              <Activity size={24} className="text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">Aura</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#bef35e]/30 bg-[#bef35e]/5 mb-5">
            <Fingerprint size={12} className="text-[#bef35e]" />
            <span className="text-[#bef35e] font-mono text-[10px] uppercase tracking-widest">
              Security Clearance Required
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic mb-2">
            Identify Yourself
          </h2>
          <p className="text-zinc-500 text-sm font-mono">
            Personalise your experience — completely optional.
          </p>
        </div>

        {/* Form */}
        <div className="aura-card-modern p-8 space-y-5 border-white/10 bg-black/60 backdrop-blur">

          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <User size={10} /> Operator Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-[#bef35e] outline-none transition-all placeholder:text-zinc-700 font-mono"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <Shield size={10} /> Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all text-left ${
                    role === r
                      ? 'border-[#bef35e] bg-[#bef35e]/10 text-[#bef35e]'
                      : 'border-white/10 bg-white/5 text-zinc-500 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <Building2 size={10} /> Company / Institution
              <span className="text-zinc-700 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Where do you work or study?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-[#bef35e] outline-none transition-all placeholder:text-zinc-700 font-mono"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !role}
            className="w-full bg-[#bef35e] text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(190,243,94,0.2)] hover:scale-[1.02] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Request Clearance <ChevronRight size={16} />
          </button>

          <p className="text-center text-[9px] text-zinc-700 font-mono leading-relaxed">
            This information personalises your experience and is stored securely.<br/>
            Nothing is sold or shared. Ever.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Clearance Badge ────────────────────────────────────────────────────────────
const ClearanceBadge = ({ token, name }: { token: string; name: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-black/80 border border-[#bef35e]/20 rounded-2xl px-4 py-3 backdrop-blur"
  >
    <div className="w-6 h-6 bg-[#bef35e] rounded-lg flex items-center justify-center">
      <Fingerprint size={12} className="text-black" />
    </div>
    <div>
      <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Cleared: {name}</p>
      <p className="text-[8px] text-[#bef35e] font-mono">{token}</p>
    </div>
  </motion.div>
);

// ── Landing Page ───────────────────────────────────────────────────────────────
const Landing = ({ setSystemStatus, systemStatus }: any) => {
  const navigate = useNavigate();

  const [showGate,       setShowGate]       = useState(false);
  const [clearanceToken, setClearanceToken] = useState('');
  const [visitorName,    setVisitorName]    = useState('');

  // ── Check localStorage on mount ───────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Already visited — never show gate again
        const data = JSON.parse(stored);
        if (data.token) {
          setClearanceToken(data.token);
          setVisitorName(data.name || '');
        }
        // skipped = true → no badge, no gate, just land
        return;
      }
    } catch { /* corrupt storage — ignore */ }

    // First time visitor — show gate after short delay
    const t = setTimeout(() => setShowGate(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleClearance = (token: string, name: string) => {
    setClearanceToken(token);
    setVisitorName(name);
    setShowGate(false);
  };

  const handleSkip = () => {
    setShowGate(false);
  };

  // ── Launch engine ─────────────────────────────────────────────────────────
  const launchEngine = async () => {
    setSystemStatus('initializing');
    try {
      const response = await fetch("https://aura-backend-33nm.onrender.com/health");
      if (response.ok) {
        setTimeout(() => {
          setSystemStatus('active');
          navigate('/dashboard');
        }, 3000);
      } else throw new Error();
    } catch {
      setSystemStatus('offline');
      setTimeout(() => setSystemStatus('idle'), 4000);
    }
  };

  const scrollToSpecs = () => {
    document.getElementById('system-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Initializing screen ───────────────────────────────────────────────────
  if (systemStatus === 'initializing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] relative">
        <div className="galactic-bg" />
        <div className="relative w-48 h-48 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-b-2 border-[#bef35e] rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={40} className="text-[#bef35e] animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter animate-pulse">
          {visitorName
            ? `Welcome, ${visitorName}. Initializing_Aura...`
            : 'Initializing_Aura_Orchestrator'}
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] mt-4 uppercase tracking-[0.5em]">
          Binding_Nodes // Handshaking_Python_Core
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">

      {/* Visitor Gate — only for first-time visitors */}
      <AnimatePresence>
        {showGate && (
          <VisitorGate
            onClearance={handleClearance}
            onSkip={handleSkip}
          />
        )}
      </AnimatePresence>

      {/* Clearance badge — only if they filled the form */}
      {clearanceToken && visitorName && (
        <ClearanceBadge token={clearanceToken} name={visitorName} />
      )}

      <div className="galactic-bg" />

      {/* ── HERO ── */}
      <section className="pt-56 pb-32 max-w-7xl mx-auto px-10 grid grid-cols-12 gap-16 items-center">
        <div className="col-span-12 lg:col-span-7">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#bef35e] font-bold text-xs uppercase tracking-[0.4em] mb-6">
            Source-Aware AIOps Infrastructure
          </motion.p>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
            The Context Gap <br />
            <span className="text-zinc-700 italic">Closed Forever.</span>
          </h1>
          <p className="text-zinc-400 max-w-lg text-xl leading-relaxed mb-12">
            Automate Root Cause Analysis by bridging Kubernetes infrastructure
            events to your application source logic instantly.
          </p>

          {/* Personalised greeting */}
          {visitorName && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-zinc-500 font-mono text-xs mb-6 uppercase tracking-widest"
            >
              Welcome back, <span className="text-[#bef35e]">{visitorName}</span>
            </motion.p>
          )}

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={launchEngine}
              className="bg-[#bef35e] text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:shadow-[0_0_30px_rgba(190,243,94,0.3)] transition-all"
            >
              Launch Engine <ArrowRight size={18} />
            </button>
            <button
              onClick={scrollToSpecs}
              className="bg-white/5 border border-white/10 px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest text-white hover:bg-white/10 transition-all"
            >
              View Specs
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex justify-center">
          <div className="relative w-[450px] h-[450px] aura-card flex items-center justify-center overflow-hidden">
            <div className="radar-sweep" />
            <div className="relative z-10 w-20 h-20 bg-[#bef35e] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(190,243,94,0.4)]">
              <Activity size={32} className="text-black" />
            </div>
            <div className="absolute w-40 h-40 border border-dashed border-white/10 rounded-full" />
            <div className="absolute w-64 h-64 border border-dashed border-white/10 rounded-full" />
            <Planet radius={80}  speed={10}  icon={<Database size={16} className="text-blue-400" />} />
            <Planet radius={128} speed={15}  icon={<Zap size={16} className="text-orange-400" />} />
            <Planet radius={128} speed={15}  delay={7.5} icon={<Cpu size={16} className="text-purple-400" />} />
            <Planet radius={180} speed={25}  icon={<Code size={16} className="text-[#bef35e]" />} />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="w-full border-y border-white/5 bg-white/[0.01] py-10 overflow-hidden mb-32">
        <div className="animate-marquee">
          {[...techStack, ...techStack, ...techStack].map((tech, i) => (
            <div key={i} className="flex items-center gap-4 mx-16">
              <div className="text-[#bef35e]">{tech.icon}</div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap italic">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-10 py-32 border-b border-white/5">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black tracking-tighter mb-4 text-white">How it Works</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold italic">
            Autonomous Remediation Lifecycle
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Step num="01" icon={<Search />}      title="Detect"  desc="K8s watcher streams real V1Events — no polling, no button." />
          <Step num="02" icon={<Terminal />}     title="Extract" desc="Java AST parser finds the exact failing method in source code." />
          <Step num="03" icon={<Cpu />}          title="Reason"  desc="Llama 3.3 70B analyzes code + crash log for root cause." />
          <Step num="04" icon={<CheckCircle />}  title="Heal"    desc="GitHub PR created automatically. Engineer reviews and merges." />
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section id="system-demo" className="max-w-7xl mx-auto px-10 py-32 mb-40">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black tracking-tighter mb-4 text-white">
            System Architecture & Demo
          </h2>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">
            Technical walkthrough of Aura's core engine
          </p>
        </div>
        <div className="aura-card w-full aspect-video rounded-[3rem] overflow-hidden relative group cursor-pointer border-white/10 bg-black/60 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#bef35e]/5 to-transparent opacity-50" />
          <div className="z-10 flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-[#bef35e] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(190,243,94,0.3)] group-hover:scale-110 transition-transform duration-500">
              <Play size={40} className="text-black ml-2" />
            </div>
            <div className="text-center">
              <p className="text-white font-black uppercase tracking-[0.3em] text-xs mb-2">
                Initialize System Walkthrough
              </p>
              <p className="text-zinc-500 font-mono text-[10px]">
                AURA_CORE_WALKTHROUGH.MP4 // Demo Coming Soon
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────
const Planet = ({ radius, speed, icon, delay = 0 }: any) => (
  <motion.div
    style={{ position: 'absolute' }}
    animate={{ rotate: 360 }}
    transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: -delay }}
  >
    <div style={{ transform: `translateX(${radius}px)` }}>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: -delay }}
        className="p-3 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md"
      >
        {icon}
      </motion.div>
    </div>
  </motion.div>
);

const Step = ({ num, icon, title, desc }: any) => (
  <div className="aura-card p-10 group transition-all hover:bg-white/[0.04]">
    <div className="flex justify-between items-start mb-10">
      <div className="w-12 h-12 bg-[#bef35e]/10 text-[#bef35e] rounded-xl flex items-center justify-center group-hover:bg-[#bef35e] group-hover:text-black transition-all">
        {icon}
      </div>
      <span className="text-2xl font-black text-white/5 italic">{num}</span>
    </div>
    <h4 className="text-xl font-bold mb-3 uppercase tracking-tighter text-white">{title}</h4>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;