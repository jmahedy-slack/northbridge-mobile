import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchCurrentAccount, fetchTransactions } from '../api/banking';
import { Screen } from '../components/Screen';
import { TransactionRow } from '../components/TransactionRow';
import { formatBalance, maskAccountNumber } from '../format';
import { useSession } from '../session/SessionContext';
import { colors, radius, spacing } from '../theme';
import type { Account, Transaction } from '../types';

export function OverviewScreen({ onSeeAll }: { onSeeAll: () => void }) {
  const { session } = useSession();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchCurrentAccount(), fetchTransactions()])
      .then(([nextAccount, nextTransactions]) => {
        if (cancelled) return;
        setAccount(nextAccount);
        setTransactions(nextTransactions);
        if (__DEV__) {
          console.log('[overview] loaded customer book', {
            customerId: session?.customer.id,
            accountId: nextAccount.id,
            balancePence: nextAccount.balancePence,
            transactionIds: nextTransactions.map((txn) => txn.id),
          });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load account.');
      });
    return () => {
      cancelled = true;
    };
  }, [session?.customer.id]);

  if (!account && !error) {
    return (
      <Screen scroll={false}>
        <ActivityIndicator color={colors.navy} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.hello}>Good morning, {session?.customer.preferredName}</Text>
      <Text style={styles.bank}>Northbridge Bank</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {account ? (
        <View style={styles.card}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.balance}>{formatBalance(account.balancePence)}</Text>
          <Text style={styles.meta}>
            {account.sortCode} · {maskAccountNumber(account.accountNumber)}
          </Text>
        </View>
      ) : null}

      <View style={styles.headerRow}>
        <Text style={styles.section}>Recent transactions</Text>
        <Pressable onPress={onSeeAll} accessibilityRole="button">
          <Text style={styles.link}>See all</Text>
        </Pressable>
      </View>
      {transactions.slice(0, 4).map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: 24, fontWeight: '700', color: colors.ink },
  bank: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  accountName: { color: colors.gold, fontSize: 14 },
  balance: { color: colors.white, fontSize: 32, fontWeight: '700', marginVertical: spacing.sm },
  meta: { color: '#C9D3DE' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  section: { fontSize: 18, fontWeight: '700', color: colors.ink },
  link: { color: colors.navyMid, fontWeight: '600' },
  error: { color: colors.error, marginBottom: spacing.md },
});
