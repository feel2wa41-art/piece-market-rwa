import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PortfolioStackParamList} from './types';
import {PortfolioScreen} from '../screens/portfolio/PortfolioScreen';
import {AssetDetailScreen} from '../screens/asset-detail/AssetDetailScreen';

const Stack = createNativeStackNavigator<PortfolioStackParamList>();

export function PortfolioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
    </Stack.Navigator>
  );
}
