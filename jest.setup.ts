import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-secure-store', () => {
  const memory = new Map<string, string>();
  (globalThis as { __nbSecureMemory?: Map<string, string> }).__nbSecureMemory = memory;
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
    getItemAsync: jest.fn(async (key: string) => memory.get(key) ?? null),
    setItemAsync: jest.fn(
      async (key: string, value: string, _options?: { keychainAccessible?: string }) => {
        memory.set(key, value);
      },
    ),
    deleteItemAsync: jest.fn(async (key: string) => {
      memory.delete(key);
    }),
  };
});

beforeEach(() => {
  (globalThis as { __nbSecureMemory?: Map<string, string> }).__nbSecureMemory?.clear();
});
