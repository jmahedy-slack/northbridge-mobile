import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { fetchCurrentAccount, fetchTransactions, submitPayment } from '../src/api/banking';
import { SECURE_TOKEN_KEY } from '../src/auth/secureTokenStore';
import {
  AuthError,
  login,
  logout,
  resetAuthStateForTests,
  restoreSession,
  SESSION_STORAGE_KEY,
} from '../src/auth/sessionService';
import { DEMO_ACCESS_TOKEN, DEMO_LOGIN } from '../src/data/synthetic';

describe('secure authentication storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await resetAuthStateForTests();
  });

  it('stores the token through the secure storage abstraction', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await expect(SecureStore.getItemAsync(SECURE_TOKEN_KEY)).resolves.toBe(DEMO_ACCESS_TOKEN);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      SECURE_TOKEN_KEY,
      DEMO_ACCESS_TOKEN,
      expect.objectContaining({
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }),
    );
  });

  it('does not write the authentication token to AsyncStorage', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    const serialised = JSON.stringify(pairs);
    expect(keys).not.toContain(SESSION_STORAGE_KEY);
    expect(serialised).not.toContain(DEMO_ACCESS_TOKEN);
  });

  it('removes a leftover insecure AsyncStorage session on login', async () => {
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ accessToken: DEMO_ACCESS_TOKEN }),
    );
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await expect(AsyncStorage.getItem(SESSION_STORAGE_KEY)).resolves.toBeNull();
  });

  it('clears the secure token on logout', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await logout();
    await expect(SecureStore.getItemAsync(SECURE_TOKEN_KEY)).resolves.toBeNull();
    await expect(restoreSession()).resolves.toBeNull();
  });

  it('removes a leftover insecure AsyncStorage session on restore', async () => {
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ accessToken: DEMO_ACCESS_TOKEN }),
    );
    await restoreSession();
    await expect(AsyncStorage.getItem(SESSION_STORAGE_KEY)).resolves.toBeNull();
  });

  it('removes a leftover insecure AsyncStorage session on logout', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ accessToken: DEMO_ACCESS_TOKEN }),
    );
    await logout();
    await expect(AsyncStorage.getItem(SESSION_STORAGE_KEY)).resolves.toBeNull();
  });
});

describe('sensitive logging', () => {
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    await AsyncStorage.clear();
    await resetAuthStateForTests();
    spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    spy.mockRestore();
  });

  function loggedText(): string {
    return spy.mock.calls.map((args) => JSON.stringify(args)).join('\n');
  }

  it('does not log authentication tokens', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    expect(loggedText()).not.toContain(DEMO_ACCESS_TOKEN);
    expect(loggedText()).not.toMatch(/Bearer /);
  });

  it('does not log account or transaction payloads', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    spy.mockClear();
    await fetchCurrentAccount();
    await fetchTransactions();
    await submitPayment(
      {
        payeeName: 'Jordan Hale',
        sortCode: '20-45-77',
        accountNumber: '40193827',
        amountPence: 2500,
        reference: 'Dinner',
      },
      'acc_nb_current_8841',
    );
    const text = loggedText();
    expect(text).not.toContain(DEMO_ACCESS_TOKEN);
    expect(text).not.toContain('acc_nb_current_8841');
    expect(text).not.toContain('842163');
    expect(text).not.toContain('txn_nb_001');
    expect(text).not.toContain('40193827');
  });
});

describe('authentication failure', () => {
  it('does not persist a token when login fails', async () => {
    await resetAuthStateForTests();
    await expect(login(DEMO_LOGIN.username, 'nope')).rejects.toBeInstanceOf(AuthError);
    await expect(SecureStore.getItemAsync(SECURE_TOKEN_KEY)).resolves.toBeNull();
  });
});

describe('network and TLS hygiene', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await resetAuthStateForTests();
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  });

  it('does not post the access token over the network during login or banking calls', async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;

    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await fetchCurrentAccount();
    await fetchTransactions();
    await submitPayment(
      {
        payeeName: 'Jordan Hale',
        sortCode: '20-45-77',
        accountNumber: '40193827',
        amountPence: 2500,
        reference: 'Dinner',
      },
      'acc_nb_current_8841',
    );

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('does not disable TLS certificate verification', async () => {
    await login(DEMO_LOGIN.username, DEMO_LOGIN.password);
    await fetchCurrentAccount();
    expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).not.toBe('0');
  });
});
