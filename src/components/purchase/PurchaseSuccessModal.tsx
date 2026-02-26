import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Modal} from '../common/Modal';
import {Button} from '../common/Button';
import {formatUSDC, shortenAddress} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface PurchaseSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewPortfolio: () => void;
  assetTitle: string;
  quantity: number;
  totalPaid: number;
  txHash: string;
}

export function PurchaseSuccessModal({
  visible,
  onClose,
  onViewPortfolio,
  assetTitle,
  quantity,
  totalPaid,
  txHash,
}: PurchaseSuccessModalProps) {
  const {t} = useTranslation();

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>&#10003;</Text>
      </View>

      <Text style={styles.title}>{t('purchase.successTitle')}</Text>
      <Text style={styles.subtitle}>{t('purchase.successSubtitle')}</Text>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('purchase.asset')}</Text>
          <Text style={styles.value} numberOfLines={1}>{assetTitle}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('purchase.quantity')}</Text>
          <Text style={styles.value}>{quantity} {t('purchase.fractions')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('purchase.totalPaid')}</Text>
          <Text style={styles.value}>{formatUSDC(totalPaid)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('purchase.network')}</Text>
          <Text style={styles.value}>Base (L2)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t('purchase.txHash')}</Text>
          <Text style={styles.hashValue}>{shortenAddress(txHash, 8)}</Text>
        </View>
      </View>

      <Button
        title={t('purchase.viewPortfolio')}
        onPress={onViewPortfolio}
        style={{marginTop: SPACING.lg}}
      />
      <Button
        title={t('common.close')}
        onPress={onClose}
        variant="ghost"
        style={{marginTop: SPACING.sm}}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 32,
    color: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  details: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  hashValue: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
});
