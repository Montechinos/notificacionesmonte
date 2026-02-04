import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../lib/modules/auth/AuthProvider';

export default function FeedScreen() {
  const { session } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const notifications = [
    {
      id: 1,
      title: '¡Bienvenido a la app! 🎉',
      body: 'Gracias por registrarte. Aquí recibirás todas tus notificaciones.',
      time: 'Hace 5 min',
      read: false,
    },
    {
      id: 2,
      title: 'Nuevo mensaje',
      body: 'Tienes un mensaje nuevo de soporte técnico.',
      time: 'Hace 1 hora',
      read: true,
    },
    {
      id: 3,
      title: 'Actualización disponible',
      body: 'Hay una nueva versión de la app disponible.',
      time: 'Hace 2 horas',
      read: true,
    },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-surface px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-textPrimary">
          Notificaciones 🔔
        </Text>
        <Text className="text-textSecondary text-sm mt-1">
          {session?.user.email}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
      >
        <View className="px-4 py-4">
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`mb-3 p-4 rounded-lg ${
                notification.read ? 'bg-surface' : 'bg-surface border-2 border-primary'
              }`}
            >
              <View className="flex-row items-start justify-between mb-2">
                <Text className="text-textPrimary font-semibold flex-1">
                  {notification.title}
                </Text>
                {!notification.read && (
                  <View className="bg-primary rounded-full w-2 h-2 mt-1" />
                )}
              </View>
              <Text className="text-textSecondary text-sm mb-2">
                {notification.body}
              </Text>
              <Text className="text-textSecondary text-xs">
                {notification.time}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {notifications.length === 0 && (
            <View className="items-center justify-center py-20">
              <Text className="text-6xl mb-4">📭</Text>
              <Text className="text-textPrimary font-semibold text-lg">
                Sin notificaciones
              </Text>
              <Text className="text-textSecondary text-sm mt-2">
                Aquí aparecerán tus notificaciones push
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}