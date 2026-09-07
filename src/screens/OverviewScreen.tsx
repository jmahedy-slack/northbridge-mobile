import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchCurrentAccount, fetchTransactions } from '../api/banking';
import { PaymentsSparkline } from '../components/PaymentsSparkline';
import { QuickActions } from '../components/QuickActions';
import { Screen } from '../components/Screen';
import { TransactionRow } from '../components/TransactionRow';
import { periodPositionPence, summariseTransactions } from '../features/statements/monthlySummary';
import { formatBalance, formatPounds, maskAccountNumber } from '../format';
import { useSession } from '../session/SessionContext';
import { isEnabled } from '../support/featureFlags';
import { colors, radius, spacing } from '../theme';
import type { Account, Transaction } from '../types';

export function OverviewScreen({
  onSend,
  onPayBill,
  onStatements,
  onMore,
}: {
  onSend: () => void;
  onPayBill: () => void;
  onStatements: () => void;
  onMore: () => void;
}) {
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
        <ActivityIndicator color={colors.gold} />
      </Screen>
    );
  }

  const spending = summariseTransactions(
    transactions.filter((txn) => txn.category !== 'Salary'),
  );
  const thisPeriodPence = account ? periodPositionPence(account.balancePence, spending.netPence) : 0;
  const preview = transactions
    .filter((txn) => isEnabled('showSalaryOnOverview') || txn.category !== 'Salary')
    .slice(0, 3);

  return (
    <Screen>
      <Text style={styles.hello}>Good morning, {session?.customer.preferredName}</Text>
      <Text style={styles.bank}>Northbridge Bank</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {account ? (
        <View style={styles.card}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.balance}>{formatBalance(account.balancePence)}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Sort code</Text>
              <Text style={styles.metaValue}>{account.sortCode}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Account number</Text>
              <Text style={styles.metaValue}>{maskAccountNumber(account.accountNumber)}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <QuickActions onSend={onSend} onPayBill={onPayBill} onStatements={onStatements} onMore={onMore} />

      {transactions.length > 0 ? (
        <View style={styles.spending}>
          <Text style={styles.section}>Spending overview</Text>
          <View style={styles.spendingRow}>
            <View style={styles.spendingCol}>
              <Text style={styles.spendingLabel}>This period</Text>
              <Text style={styles.spendingValue}>{formatBalance(thisPeriodPence)}</Text>
            </View>
            <View style={[styles.spendingCol, styles.spendingCenter]}>
              <Text style={styles.spendingLabel}>payments</Text>
              <PaymentsSparkline values={spending.paymentSeries} />
            </View>
            <View style={[styles.spendingCol, styles.spendingEnd]}>
              <Text style={styles.spendingLabel}>net</Text>
              <View style={styles.netRow}>
                <View style={styles.netSwatch} />
                <Text style={styles.netValue}>{formatPounds(spending.netPence)}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      <Text style={[styles.section, styles.transactionsHeading]}>Recent transactions</Text>
      {preview.map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} compact />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: 24, fontWeight: '700', color: colors.white },
  bank: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg, fontSize: 15 },
  card: {
    backgroundColor: colors.creamCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  accountName: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  balance: { color: colors.ink, fontSize: 34, fontWeight: '700', marginVertical: spacing.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  metaBlock: { flex: 1 },
  metaLabel: { color: colors.mutedDark, fontSize: 12, marginBottom: 4 },
  metaValue: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  spending: { marginBottom: spacing.lg },
  section: { fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: spacing.sm },
  spendingRow: { flexDirection: 'row', alignItems: 'flex-end' },
  spendingCol: { flex: 1 },
  spendingCenter: { alignItems: 'center' },
  spendingEnd: { alignItems: 'flex-end' },
  spendingLabel: { color: colors.muted, fontSize: 12, marginBottom: 6 },
  spendingValue: { color: colors.white, fontSize: 16, fontWeight: '700' },
  netRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  netSwatch: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.gold },
  netValue: { color: colors.gold, fontSize: 16, fontWeight: '700' },
  transactionsHeading: { marginBottom: 0 },
  error: { color: colors.error, marginBottom: spacing.md },
});
