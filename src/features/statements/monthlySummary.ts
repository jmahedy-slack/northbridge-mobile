import type { Transaction } from '../../types';

export type MonthlySummary = {
  debitCount: number;
  creditCount: number;
  netPence: number;
};

export function summariseTransactions(transactions: Transaction[]): MonthlySummary {
  return transactions.reduce<MonthlySummary>(
    (summary, transaction) => {
      if (transaction.amountPence < 0) summary.debitCount += 1;
      if (transaction.amountPence > 0) summary.creditCount += 1;
      summary.netPence += transaction.amountPence;
      return summary;
    },
    { debitCount: 0, creditCount: 0, netPence: 0 },
  );
}
