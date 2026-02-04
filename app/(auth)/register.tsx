import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/core/supabase/client.supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/notifications/Toast';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  
  
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      setToast({ visible: true, message: 'Por favor completa todos los campos', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // 1. Crear usuario en Auth
      const { data: { session, user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // 2. Crear Perfil para disparar el Trigger
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: user?.id, 
          email: user?.email, 
          first_name: firstName, 
          last_name: lastName 
        }]);
      
      if (profileError) {
        console.error("Error creando perfil:", profileError);
      }

      setToast({ visible: true, message: '¡Cuenta creada! Espera tu notificación de bienvenida...', type: 'success' });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.replace('./(tabs)/feed');
      }, 2000);

    } catch (error: any) {
      setToast({ visible: true, message: error.message || 'Error al crear cuenta', type: 'error' });
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
          <View className="mb-8">
            <Text className="text-4xl font-bold text-textPrimary mb-2">
              Crear Cuenta 🚀
            </Text>
            <Text className="text-textSecondary text-base">
              Únete y recibe notificaciones personalizadas
            </Text>
          </View>

          {/* Form */}
          <View>
            <Input
              label="Nombre"
              placeholder="Juan"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <Input
              label="Apellido"
              placeholder="Pérez"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              variant="primary"
              size="lg"
            />
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-textSecondary">
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary font-semibold mt-1">
                Iniciar sesión
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