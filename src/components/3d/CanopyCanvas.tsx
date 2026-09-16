import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PresentationControls,
  ContactShadows,
  Environment,
  Center,
  useProgress,
} from '@react-three/drei';
import * as THREE from 'three';
import { CanopyModel } from './CanopyModel';
import type { CameraPreset } from '../../types/product';
import { Loader2 } from 'lucide-react';

interface CanopyCanvasProps {
  modelFile: string;
  colorHex: string;
  tintHex?: string;
  frameOption: 'with-frame' | 'no-frame';
  totalPrice: number;
  cameraPreset: CameraPreset;
  isAutoRotate?: boolean;
  zoomMultiplier?: number;
  resetKey?: number;
}

const PRESET_CAMERA_CONFIGS: Record<
  CameraPreset,
  { position: THREE.Vector3; target: THREE.Vector3 }
> = {
  presentation: {
    position: new THREE.Vector3(2.6, 1.4, 3.0),
    target: new THREE.Vector3(0, 0.15, 0),
  },
  top: {
    // 0.08 on Z avoids gimbal-lock when looking straight down
    position: new THREE.Vector3(0, 4.4, 0.08),
    target: new THREE.Vector3(0, 0.2, 0),
  },
  'bottom-left': {
    position: new THREE.Vector3(-1.8, -0.65, 1.8),
    target: new THREE.Vector3(0, 0.45, 0),
  },
  'bottom-right': {
    position: new THREE.Vector3(1.8, -0.65, 1.8),
    target: new THREE.Vector3(0, 0.45, 0),
  },
  bottom: {
    position: new THREE.Vector3(-1.8, -0.65, 1.8),
    target: new THREE.Vector3(0, 0.45, 0),
  },
  'top-left': {
    position: new THREE.Vector3(-3.2, 2.5, 2.6),
    target: new THREE.Vector3(0, 0.1, 0),
  },
  front: {
    position: new THREE.Vector3(0, 0.35, 3.8),
    target: new THREE.Vector3(0, 0.15, 0),
  },
  side: {
    position: new THREE.Vector3(3.8, 0.35, 0),
    target: new THREE.Vector3(0, 0.15, 0),
  },
};

function CameraController({
  preset,
  zoomMultiplier = 1,
}: {
  preset: CameraPreset;
  zoomMultiplier?: number;
}) {
  const currentTarget = useRef(new THREE.Vector3(0, 0.15, 0));

  useFrame((state, delta) => {
    const config = PRESET_CAMERA_CONFIGS[preset] ?? PRESET_CAMERA_CONFIGS.presentation;
    const targetPos = config.position.clone().multiplyScalar(zoomMultiplier);
    state.camera.position.lerp(targetPos, Math.min(delta * 4.5, 0.25));
    currentTarget.current.lerp(config.target, Math.min(delta * 4.5, 0.25));
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}

function TurntableGroup({
  isAutoRotate,
  resetKey,
  children,
}: {
  isAutoRotate: boolean;
  resetKey?: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = 0;
    }
  }, [resetKey]);

  useFrame((_, delta) => {
    if (isAutoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function CanvasLoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] dark:bg-slate-900/60">
      <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 px-6 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/95">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-900 dark:text-white">
            Loading 3D Model
          </p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export function CanopyCanvas({
  modelFile,
  colorHex,
  tintHex,
  frameOption,
  totalPrice,
  cameraPreset,
  isAutoRotate = false,
  zoomMultiplier = 1,
  resetKey = 0,
}: CanopyCanvasProps) {
  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      <CanvasLoadingOverlay />

      <Canvas
        camera={{ position: [2.6, 1.4, 3.0], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <CameraController
          preset={cameraPreset}
          zoomMultiplier={zoomMultiplier}
        />

        <ambientLight intensity={0.75} />
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.6}
          color="#EEF2FF"
        />
        <pointLight position={[0, 4, 3]} intensity={0.5} />

        <Environment preset="city" environmentIntensity={0.6} />

        <Suspense fallback={null}>
          <TurntableGroup isAutoRotate={isAutoRotate} resetKey={resetKey}>
            <PresentationControls
              key={resetKey}
              enabled={cameraPreset === 'presentation' && !isAutoRotate}
              global={false}
              cursor={cameraPreset === 'presentation'}
              snap={true}
              speed={1.2}
              zoom={1}
              polar={[-Math.PI / 14, Math.PI / 10]}
              azimuth={[-Math.PI / 6, Math.PI / 6]}
            >
              <Center position={[0, 0, 0]}>
                <CanopyModel
                  modelFile={modelFile}
                  colorHex={colorHex}
                  tintHex={tintHex}
                  frameOption={frameOption}
                  totalPrice={totalPrice}
                />
              </Center>
            </PresentationControls>

            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.6}
              scale={6.5}
              blur={2.2}
              far={3}
              color="#3730A3"
            />
          </TurntableGroup>
        </Suspense>
      </Canvas>
    </div>
  );
}
