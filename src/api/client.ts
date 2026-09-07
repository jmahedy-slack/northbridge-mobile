import { DEMO_ACCOUNT, DEMO_TRANSACTIONS } from '../data/synthetic';
import { logDev } from '../auth/safeLog';
import { readAccessToken } from '../auth/sessionService';

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

  logDev('api request', { method, path });

  return dispatchMock<T>(path, method, options.body);
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
