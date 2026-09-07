import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type IconProps = {
  color?: string;
  size?: number;
};

function tone(color?: string) {
  return color ?? colors.navyDeep;
}

export function SendIcon({ color, size = 22 }: IconProps) {
  const c = tone(color);
  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      <View style={[styles.arrowRow, { marginBottom: 5 }]}>
        <View style={[styles.shaft, { backgroundColor: c, flex: 1 }]} />
        <View style={[styles.chevronRight, { borderLeftColor: c }]} />
      </View>
      <View style={styles.arrowRow}>
        <View style={[styles.chevronLeft, { borderRightColor: c }]} />
        <View style={[styles.shaft, { backgroundColor: c, flex: 1 }]} />
      </View>
    </View>
  );
}

export function CardIcon({ color, size = 22 }: IconProps) {
  const c = tone(color);
  return (
    <View
      style={{
        width: size,
        height: size * 0.68,
        borderRadius: 3,
        borderWidth: 1.6,
        borderColor: c,
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <View style={{ height: 4, backgroundColor: c, marginTop: 4 }} />
    </View>
  );
}

export function DocumentIcon({ color, size = 22 }: IconProps) {
  const c = tone(color);
  return (
    <View
      style={{
        width: size * 0.72,
        height: size,
        borderRadius: 2,
        borderWidth: 1.6,
        borderColor: c,
        paddingHorizontal: 3,
        paddingTop: 5,
        gap: 3,
      }}
    >
      <View style={[styles.line, { backgroundColor: c }]} />
      <View style={[styles.line, { backgroundColor: c, width: '70%' }]} />
      <View style={[styles.line, { backgroundColor: c, width: '85%' }]} />
    </View>
  );
}

export function MoreIcon({ color, size = 22 }: IconProps) {
  const c = tone(color);
  const dot = size * 0.16;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
      <View style={{ width: dot, height: dot, borderRadius: dot, backgroundColor: c }} />
      <View style={{ width: dot, height: dot, borderRadius: dot, backgroundColor: c }} />
      <View style={{ width: dot, height: dot, borderRadius: dot, backgroundColor: c }} />
    </View>
  );
}

export function WalletIcon({ color, size = 22 }: IconProps) {
  const c = tone(color);
  return (
    <View
      style={{
        width: size,
        height: size * 0.72,
        borderRadius: 3,
        borderWidth: 1.6,
        borderColor: c,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 3,
      }}
    >
      <View
        style={{
          width: size * 0.28,
          height: size * 0.22,
          borderRadius: 2,
          borderWidth: 1.4,
          borderColor: c,
        }}
      />
    </View>
  );
}

export function ProfileIcon({ color, size = 22 }: IconProps) {
  const c = tone(color);
  const head = size * 0.28;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        style={{
          width: head,
          height: head,
          borderRadius: head,
          borderWidth: 1.6,
          borderColor: c,
          marginBottom: 3,
        }}
      />
      <View
        style={{
          width: size * 0.7,
          height: size * 0.32,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderWidth: 1.6,
          borderBottomWidth: 0,
          borderColor: c,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  arrowRow: { flexDirection: 'row', alignItems: 'center' },
  shaft: { height: 2, borderRadius: 1 },
  chevronRight: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  chevronLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  line: { height: 1.6, width: '100%', borderRadius: 1 },
});
