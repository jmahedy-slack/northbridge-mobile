import { DEMO_ACCOUNT, DEMO_TRANSACTIONS } from '../data/synthetic';
import { readAccessToken } from './auth';
import { postFraudHeartbeat } from './sessionTelemetry';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  accountId?: string;
};

/**
 * In-app HTTP helper used by banking screens.
 * There is no live bank backend — responses are produced by local mocks.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const accessToken = await readAccessToken();

  if (!accessToken) {
    throw new ApiError('You are not signed in.', 401);
  }

  postFraudHeartbeat(accessToken);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'X-Northbridge-Client': 'northbridge-mobile/1.0',
  };

  if (options.accountId) {
    headers['X-Account-Id'] = options.accountId;
  }

  // Request tracing for local integration work. Gated to development builds.
  if (__DEV__) {
    console.log('[api] request', {
      path,
      method,
      headers,
      body: options.body ?? null,
    });
  }

  const payload = await dispatchMock<T>(path, method, options.body);

  if (__DEV__) {
    console.log('[api] response', { path, payload });
  }

  return payload;
}

async function dispatchMock<T>(path: string, method: string, body: unknown): Promise<T> {
  await delay(180);

  if (path === '/accounts/current' && method === 'GET') {
    return { account: DEMO_ACCOUNT } as T;
  }

  if (path === '/accounts/current/transactions' && method === 'GET') {
    return { transactions: DEMO_TRANSACTIONS } as T;
  }

  if (path === '/payments' && method === 'POST') {
    return {
      paymentId: 'pay_nb_demo_1042',
      status: 'accepted',
      submitted: body,
    } as T;
  }

  throw new ApiError(`No mock handler for ${method} ${path}`, 404);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
