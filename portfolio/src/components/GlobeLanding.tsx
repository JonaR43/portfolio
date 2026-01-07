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

const PROJECT_DATA = [
    {
        id: 'DL-01',
        title: 'Esports Data Lake',
        desc: 'Ingesting 5TB of match data daily via serverless pipelines. Normalized disparate data sources into a unified queryable format for analytics teams.',
        tech: ['AWS S3', 'Athena', 'Kinesis', 'Python'],
        gallery: [
            'https://images.unsplash.com/photo-1558494949-efc025793ad2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: 'https://google.com'
    },
    {
        id: 'OE-99',
        title: 'Odds Engine',
        desc: 'Sub-50ms latency engine for calculating live win probabilities. Uses in-memory caching and optimized Go routines to handle concurrent probability modeling.',
        tech: ['Golang', 'Redis', 'WebSockets', 'Docker'],
        gallery: [
            'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: 'https://google.com'
    },
    {
        id: 'MT-42',
        title: 'Match Telemetry',
        desc: 'Real-time player movement tracking and heatmap generation. visualizes player density and rotation patterns on a live 2D map.',
        tech: ['Rust', 'Kafka', 'React', 'D3.js'],
        gallery: [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: 'https://google.com'
    }
];

// --- UI HELPERS ---

const TechBadge = ({ label }: { label: string }) => (
    <span 
        style={{
            display: 'inline-block',
            padding: '4px 8px',
            marginRight: '8px',
            marginBottom: '4px',
            borderRadius: '4px',
            backgroundColor: 'rgba(224, 122, 95, 0.05)',
            border: '1px solid rgba(224, 122, 95, 0.2)',
            fontSize: '10px',
            fontFamily: '"Share Tech Mono", monospace',
            color: '#E07A5F',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        }}
    >
        {label}
    </span>
);

const StatBox = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        borderRadius: '8px'
    }}>
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#E07A5F', opacity: 0.8
        }} />
        <span style={{ display: 'block', fontSize: '10px', color: '#888', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
            {label}
        </span>
        <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>
            {value}
        </span>
        {sub && <span style={{ display: 'block', fontSize: '10px', color: '#666', marginTop: '4px', fontFamily: 'monospace' }}>{sub}</span>}
    </div>
);

// --- COMPONENT: IMAGE CAROUSEL ---
const ImageCarousel = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            minHeight: '400px',
            backgroundColor: '#000', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.1)' 
        }}>
            {/* Image */}
            <img 
                src={images[index]} 
                alt="Project Gallery" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.9 }} 
            />
            
            {/* Overlay Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button 
                        onClick={prev}
                        style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #E07A5F', padding: '12px', cursor: 'pointer', borderRadius: '4px', zIndex: 20 }}
                    >
                        ←
                    </button>
                    <button 
                        onClick={next}
                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #E07A5F', padding: '12px', cursor: 'pointer', borderRadius: '4px', zIndex: 20 }}
                    >
                        →
                    </button>
                </>
            )}

            {/* Counter Badge */}
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'black', padding: '4px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#E07A5F', border: '1px solid #E07A5F' }}>
                IMG_0{index + 1} / 0{images.length}
            </div>
        </div>
    );
};

