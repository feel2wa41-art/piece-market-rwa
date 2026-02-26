import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button} from '../../components/common';
import {useDemoStore} from '../../store/useDemoStore';
import {useAssetStore} from '../../store/useAssetStore';
import {formatUSDC} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import {AdminStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

export function AdminDashboardScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const {
    totalTransactions,
    totalBuyFees,
    totalSellFees,
    totalListingFees,
    allTransactions,
    getTotalRevenue,
    withdrawnAmount,
  } = useDemoStore();
  const assets = useAssetStore(s => s.assets);

  const totalRevenue = getTotalRevenue();
  const activeAssets = assets.filter(a => a.status === 'ACTIVE').length;

  const summaryCards = [
    {label: t('admin.totalTransactions'), value: `${totalTransactions}`, color: COLORS.primary},
    {label: t('admin.totalRevenue'), value: formatUSDC(totalRevenue), color: COLORS.success},
    {label: t('admin.activeAssets'), value: `${activeAssets}`, color: COLORS.secondary},
    {label: t('admin.withdrawn'), value: formatUSDC(withdrawnAmount), color: COLORS.warning},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('admin.dashboard')}</Text>
          <Text style={styles.subtitle}>{t('admin.platformOverview')}</Text>
        </View>

        <View style={styles.cardGrid}>
          {summaryCards.map((card, i) => (
            <View key={i} style={[styles.summaryCard, {borderLeftColor: card.color}]}>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={[styles.cardValue, {color: card.color}]}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.revenueBreakdown')}</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, {backgroundColor: COLORS.success}]} />
                <Text style={styles.breakdownLabel}>{t('admin.buyFees')} (3%)</Text>
              </View>
              <Text style={styles.breakdownValue}>{formatUSDC(totalBuyFees)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, {backgroundColor: COLORS.warning}]} />
                <Text style={styles.breakdownLabel}>{t('admin.sellFees')} (2%)</Text>
              </View>
              <Text style={styles.breakdownValue}>{formatUSDC(totalSellFees)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.dot, {backgroundColor: COLORS.secondary}]} />
                <Text style={styles.breakdownLabel}>{t('admin.listingFees')} (5%)</Text>
              </View>
              <Text style={styles.breakdownValue}>{formatUSDC(totalListingFees)}</Text>
            </View>
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('admin.grossRevenue')}</Text>
              <Text style={styles.totalValue}>
                {formatUSDC(totalBuyFees + totalSellFees + totalListingFees)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('admin.recentTransactions')}</Text>
          {allTransactions.length === 0 ? (
            <Text style={styles.emptyText}>{t('admin.noTransactions')}</Text>
          ) : (
            allTransactions.slice(0, 10).map(tx => (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle} numberOfLines={1}>{tx.assetTitle}</Text>
                  <Text style={styles.txMeta}>
                    {tx.type} · {tx.fractionCount} fractions · {new Date(tx.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={styles.txAmount}>{formatUSDC(tx.totalAmount)}</Text>
                  <Text style={styles.txFee}>Fee: {formatUSDC(tx.fee)}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.withdrawSection}>
          <Button
            title={t('admin.withdrawRevenue')}
            onPress={() => navigation.navigate('RevenueWithdrawal')}
            size="lg"
            style={{width: '100%'}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  summaryCard: {
    width: '47%',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
  },
  cardLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  cardValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  section: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  breakdownLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  breakdownValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.sm,
    paddingTop: SPACING.lg,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.success,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    padding: SPACING.xxl,
  },
  txCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
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
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  txFee: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
    marginTop: 2,
  },
  withdrawSection: {
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
});
