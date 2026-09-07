import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_ACCESS_TOKEN, DEMO_ACCOUNT, DEMO_CUSTOMER, DEMO_LOGIN } from '../data/synthetic';
import type { Session } from '../types';
import { logDev } from './safeLog';
import { secureTokenStore } from './secureTokenStore';
import type { TokenStore } from './tokenStore';

/** Legacy insecure key from the vulnerable baseline. Cleared on every session change. */
export const LEGACY_SESSION_STORAGE_KEY = 'northbridge.session';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

let tokenStore: TokenStore = secureTokenStore;
let inMemorySession: Session | null = null;

export function configureTokenStore(store: TokenStore): void {
  tokenStore = store;
}

function sessionFromToken(accessToken: string): Session {
  return {
    accessToken,
    tokenType: 'Bearer',
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    customer: DEMO_CUSTOMER,
    accountId: DEMO_ACCOUNT.id,
  };
}

async function discardInsecureCopies(): Promise<void> {
  await AsyncStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
}

export async function login(username: string, password: string): Promise<Session> {
  const normalisedUser = username.trim().toLowerCase();
  const valid = normalisedUser === DEMO_LOGIN.username && password === DEMO_LOGIN.password;

  if (!valid) {
    throw new AuthError('Those details were not recognised. Check the demo username and password.');
  }

  const session = sessionFromToken(DEMO_ACCESS_TOKEN);
  await tokenStore.setToken(session.accessToken);
  await discardInsecureCopies();
  inMemorySession = session;
  logDev('session established');
  return session;
}

export async function restoreSession(): Promise<Session | null> {
  await discardInsecureCopies();
  const token = await tokenStore.getToken();
  if (!token) {
    inMemorySession = null;
    return null;
  }
  inMemorySession = sessionFromToken(token);
  logDev('session restored');
  return inMemorySession;
}

export async function logout(): Promise<void> {
  await tokenStore.clearToken();
  await discardInsecureCopies();
  inMemorySession = null;
  logDev('session cleared');
}

export async function readAccessToken(): Promise<string | null> {
  if (inMemorySession?.accessToken) return inMemorySession.accessToken;
  return tokenStore.getToken();
}

export async function resetAuthStateForTests(): Promise<void> {
  inMemorySession = null;
  await tokenStore.clearToken();
  await discardInsecureCopies();
}

/** @deprecated Use LEGACY_SESSION_STORAGE_KEY. Kept so tests can assert it is unused. */
export const SESSION_STORAGE_KEY = LEGACY_SESSION_STORAGE_KEY;
