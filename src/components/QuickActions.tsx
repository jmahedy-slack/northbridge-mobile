import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import { CardIcon, DocumentIcon, MoreIcon, SendIcon } from './NavIcons';

type Action = {
  key: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
};

export function QuickActions({
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
  const actions: Action[] = [
    { key: 'send', label: 'Send', icon: <SendIcon />, onPress: onSend },
    { key: 'bill', label: 'Pay bill', icon: <CardIcon />, onPress: onPayBill },
    { key: 'statements', label: 'Statements', icon: <DocumentIcon />, onPress: onStatements },
    { key: 'more', label: 'More', icon: <MoreIcon />, onPress: onMore },
  ];

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={styles.item}
        >
          <View style={styles.circle}>{action.icon}</View>
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  item: { alignItems: 'center', width: 72 },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: { color: colors.gold, fontSize: 12, fontWeight: '600' },
});