// --- COMPONENT: PROJECT DETAIL VIEW ---
const ProjectDetailView = ({ project, onBack }: { project: typeof PROJECT_DATA[0], onBack: () => void }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <button 
                    onClick={onBack}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#E07A5F', cursor: 'pointer', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.1em' }}
                >
                    ← RETURN_TO_LIST
                </button>
                <div style={{ fontFamily: 'monospace', color: '#666', fontSize: '12px' }}>ID: {project.id} // CLASSIFIED</div>
            </div>

            {/* 2. Split Content Layout */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '48px',
                height: '100%',
                paddingBottom: '40px'
            }}>
                
                {/* LEFT COLUMN: CAROUSEL */}
                <div style={{ height: '100%', maxHeight: '65vh' }}>
                    <ImageCarousel images={project.gallery} />
                </div>

                {/* RIGHT COLUMN: SCROLLABLE CONTENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
                    
                    {/* Title Area */}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', textTransform: 'uppercase', lineHeight: '1.1' }}>
                            {project.title}
                        </h1>
                        <div style={{ height: '2px', width: '60px', backgroundColor: '#E07A5F', marginTop: '16px' }} />
                    </div>

                    {/* Description */}
                    <div>
                        <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', fontSize: '12px' }}>
                            // MISSION_BRIEF
                        </h3>
                        <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', fontWeight: '300' }}>
                            {project.desc}
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', fontSize: '12px' }}>
                            // TECH_STACK
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {project.tech.map(t => <TechBadge key={t} label={t} />)}
                        </div>
                    </div>

                    {/* Links */}
                    <div style={{ marginTop: 'auto' }}>
                        <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', fontSize: '12px' }}>
                            // UPLINKS
                        </h3>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <a 
                                href={project.githubUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontFamily: 'monospace', fontSize: '12px', borderRadius: '4px', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#E07A5F'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                            >
                                GITHUB_REPO
                            </a>
                            <a 
                                href={project.liveUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: '#E07A5F', color: 'black', textDecoration: 'none', fontFamily: 'monospace', fontSize: '12px', borderRadius: '4px', fontWeight: 'bold' }}
                            >
                                LIVE_DEMO
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: PROJECT CARD ---
const ProjectCard = ({ project, onClick }: { project: typeof PROJECT_DATA[0], onClick: (id: string) => void }) => (
    <div 
        onClick={() => onClick(project.id)}
        className="group"
        style={{
            display: 'flex', flexDirection: 'column', position: 'relative', height: '100%', minHeight: '400px', cursor: 'pointer',
            background: 'linear-gradient(180deg, rgba(30,30,35,0.8) 0%, rgba(10,10,10,1) 100%)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden',
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)', transition: 'transform 0.3s ease'
        }}
    >
        <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
            <img 
                src={project.gallery[0]}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.8, transition: 'transform 0.5s ease', filter: 'grayscale(100%) contrast(1.2)' }}
                className="group-hover:scale-105 group-hover:grayscale-0"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,1), transparent)' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#E07A5F', color: '#000', padding: '4px 12px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {project.id}
            </div>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', fontFamily: '"Share Tech Mono", monospace', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                {project.title}
            </h3>
            <div style={{ height: '1px', width: '40px', backgroundColor: '#E07A5F', marginBottom: '16px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                {project.desc}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                {project.tech.map(t => <TechBadge key={t} label={t} />)}
            </div>
        </div>
    </div>
);

// --- HUD COMPONENT ---
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
            style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 5000, pointerEvents: 'none', userSelect: 'none' }}
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
                    <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '10px', height: '10px', borderTop: '2px solid #E07A5F', borderRight: '2px solid #E07A5F' }} />
                    <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '10px', height: '10px', borderBottom: '2px solid #E07A5F', borderLeft: '2px solid #E07A5F' }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                        <span style={{ color: '#E07A5F', fontSize: '1.125rem', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                            OP_OVERWATCH
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e', width: '6px', height: '6px', borderRadius: '50%' }} />
                             <span style={{ color: '#22c55e', fontSize: '10px', letterSpacing: '0.05em', fontWeight: 'bold' }}>LIVE</span>
                        </div>
                    </div>

                    <div style={{ color: '#F4F1DE', fontSize: '12px', opacity: 0.8, letterSpacing: '0.05em', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
                            <span style={{ color: '#888' }}>LOC</span> 
                            <span>34.05°N, 118.24°W</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
                             <span style={{ color: '#888' }}>CLK</span> 
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
                    <Html transform distanceFactor={4} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
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
    
    // Track which project is clicked
    const [activeProject, setActiveProject] = useState<typeof PROJECT_DATA[0] | null>(null);
    
    // Derived state for expanding the panel
    const isExpanded = !!activeProject;

    // Reset project view when closing the main panel or switching main sections
    useEffect(() => {
        if (!activeSection) setActiveProject(null);
    }, [activeSection]);

    return (
        <AnimatePresence mode="wait">
            {activeSection && (
                <>
                    <motion.div
                        key="backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-[2px]"
                    />

                    <motion.div
                        key="panel"
                        variants={panelVariants}
                        initial="hidden"
                        // Animate height and rounding based on expansion state
                        animate={{ 
                            y: 0,
                            height: isExpanded ? '100vh' : '85vh',
                            borderTopLeftRadius: isExpanded ? '0px' : '24px',
                            borderTopRightRadius: isExpanded ? '0px' : '24px',
                            transition: { type: "spring", damping: 25, stiffness: 200 }
                        }}
                        exit="exit"
                        style={{ 
                            position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 9999, 
                            backgroundColor: '#0a0a0a', 
                            borderTop: '2px solid #E07A5F',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        className="shadow-2xl"
                    >
                        {/* Background Grid Pattern */}
                        <div 
                            className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
                        />

                        {/* HEADER */}
                        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0f0f0f]">
                             <button onClick={onClose} className="flex items-center gap-2 text-[#E07A5F] hover:text-white transition-colors group cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                <span className="font-mono text-xs tracking-[0.2em] uppercase">ABORT_VIEW</span>
                             </button>
                             <div className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 bg-[#E07A5F] rounded-full animate-pulse" />
                                 <h2 className="text-lg font-bold tracking-[0.2em] text-[#F4F1DE] uppercase opacity-80 hidden md:block font-mono">
                                    // {activeSection} {activeProject ? `/ ${activeProject.id}` : ''}
                                 </h2>
                             </div>
                        </div>
                        
                        {/* SCROLLABLE CONTENT */}
                        <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 text-gray-300 font-sans">
                            <div className="max-w-7xl mx-auto" style={{ height: '100%' }}>
                                
                                {activeSection === 'about' && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <div>
                                                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '-0.05em', fontFamily: 'monospace' }}>
                                                    Operator <span style={{ color: '#E07A5F' }}>Dossier</span>
                                                </h1>
                                                <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', lineHeight: '1.75' }}>
                                                    Architecting high-concurrency systems for the competitive arena.
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'none' }} className="md:block">
                                                <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>Clearance Level</div>
                                                <div style={{ color: '#E07A5F', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'monospace' }}>ALPHA-1</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                                            <StatBox label="Class" value="Architect" />
                                            <StatBox label="Stack" value="Golang" sub="v1.21+" />
                                            <StatBox label="Latency" value="<50ms" sub="Global" />
                                            <StatBox label="Cost" value="$0.00" sub="Serverless" />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                                            <div style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '1.25rem' }}>⌖</span> OBJECTIVE
                                                </h3>
                                                <p style={{ fontSize: '1rem', lineHeight: '2', color: '#d1d5db', fontWeight: '300' }}>
                                                    My mission is to balance complex real-time engineering with a ruthless cost strategy. 
                                                    I don't just write code; I design systems that scale to millions of events while keeping the monthly bill near zero.
                                                </p>
                                            </div>
                                            <div style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '1.25rem' }}>⚡</span> ARSENAL
                                                </h3>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {['Golang', 'AWS Lambda', 'Redis Cluster', 'Docker', 'K8s', 'Terraform', 'gRPC', 'Postgres', 'TypeScript'].map(tech => (
                                                        <TechBadge key={tech} label={tech} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'projects' && (
                                    <>
                                        {!activeProject ? (
                                            /* LIST VIEW (GRID) */
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px', marginBottom: '32px' }}>
                                                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.05em', fontFamily: 'monospace' }}>
                                                        Mission <span style={{ color: '#E07A5F' }}>Logs</span>
                                                    </h1>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <span style={{ width: '8px', height: '8px', backgroundColor: '#E07A5F', borderRadius: '50%', display: 'inline-block' }} className="animate-pulse" />
                                                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E07A5F' }}>STATUS: CLASSIFIED</span>
                                                    </div>
                                                </div>

                                                <div 
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                                        gap: '48px'
                                                    }}
                                                >
                                                    {PROJECT_DATA.map((project) => (
                                                        <ProjectCard 
                                                            key={project.id} 
                                                            project={project} 
                                                            onClick={() => setActiveProject(project)} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            /* DETAIL VIEW */
                                            <ProjectDetailView project={activeProject} onBack={() => setActiveProject(null)} />
                                        )}
                                    </>
                                )}

                                {activeSection === 'contact' && (
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 0' }}>
                                        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                                            <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to right, #E07A5F, #9333ea)', borderRadius: '8px', filter: 'blur(20px)', opacity: 0.25 }}></div>
                                            <div style={{ position: 'relative', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: '48px', borderRadius: '8px', textAlign: 'center' }}>
                                                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '-0.05em', fontFamily: 'monospace' }}>
                                                    Establish <span style={{ color: '#E07A5F' }}>Uplink</span>
                                                </h1>
                                                <p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '1.125rem', fontWeight: '300' }}>
                                                    Secure channels are open. Ready to discuss high-performance architecture, 
                                                    esports analysis, or serverless deployments.
                                                </p>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' }}>
                                                    {[
                                                        { label: 'Email_Protocol', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
                                                        { label: 'GitHub_Repo', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
                                                        { label: 'LinkedIn_Feed', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z' },
                                                        { label: 'Resume_DL', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3' }
                                                    ].map((item) => (
                                                        <button key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s' }} className="hover:bg-[#E07A5F] hover:text-black hover:border-[#E07A5F] group">
                                                            <span style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>{item.label}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d={item.icon} />
                                                            </svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
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

        <TerminalHeader visible={activeSection === null} />

        <ContentPanel activeSection={activeSection} onClose={() => setActiveSection(null)} />
    </div>
  );
}