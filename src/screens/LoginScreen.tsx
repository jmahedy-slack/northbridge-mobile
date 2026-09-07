import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuthError } from '../api/auth';
import { PrimaryButton } from '../components/PrimaryButton';
import { DEMO_LOGIN } from '../data/synthetic';
import { useSession } from '../session/SessionContext';
import { colors, radius, spacing } from '../theme';

export function LoginScreen() {
  const { signIn } = useSession();
  const [username, setUsername] = useState(DEMO_LOGIN.username);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError(null);
    setBusy(true);
    try {
      await signIn(username, password);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Unable to sign in right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.hero}>
        <Text style={styles.kicker}>Northbridge Bank</Text>
        <Text style={styles.title}>Northbridge Mobile</Text>
        <Text style={styles.subtitle}>Personal banking for demonstration only</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          testID="login-username"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          testID="login-password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={busy ? 'Signing in…' : 'Sign in'} onPress={onSubmit} disabled={busy} />
        <Text style={styles.hint}>
          Demo login: {DEMO_LOGIN.username} / {DEMO_LOGIN.password}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy, justifyContent: 'flex-end' },
  hero: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  kicker: { color: colors.gold, letterSpacing: 1.4, textTransform: 'uppercase', fontSize: 12 },
  title: { color: colors.white, fontSize: 32, fontWeight: '700', marginTop: spacing.sm },
  subtitle: { color: '#C9D3DE', marginTop: spacing.sm, fontSize: 15 },
  card: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  label: { color: colors.muted, marginBottom: 6, marginTop: spacing.md, fontSize: 13 },
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
  error: { color: colors.error, marginVertical: spacing.sm },
  hint: { textAlign: 'center', color: colors.muted, marginTop: spacing.md, fontSize: 13 },
});
