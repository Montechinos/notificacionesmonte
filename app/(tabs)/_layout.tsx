import { Tabs } from 'expo-router';
// 1. IMPORTANTE: Agregamos Text a la importación
import { View, Text } from 'react-native'; 

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#475569',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            /* 2. El View solo maneja la opacidad */
            <View style={{ opacity: focused ? 1 : 0.6 }}>
              {/* 3. El Text maneja el tamaño del emoji */}
              <Text style={{ fontSize: 24 }}>🔔</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ opacity: focused ? 1 : 0.6 }}>
              {/* Usamos Text aquí también */}
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}