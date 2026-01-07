import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html, Line, Billboard, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import * as THREE from 'three';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

// --- Configuration ---
const COLORS = {
  background: '#121212',
  accent: '#E07A5F',     // Burnt Orange
  text: '#F4F1DE',       // Cream
};

const SECTIONS = [
  { id: 'about', label: 'ABOUT ME', dir: [1, 0.5, 0.8] },
  { id: 'projects', label: 'PROJECTS', dir: [-1, 0.8, 0.8] },
  { id: 'contact', label: 'CONTACT', dir: [0.2, -1, 0.5] },
];

// --- HUD COMPONENT (RESTORED COD STYLE) ---
function TerminalHeader({ visible }: { visible: boolean }) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toISOString().split('T')[1].split('.')[0] + " Z";
            const dateString = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase();
            setTime(`${dateString} :: ${timeString}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            // Fade out animation
            initial={{ opacity: 1 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-12 left-12 md:top-16 md:left-16 z-[50] pointer-events-none select-none"
        >
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}
            </style>

            <div style={{ fontFamily: '"Share Tech Mono", monospace' }}>
                <div 
                    style={{
                        backgroundColor: 'rgba(26, 27, 30, 0.85)', 
                        borderLeft: '3px solid #E07A5F',
                        padding: '12px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                        width: 'fit-content',
                        backdropFilter: 'blur(8px)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative'
                    }}
                >
                    {/* Corner Bracket (Top Right) */}
                    <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '10px', height: '10px', borderTop: '2px solid #E07A5F', borderRight: '2px solid #E07A5F' }} />
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-6 mb-2 border-b border-white/10 pb-1">
                        <span className="text-[#E07A5F] text-lg tracking-widest font-bold">
                            OP_OVERWATCH
                        </span>
                        <div className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
                             <span className="text-green-500 text-[10px] tracking-wider font-bold">LIVE</span>
                        </div>
                    </div>

                    {/* Data Row */}
                    <div className="text-[#F4F1DE] text-xs opacity-80 tracking-wider space-y-0.5">
                        <div className="flex justify-between gap-8">
                            <span className="text-gray-500">LOC</span> 
                            <span>34.05°N, 118.24°W</span>
                        </div>
                        <div className="flex justify-between gap-8">
                             <span className="text-gray-500">CLK</span> 
                             <span>{time}</span>
                        </div>
                    </div>

                    {/* Corner Bracket (Bottom Left) */}
                    <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '10px', height: '10px', borderBottom: '2px solid #E07A5F', borderLeft: '2px solid #E07A5F' }} />
                </div>
            </div>
        </motion.div>
    );
}

// --- 3D SCENE COMPONENTS ---
function EdgeNetwork({ activeSection, onSectionSelect }: { activeSection: string | null, onSectionSelect: (id: string | null) => void }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const SPHERE_RADIUS = 1.5;
  const LINE_LENGTH = 0.6; 

  const [sphere] = useState(() => random.inSphere(new Float32Array(4000), { radius: SPHERE_RADIUS }));

  useFrame((_state, _delta) => {
    const targetScale = activeSection ? 1.4 : 1;
    if (pointsRef.current) {
        pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.02);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={COLORS.accent} size={0.02} sizeAttenuation={true} depthWrite={false} />
      </Points>

      {!activeSection && SECTIONS.map((section) => {
        const direction = new THREE.Vector3(...(section.dir as [number, number, number])).normalize();
        const surfacePos = direction.clone().multiplyScalar(SPHERE_RADIUS);
        const labelPos = direction.clone().multiplyScalar(SPHERE_RADIUS + LINE_LENGTH);

        return (
            <group key={section.id}>
                <Line points={[surfacePos, labelPos]} color="white" transparent opacity={0.3} lineWidth={1} />
                <mesh position={surfacePos}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshBasicMaterial color={COLORS.accent} />
                </mesh>
                <Billboard position={labelPos}>
                    <Html transform distanceFactor={4} style={{ pointerEvents: 'none' }}>
                        <div 
                            className="cursor-pointer group"
                            style={{ pointerEvents: 'auto' }} 
                            onClick={(e) => { e.stopPropagation(); onSectionSelect(section.id); }}
                        >
                            <div className="flex items-center gap-3 transition-transform duration-300 group-hover:scale-110">
                                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
                                <span 
                                    className="text-[10px] font-mono text-white tracking-[0.2em] uppercase whitespace-nowrap group-hover:text-[#E07A5F] transition-colors"
                                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }} 
                                >
                                    {section.label}
                                </span>
                            </div>
                        </div>
                    </Html>
                </Billboard>
            </group>
        );
      })}
    </group>
  );
}

function CameraRig({ activeSection }: { activeSection: string | null }) {
    useFrame((state) => {
        const targetDistance = activeSection ? 1.5 : 3.5;
        const currentPos = state.camera.position.clone();
        const targetPos = currentPos.normalize().multiplyScalar(targetDistance);

        state.camera.position.lerp(targetPos, 0.02);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

// --- PANEL ANIMATION VARIANTS ---
const panelVariants: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200, delay: 0.6 }
  },
  exit: { 
    y: '100%',
    transition: { type: "spring", damping: 30, stiffness: 300, delay: 0 } 
  }
};

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

function ContentPanel({ activeSection, onClose }: { activeSection: string | null, onClose: () => void }) {
    return (
        <AnimatePresence mode="wait">
            {activeSection && (
                <>
                    {/* 1. DARK BACKDROP */}
                    <motion.div
                        key="backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-[2px]"
                    />

                    {/* 2. SLIDING TAB */}
                    <motion.div
                        key="panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ 
                            position: 'fixed', bottom: 0, left: 0, width: '100%', height: '90vh', zIndex: 9999, 
                            backgroundColor: '#181818', borderTop: '1px solid #E07A5F'
                        }}
                        className="shadow-2xl flex flex-col overflow-hidden rounded-t-3xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1f1f1f]">
                             <button onClick={onClose} className="flex items-center gap-2 text-[#E07A5F] hover:text-white transition-colors group cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                <span className="font-mono text-sm tracking-widest uppercase">Return to Orbit</span>
                             </button>
                             <h2 className="text-xl font-bold tracking-tighter text-[#F4F1DE] uppercase opacity-50 hidden md:block">
                                {activeSection} MODULE
                             </h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 text-gray-300">
                            <div className="max-w-5xl mx-auto">
                                {activeSection === 'about' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Architecting the <span className="text-[#E07A5F]">Invisible</span>.</h1>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                                                <h3 className="text-xl font-mono text-[#E07A5F] mb-4">01 // THE MISSION</h3>
                                                <p className="leading-relaxed">My focus is entirely on backend scalability. In esports, a 200ms delay isn't just a bug; it's a competitive disadvantage.</p>
                                            </div>
                                            <div className="p-6 border border-white/10 rounded-lg bg-white/5">
                                                <h3 className="text-xl font-mono text-[#E07A5F] mb-4">02 // THE STACK</h3>
                                                <ul className="grid grid-cols-2 gap-2 text-sm font-mono">
                                                    <li>• Go (Golang)</li>
                                                    <li>• Redis Cluster</li>
                                                    <li>• AWS Lambda</li>
                                                    <li>• Docker / K8s</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'projects' && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <h1 className="text-4xl font-bold text-white mb-8">System Deployments</h1>
                                        <div className="group border-l-2 border-[#E07A5F] pl-6 hover:bg-white/5 p-4 transition-colors">
                                            <h3 className="text-2xl font-bold text-white">Esports Data Lake</h3>
                                            <p className="text-gray-400">Ingesting 5TB of match data daily.</p>
                                        </div>
                                        <div className="group border-l-2 border-gray-700 hover:border-[#E07A5F] pl-6 hover:bg-white/5 p-4 transition-colors">
                                            <h3 className="text-2xl font-bold text-white">Real-Time Odds Engine</h3>
                                            <p className="text-gray-400">Sub-50ms latency engine for calculating win probabilities during live matches.</p>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'contact' && (
                                    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <h1 className="text-5xl font-bold text-white">Open Channel</h1>
                                        <button className="px-10 py-4 bg-[#E07A5F] text-black font-bold tracking-widest text-lg hover:scale-105 transition-transform cursor-pointer">
                                            INITIATE_EMAIL()
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function GlobeLanding() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: COLORS.background, position: 'relative' }}>
        
        {/* Pass visible prop to fade out when activeSection is set */}
        <TerminalHeader visible={activeSection === null} />

        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 3.5] }}>
                <fog attach="fog" args={[COLORS.background, 1, 6]} /> 
                <CameraRig activeSection={activeSection} />
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    autoRotate={!activeSection} 
                    autoRotateSpeed={0.5}
                    enabled={!activeSection} 
                />
                <EdgeNetwork activeSection={activeSection} onSectionSelect={setActiveSection} />
            </Canvas>
        </div>
        <ContentPanel activeSection={activeSection} onClose={() => setActiveSection(null)} />
    </div>
  );
}




////////


import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html, Line, Billboard, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import * as THREE from 'three';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

// --- Configuration ---
const COLORS = {
  background: '#121212',
  accent: '#E07A5F',     // Burnt Orange
  text: '#F4F1DE',       // Cream
};

const SECTIONS = [
  { id: 'about', label: 'ABOUT ME', dir: [1, 0.5, 0.8] },
  { id: 'projects', label: 'PROJECTS', dir: [-1, 0.8, 0.8] },
  { id: 'contact', label: 'CONTACT', dir: [0.2, -1, 0.5] },
];

// --- UI HELPERS ---
const TechBadge = ({ label }: { label: string }) => (
    <span className="px-2 py-1 text-[10px] font-mono border border-[#E07A5F]/30 bg-[#E07A5F]/10 text-[#E07A5F] rounded uppercase tracking-wider">
        {label}
    </span>
);

const StatBox = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div className="flex flex-col p-4 bg-white/5 border-l-2 border-[#E07A5F] hover:bg-white/10 transition-colors">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">{label}</span>
        <span className="text-2xl font-bold text-white font-mono">{value}</span>
        {sub && <span className="text-[10px] text-[#E07A5F] mt-1">{sub}</span>}
    </div>
);

// --- HUD COMPONENT (COD MW STYLE) ---
function TerminalHeader({ visible }: { visible: boolean }) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toISOString().split('T')[1].split('.')[0] + " Z";
            const dateString = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase();
            setTime(`${dateString} :: ${timeString}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            // HIGH Z-INDEX + DOM ORDER ensures this stays on top of labels
            className="absolute top-12 left-12 md:top-16 md:left-16 z-[5000] pointer-events-none select-none"
        >
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}
            </style>

            <div style={{ fontFamily: '"Share Tech Mono", monospace' }}>
                <div 
                    style={{
                        backgroundColor: 'rgba(26, 27, 30, 0.95)', 
                        borderLeft: '3px solid #E07A5F',
                        padding: '12px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
                        width: 'fit-content',
                        backdropFilter: 'blur(8px)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative'
                    }}
                >
                    {/* Decorative Corner Brackets */}
                    <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '10px', height: '10px', borderTop: '2px solid #E07A5F', borderRight: '2px solid #E07A5F' }} />
                    <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '10px', height: '10px', borderBottom: '2px solid #E07A5F', borderLeft: '2px solid #E07A5F' }} />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between gap-6 mb-2 border-b border-white/10 pb-1">
                        <span className="text-[#E07A5F] text-lg tracking-widest font-bold">
                            OP_OVERWATCH
                        </span>
                        <div className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
                             <span className="text-green-500 text-[10px] tracking-wider font-bold">LIVE</span>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="text-[#F4F1DE] text-xs opacity-80 tracking-wider space-y-0.5">
                        <div className="flex justify-between gap-8">
                            <span className="text-gray-500">LOC</span> 
                            <span>34.05°N, 118.24°W</span>
                        </div>
                        <div className="flex justify-between gap-8">
                             <span className="text-gray-500">CLK</span> 
                             <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- 3D SCENE ---
