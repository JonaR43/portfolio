import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = ['React', 'Go', 'AWS', 'Docker', 'Redis', 'Vite', 'ThreeJS', 'gRPC'];

function Word({ children, position }: { children: string; position: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ camera }) => {
    if (!ref.current) return;
    // Make text always face the camera (Billboard effect)
    ref.current.lookAt(camera.position);
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.5}
      color="#66FCF1" // Neon Cyan
      anchorX="center"
      anchorY="middle"
    >
      {children}
    </Text>
  );
}

function Cloud({ radius = 4 }) {
  // Compute positions once
  const words = useMemo(() => {
    const temp = [];
    const phiSpan = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < SKILLS.length; i++) {
        const y = 1 - (i / (SKILLS.length - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y); // radius at y
        const theta = phiSpan * i; // golden angle increment
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        temp.push({ 
            pos: new THREE.Vector3(x * radius, y * radius, z * radius), 
            word: SKILLS[i] 
        });
    }
    return temp;
  }, [radius]);

  return (
    <group>
      {words.map((item, i) => (
        <Word key={i} position={item.pos}>{item.word}</Word>
      ))}
    </group>
  );
}

export default function SkillCloudLanding() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0B0C10' }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <fog attach="fog" args={['#0B0C10', 0, 25]} />
        <Cloud />
        {/* Allows user to spin the cloud with mouse */}
        <TrackballControls noZoom /> 
      </Canvas>
    </div>
  );
}