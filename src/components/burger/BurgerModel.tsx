import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

// Mapeo nombre de ingrediente → ruta del modelo GLB
const MODEL_MAP: Record<string, string> = {
  'Pan inferior': require('../../../assets/images/Hamburguesa/Pan_Abajo.glb'),
  'Carne': require('../../../assets/images/Hamburguesa/Carne.glb'),
  'Queso': require('../../../assets/images/Hamburguesa/Queso.glb'),
  'Lechuga': require('../../../assets/images/Hamburguesa/lechuga.glb'),
  'Tomate': require('../../../assets/images/Hamburguesa/Tomates.glb'),
  'Pan superior': require('../../../assets/images/Hamburguesa/Pan_De_arriba.glb'),
};

// Escala personalizada por modelo (algunos modelos vienen a escalas distintas)
const SCALE_MAP: Record<string, number> = {
  'Pan inferior': 1,
  'Carne': 1,
  'Queso': 1,
  'Lechuga': 1,
  'Tomate': 1,
  'Pan superior': 1,
};

interface BurgerModelProps {
  name: string;
  yPosition: number;
}

export function BurgerModel({ name, yPosition }: BurgerModelProps) {
  const url = MODEL_MAP[name];
  if (!url) return null;

  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const scale = SCALE_MAP[name] ?? 1;

  return (
    <primitive
      object={cloned}
      position={[0, yPosition, 0]}
      scale={[scale, scale, scale]}
    />
  );
}

// Nombres de ingredientes que tienen modelo 3D
export const INGREDIENTS_WITH_MODEL = Object.keys(MODEL_MAP);
