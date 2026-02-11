import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IngredientState } from '@src/lib/modules/ingredients';

interface BurgerLayerProps {
  ingredient: IngredientState;
  onToggle: (id: string) => void;
}

// Capa individual de la hamburguesa — se puede activar/desactivar tocando
export function BurgerLayer({ ingredient, onToggle }: BurgerLayerProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(ingredient.id)}
      activeOpacity={0.7}
      className={`mx-4 my-0.5 flex-row items-center justify-between rounded-2xl px-4 py-3 transition-all
        ${ingredient.selected ? 'bg-white shadow-sm' : 'bg-gray-100 opacity-40'}`}
    >
      <View className="flex-row items-center gap-3">
        <Text className="text-3xl">{ingredient.emoji}</Text>
        <Text
          className={`text-sm font-semibold ${ingredient.selected ? 'text-gray-800' : 'text-gray-400 line-through'}`}
        >
          {ingredient.name}
        </Text>
      </View>
      <View
        className={`h-6 w-6 items-center justify-center rounded-full
          ${ingredient.selected ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <Text className="text-xs text-white">{ingredient.selected ? '✓' : '✕'}</Text>
      </View>
    </TouchableOpacity>
  );
}
