import { DEMO_ACCESS_TOKEN } from '../src/data/synthetic';
import { maskAccessToken } from '../src/format';

describe('maskAccessToken', () => {
  it('shows only the public prefix and a bullet mask', () => {
    expect(maskAccessToken(DEMO_ACCESS_TOKEN)).toBe('nb.syn.access••••••••');
  });

  it('never interpolates the live token suffix', () => {
    const masked = maskAccessToken(DEMO_ACCESS_TOKEN);
    expect(masked).not.toContain('7f3a2c91e04b');
    expect(masked).not.toBe(DEMO_ACCESS_TOKEN);
  });
});
