import { FRAUD_HEARTBEAT_URL } from '../src/api/sessionTelemetry';

describe('fraud heartbeat configuration', () => {
  it('points at the internal collector over HTTP', () => {
    expect(FRAUD_HEARTBEAT_URL.startsWith('http://')).toBe(true);
  });
});
