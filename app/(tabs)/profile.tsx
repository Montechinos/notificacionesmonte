import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../lib/modules/auth/AuthProvider';
import { Button } from '../../components/ui/Button';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-surface px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-textPrimary">
          Perfil 👤
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          {/* User Info Card */}
          <View className="bg-surface rounded-lg p-6 mb-6">
            <View className="items-center mb-4">
              <View className="bg-primary rounded-full w-20 h-20 items-center justify-center mb-3">
                <Text className="text-4xl">👤</Text>
              </View>
              <Text className="text-textPrimary font-bold text-xl">
                {session?.user.email?.split('@')[0]}
              </Text>
              <Text className="text-textSecondary text-sm mt-1">
                {session?.user.email}
              </Text>
            </View>

            <View className="border-t border-border pt-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-textSecondary">ID de Usuario</Text>
                <Text className="text-textPrimary font-mono text-xs">
                  {session?.user.id.slice(0, 8)}...
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-textSecondary">Creado</Text>
                <Text className="text-textPrimary">
                  {new Date(session?.user.created_at || '').toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View className="mb-6">
            <Text className="text-textPrimary font-semibold mb-3">
              Configuración
            </Text>
            
            <TouchableOpacity className="bg-surface rounded-lg p-4 mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🔔</Text>
                <Text className="text-textPrimary">Notificaciones Push</Text>
              </View>
              <Text className="text-success font-semibold">Activo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface rounded-lg p-4 mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🌙</Text>
                <Text className="text-textPrimary">Modo Oscuro</Text>
              </View>
              <Text className="text-success font-semibold">Activado</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface rounded-lg p-4 mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">🔐</Text>
                <Text className="text-textPrimary">Privacidad</Text>
              </View>
              <Text className="text-textSecondary">›</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
            size="lg"
          />

          {/* App Info */}
          <View className="mt-8 items-center">
            <Text className="text-textSecondary text-xs">
              NotificacionesMonte v1.0.0
            </Text>
            <Text className="text-textSecondary text-xs mt-1">
              Hecho con ❤️ por tu equipo
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}