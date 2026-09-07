import { DEMO_TRANSACTIONS } from '../src/data/synthetic';
import { periodPositionPence, summariseTransactions } from '../src/features/statements/monthlySummary';

describe('monthly statement summary', () => {
  it('nets the seeded demo transactions', () => {
    const summary = summariseTransactions(DEMO_TRANSACTIONS);
    expect(summary.debitCount).toBe(5);
    expect(summary.creditCount).toBe(1);
    expect(summary.netPence).toBe(384758);
    expect(summary.debitPence).toBe(-40242);
    expect(summary.creditPence).toBe(425000);
  });

  it('orders the payments sparkline oldest first', () => {
    const summary = summariseTransactions(DEMO_TRANSACTIONS);
    expect(summary.paymentSeries).toEqual([9142, 28450, 520, 680, 1450]);
  });

  it('derives the period opening position from the current balance', () => {
    expect(periodPositionPence(842163, -40242)).toBe(882405);
  });
});
