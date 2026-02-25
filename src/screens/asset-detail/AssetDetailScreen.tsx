import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {AssetDetailScreenProps} from '../../navigation/types';

export function AssetDetailScreen({route}: AssetDetailScreenProps) {
  const {t} = useTranslation();
  const {assetId} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>Asset Image</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.assetId}>Asset #{assetId}</Text>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.label}>{t('asset.fractionPrice')}</Text>
            <Text style={styles.price}>-</Text>
          </View>
          <View>
            <Text style={styles.label}>{t('asset.available')}</Text>
            <Text style={styles.value}>-</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>{t('asset.buyFraction')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imagePlaceholder: {
    height: 250,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
  },
  info: {
    flex: 1,
    padding: SPACING.xl,
  },
  assetId: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  footer: {
    padding: SPACING.xl,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
