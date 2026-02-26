import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {MainTabParamList} from './types';
import {HomeStack} from './HomeStack';
import {MarketStack} from './MarketStack';
import {SwapStack} from './SwapStack';
import {PortfolioStack} from './PortfolioStack';
import {ProfileStack} from './ProfileStack';
import {AdminStack} from './AdminStack';
import {useAuthStore} from '../store/useAuthStore';
import {COLORS} from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, {active: string; inactive: string}> = {
  HomeTab: {active: '🏠', inactive: '🏠'},
  MarketTab: {active: '🏪', inactive: '🏪'},
  SwapTab: {active: '🔄', inactive: '🔄'},
  PortfolioTab: {active: '💼', inactive: '💼'},
  AdminTab: {active: '⚙️', inactive: '⚙️'},
  ProfileTab: {active: '👤', inactive: '👤'},
};

function TabIcon({name, focused}: {name: string; focused: boolean}) {
  const icon = TAB_ICONS[name];
  if (!icon) return null;
  return (
    <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
      <Text style={styles.iconText}>{focused ? icon.active : icon.inactive}</Text>
    </View>
  );
}

export function MainTabNavigator() {
  const {t} = useTranslation();
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({focused}) => <TabIcon name="HomeTab" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MarketTab"
        component={MarketStack}
        options={{
          tabBarLabel: t('tabs.market'),
          tabBarIcon: ({focused}) => <TabIcon name="MarketTab" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SwapTab"
        component={SwapStack}
        options={{
          tabBarLabel: t('tabs.swap'),
          tabBarIcon: ({focused}) => <TabIcon name="SwapTab" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="PortfolioTab"
        component={PortfolioStack}
        options={{
          tabBarLabel: t('tabs.portfolio'),
          tabBarIcon: ({focused}) => <TabIcon name="PortfolioTab" focused={focused} />,
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStack}
          options={{
            tabBarLabel: t('tabs.admin'),
            tabBarIcon: ({focused}) => <TabIcon name="AdminTab" focused={focused} />,
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({focused}) => <TabIcon name="ProfileTab" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'web' ? 72 : 80,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 8 : 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...(Platform.OS === 'web'
      ? {boxShadow: '0 -2px 12px rgba(0,0,0,0.06)'}
      : {shadowColor: '#000', shadowOffset: {width: 0, height: -2}, shadowOpacity: 0.06, shadowRadius: 12, elevation: 8}),
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: COLORS.primaryLight,
  },
  iconText: {
    fontSize: 18,
  },
});
