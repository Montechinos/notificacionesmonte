import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@src/lib/modules/auth';
import { Input } from '@src/components/ui/Input';
import { Button } from '@src/components/ui/Button';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'El correo es requerido';
    if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      const friendly = msg.includes('Invalid login')
        ? 'Email o contraseña incorrectos.'
        : msg.includes('Email not confirmed')
        ? 'Confirmá tu email antes de iniciar sesión, o desactivá la confirmación en Supabase.'
        : msg;
      Alert.alert('Error', friendly);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-12">
        <View className="mb-10 items-center">
          <Text className="text-6xl">🍔</Text>
          <Text className="mt-3 text-3xl font-extrabold text-red-600">BurgerMonte</Text>
          <Text className="mt-1 text-sm text-gray-500">Tu burger a medida</Text>
        </View>

        <Input
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          error={errors.password}
        />

        <Button label="Iniciar sesión" onPress={handleLogin} isLoading={isLoading} />

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500">¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" asChild>
            <Text className="font-semibold text-red-600">Regístrate</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
