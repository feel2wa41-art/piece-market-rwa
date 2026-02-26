import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MarketStackParamList} from './types';
import {MarketScreen} from '../screens/market/MarketScreen';
import {AssetDetailScreen} from '../screens/asset-detail/AssetDetailScreen';
import {AssetCertificateScreen} from '../screens/asset-detail/AssetCertificateScreen';

const Stack = createNativeStackNavigator<MarketStackParamList>();

export function MarketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Market"
        component={MarketScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
      <Stack.Screen
        name="AssetCertificate"
        component={AssetCertificateScreen}
        options={{title: 'Asset Certificate'}}
      />
    </Stack.Navigator>
  );
}
