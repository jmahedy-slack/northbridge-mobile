import { StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { useSession } from '../session/SessionContext';
import { colors, radius, spacing } from '../theme';

export function SecuritySettingsScreen() {
  const { session } = useSession();

  return (
    <Screen>
      <Text style={styles.title}>Security settings</Text>
      <Text style={styles.lede}>
        These controls are illustrative. They do not connect to a live identity platform.
      </Text>

      <View style={styles.card}>
        <Row label="Stay signed in on this device" value />
        <Row label="Notify me of new sign-ins" value />
        <Row label="Hide balances on the lock screen" value={false} last />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Current session</Text>
        <Text style={styles.meta}>Customer {session?.customer.id}</Text>
        <Text style={styles.meta}>Expires {session?.expiresAt ? new Date(session.expiresAt).toLocaleString('en-GB') : '—'}</Text>
      </View>
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: boolean; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} disabled />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.white },
  lede: { color: colors.muted, marginTop: 8, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.navyMid,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.goldLine },
  rowLabel: { color: colors.white, flex: 1, paddingRight: spacing.md },
  section: { fontWeight: '700', color: colors.white, marginTop: spacing.md },
  meta: { color: colors.muted, marginTop: 6, marginBottom: 4 },
});
