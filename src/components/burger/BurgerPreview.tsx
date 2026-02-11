import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { IngredientState } from '@src/lib/modules/ingredients';
import { BurgerLayer } from './BurgerLayer';

interface BurgerPreviewProps {
  ingredients: IngredientState[];
  onToggle: (id: string) => void;
}

// Vista apilada de la hamburguesa — ingredientes de arriba hacia abajo
export function BurgerPreview({ ingredients, onToggle }: BurgerPreviewProps) {
  const selectedCount = ingredients.filter((i) => i.selected).length;

  return (
    <View className="flex-1">
      {/* Indicador visual de capas activas */}
      <View className="mb-2 items-center">
        <View className="rounded-full bg-red-50 px-4 py-1">
          <Text className="text-xs font-semibold text-red-600">
            {selectedCount} ingrediente{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
      >
        {/* Renderizar ingredientes en orden inverso para efecto 3D (pan arriba) */}
        {[...ingredients].reverse().map((ingredient) => (
          <BurgerLayer
            key={ingredient.id}
            ingredient={ingredient}
            onToggle={onToggle}
          />
        ))}
      </ScrollView>
    </View>
  );
}
