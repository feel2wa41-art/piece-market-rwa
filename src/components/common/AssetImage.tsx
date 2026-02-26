import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';

interface AssetImageProps {
  source: string | number;
  style?: any;
}

/**
 * Cross-platform image component.
 * - Mobile: uses RN <Image> with require() number source
 * - Web: uses <img> tag directly (react-native-web's Image renders as
 *   a div with background-image which often causes sizing issues)
 */
export function AssetImage({source, style}: AssetImageProps) {
  const flatStyle = StyleSheet.flatten(style) || {};

  if (Platform.OS === 'web') {
    const src = typeof source === 'number' ? source : source;
    return (
      <img
        src={src as any}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          ...(flatStyle as any),
        }}
        alt=""
      />
    );
  }

  // Mobile
  const imageSource = typeof source === 'number' ? source : {uri: source};
  return <Image source={imageSource} style={style} resizeMode="cover" />;
}
