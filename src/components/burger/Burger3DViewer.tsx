import React, { Suspense } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { IngredientState } from '@src/lib/modules/ingredients';
import { BurgerModel, INGREDIENTS_WITH_MODEL } from './BurgerModel';

const LAYER_HEIGHT = 0.35;

function BurgerScene({ ingredients }: { ingredients: IngredientState[] }) {
  const layers = ingredients
    .filter((i) => i.selected && INGREDIENTS_WITH_MODEL.includes(i.name))
    .sort((a, b) => a.display_order - b.display_order);

  // Centrar la pila verticalmente
  const totalHeight = layers.length * LAYER_HEIGHT;
  const offsetY = -totalHeight / 2;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
      <directionalLight position={[-2, 3, -2]} intensity={0.4} />
      {layers.map((ing, i) => (
        <BurgerModel
          key={ing.id}
          name={ing.name}
          yPosition={offsetY + i * LAYER_HEIGHT}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#D62300" />
    </mesh>
  );
}

interface Burger3DViewerProps {
  ingredients: IngredientState[];
}

export function Burger3DViewer({ ingredients }: Burger3DViewerProps) {
  return (
    <View className="h-64 w-full overflow-hidden rounded-2xl bg-orange-50">
      <Canvas camera={{ position: [0, 2, 5], fov: 35 }}>
        <Suspense fallback={<LoadingFallback />}>
          <BurgerScene ingredients={ingredients} />
        </Suspense>
      </Canvas>
      <View className="absolute bottom-2 right-2">
        <Text className="text-[10px] text-gray-400">Girá para rotar</Text>
      </View>
    </View>
  );
}
