/**
 * Persistence for the authentication token only.
 * Implementations must use platform-backed secure storage, not AsyncStorage.
 */
export type TokenStore = {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
};
