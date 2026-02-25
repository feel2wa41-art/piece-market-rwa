import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '../../components/common';
import {ProgressBar} from '../../components/asset';
import {MOCK_ASSETS} from '../../data/mockAssets';
import {formatCurrency} from '../../utils/format';
import {calculateBuyFee} from '../../utils/fee';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {AssetDetailScreenProps} from '../../navigation/types';

export function AssetDetailScreen({route}: AssetDetailScreenProps) {
  const {t} = useTranslation();
  const {assetId} = route.params;

  const asset = MOCK_ASSETS.find(a => a.id === assetId);
  if (!asset) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding: SPACING.xl}}>{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  const fee = calculateBuyFee(asset.unitPrice);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>🖼️</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {t(`categories.${asset.category}`)}
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.assetTitle}>{asset.title}</Text>
          <Text style={styles.seller}>
            {asset.seller.name} {asset.seller.verified ? '✓' : ''}
          </Text>

          <View style={styles.descriptionBox}>
            <Text style={styles.descText}>{asset.description}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('asset.totalValue')}</Text>
              <Text style={styles.statValue}>
                {formatCurrency(asset.totalValue)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('asset.fractionPrice')}</Text>
              <Text style={[styles.statValue, {color: COLORS.primary}]}>
                {formatCurrency(asset.unitPrice)}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.statLabel}>{t('asset.sold')}</Text>
              <Text style={styles.statLabel}>{t('asset.available')}</Text>
            </View>
            <ProgressBar
              current={asset.soldFractions}
              total={asset.fractionCount}
            />
          </View>

          <View style={styles.feeCard}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>{t('asset.fractionPrice')}</Text>
              <Text style={styles.feeValue}>
                {formatCurrency(fee.itemPrice)}
              </Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>{t('asset.serviceFee')}</Text>
              <Text style={styles.feeValue}>
                {formatCurrency(fee.serviceFee)}
              </Text>
            </View>
            <View style={[styles.feeRow, styles.feeTotalRow]}>
              <Text style={styles.feeTotalLabel}>
                {t('asset.totalPayment')}
              </Text>
              <Text style={styles.feeTotalValue}>
                {formatCurrency(fee.totalPayment)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('asset.buyFraction')}
          onPress={() => {}}
          size="lg"
          style={{width: '100%'}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 280,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 64,
  },
  badge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  info: {
    padding: SPACING.xl,
  },
  assetTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  seller: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  descriptionBox: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  descText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  progressSection: {
    marginTop: SPACING.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  feeCard: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  feeLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  feeValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  feeTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
  },
  feeTotalLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  feeTotalValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  footer: {
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
