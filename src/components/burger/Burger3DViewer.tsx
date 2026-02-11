
import React from 'react';
import { View, Text } from 'react-native';
import { IngredientState } from '@src/lib/modules/ingredients';

interface Props {
  ingredients: IngredientState[];
}

export function Burger3DViewer({ ingredients }: Props) {
  return (
    <View className="h-64 items-center justify-center rounded-2xl bg-orange-50">
      <Text className="text-gray-400">Vista 3D no disponible en la app</Text>
    </View>
  );
}
