import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

// --- Configuration: "The System Architect" Palette ---
const COLORS = {
  background: '#121212', // Charcoal
  gridCell: '#252525',   // Oiled Slate
  gridSection: '#E07A5F', // Burnt Orange
  text: '#F4F1DE',       // Cream
};

const ArchitectScene = () => {
  return (
    <>
      {/* 1. Fog: Blends the grid into the background for depth */}
      <color attach="background" args={[COLORS.background]} />
      <fog attach="fog" args={[COLORS.background, 10, 40]} />

      {/* 2. The Infinite Grid (Shader Based - High Performance) */}
      <Grid
        position={[0, -1, 0]}
        args={[30, 30]} // Size of the grid area
        cellSize={0.5}  // Small squares
        cellThickness={0.6}
        cellColor={COLORS.gridCell}
        sectionSize={2.5} // Large squares
        sectionThickness={1.2}
        sectionColor={COLORS.gridSection}
        fadeDistance={25} // Distance where grid fades out
        fadeStrength={1}
        infiniteGrid={true} // The "Serverless" infinite scaling illusion
      />

      {/* 3. Placeholder Hero Object (Represents your 3D Asset) */}
      {/* Replace this Mesh with your optimized GLTF later */}
      <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={COLORS.gridSection} 
          roughness={0.2} 
          metalness={0.8} 
          wireframe={true} // Wireframe fits the "Architect" vibe
        />
      </mesh>
      
      {/* 4. Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.gridSection} />
      
      {/* 5. Controls: Auto-rotate slowly to show 3D nature */}
      <OrbitControls 
        enableZoom={false} 
        autoRotate={true} 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2.2} // Prevent going under the floor
      />
      <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />
    </>
  );
};

export default function ArchitectLandingPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: COLORS.background }}>
      
      {/* LAYER 1: 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <ArchitectScene />
          </Suspense>
        </Canvas>
      </div>

      {/* LAYER 2: HTML Overlay (The Content) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          
          {/* Left Column: Typography */}
          {/* pointer-events-auto allows selecting text over the canvas */}
          <div className="text-left pointer-events-auto">
            <h2 
              className="text-lg font-mono mb-4 tracking-widest"
              style={{ color: COLORS.gridSection }}
            >
              SYSTEM ARCHITECT // ESPORTS
            </h2>
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter"
              style={{ color: COLORS.text }}
            >
              SCALABLE.<br />
              REAL-TIME.<br />
              SERVERLESS.
            </h1>
            <p className="text-xl max-w-md opacity-80 mb-8 font-light" style={{ color: COLORS.text }}>
              Building high-performance analysis platforms with $0 overhead strategies.
            </p>
            
            <button 
              className="px-8 py-3 font-bold rounded hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: COLORS.gridSection, 
                color: COLORS.background 
              }}
            >
              VIEW ARCHITECTURE
            </button>
          </div>

          {/* Right Column: Empty to let the 3D Hero shine */}
          <div></div>
        </div>
      </div>
    </div>
  );
}