/* eslint-disable @typescript-eslint/no-require-imports */
// Mapeo de ingrediente → modelo GLB, escala y offset vertical para apilar
export const MODEL_MAP: Record<string, { url: string; y: number; scale: number }> = {
  'Pan inferior': { url: require('../../../assets/images/Hamburguesa/Pan_Abajo.glb') as string, y: 0, scale: 3 },
  'Carne': { url: require('../../../assets/images/Hamburguesa/Carne.glb') as string, y: 0.12, scale: 3 },
  'Queso': { url: require('../../../assets/images/Hamburguesa/Queso.glb') as string, y: 0.22, scale: 3 },
  'Lechuga': { url: require('../../../assets/images/Hamburguesa/lechuga.glb') as string, y: 0.32, scale: 3 },
  'Tomate': { url: require('../../../assets/images/Hamburguesa/Tomates.glb') as string, y: 0.42, scale: 3 },
  'Pan superior': { url: require('../../../assets/images/Hamburguesa/Pan_De_arriba.glb') as string, y: 0.55, scale: 3 },
};
