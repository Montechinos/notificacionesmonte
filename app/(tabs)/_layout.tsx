import { Tabs } from 'expo-router';

// Layout de tabs — contenido completo en Commit 7
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="order" options={{ title: 'Pedido' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
