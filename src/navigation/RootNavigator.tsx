import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { OverviewScreen } from '../screens/OverviewScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SecuritySettingsScreen } from '../screens/SecuritySettingsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { useSession } from '../session/SessionContext';
import { colors } from '../theme';
import { ProfileIcon, SendIcon, WalletIcon } from '../components/NavIcons';

export type HomeStackParamList = {
  Overview: undefined;
  Transactions: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  SecuritySettings: undefined;
};

type TabParamList = {
  Accounts: undefined;
  Pay: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.navyDeep },
  headerTintColor: colors.gold,
  headerTitleStyle: { color: colors.white, fontWeight: '700' as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.navyDeep },
};

function TabGlyph({ name, focused }: { name: keyof TabParamList; focused: boolean }) {
  const color = focused ? colors.gold : colors.goldMuted;
  if (name === 'Accounts') return <WalletIcon color={color} />;
  if (name === 'Pay') return <SendIcon color={color} />;
  return <ProfileIcon color={color} />;
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen name="Overview" options={{ headerShown: false }}>
        {({ navigation }) => (
          <OverviewScreen
            onStatements={() => navigation.navigate('Transactions')}
            onSend={() => navigation.getParent()?.navigate('Pay')}
            onPayBill={() => navigation.getParent()?.navigate('Pay')}
            onMore={() => navigation.getParent()?.navigate('Profile')}
          />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: 'Transactions' }}
      />
    </HomeStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen name="ProfileHome" options={{ headerShown: false }}>
        {({ navigation }) => (
          <ProfileScreen onOpenSecurity={() => navigation.navigate('SecuritySettings')} />
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
        options={{ title: 'Security settings' }}
      />
    </ProfileStack.Navigator>
  );
}

function SignedInTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.goldMuted,
        tabBarStyle: {
          backgroundColor: colors.navyDeep,
          borderTopColor: colors.navyMid,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused }) => <TabGlyph name={route.name} focused={focused} />,
      })}
    >
      <Tabs.Screen name="Accounts" component={HomeNavigator} />
      <Tabs.Screen name="Pay" component={PaymentScreen} />
      <Tabs.Screen name="Profile" component={ProfileNavigator} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const { session, ready } = useSession();

  if (!ready) {
    return (
      <View style={tabStyles.boot}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <RootStack.Screen name="App" component={SignedInTabs} />
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navyDeep },
});
