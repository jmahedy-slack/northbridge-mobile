import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useSession } from '../session/SessionContext';
import { colors, radius, spacing } from '../theme';

export function ProfileScreen({ onOpenSecurity }: { onOpenSecurity: () => void }) {
  const { session, signOut } = useSession();
  const customer = session?.customer;

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{customer?.fullName}</Text>
        <Text style={styles.meta}>{customer?.email}</Text>
        <Text style={styles.meta}>Membership {customer?.membershipNumber}</Text>
      </View>

      <Pressable onPress={onOpenSecurity} style={styles.row} accessibilityRole="button">
        <Text style={styles.rowTitle}>Security settings</Text>
        <Text style={styles.rowHint}>Password, devices and session</Text>
      </Pressable>

      <View style={{ marginTop: spacing.lg }}>
        <PrimaryButton label="Sign out" onPress={() => void signOut()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.navyMid,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  name: { fontSize: 20, fontWeight: '700', color: colors.white },
  meta: { color: colors.muted, marginTop: 6 },
  row: {
    backgroundColor: colors.navyMid,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: colors.white },
  rowHint: { color: colors.muted, marginTop: 4 },
});
