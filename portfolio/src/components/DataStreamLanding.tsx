import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration: "The Esports Analyst" Palette ---
const COLORS = {
  background: '#0B0C10', // Deep Void
  surface: '#1F2833',    // Gunmetal
  primary: '#66FCF1',    // Neon Cyan (The "Gamer" glow)
  secondary: '#C5C6C7',  // Silver Text
};

function DataStreamParticles({ count = 300 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // 1. Create a dummy object to handle matrix math efficiently
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 2. Generate random initial data for each particle
  // We calculate this ONCE at startup, not every frame
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  // 3. The Animation Loop (Runs 60fps or on demand)
  useFrame((state) => {
    // 1. Capture the current mesh in a local variable
    const mesh = meshRef.current;
    
    // 2. Guard clause: If mesh doesn't exist yet, stop completely
    if (!mesh) return;

    // Move the light around slightly
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
        lightRef.current.position.x = Math.sin(time * 0.5) * 20;
    }

    // Update particles
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      
      t = particle.t += speed / 2;
      
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      // 3. Use the local 'mesh' variable here (TypeScript is now happy)
      mesh.setMatrixAt(i, dummy.matrix);
    });
    
    // 4. And here
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight ref={lightRef} distance={40} intensity={2} color={COLORS.primary} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* The shape of the particle (Low poly = faster) */}
        <dodecahedronGeometry args={[0.2, 0]} />
        {/* The material (MeshPhong responds to light) */}
        <meshPhongMaterial color={COLORS.primary} emissive={COLORS.primary} emissiveIntensity={0.5} />
      </instancedMesh>
    </>
  );
}

export default function DataStreamLanding() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: COLORS.background }}>
      
      {/* LAYER 1: 3D Data Stream */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <color attach="background" args={[COLORS.background]} />
          {/* Fog creates depth so particles fade into the void */}
          <fog attach="fog" args={[COLORS.background, 10, 35]} /> 
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
             <DataStreamParticles count={400} />
          </Suspense>
        </Canvas>
      </div>

      {/* LAYER 2: UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center">
            {/* Tech Stack Badge */}
            <div 
                className="inline-block px-3 py-1 mb-4 text-xs font-mono tracking-widest border rounded pointer-events-auto cursor-help"
                style={{ borderColor: COLORS.primary, color: COLORS.primary }}
            >
                LIVE DATA ANALYTICS
            </div>

            {/* Main Headline with Neon Effect */}
            <h1 
                className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                style={{ 
                    color: '#fff',
                    textShadow: `0 0 20px ${COLORS.primary}` // Neon glow
                }}
            >
                PLAYER ONE
            </h1>
            
            <p className="max-w-md mx-auto mb-8 font-mono text-sm md:text-base" style={{ color: COLORS.secondary }}>
                Full-stack engineering for the esports ecosystem. 
                <br/>Optimizing the gap between raw data and victory.
            </p>

            <button 
                className="px-8 py-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-105 pointer-events-auto"
                style={{ 
                    backgroundColor: 'transparent',
                    border: `2px solid ${COLORS.primary}`,
                    color: COLORS.primary,
                    boxShadow: `0 0 10px ${COLORS.primary}40`
                }}
            >
                Init System
            </button>
        </div>
      </div>
    </div>
  );
}