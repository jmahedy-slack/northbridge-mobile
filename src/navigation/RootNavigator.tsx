import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { OverviewScreen } from '../screens/OverviewScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SecuritySettingsScreen } from '../screens/SecuritySettingsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { useSession } from '../session/SessionContext';
import { colors } from '../theme';

export type HomeStackParamList = {
  Overview: undefined;
  Transactions: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  SecuritySettings: undefined;
};

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Overview" options={{ headerShown: false }}>
        {({ navigation }) => (
          <OverviewScreen onSeeAll={() => navigation.navigate('Transactions')} />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="Transactions" component={TransactionsScreen} options={{ title: 'Transactions' }} />
    </HomeStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
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
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white },
      }}
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.navy} />
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
