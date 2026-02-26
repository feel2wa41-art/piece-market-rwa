import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SwapStackParamList} from './types';
import {SwapMarketScreen} from '../screens/swap/SwapMarketScreen';
import {SwapDetailScreen} from '../screens/swap/SwapDetailScreen';
import {CreateSwapScreen} from '../screens/swap/CreateSwapScreen';

const Stack = createNativeStackNavigator<SwapStackParamList>();

export function SwapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SwapMarket"
        component={SwapMarketScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SwapDetail"
        component={SwapDetailScreen}
        options={{title: 'Swap Detail'}}
      />
      <Stack.Screen
        name="CreateSwap"
        component={CreateSwapScreen}
        options={{title: 'Create Swap'}}
      />
    </Stack.Navigator>
  );
}
