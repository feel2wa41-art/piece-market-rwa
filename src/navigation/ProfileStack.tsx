import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileStackParamList} from './types';
import {ProfileScreen} from '../screens/profile/ProfileScreen';
import {LanguageSettingsScreen} from '../screens/profile/LanguageSettingsScreen';
import {WalletDetailScreen} from '../screens/wallet/WalletDetailScreen';
import {SellerRegistrationScreen} from '../screens/seller/SellerRegistrationScreen';
import {DocsScreen} from '../screens/profile/DocsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
      />
      <Stack.Screen
        name="WalletDetail"
        component={WalletDetailScreen}
        options={{title: 'Wallet'}}
      />
      <Stack.Screen
        name="SellerRegistration"
        component={SellerRegistrationScreen}
        options={{title: 'Register Asset'}}
      />
      <Stack.Screen
        name="Docs"
        component={DocsScreen}
        options={{title: 'Documents'}}
      />
    </Stack.Navigator>
  );
}
