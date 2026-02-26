import React, {useState} from 'react';
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
import {Button, AssetImage} from '../../components/common';
import {QuantitySelector} from '../../components/common/QuantitySelector';
import {ProgressBar} from '../../components/asset';
import {PurchaseConfirmModal} from '../../components/purchase/PurchaseConfirmModal';
import {PurchaseSuccessModal} from '../../components/purchase/PurchaseSuccessModal';
import {useAssetStore} from '../../store/useAssetStore';
import {useWalletStore} from '../../store/useWalletStore';
import {useDemoStore} from '../../store/useDemoStore';
import {formatUSDC, formatCurrency} from '../../utils/format';
import {calculateBuyFee} from '../../utils/fee';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {AssetDetailScreenProps} from '../../navigation/types';

export function AssetDetailScreen({route}: AssetDetailScreenProps) {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {assetId} = route.params;

  const assets = useAssetStore(s => s.assets);
  const purchaseFractions = useAssetStore(s => s.purchaseFractions);
  const walletBalance = useWalletStore(s => s.balance);
  const deductBalance = useWalletStore(s => s.deductBalance);
  const addTransaction = useWalletStore(s => s.addTransaction);
  const recordTransaction = useDemoStore(s => s.recordTransaction);

  const asset = assets.find(a => a.id === assetId);

  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [lastTxHash, setLastTxHash] = useState('');
  const [lastTotal, setLastTotal] = useState(0);

  if (!asset) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding: SPACING.xl}}>{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  const available = asset.fractionCount - asset.soldFractions;
  const subtotal = quantity * asset.unitPrice;
  const fee = calculateBuyFee(subtotal);

  const handlePurchase = async () => {
    setPurchasing(true);

    // Simulate blockchain tx on Base L2
    await new Promise(resolve => setTimeout(resolve, 1500));

    const totalPayment = fee.totalPayment;
    const success = deductBalance(totalPayment);

    if (success) {
      purchaseFractions(assetId, quantity);

      const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
      const tx = {
        id: `tx-${Date.now()}`,
        type: 'BUY' as const,
        assetId: asset.id,
        assetTitle: asset.title,
        fractionCount: quantity,
        pricePerFraction: asset.unitPrice,
        totalAmount: subtotal,
        fee: fee.serviceFee,
        txHash,
        status: 'CONFIRMED' as const,
        createdAt: new Date().toISOString(),
      };

      addTransaction(tx);
      recordTransaction(tx);

      setLastTxHash(txHash);
      setLastTotal(totalPayment);
      setShowConfirm(false);
      setShowSuccess(true);
    }

    setPurchasing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <AssetImage source={asset.imageUrl} />
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
                {formatUSDC(asset.totalValue)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('asset.fractionPrice')}</Text>
              <Text style={[styles.statValue, {color: COLORS.primary}]}>
                {formatUSDC(asset.unitPrice)}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.statLabel}>{t('asset.sold')}</Text>
              <Text style={styles.statLabel}>
                {t('asset.available')}: {available}
              </Text>
            </View>
            <ProgressBar
              current={asset.soldFractions}
              total={asset.fractionCount}
            />
          </View>

          {/* Trust & Verification Card */}
          {(asset.custody || asset.musicRights) && (
            <TouchableOpacity
              style={styles.trustCard}
              onPress={() => navigation.navigate('AssetCertificate', {assetId: asset.id})}
              activeOpacity={0.7}>
              <View style={styles.trustHeader}>
                <Text style={styles.trustIcon}>{asset.category === 'MUSIC_RIGHTS' ? '🎵' : '🛡'}</Text>
                <Text style={styles.trustTitle}>{t('certificate.trustTitle')}</Text>
                <Text style={styles.trustArrow}>→</Text>
              </View>
              <View style={styles.trustBadges}>
                {asset.category === 'MUSIC_RIGHTS' ? (
                  <>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustBadgeDot}>✓</Text>
                      <Text style={styles.trustBadgeText}>{t('certificate.badgeCopyright')}</Text>
                    </View>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustBadgeDot}>✓</Text>
                      <Text style={styles.trustBadgeText}>{t('certificate.badgeAiDisclosure')}</Text>
                    </View>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustBadgeDot}>✓</Text>
                      <Text style={styles.trustBadgeText}>{t('certificate.badgeOnChain')}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustBadgeDot}>✓</Text>
                      <Text style={styles.trustBadgeText}>{t('certificate.badgeCustody')}</Text>
                    </View>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustBadgeDot}>✓</Text>
                      <Text style={styles.trustBadgeText}>{t('certificate.badgeLegal')}</Text>
                    </View>
                    <View style={styles.trustBadge}>
                      <Text style={styles.trustBadgeDot}>✓</Text>
                      <Text style={styles.trustBadgeText}>{t('certificate.badgeOnChain')}</Text>
                    </View>
                  </>
                )}
              </View>
              <Text style={styles.trustSub}>
                {asset.category === 'MUSIC_RIGHTS' && asset.musicRights
                  ? `${asset.musicRights.registrar} · ${asset.musicRights.registrationNumber}`
                  : asset.custody
                    ? `${asset.custody.custodian} · ${asset.custody.location}`
                    : ''}
              </Text>
            </TouchableOpacity>
          )}

          {available > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>{t('purchase.selectQuantity')}</Text>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={Math.min(available, 100)}
              />
            </View>
          )}

          <View style={styles.feeCard}>
            <View style={styles.chainBadge}>
              <Text style={styles.chainText}>Base (L2) · USDC</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>
                {t('asset.fractionPrice')} x {quantity}
              </Text>
              <Text style={styles.feeValue}>
                {formatUSDC(subtotal)}
              </Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>{t('asset.serviceFee')}</Text>
              <Text style={styles.feeValue}>
                {formatUSDC(fee.serviceFee)}
              </Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>{t('asset.gasFee')}</Text>
              <Text style={styles.gasValue}>
                {formatUSDC(fee.gasFee)}
              </Text>
            </View>
            <View style={[styles.feeRow, styles.feeTotalRow]}>
              <Text style={styles.feeTotalLabel}>
                {t('asset.totalPayment')}
              </Text>
              <Text style={styles.feeTotalValue}>
                {formatUSDC(fee.totalPayment)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={available > 0 ? t('asset.buyFraction') : t('asset.soldOut')}
          onPress={() => setShowConfirm(true)}
          size="lg"
          disabled={available <= 0}
          style={{width: '100%'}}
        />
      </View>

      <PurchaseConfirmModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handlePurchase}
        assetTitle={asset.title}
        quantity={quantity}
        unitPrice={asset.unitPrice}
        fee={fee.serviceFee}
        gasFee={fee.gasFee}
        totalPayment={fee.totalPayment}
        walletBalance={walletBalance}
        loading={purchasing}
      />

      <PurchaseSuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setQuantity(1);
        }}
        onViewPortfolio={() => {
          setShowSuccess(false);
          navigation.navigate('PortfolioTab');
        }}
        assetTitle={asset.title}
        quantity={quantity}
        totalPaid={lastTotal}
        txHash={lastTxHash}
      />
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
    fontSize: FONT_SIZE.lg,
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
  quantitySection: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  trustCard: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: '#F0FDF4',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  trustTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  trustArrow: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.success,
    fontWeight: '600',
  },
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  trustBadgeDot: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
    fontWeight: '700',
    marginRight: 4,
  },
  trustBadgeText: {
    fontSize: FONT_SIZE.xs,
    color: '#166534',
    fontWeight: '500',
  },
  trustSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  feeCard: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  chainBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  chainText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.primary,
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
  gasValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
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
