import { useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@src/lib/core/supabase';
import { getExpoPushToken } from '@src/lib/core/notifications';
import { deviceStorage } from '@src/lib/core/storage';

export function useDeviceRegistration(userId: string | undefined) {
  useEffect(() => {
    // Push tokens solo funcionan en dispositivos nativos físicos
    if (!userId || Platform.OS === 'web') return;

    const registerDevice = async () => {
      const token = await getExpoPushToken();
      if (!token) return;

      const cached = await deviceStorage.getPushToken();
      if (cached === token) return;

      await supabase.from('devices').upsert(
        { user_id: userId, push_token: token, platform: Platform.OS },
        { onConflict: 'user_id,push_token' }
      );

      await deviceStorage.savePushToken(token);
    };

    registerDevice();
  }, [userId]);
}
