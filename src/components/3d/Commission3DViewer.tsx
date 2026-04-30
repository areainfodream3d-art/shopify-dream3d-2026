import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, useProgress } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

function Loader() {
  const { progress } = useProgress();
  const { t } = useTranslation();
  return (
    <Html center>
      <div className="flex flex-col items-center bg-black/80 p-4 rounded-xl border border-neon-orange/30 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mb-2"></div>
        <div className="text-neon-orange font-bold text-sm">{progress.toFixed(0)}%</div>
        <div className="text-xs text-gray-400 mt-1">{t('commission.viewer.loading')}</div>
      </div>
    </Html>
  );
}

function Model({ url, onError }: { url: string, onError: (err: any) => void }) {
  try {
    const { scene } = useGLTF(url, true); // true = use draco
    return <primitive object={scene} />;
  } catch (error) {
    console.error("Error loading model:", error);
    onError(error);
    return null;
  }
}

interface Commission3DViewerProps {
  modelUrl: string;
  modelName?: string;
  modelDesc?: string;
}

export const Commission3DViewer: React.FC<Commission3DViewerProps> = ({ 
  modelUrl, 
  modelName = "Drago dell'Etere", 
  modelDesc = '"Drago, dungeon, tesori"' 
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // Reset error when url changes
  useEffect(() => {
    setError(null);
  }, [modelUrl]);

  if (error) {
    return (
      <div className="w-full h-[500px] bg-dark-surface rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center p-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/5 to-transparent"></div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-orange"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t('commission.viewer.upload_here')}</h3>
          <p className="text-gray-400 text-sm max-w-xs">{t('commission.viewer.drag_drop')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-neon-orange/20 relative group">
      {/* Badge AI */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className="bg-neon-orange/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neon-orange border border-neon-orange/50 animate-pulse">
          {t('commission.viewer.ai_generated')}
        </span>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.5} shadows={false}>
            <ErrorBoundary onError={() => setError(t('commission.viewer.error_load'))}>
              <Model 
                url={modelUrl} 
                onError={(e) => setError(t('commission.viewer.error_load'))} 
              />
            </ErrorBoundary>
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={true} />
      </Canvas>
      
      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h3 className="text-xl font-bold text-white mb-1">{modelName}</h3>
        <p className="text-sm text-gray-300 mb-2">
          <span className="text-neon-blue italic">{modelDesc}</span>
        </p>
        <div className="text-xs text-gray-500">
          {t('commission.viewer.controls')}
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode, onError: () => void }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
