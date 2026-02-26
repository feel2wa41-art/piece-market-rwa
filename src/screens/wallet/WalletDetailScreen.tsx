import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '../../components/common';
import {useWalletStore} from '../../store/useWalletStore';
import {formatUSDC, shortenAddress} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

const TYPE_COLORS: Record<string, string> = {
  BUY: COLORS.success,
  SELL: COLORS.warning,
  LISTING: COLORS.secondary,
  TRANSFER: COLORS.primary,
  WITHDRAWAL: COLORS.error,
};

export function WalletDetailScreen() {
  const {t} = useTranslation();
  const balance = useWalletStore(s => s.balance);
  const address = useWalletStore(s => s.address);
  const transactions = useWalletStore(s => s.transactions);
  const addBalance = useWalletStore(s => s.addBalance);

  const handleDeposit = () => {
    // Simulate: User pays KRW via card → auto-swap to USDC on Base
    const depositAmount = 1000; // 1,000 USDC
    addBalance(depositAmount);
    Alert.alert(
      t('wallet.depositSuccess'),
      t('wallet.depositMessage', {amount: formatUSDC(depositAmount)}),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('wallet.balance')}</Text>
          <Text style={styles.balanceValue}>{formatUSDC(balance)}</Text>
          <View style={styles.chainBadge}>
            <Text style={styles.chainBadgeText}>Base (L2)</Text>
          </View>
          {address && (
            <TouchableOpacity
              onPress={() => Alert.alert(t('wallet.address'), address)}>
              <Text style={styles.address}>{shortenAddress(address)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title={t('wallet.deposit')}
            onPress={handleDeposit}
            style={{flex: 1, marginRight: SPACING.sm}}
          />
          <Button
            title={t('wallet.withdraw')}
            onPress={() => Alert.alert(t('wallet.withdrawTitle'), t('wallet.withdrawInfo'))}
            variant="outline"
            style={{flex: 1, marginLeft: SPACING.sm}}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('wallet.howItWorks')}</Text>
          <Text style={styles.infoText}>{t('wallet.howItWorksDesc')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('wallet.recentTransactions')}</Text>

        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>{t('wallet.noTransactions')}</Text>
        ) : (
          transactions.slice(0, 20).map(tx => (
            <View key={tx.id} style={styles.txCard}>
              <View style={[styles.txDot, {backgroundColor: TYPE_COLORS[tx.type] || COLORS.text}]} />
              <View style={styles.txInfo}>
                <Text style={styles.txTitle} numberOfLines={1}>{tx.assetTitle}</Text>
                <Text style={styles.txMeta}>
                  {tx.type} · {new Date(tx.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.txAmount, {color: TYPE_COLORS[tx.type] || COLORS.text}]}>
                -{formatUSDC(tx.totalAmount + tx.fee)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  balanceCard: {
    margin: SPACING.xl,
    padding: SPACING.xxl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  chainBadge: {
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  chainBadgeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  address: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.6)',
    marginTop: SPACING.sm,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
    padding: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryDark,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  txDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  txMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  txAmount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});
