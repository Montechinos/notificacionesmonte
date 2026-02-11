import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from './Button';

interface OrderStatusProps {
  state: 'waiting' | 'done' | 'error';
  countdown: number;
  error: string | null;
  onReset: () => void;
}

// Pantalla superpuesta que muestra el estado del pedido en curso
export function OrderStatus({ state, countdown, error, onReset }: OrderStatusProps) {
  if (state === 'waiting') {
    return (
      <View className="absolute inset-0 items-center justify-center bg-white/95 px-8">
        <Text className="mb-4 text-6xl">🍔</Text>
        <Text className="mb-2 text-2xl font-extrabold text-gray-900">
          ¡Pedido recibido!
        </Text>
        <Text className="mb-8 text-center text-gray-500">
          Tu hamburguesa está en preparación
        </Text>
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <Text className="text-4xl font-black text-red-600">{countdown}</Text>
        </View>
        <ActivityIndicator color="#D62300" size="small" />
        <Text className="mt-3 text-xs text-gray-400">
          Recibirás una notificación cuando esté lista
        </Text>
      </View>
    );
  }

  if (state === 'done') {
    return (
      <View className="absolute inset-0 items-center justify-center bg-white/95 px-8">
        <Text className="mb-4 text-6xl">🎉</Text>
        <Text className="mb-2 text-2xl font-extrabold text-green-600">
          ¡Lista para retirar!
        </Text>
        <Text className="mb-8 text-center text-gray-500">
          Tu burger ya está lista. ¡Buen provecho!
        </Text>
        <Button label="Hacer otro pedido" onPress={onReset} variant="primary" />
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View className="absolute inset-0 items-center justify-center bg-white/95 px-8">
        <Text className="mb-4 text-6xl">❌</Text>
        <Text className="mb-2 text-xl font-bold text-red-600">Error en el pedido</Text>
        <Text className="mb-8 text-center text-gray-500">{error}</Text>
        <Button label="Reintentar" onPress={onReset} variant="ghost" />
      </View>
    );
  }

  return null;
}
