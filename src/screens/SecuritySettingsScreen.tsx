import { StyleSheet, Switch, Text, View } from 'react-native';
import { FRAUD_HEARTBEAT_URL } from '../api/sessionTelemetry';
import { Screen } from '../components/Screen';
import { maskAccessToken } from '../format';
import { useSession } from '../session/SessionContext';
import { colors, radius, spacing } from '../theme';

function collectorHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

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

      <View style={styles.heartbeatCard}>
        <View style={styles.heartbeatAccent} />
        <View style={styles.heartbeatHeader}>
          <Text style={styles.heartbeatTitle}>Fraud protection heartbeat</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Insecure</Text>
          </View>
        </View>

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Destination</Text>
          <Text style={styles.detailValue}>{collectorHost(FRAUD_HEARTBEAT_URL)}</Text>
        </View>

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Transport</Text>
          <Text style={styles.detailValue}>HTTP (cleartext), not HTTPS</Text>
        </View>

        <View style={styles.detailBlock}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Certificate checks</Text>
            <Text style={styles.detailOff}>Off</Text>
          </View>
          <Text style={styles.detailCaption}>
            NODE_TLS_REJECT_UNAUTHORIZED is 0. The app will accept any certificate.
          </Text>
        </View>

        <View style={[styles.detailBlock, styles.detailBlockLast]}>
          <Text style={styles.detailLabel}>Payload</Text>
          <Text style={styles.detailValue}>
            Access token sent in the Authorization header and JSON body
          </Text>
          <View style={styles.tokenChip}>
            <Text style={styles.tokenText}>{maskAccessToken(session?.accessToken)}</Text>
          </View>
        </View>

        <View style={styles.warningStrip}>
          <Text style={styles.warningText}>
            This device shares your banking session with an unencrypted collector on every API call.
          </Text>
        </View>
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
  title: { fontSize: 24, fontWeight: '700', color: colors.ink },
  lede: { color: colors.muted, marginTop: 8, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowLabel: { color: colors.ink, flex: 1, paddingRight: spacing.md },
  section: { fontWeight: '700', color: colors.ink, marginTop: spacing.md },
  meta: { color: colors.muted, marginTop: 6, marginBottom: 4 },
  heartbeatCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  heartbeatAccent: { height: 3, backgroundColor: colors.gold },
  heartbeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  heartbeatTitle: { fontWeight: '700', color: colors.ink, flex: 1, fontSize: 16 },
  statusPill: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FECDCA',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: { color: colors.error, fontSize: 12, fontWeight: '700' },
  detailBlock: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  detailBlockLast: { paddingBottom: spacing.md },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: { color: colors.muted, fontSize: 13 },
  detailValue: { color: colors.ink, fontSize: 15, fontWeight: '600', marginTop: 4 },
  detailOff: { color: colors.error, fontSize: 15, fontWeight: '700' },
  detailCaption: { color: colors.muted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  tokenChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tokenText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  warningStrip: {
    backgroundColor: '#FEF3F2',
    borderTopWidth: 1,
    borderTopColor: '#FECDCA',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  warningText: { color: colors.error, fontSize: 12, lineHeight: 17, fontWeight: '600' },
});
