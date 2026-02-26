import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdminStackParamList} from './types';
import {AdminDashboardScreen} from '../screens/admin/AdminDashboardScreen';
import {RevenueWithdrawalScreen} from '../screens/admin/RevenueWithdrawalScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RevenueWithdrawal"
        component={RevenueWithdrawalScreen}
        options={{title: 'Revenue Withdrawal'}}
      />
    </Stack.Navigator>
  );
}