function EdgeNetwork({ activeSection, onSectionSelect }: { activeSection: string | null, onSectionSelect: (id: string | null) => void }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const SPHERE_RADIUS = 1.5;
  const LINE_LENGTH = 0.6; 

  const [sphere] = useState(() => random.inSphere(new Float32Array(4000), { radius: SPHERE_RADIUS }));

  useFrame((_state, _delta) => {
    const targetScale = activeSection ? 1.4 : 1;
    if (pointsRef.current) {
        pointsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.02);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={COLORS.accent} size={0.02} sizeAttenuation={true} depthWrite={false} />
      </Points>

      {!activeSection && SECTIONS.map((section) => {
        const direction = new THREE.Vector3(...(section.dir as [number, number, number])).normalize();
        const surfacePos = direction.clone().multiplyScalar(SPHERE_RADIUS);
        const labelPos = direction.clone().multiplyScalar(SPHERE_RADIUS + LINE_LENGTH);

        return (
            <group key={section.id}>
                <Line points={[surfacePos, labelPos]} color="white" transparent opacity={0.3} lineWidth={1} />
                <mesh position={surfacePos}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshBasicMaterial color={COLORS.accent} />
                </mesh>
                <Billboard position={labelPos}>
                    <Html 
                        transform 
                        distanceFactor={4} 
                        // LOW Z-INDEX ensures labels slide UNDER the HUD
                        zIndexRange={[10, 0]} 
                        style={{ pointerEvents: 'none' }}
                    >
                        <div 
                            className="cursor-pointer group"
                            style={{ pointerEvents: 'auto' }} 
                            onClick={(e) => { e.stopPropagation(); onSectionSelect(section.id); }}
                        >
                            <div className="flex items-center gap-3 transition-transform duration-300 group-hover:scale-110">
                                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
                                <span 
                                    className="text-[10px] font-mono text-white tracking-[0.2em] uppercase whitespace-nowrap group-hover:text-[#E07A5F] transition-colors"
                                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }} 
                                >
                                    {section.label}
                                </span>
                            </div>
                        </div>
                    </Html>
                </Billboard>
            </group>
        );
      })}
    </group>
  );
}

