import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { fetchTransactions } from '../api/banking';
import { Screen } from '../components/Screen';
import { TransactionRow } from '../components/TransactionRow';
import { colors } from '../theme';
import type { Transaction } from '../types';

export function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions()
      .then(setTransactions)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load transactions.'));
  }, []);

  if (!transactions.length && !error) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator color={colors.gold} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 8 }}>
        Transactions
      </Text>
      <Text style={{ color: colors.muted, marginBottom: 16 }}>Northbridge Current Account</Text>
      {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}
      {transactions.map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      ))}
    </Screen>
  );
}
