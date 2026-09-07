import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export function PaymentsSparkline({ values }: { values: number[] }) {
  const series = values.length > 0 ? values : [4, 8, 5, 10, 7];
  const max = Math.max(...series, 1);

  return (
    <View style={styles.chart} accessibilityLabel="Payments this period">
      {series.map((value, index) => {
        const height = Math.max(4, Math.round((value / max) * 22));
        return <View key={`${value}-${index}`} style={[styles.bar, { height }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 28,
    minWidth: 56,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
  },
  bar: {
    width: 5,
    borderRadius: 1,
    backgroundColor: colors.gold,
  },
});
