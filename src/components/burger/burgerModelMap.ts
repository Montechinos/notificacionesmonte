// Mapeo de ingrediente → modelo GLB y offset vertical para apilar
export const MODEL_MAP: Record<string, { url: string; y: number }> = {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Pan inferior': { url: require('../../../assets/images/Hamburguesa/Pan_Abajo.glb') as string, y: 0 },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Carne': { url: require('../../../assets/images/Hamburguesa/Carne.glb') as string, y: 0.3 },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Queso': { url: require('../../../assets/images/Hamburguesa/Queso.glb') as string, y: 0.6 },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Lechuga': { url: require('../../../assets/images/Hamburguesa/lechuga.glb') as string, y: 0.9 },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Tomate': { url: require('../../../assets/images/Hamburguesa/Tomates.glb') as string, y: 1.2 },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Pan superior': { url: require('../../../assets/images/Hamburguesa/Pan_De_arriba.glb') as string, y: 1.5 },
};
