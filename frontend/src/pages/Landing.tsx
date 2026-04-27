import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Cpu, Code, Terminal, CheckCircle, 
  Search, Database, Zap, Activity, Globe, Play, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const techStack = [
  { name: "Kubernetes", icon: <Database size={14}/> },
  { name: "Apache Kafka", icon: <Zap size={14}/> },
  { name: "Llama 3 AI", icon: <Cpu size={14}/> },
  { name: "Java 21", icon: <Code size={14}/> },
  { name: "AST Engine", icon: <Terminal size={14}/> },
  { name: "Fabric8", icon: <Globe size={14}/> },
  { name: "Spring Boot", icon: <Activity size={14}/> }
];

const Landing = ({ setSystemStatus, systemStatus }: any) => {
  const navigate = useNavigate();

  const launchEngine = async () => {
    setSystemStatus('initializing');
    try {
      const response = await fetch("http://localhost:8000/health");
      if (response.ok) {
        setTimeout(() => {
          setSystemStatus('active');
          navigate('/dashboard');
        }, 3000);
      } else {
        throw new Error();
      }
    } catch (err) {
      setSystemStatus('offline');
      setTimeout(() => setSystemStatus('idle'), 4000);
    }
  };

  const scrollToSpecs = () => {
    document.getElementById('system-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter animate-pulse">Initializing_Aura_Orchestrator</h2>
        <p className="text-zinc-500 font-mono text-[10px] mt-4 uppercase tracking-[0.5em]">Binding_Nodes // Handshaking_Python_Core</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="galactic-bg" />
      
      <section className="pt-56 pb-32 max-w-7xl mx-auto px-10 grid grid-cols-12 gap-16 items-center">
        <div className="col-span-12 lg:col-span-7">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#bef35e] font-bold text-xs uppercase tracking-[0.4em] mb-6">
            Source-Aware AIOps Infrastructure
          </motion.p>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
            The Context Gap <br /> <span className="text-zinc-700 italic">Closed Forever.</span>
          </h1>
          <p className="text-zinc-400 max-w-lg text-xl leading-relaxed mb-12">
            Automate Root Cause Analysis by bridging Kubernetes infrastructure events 
            to your application source logic instantly.
          </p>
          <div className="flex gap-4">
            <button onClick={launchEngine} className="bg-[#bef35e] text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:shadow-[0_0_30px_rgba(190,243,94,0.3)] transition-all">
              Launch Engine <ArrowRight size={18} />
            </button>
            <button onClick={scrollToSpecs} className="bg-white/5 border border-white/10 px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest text-white hover:bg-white/10 transition-all">
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
              <div className="absolute w-88 h-88 border border-dashed border-white/10 rounded-full" />
              <Planet radius={80} speed={10} icon={<Database size={16} className="text-blue-400" />} />
              <Planet radius={128} speed={15} icon={<Zap size={16} className="text-orange-400" />} />
              <Planet radius={128} speed={15} delay={7.5} icon={<Cpu size={16} className="text-purple-400" />} />
              <Planet radius={180} speed={25} icon={<Code size={16} className="text-[#bef35e]" />} />
          </div>
        </div>
      </section>

      <div className="w-full border-y border-white/5 bg-white/[0.01] py-10 overflow-hidden mb-32">
        <div className="animate-marquee">
          {[...techStack, ...techStack, ...techStack].map((tech, i) => (
            <div key={i} className="flex items-center gap-4 mx-16">
              <div className="text-[#bef35e]">{tech.icon}</div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap italic">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-10 py-32 border-b border-white/5">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black tracking-tighter mb-4">How it Works</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold italic">Autonomous Remediation Lifecycle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Step num="01" icon={<Search />} title="Detect" desc="Fabric8 identifies K8s V1Events in real-time." />
          <Step num="02" icon={<Terminal />} title="Extract" desc="Clones repo and pinpoints logic via AST." />
          <Step num="03" icon={<Cpu />} title="Reason" desc="Llama 3 processes Log + Code context." />
          <Step num="04" icon={<CheckCircle />} title="QA Verify" desc="Automation validates patch safety." />
        </div>
      </section>

      <section id="system-demo" className="max-w-7xl mx-auto px-10 py-32 mb-40">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black tracking-tighter mb-4 text-white">System Architecture & Demo</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Technical walkthrough of Aura's core engine</p>
        </div>
        <div className="aura-card w-full aspect-video rounded-[3rem] overflow-hidden relative group cursor-pointer border-white/10 bg-black/60 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#bef35e]/5 to-transparent opacity-50" />
            <div className="z-10 flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-[#bef35e] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(190,243,94,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Play size={40} className="text-black ml-2" />
                </div>
                <div className="text-center">
                  <p className="text-white font-black uppercase tracking-[0.3em] text-xs mb-2">Initialize System Walkthrough</p>
                  <p className="text-zinc-500 font-mono text-[10px]">AURA_CORE_WALKTHROUGH.MP4 // 4K RESOLUTION</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

const Planet = ({ radius, speed, icon, delay = 0 }: any) => (
  <motion.div style={{ position: 'absolute' }} animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: -delay }}>
    <div style={{ transform: `translateX(${radius}px)` }}>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: -delay }} className="p-3 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
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
    <h4 className="text-xl font-bold mb-3 uppercase tracking-tighter">{title}</h4>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;