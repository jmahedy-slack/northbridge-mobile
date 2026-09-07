export function formatPounds(amountPence: number): string {
  const absolute = Math.abs(amountPence) / 100;
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(absolute);
  return amountPence < 0 ? `−${formatted}` : formatted;
}

export function formatBalance(amountPence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amountPence / 100);
}

export function formatBookedAt(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
}

export function maskAccountNumber(accountNumber: string): string {
  return `•••• ${accountNumber.slice(-4)}`;
}

const ACCESS_TOKEN_PUBLIC_PREFIX = 'nb.syn.access';
const ACCESS_TOKEN_MASK = '••••••••';

/**
 * Display-only mask for the synthetic access token.
 * The live token value is never interpolated into the returned string.
 */
export function maskAccessToken(token: string | undefined): string {
  if (token?.startsWith(ACCESS_TOKEN_PUBLIC_PREFIX)) {
    return `${ACCESS_TOKEN_PUBLIC_PREFIX}${ACCESS_TOKEN_MASK}`;
  }
  return ACCESS_TOKEN_MASK;
}
