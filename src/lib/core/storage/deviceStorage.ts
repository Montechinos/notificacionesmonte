import * as SecureStore from 'expo-secure-store';

const DEVICE_TOKEN_KEY = 'burgermonte_push_token';

export const deviceStorage = {
  async savePushToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(DEVICE_TOKEN_KEY, token);
  },

  async getPushToken(): Promise<string | null> {
    return SecureStore.getItemAsync(DEVICE_TOKEN_KEY);
  },

  async clearPushToken(): Promise<void> {
    await SecureStore.deleteItemAsync(DEVICE_TOKEN_KEY);
  },
};
