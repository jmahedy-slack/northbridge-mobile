import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_ACCESS_TOKEN, DEMO_ACCOUNT, DEMO_CUSTOMER, DEMO_LOGIN } from '../data/synthetic';
import type { Session } from '../types';

/**
 * Session blob stored for returning users.
 *
 * AsyncStorage is used because it is the Expo-supported persistence API that
 * works in Expo Go without additional native configuration. The payload is
 * JSON so the customer profile can be restored with the token in one read.
 */
export const SESSION_STORAGE_KEY = 'northbridge.session';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

function buildSession(): Session {
  return {
    accessToken: DEMO_ACCESS_TOKEN,
    tokenType: 'Bearer',
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    customer: DEMO_CUSTOMER,
    accountId: DEMO_ACCOUNT.id,
  };
}

export async function login(username: string, password: string): Promise<Session> {
  const normalisedUser = username.trim().toLowerCase();
  const valid =
    normalisedUser === DEMO_LOGIN.username && password === DEMO_LOGIN.password;

  if (!valid) {
    throw new AuthError('Those details were not recognised. Check the demo username and password.');
  }

  const session = buildSession();

  // Persist the full session so cold starts can skip the login screen.
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  if (__DEV__) {
    // Helpful when tracing login against the mock identity service.
    console.log('[auth] session persisted', {
      customerId: session.customer.id,
      accountId: session.accountId,
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
    });
  }

  return session;
}

export async function restoreSession(): Promise<Session | null> {
  const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Session;
    if (__DEV__) {
      console.log('[auth] restored session', {
        customerId: session.customer?.id,
        accessToken: session.accessToken,
      });
    }
    return session?.accessToken ? session : null;
  } catch {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function readAccessToken(): Promise<string | null> {
  const session = await restoreSession();
  return session?.accessToken ?? null;
}
