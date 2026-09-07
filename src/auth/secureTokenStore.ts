import * as SecureStore from 'expo-secure-store';
import type { TokenStore } from './tokenStore';

const TOKEN_KEY = 'northbridge.accessToken';

export const secureTokenStore: TokenStore = {
  async getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  async clearToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

export const SECURE_TOKEN_KEY = TOKEN_KEY;
