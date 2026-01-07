import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
import { COLORS, SECTIONS } from '../constants';

export function EdgeNetwork({ activeSection, onSectionSelect }: { activeSection: string | null, onSectionSelect: (id: string | null) => void }) {
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
                                <span className="text-[10px] font-mono text-white tracking-[0.2em] uppercase whitespace-nowrap group-hover:text-[#E07A5F] transition-colors" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
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

export function CameraRig({ activeSection }: { activeSection: string | null }) {
    useFrame((state) => {
        const targetDistance = activeSection ? 1.5 : 3.5;
        const currentPos = state.camera.position.clone();
        const targetPos = currentPos.normalize().multiplyScalar(targetDistance);
        state.camera.position.lerp(targetPos, 0.02);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}