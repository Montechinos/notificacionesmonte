import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@src/lib/modules/auth';
import { Input } from '@src/components/ui/Input';
import { Button } from '@src/components/ui/Button';

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!fullName.trim()) e.fullName = 'El nombre es requerido';
    if (!email.trim()) e.email = 'El correo es requerido';
    if (password.length < 8) {
      e.password = 'Mínimo 8 caracteres';
    } else if (!/[A-Z]/.test(password)) {
      e.password = 'Necesita al menos una mayúscula (ej: A)';
    } else if (!/[a-z]/.test(password)) {
      e.password = 'Necesita al menos una minúscula (ej: a)';
    } else if (!/[0-9]/.test(password)) {
      e.password = 'Necesita al menos un número (ej: 1)';
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      e.password = 'Necesita al menos un símbolo (ej: ! @ # $)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await signUp(email.trim(), password, fullName.trim());
      Alert.alert('¡Bienvenido!', 'Cuenta creada. Revisa tu correo para confirmar.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      const friendly = msg.includes('429') || msg.includes('rate')
        ? 'Demasiados intentos. Esperá 2 minutos e intentá con otro email.'
        : msg.includes('already registered')
        ? 'Ese email ya está registrado. Intentá iniciar sesión.'
        : msg.includes('422') || msg.includes('weak') || msg.includes('password')
        ? 'Contraseña muy débil. Usá mayúsculas, números y símbolos. Ej: Burger123!'
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
          <Text className="mt-3 text-3xl font-extrabold text-red-600">Crear cuenta</Text>
          <Text className="mt-1 text-sm text-gray-500">Únete a BurgerMonte</Text>
        </View>

        <Input
          label="Nombre completo"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Juan Pérez"
          error={errors.fullName}
        />
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
          autoCapitalize="none"
        />
        <Text className="mb-4 -mt-2 text-xs text-gray-400">Mínimo 8 caracteres · mayúscula · número · símbolo (ej: Burger123!)</Text>

        <Button label="Crear cuenta" onPress={handleRegister} isLoading={isLoading} />

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500">¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" asChild>
            <Text className="font-semibold text-red-600">Inicia sesión</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
