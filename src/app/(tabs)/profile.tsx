import React, { useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@src/lib/modules/auth';
import { Button } from '@src/components/ui/Button';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  const [confirming, setConfirming] = useState(false);

  const handleSignOut = async () => {
    // En web usamos confirm() nativo del browser; en nativo mostramos un segundo botón
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      const ok = window.confirm('¿Cerrar sesión?');
      if (ok) await signOut();
      return;
    }
    // En nativo: primer tap muestra confirmación, segundo tap ejecuta
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setConfirming(false);
    await signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="flex-grow px-6 py-8">
        {/* Avatar */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <Text className="text-5xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">
            {user?.user_metadata?.full_name ?? 'Usuario'}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">{user?.email}</Text>
        </View>

        {/* Info */}
        <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Cuenta
          </Text>
          <InfoRow label="Email" value={user?.email ?? '-'} />
          <InfoRow
            label="Miembro desde"
            value={user?.created_at
              ? new Date(user.created_at).toLocaleDateString('es-AR')
              : '-'}
          />
        </View>

        <View className="mt-auto gap-3">
          <Button
            label={confirming ? '¿Seguro? Tocá de nuevo para salir' : 'Cerrar sesión'}
            variant={confirming ? 'secondary' : 'ghost'}
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
