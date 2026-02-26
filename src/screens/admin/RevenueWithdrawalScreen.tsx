import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {Button} from '../../components/common';
import {useDemoStore} from '../../store/useDemoStore';
import {formatUSDC, shortenAddress} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

export function RevenueWithdrawalScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const getTotalRevenue = useDemoStore(s => s.getTotalRevenue);
  const withdrawRevenue = useDemoStore(s => s.withdrawRevenue);

  const availableRevenue = getTotalRevenue();

  const [walletAddress, setWalletAddress] = useState('0x9876543210fedcba9876543210fedcba98765432');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const amountNum = parseFloat(amount) || 0;

  const handleWithdraw = async () => {
    if (amountNum <= 0 || amountNum > availableRevenue) {
      Alert.alert(t('admin.invalidAmount'));
      return;
    }
    if (!walletAddress || walletAddress.length < 10) {
      Alert.alert(t('admin.invalidAddress'));
      return;
    }

    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    withdrawRevenue(amountNum);

    const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

    setProcessing(false);
    Alert.alert(
      t('admin.withdrawSuccess'),
      `${t('admin.withdrawAmount')}: ${formatUSDC(amountNum)}\n${t('admin.txHash')}: ${shortenAddress(txHash, 8)}`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('admin.availableRevenue')}</Text>
          <Text style={styles.balanceValue}>{formatUSDC(availableRevenue)}</Text>
        </View>

        <Text style={styles.inputLabel}>{t('admin.withdrawAmount')}</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder={`Max: ${formatUSDC(availableRevenue)}`}
          placeholderTextColor={COLORS.textTertiary}
          keyboardType="numeric"
        />

        <Button
          title={t('admin.withdrawMax')}
          onPress={() => setAmount(availableRevenue.toFixed(2))}
          variant="ghost"
          size="sm"
          style={{alignSelf: 'flex-end', marginTop: SPACING.xs}}
        />

        <Text style={styles.inputLabel}>{t('admin.walletAddress')}</Text>
        <TextInput
          style={styles.input}
          value={walletAddress}
          onChangeText={setWalletAddress}
          placeholder="0x..."
          placeholderTextColor={COLORS.textTertiary}
        />

        {amountNum > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('admin.withdrawAmount')}</Text>
              <Text style={styles.summaryValue}>{formatUSDC(amountNum)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('admin.destination')}</Text>
              <Text style={styles.summaryAddress}>{shortenAddress(walletAddress)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('admin.network')}</Text>
              <Text style={styles.summaryValue}>Base (L2)</Text>
            </View>
          </View>
        )}

        <Button
          title={t('admin.confirmWithdraw')}
          onPress={handleWithdraw}
          loading={processing}
          disabled={amountNum <= 0 || amountNum > availableRevenue}
          size="lg"
          style={{marginTop: SPACING.xxl}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
  },
  balanceCard: {
    padding: SPACING.xxl,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  balanceLabel: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  summaryCard: {
    marginTop: SPACING.xxl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryAddress: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
});
