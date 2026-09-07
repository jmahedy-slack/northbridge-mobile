import { DEMO_TRANSACTIONS } from '../src/data/synthetic';
import { summariseTransactions } from '../src/features/statements/monthlySummary';

describe('monthly statement summary', () => {
  it('nets the seeded demo transactions', () => {
    const summary = summariseTransactions(DEMO_TRANSACTIONS);
    expect(summary.debitCount).toBe(3);
    expect(summary.creditCount).toBe(1);
    expect(summary.netPence).toBe(383190);
  });
});
