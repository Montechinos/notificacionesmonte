import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@src/lib/modules/auth';
import { useIngredients } from '@src/lib/modules/ingredients';
import { useOrder } from '@src/lib/modules/orders';
import { BurgerPreview } from '@src/components/burger';
import { Button } from '@src/components/ui/Button';
import { OrderStatus } from '@src/components/ui/OrderStatus';

export default function OrderScreen() {
  const { user } = useAuth();
  const { ingredients, selectedIngredients, toggleIngredient } = useIngredients();
  const { state, countdown, error, placeOrder, reset } = useOrder(user?.id);

  const handleOrder = () => {
    placeOrder(selectedIngredients.map((i) => i.id));
  };

  const showOverlay = state === 'waiting' || state === 'done' || state === 'error';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="border-b border-gray-100 bg-white px-6 py-4">
        <Text className="text-2xl font-extrabold text-gray-900">Tu Burger 🍔</Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          Toca los ingredientes para activar o desactivar
        </Text>
      </View>

      <View className="flex-1 pt-2">
        <BurgerPreview ingredients={ingredients} onToggle={toggleIngredient} />
      </View>

      <View className="border-t border-gray-100 bg-white px-6 py-4">
        <Button
          label={`PEDIR  (${selectedIngredients.length} ingredientes)`}
          onPress={handleOrder}
          isLoading={state === 'ordering'}
          disabled={selectedIngredients.length === 0 || showOverlay}
          variant="primary"
        />
      </View>

      {showOverlay && (
        <OrderStatus
          state={state as 'waiting' | 'done' | 'error'}
          countdown={countdown}
          error={error}
          onReset={reset}
        />
      )}
    </SafeAreaView>
  );
}
