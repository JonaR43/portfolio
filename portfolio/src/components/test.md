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