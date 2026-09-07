import { StyleSheet, Text, View } from 'react-native';
import { formatBookedAt, formatPounds } from '../format';
import { colors, spacing } from '../theme';
import type { Transaction } from '../types';

export function TransactionRow({
  transaction,
  compact = false,
}: {
  transaction: Transaction;
  compact?: boolean;
}) {
  const credit = transaction.amountPence > 0;
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.merchant}>{transaction.merchant}</Text>
        {compact ? null : (
          <Text style={styles.meta}>
            {transaction.category} · {formatBookedAt(transaction.bookedAt)}
          </Text>
        )}
      </View>
      <Text style={[styles.amount, credit ? styles.credit : styles.debit]}>
        {credit ? '+' : ''}
        {formatPounds(transaction.amountPence)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.goldLine,
  },
  copy: { flex: 1, paddingRight: spacing.sm },
  merchant: { color: colors.white, fontSize: 16, fontWeight: '600' },
  meta: { color: colors.muted, marginTop: 4, fontSize: 13 },
  amount: { fontSize: 16, fontWeight: '600' },
  credit: { color: colors.credit },
  debit: { color: colors.white },
});
