import React from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@src/lib/modules/auth';
import { Button } from '@src/components/ui/Button';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="flex-grow px-6 py-8">
        <View className="mb-8 items-center">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <Text className="text-5xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">
            {user?.user_metadata?.full_name ?? 'Usuario'}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">{user?.email}</Text>
        </View>

        <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Cuenta
          </Text>
          <InfoRow label="Email" value={user?.email ?? '-'} />
          <InfoRow
            label="Miembro desde"
            value={
              user?.created_at
                ? new Date(user.created_at).toLocaleDateString('es-AR')
                : '-'
            }
          />
        </View>

        <View className="mt-auto">
          <Button
            label="Cerrar sesión"
            variant="ghost"
            onPress={handleSignOut}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-medium text-gray-900">{value}</Text>
    </View>
  );
}
