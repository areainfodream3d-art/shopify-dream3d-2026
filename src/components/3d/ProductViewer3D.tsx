import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, useProgress, useAnimations } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

// Componente per il caricamento
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mb-2"></div>
        <div className="text-neon-orange font-bold text-sm">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

// Componente per caricare il modello GLB/GLTF
const GLBModel = ({ url, autoRotate = true }: { url: string, autoRotate?: boolean }) => {
  const { scene, animations } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);

  // Play animation if exists
  React.useEffect(() => {
    if (actions) {
      // Play ALL animations found
      Object.keys(actions).forEach((key) => {
        const action = actions[key];
        if (action) {
            action.reset().fadeIn(0.5).play();
            // Ensure loop and time scale
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.clampWhenFinished = false;
            action.timeScale = 1; 
        }
      });
    }
    return () => {
        if (actions) {
            Object.values(actions).forEach(action => action?.stop());
        }
    };
  }, [actions]);

  // Removed manual rotation, using OrbitControls autoRotate instead
  return <primitive ref={modelRef} object={scene} />;
};

// Componente per caricare il modello STL
const STLModel = ({ url, autoRotate = true }: { url: string, autoRotate?: boolean }) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  // Centra la geometria
  React.useMemo(() => {
    if (geometry) {
        geometry.center();
        geometry.computeVertexNormals();
    }
  }, [geometry]);

  // Removed manual rotation, using OrbitControls autoRotate instead
  return (
    <mesh ref={meshRef} geometry={geometry} scale={[0.1, 0.1, 0.1]}> 
      <meshStandardMaterial color="#cccccc" roughness={0.5} metalness={0.5} />
    </mesh>
  );
};

// Wrapper che decide quale loader usare in base all'estensione
const Model = ({ url, autoRotate }: { url: string, autoRotate?: boolean }) => {
    const isSTL = url.toLowerCase().endsWith('.stl');
    
    if (isSTL) {
        return <STLModel url={url} autoRotate={autoRotate} />;
    }
    return <GLBModel url={url} autoRotate={autoRotate} />;
};

// Un semplice cubo che ruota come fallback
const CubeModel = (props: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#FF8C00" roughness={0.3} metalness={0.8} />
    </mesh>
  );
};

interface ProductViewer3DProps {
  modelUrl?: string;
  className?: string;
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  showControls?: boolean;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ 
  modelUrl, 
  className,
  enableZoom = true,
  enableRotate = true,
  enablePan = true,
  autoRotate = true,
  showControls = true
}) => {
  return (
    <div className={`w-full h-[400px] md:h-[500px] bg-dark-surface/50 rounded-2xl overflow-hidden border border-white/5 relative ${className || ''}`}>
      {showControls && (
        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neon-orange border border-neon-orange/30">
            Interactive 3D
        </div>
      )}
      
      {/* Key is crucial here to force remount when URL changes */}
      <Canvas key={modelUrl} shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.6} adjustCamera>
            {modelUrl ? <Model url={modelUrl} autoRotate={autoRotate} /> : <CubeModel />}
          </Stage>
        </Suspense>
        <OrbitControls 
            makeDefault 
            autoRotate={autoRotate} 
            autoRotateSpeed={2.0} 
            enableZoom={enableZoom} 
            enableRotate={enableRotate}
            enablePan={enablePan}
        />
      </Canvas>
      
      {showControls && (
        <div className="absolute bottom-4 left-0 w-full text-center text-gray-500 text-xs pointer-events-none">
            Trascina per ruotare • Usa due dita per spostare {enableZoom ? '• Zoom con rotella' : ''}
        </div>
      )}
    </div>
  );
};
