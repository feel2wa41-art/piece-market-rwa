import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RWAAsset} from '../../types/asset';
import {ProgressBar} from './ProgressBar';
import {AssetImage} from '../common/AssetImage';
import {formatCurrency} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface AssetCardProps {
  asset: RWAAsset;
  onPress: () => void;
  compact?: boolean;
}

export function AssetCard({asset, onPress, compact = false}: AssetCardProps) {
  const {t} = useTranslation();

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.compactImage}>
          <AssetImage source={asset.imageUrl} />
        </View>
        <Text style={styles.compactTitle} numberOfLines={1}>
          {asset.title}
        </Text>
        <Text style={styles.compactPrice}>
          {formatCurrency(asset.unitPrice)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <AssetImage source={asset.imageUrl} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {t(`categories.${asset.category}`)}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {asset.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{t('asset.fractionPrice')}</Text>
          <Text style={styles.price}>{formatCurrency(asset.unitPrice)}</Text>
        </View>
        <ProgressBar
          current={asset.soldFractions}
          total={asset.fractionCount}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  imageContainer: {
    height: 160,
    backgroundColor: COLORS.surface,
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
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
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  priceLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // Compact card styles
  compactCard: {
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  compactImage: {
    height: 100,
    backgroundColor: COLORS.surface,
  },
  compactTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  compactPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.xs,
  },
});
