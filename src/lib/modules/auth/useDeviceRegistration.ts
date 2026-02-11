import { useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@src/lib/core/supabase';
import { getExpoPushToken } from '@src/lib/core/notifications';
import { deviceStorage } from '@src/lib/core/storage';

// Hook que registra o actualiza el push token del dispositivo en Supabase
export function useDeviceRegistration(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    const registerDevice = async () => {
      const token = await getExpoPushToken();
      if (!token) return;

      const cached = await deviceStorage.getPushToken();

      // Evitar re-registrar si el token no cambió
      if (cached === token) return;

      await supabase.from('devices').upsert(
        {
          user_id: userId,
          push_token: token,
          platform: Platform.OS,
        },
        { onConflict: 'user_id,push_token' }
      );

      await deviceStorage.savePushToken(token);
    };

    registerDevice();
  }, [userId]);
}
