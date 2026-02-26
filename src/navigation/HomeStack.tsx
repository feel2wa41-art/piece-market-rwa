import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from './types';
import {HomeScreen} from '../screens/home/HomeScreen';
import {AssetDetailScreen} from '../screens/asset-detail/AssetDetailScreen';
import {AssetCertificateScreen} from '../screens/asset-detail/AssetCertificateScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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
