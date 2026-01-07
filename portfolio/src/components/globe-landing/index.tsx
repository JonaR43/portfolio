import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { COLORS } from './constants';
import { TerminalHeader } from './components/SharedUI';
import { EdgeNetwork, CameraRig } from './components/Scene3D';
import ContentPanel from './ContentPanel';

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