function CameraRig({ activeSection }: { activeSection: string | null }) {
    useFrame((state) => {
        const targetDistance = activeSection ? 1.5 : 3.5;
        const currentPos = state.camera.position.clone();
        const targetPos = currentPos.normalize().multiplyScalar(targetDistance);

        state.camera.position.lerp(targetPos, 0.02);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

// --- PANEL ANIMATION VARIANTS ---
const panelVariants: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200, delay: 0.6 }
  },
  exit: { 
    y: '100%',
    transition: { type: "spring", damping: 30, stiffness: 300, delay: 0 } 
  }
};

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

// --- CONTENT PANEL ---
function ContentPanel({ activeSection, onClose }: { activeSection: string | null, onClose: () => void }) {
    return (
        <AnimatePresence mode="wait">
            {activeSection && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        key="backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-[2px]"
                    />

                    {/* SLIDING PANEL */}
                    <motion.div
                        key="panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ 
                            position: 'fixed', bottom: 0, left: 0, width: '100%', height: '85vh', zIndex: 9999, 
                            backgroundColor: '#111', 
                            borderTop: '2px solid #E07A5F'
                        }}
                        className="shadow-2xl flex flex-col overflow-hidden rounded-t-3xl"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#161616]">
                             <button onClick={onClose} className="flex items-center gap-2 text-[#E07A5F] hover:text-white transition-colors group cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                <span className="font-mono text-xs tracking-[0.2em] uppercase">ABORT_VIEW</span>
                             </button>
                             <div className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 bg-[#E07A5F] rounded-full animate-pulse" />
                                 <h2 className="text-lg font-bold tracking-[0.2em] text-[#F4F1DE] uppercase opacity-80 hidden md:block font-mono">
                                    // {activeSection}
                                 </h2>
                             </div>
                        </div>
                        
                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-12 text-gray-300 font-sans">
                            <div className="max-w-4xl mx-auto">
                                
                                {/* --- ABOUT SECTION --- */}
                                {activeSection === 'about' && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        
                                        <div className="border-b border-white/10 pb-8">
                                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tighter">
                                                Operator <span className="text-[#E07A5F]">Dossier</span>
                                            </h1>
                                            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                                                Specialized in high-concurrency backend architecture for competitive esports. 
                                                Currently executing a <span className="text-white font-bold">6-week sprint</span> to build a production-grade analysis platform from zero.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <StatBox label="Class" value="Architect" />
                                            <StatBox label="Stack" value="Golang" sub="v1.21+" />
                                            <StatBox label="Latency" value="<50ms" sub="Global" />
                                            <StatBox label="Cloud Cost" value="$0.00" sub="Serverless First" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-6 bg-white/5 rounded border border-white/5">
                                                <h3 className="text-[#E07A5F] font-mono tracking-widest mb-4 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-[#E07A5F]" /> OBJECTIVE
                                                </h3>
                                                <p className="text-sm leading-7 text-gray-400">
                                                    My mission is to balance complex real-time engineering with a ruthless cost strategy. 
                                                    I don't just write code; I design systems that scale to millions of events while keeping the monthly bill near zero.
                                                </p>
                                            </div>
                                            <div className="p-6 bg-white/5 rounded border border-white/5">
                                                <h3 className="text-[#E07A5F] font-mono tracking-widest mb-4 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-[#E07A5F]" /> ARSENAL
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Golang', 'AWS Lambda', 'Redis Cluster', 'Docker', 'K8s', 'Terraform', 'gRPC', 'Postgres'].map(tech => (
                                                        <TechBadge key={tech} label={tech} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- PROJECTS SECTION --- */}
                                {activeSection === 'projects' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-end justify-between border-b border-white/10 pb-6">
                                            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">
                                                Mission <span className="text-[#E07A5F]">Logs</span>
                                            </h1>
                                            <span className="font-mono text-xs text-[#E07A5F] hidden md:block">STATUS: CLASSIFIED</span>
                                        </div>

                                        <div className="group relative p-6 bg-white/5 border border-white/10 hover:border-[#E07A5F] transition-all duration-300">
                                            <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs text-gray-500">ID: DL-01</div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Esports Data Lake</h3>
                                            <p className="text-gray-400 mb-6 max-w-xl">
                                                A high-throughput ingestion pipeline processing 5TB of match data daily. 
                                                Utilizes serverless architecture to normalize disparate data sources into a unified queryable format.
                                            </p>
                                            <div className="flex flex-wrap gap-3 mb-6">
                                                <TechBadge label="AWS S3" />
                                                <TechBadge label="Athena" />
                                                <TechBadge label="Kinesis" />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Volume</div>
                                                    <div className="text-white font-mono">5TB/Day</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Cost</div>
                                                    <div className="text-white font-mono">-$40%</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group relative p-6 bg-white/5 border border-white/10 hover:border-[#E07A5F] transition-all duration-300">
                                            <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs text-gray-500">ID: OE-99</div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Real-Time Odds Engine</h3>
                                            <p className="text-gray-400 mb-6 max-w-xl">
                                                Sub-50ms latency engine for calculating win probabilities during live matches. 
                                                Uses in-memory caching and optimized Go routines to handle concurrent probability modeling.
                                            </p>
                                            <div className="flex flex-wrap gap-3 mb-6">
                                                <TechBadge label="Golang" />
                                                <TechBadge label="Redis" />
                                                <TechBadge label="WebSockets" />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Latency</div>
                                                    <div className="text-[#E07A5F] font-mono">42ms</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase">Uptime</div>
                                                    <div className="text-white font-mono">99.99%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- CONTACT SECTION --- */}
                                {activeSection === 'contact' && (
                                    <div className="h-full flex flex-col justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-12">
                                        <h1 className="text-5xl font-bold text-white mb-8 uppercase tracking-tighter text-center">
                                            Establish <span className="text-[#E07A5F]">Uplink</span>
                                        </h1>
                                        <p className="text-gray-400 text-center max-w-md mb-12">
                                            Secure channels are open. Ready to discuss high-performance architecture, 
                                            esports analysis, or serverless deployments.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                                            <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-[#E07A5F] hover:text-black hover:border-[#E07A5F] transition-all group">
                                                <span className="font-mono uppercase tracking-widest text-sm">Email_Protocol</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                            </button>
                                            <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-[#E07A5F] hover:text-black hover:border-[#E07A5F] transition-all group">
                                                <span className="font-mono uppercase tracking-widest text-sm">GitHub_Repo</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                            </button>
                                            <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-[#E07A5F] hover:text-black hover:border-[#E07A5F] transition-all group">
                                                <span className="font-mono uppercase tracking-widest text-sm">LinkedIn_Feed</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                            </button>
                                            <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-[#E07A5F] hover:text-black hover:border-[#E07A5F] transition-all group">
                                                <span className="font-mono uppercase tracking-widest text-sm">Resume_Download</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// --- MAIN ASSEMBLY ---
export default function GlobeLanding() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: COLORS.background, position: 'relative' }}>
        
        {/* CANVAS (Level 0) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 3.5] }}>
                <fog attach="fog" args={[COLORS.background, 1, 6]} /> 
                <CameraRig activeSection={activeSection} />
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    autoRotate={!activeSection} 
                    autoRotateSpeed={0.5}
                    enabled={!activeSection} 
                />
                <EdgeNetwork activeSection={activeSection} onSectionSelect={setActiveSection} />
            </Canvas>
        </div>

        {/* HUD (Level 2 - Dom Ordered last to stay on top) */}
        <TerminalHeader visible={activeSection === null} />

        {/* PANEL (Level 4) */}
        <ContentPanel activeSection={activeSection} onClose={() => setActiveSection(null)} />
    </div>
  );
}