import { Redirect } from 'expo-router';

// La pantalla raíz delega la navegación al layout que evalúa la sesión
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
