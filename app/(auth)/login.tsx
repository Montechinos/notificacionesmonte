import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/modules/auth/AuthProvider';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/notifications/Toast';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  
  
  const { signInWithEmail } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({ visible: true, message: 'Por favor completa todos los campos', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      setToast({ visible: true, message: '¡Bienvenido de vuelta!', type: 'success' });
    } catch (error: any) {
      setToast({ visible: true, message: error.message || 'Error al iniciar sesión', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-textPrimary mb-2">
              ¡Bienvenido! 👋
            </Text>
            <Text className="text-textSecondary text-base">
              Inicia sesión para continuar
            </Text>
          </View>

          {/* Form */}
          <View>
            <Input
              label="Correo Electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
              size="lg"
            />
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-textSecondary">
              ¿No tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary font-semibold mt-1">
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </KeyboardAvoidingView>
  );
}