import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Modal} from '../common/Modal';
import {Button} from '../common/Button';
import {formatUSDC} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface PurchaseConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetTitle: string;
  quantity: number;
  unitPrice: number;
  fee: number;
  gasFee: number;
  totalPayment: number;
  walletBalance: number;
  loading?: boolean;
}

export function PurchaseConfirmModal({
  visible,
  onClose,
  onConfirm,
  assetTitle,
  quantity,
  unitPrice,
  fee,
  gasFee,
  totalPayment,
  walletBalance,
  loading,
}: PurchaseConfirmModalProps) {
  const {t} = useTranslation();
  const hasEnoughBalance = walletBalance >= totalPayment;

  return (
    <Modal visible={visible} onClose={onClose} title={t('purchase.confirmTitle')}>
      <Text style={styles.assetTitle}>{assetTitle}</Text>

      <View style={styles.chainBadge}>
        <Text style={styles.chainText}>Base (L2) · USDC</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t('purchase.quantity')}</Text>
        <Text style={styles.value}>{quantity} {t('purchase.fractions')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('purchase.unitPrice')}</Text>
        <Text style={styles.value}>{formatUSDC(unitPrice)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('purchase.subtotal')}</Text>
        <Text style={styles.value}>{formatUSDC(quantity * unitPrice)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('asset.serviceFee')}</Text>
        <Text style={styles.value}>{formatUSDC(fee)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('asset.gasFee')}</Text>
        <Text style={styles.gasValue}>{formatUSDC(gasFee)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>{t('asset.totalPayment')}</Text>
        <Text style={styles.totalValue}>{formatUSDC(totalPayment)}</Text>
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>{t('purchase.walletBalance')}</Text>
        <Text style={[styles.balanceValue, !hasEnoughBalance && styles.insufficientBalance]}>
          {formatUSDC(walletBalance)}
        </Text>
      </View>

      {!hasEnoughBalance && (
        <Text style={styles.errorText}>{t('purchase.insufficientBalance')}</Text>
      )}

      <View style={styles.buttons}>
        <Button
          title={t('common.cancel')}
          onPress={onClose}
          variant="outline"
          style={{flex: 1, marginRight: SPACING.sm}}
        />
        <Button
          title={t('purchase.confirmPurchase')}
          onPress={onConfirm}
          disabled={!hasEnoughBalance}
          loading={loading}
          style={{flex: 1, marginLeft: SPACING.sm}}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  assetTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  chainBadge: {
    alignSelf: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  chainText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.primary,
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
  },
  gasValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  balanceLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  balanceValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  insufficientBalance: {
    color: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
  },
});
