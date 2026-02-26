import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {EmptyState} from '../../components/common';
import {useWalletStore} from '../../store/useWalletStore';
import {formatUSDC, shortenAddress} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import {Transaction} from '../../types/transaction';

const TYPE_COLORS: Record<string, string> = {
  BUY: COLORS.success,
  SELL: COLORS.warning,
  LISTING: COLORS.secondary,
  TRANSFER: COLORS.primary,
  WITHDRAWAL: COLORS.error,
};

const TYPE_ICONS: Record<string, string> = {
  BUY: '+',
  SELL: '-',
  LISTING: 'L',
  TRANSFER: 'T',
  WITHDRAWAL: 'W',
};

function TransactionItem({tx}: {tx: Transaction}) {
  const {t} = useTranslation();
  const color = TYPE_COLORS[tx.type] || COLORS.text;
  const date = new Date(tx.createdAt);

  return (
    <View style={styles.txCard}>
      <View style={[styles.txIcon, {backgroundColor: color + '20'}]}>
        <Text style={[styles.txIconText, {color}]}>{TYPE_ICONS[tx.type]}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txTitle} numberOfLines={1}>{tx.assetTitle}</Text>
        <Text style={styles.txMeta}>
          {tx.type} · {tx.fractionCount} {t('purchase.fractions')} · {date.toLocaleDateString()}
        </Text>
        {tx.txHash && (
          <Text style={styles.txHash}>{shortenAddress(tx.txHash, 6)}</Text>
        )}
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, {color}]}>
          {tx.type === 'SELL' ? '+' : '-'}{formatUSDC(tx.totalAmount + tx.fee)}
        </Text>
        <Text style={styles.txFee}>
          {t('purchase.fee')}: {formatUSDC(tx.fee)}
        </Text>
      </View>
    </View>
  );
}

export function TransactionHistoryScreen() {
  const {t} = useTranslation();
  const transactions = useWalletStore(s => s.transactions);

  return (
    <SafeAreaView style={styles.container}>
      {transactions.length === 0 ? (
        <EmptyState icon="📋" message={t('portfolio.noTransactions')} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => <TransactionItem tx={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.xl,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  txIconText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  txInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  txTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  txMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  txHash: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  txFee: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});
