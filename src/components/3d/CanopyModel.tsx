import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { PriceAnnotation } from './PriceAnnotation';

interface CanopyModelProps {
  modelFile: string;
  colorHex: string;
  tintHex?: string;
  frameOption: 'with-frame' | 'no-frame';
  totalPrice: number;
}

export function CanopyModel({
  modelFile,
  colorHex,
  tintHex,
  frameOption,
  totalPrice,
}: CanopyModelProps) {
  const { scene } = useGLTF(modelFile, '/draco/');

  // Clone materials so tinting does not mutate cached assets
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    clonedScene.traverse((obj) => {
      const name = obj.name.toLowerCase();

      if (name.includes('leg') || name.includes('mechanism')) {
        obj.visible = frameOption === 'with-frame';
      }

      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        for (const mat of materials) {
          if (mat) {
            const matName = mat.name.toLowerCase();
            if (matName.includes('fabric') && 'color' in mat) {
              const standardMat = mat as THREE.MeshStandardMaterial;
              const targetColor =
                tintHex && !matName.includes('inner')
                  ? tintHex
                  : colorHex;
              standardMat.color.set(targetColor);
              standardMat.needsUpdate = true;
            }
          }
        }
      }
    });
  }, [clonedScene, colorHex, tintHex, frameOption]);

  return (
    <group position={[0, 0, 0]}>
      <primitive object={clonedScene} />
      <PriceAnnotation
        price={totalPrice}
        position={[1.05, 1.15, 0.2]}
      />
    </group>
  );
}

useGLTF.preload('/glb/Tent_5_5.draco.glb', '/draco/');
useGLTF.preload('/glb/Tent_6_5_6_5.draco.glb', '/draco/');
useGLTF.preload('/glb/Tent_8_8.draco.glb', '/draco/');
