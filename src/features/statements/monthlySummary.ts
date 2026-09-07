import type { Transaction } from '../../types';

export type MonthlySummary = {
  debitCount: number;
  creditCount: number;
  netPence: number;
  debitPence: number;
  creditPence: number;
  paymentSeries: number[];
};

export function summariseTransactions(transactions: Transaction[]): MonthlySummary {
  const summary = transactions.reduce<MonthlySummary>(
    (next, transaction) => {
      if (transaction.amountPence < 0) {
        next.debitCount += 1;
        next.debitPence += transaction.amountPence;
        next.paymentSeries.push(Math.abs(transaction.amountPence));
      }
      if (transaction.amountPence > 0) {
        next.creditCount += 1;
        next.creditPence += transaction.amountPence;
      }
      next.netPence += transaction.amountPence;
      return next;
    },
    { debitCount: 0, creditCount: 0, netPence: 0, debitPence: 0, creditPence: 0, paymentSeries: [] },
  );
  return { ...summary, paymentSeries: [...summary.paymentSeries].reverse() };
}

/** Balance at the start of the period, derived from the current book. */
export function periodPositionPence(balancePence: number, netPence: number): number {
  return balancePence - netPence;
}
