import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SessionProvider } from './src/session/SessionProvider';
import { colors } from './src/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.frame}>
        <SafeAreaProvider>
          <SessionProvider>
            <RootNavigator />
            <StatusBar style="light" />
          </SessionProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const webShell = Platform.OS === 'web';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navyDeep,
    alignItems: webShell ? 'center' : undefined,
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: webShell ? 430 : undefined,
    backgroundColor: colors.navyDeep,
  },
});
