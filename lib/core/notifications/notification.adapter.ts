import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const NotificationAdapter = {
  // 1. Configuración Global ------------------------------------------
  setup: () => {
    // Definimos qué pasa si recibimos una notificación con la APP ABIERTA (Foreground)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        // 🔔 shouldShowAlert: 
        // true = Permite mostrar alertas visuales en general.
        // false = Silencia la notificación visualmente.
        shouldShowAlert: true,

        // 🔊 shouldPlaySound: 
        // true = Reproduce el sonido o vibración del sistema.
        shouldPlaySound: true,

        // 🔴 shouldSetBadge: 
        // false = No altera el contador rojo de la app (Home Screen).
        shouldSetBadge: false,

        // 🏳️ shouldShowBanner (iOS Nuevo Standard):
        // true = Muestra el banner deslizable desde arriba (como un mensaje normal).
        shouldShowBanner: true,

        // 📜 shouldShowList (iOS Nuevo Standard):
        // true = Mantiene la notificación visible en el Centro de Notificaciones.
        shouldShowList: true,
      }),
    });
  },

  // 2. Método Principal: Obtener el Token ----------------------------
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    let token;

    // A. Configuración específica para ANDROID 🤖
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default', // Nombre interno del canal
        importance: Notifications.AndroidImportance.MAX, // Máxima prioridad (suena y vibra)
        vibrationPattern: [0, 250, 250, 250], // Patrón de vibración
        lightColor: '#FF6366F1', // Color del LED de notificación (nuestra primary)
      });
    }

    // B. Verificación de Dispositivo Físico 📱
    // (Los simuladores NO tienen Push Token, fallarán si no verificamos esto)
    if (Device.isDevice) {
      
      // C. Gestión de Permisos (La parte aburrida pero vital) 👮
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si no tenemos permiso aún, lo pedimos amablemente
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Si el usuario dijo que NO... nos rendimos :(
      if (finalStatus !== 'granted') {
        console.log('¡Permiso denegado por el usuario!');
        return null;
      }

      // D. ¡Éxito! Obtenemos el Token 🎟️
      // El projectId es vital para EAS Build
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
      
    } else {
      console.log('⚠️ Debes usar un dispositivo físico para probar Push Notifications');
    }

    return token || null;
  }
};