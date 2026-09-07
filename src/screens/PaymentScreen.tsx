import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { submitPayment } from '../api/banking';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useSession } from '../session/SessionContext';
import { colors, radius, spacing } from '../theme';

export function PaymentScreen() {
  const { session } = useSession();
  const [payeeName, setPayeeName] = useState('Jordan Hale');
  const [sortCode, setSortCode] = useState('20-45-77');
  const [accountNumber, setAccountNumber] = useState('40193827');
  const [amount, setAmount] = useState('25.00');
  const [reference, setReference] = useState('Dinner');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError(null);
    setMessage(null);
    const pounds = Number.parseFloat(amount);
    if (!session?.accountId || Number.isNaN(pounds) || pounds <= 0) {
      setError('Enter a valid amount to continue.');
      return;
    }
    setBusy(true);
    try {
      const result = await submitPayment(
        {
          payeeName,
          sortCode,
          accountNumber,
          amountPence: Math.round(pounds * 100),
          reference,
        },
        session.accountId,
      );
      setMessage(`Payment accepted (${result.paymentId}). This is a simulated transfer.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be submitted.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Send a payment</Text>
      <Text style={styles.lede}>From Northbridge Current Account. Demo only — nothing leaves this device.</Text>

      <Field label="Payee" value={payeeName} onChange={setPayeeName} />
      <Field label="Sort code" value={sortCode} onChange={setSortCode} />
      <Field label="Account number" value={accountNumber} onChange={setAccountNumber} />
      <Field label="Amount (£)" value={amount} onChange={setAmount} keyboardType="decimal-pad" />
      <Field label="Reference" value={reference} onChange={setReference} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <View style={{ marginTop: spacing.md }}>
        <PrimaryButton label={busy ? 'Sending…' : 'Confirm payment'} onPress={onSubmit} disabled={busy} />
      </View>
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: 'decimal-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.input} keyboardType={keyboardType} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.ink },
  lede: { color: colors.muted, marginTop: 6, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  label: { color: colors.muted, marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  error: { color: colors.error, marginBottom: spacing.sm },
  success: { color: colors.credit, marginBottom: spacing.sm },
});
