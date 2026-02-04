import { usePushNotifications } from "@/lib/core/notifications/usePushNotifications";
import { AuthProvider, useAuth } from "@/lib/modules/auth/AuthProvider";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import "../global.css";

function AuthLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 1. Iniciamos el sistema de notificaciones
  const userId = session?.user.id;
  usePushNotifications(userId);

  // 2. Efecto de Protección de Rutas
  useEffect(() => {
    if (loading) return; // Esperamos a saber si hay sesión o no

    // Verificamos si estamos en el grupo de rutas de autenticación (login/register)
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // ⛔ Si NO hay usuario y NO estamos en login -> Mandar a Login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // ✅ Si HAY usuario y estamos en login -> Mandar al Home
      router.replace('./(tabs)/feed');
    }
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E293B',
        },
        headerTintColor: '#F1F5F9',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}