import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, AssetImage} from '../../components/common';
import {useAssetStore} from '../../store/useAssetStore';
import {useSwapStore} from '../../store/useSwapStore';
import {useWalletStore} from '../../store/useWalletStore';
import {useDemoStore} from '../../store/useDemoStore';
import {COLLECTIONS} from '../../data/mockCollections';
import {formatUSDC} from '../../utils/format';
import {FEE_RATES} from '../../constants/fees';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {SwapStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<SwapStackParamList, 'SwapDetail'>;

export function SwapDetailScreen({route}: Props) {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {swapId} = route.params;

  const offers = useSwapStore(s => s.offers);
  const acceptOffer = useSwapStore(s => s.acceptOffer);
  const assets = useAssetStore(s => s.assets);
  const portfolio = useAssetStore(s => s.portfolio);
  const swapFractions = useAssetStore(s => s.swapFractions);
  const deductBalance = useWalletStore(s => s.deductBalance);
  const addTransaction = useWalletStore(s => s.addTransaction);
  const recordTransaction = useDemoStore(s => s.recordTransaction);

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [txHash, setTxHash] = useState('');

  const offer = offers.find(o => o.id === swapId);
  if (!offer) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding: SPACING.xl}}>{t('common.error')}</Text>
      </SafeAreaView>
    );
  }

  const offerAsset = assets.find(a => a.id === offer.offerAssetId);
  const wantAsset = assets.find(a => a.id === offer.wantAssetId);
  if (!offerAsset || !wantAsset) return null;

  const ownedIds = portfolio.map(p => p.asset.id);
  const hasRequired = portfolio.find(
    p => p.asset.id === offer.wantAssetId && p.ownedFractions >= offer.wantFractions,
  );

  const giveValue = offer.wantFractions * wantAsset.unitPrice;
  const getValue = offer.offerFractions * offerAsset.unitPrice;
  const swapFee = giveValue * FEE_RATES.SWAP;
  const buyFee = giveValue * FEE_RATES.BUY + getValue * FEE_RATES.SELL;

  // Does this complete a collection?
  const completesCollection = COLLECTIONS.find(col =>
    col.assetIds.includes(offer.offerAssetId) &&
    !ownedIds.includes(offer.offerAssetId) &&
    ownedIds.includes(offer.wantAssetId),
  );

  const handleAccept = async () => {
    if (!hasRequired) {
      Alert.alert(t('swap.insufficientFractions'), t('swap.needMore'));
      return;
    }
    if (!deductBalance(swapFee)) {
      Alert.alert(t('purchase.insufficientBalance'));
      return;
    }

    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));

    const success = swapFractions(
      offer.wantAssetId,
      offer.wantFractions,
      offer.offerAssetId,
      offer.offerFractions,
    );

    if (success) {
      acceptOffer(offer.id);
      const hash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
      setTxHash(hash);

      const tx = {
        id: `tx-${Date.now()}`,
        type: 'BUY' as const,
        assetId: offer.offerAssetId,
        assetTitle: `Swap: ${wantAsset.title} → ${offerAsset.title}`,
        fractionCount: offer.offerFractions,
        pricePerFraction: 0,
        totalAmount: 0,
        fee: swapFee,
        txHash: hash,
        status: 'CONFIRMED' as const,
        createdAt: new Date().toISOString(),
      };
      addTransaction(tx);
      recordTransaction(tx);
      setCompleted(true);
    }

    setProcessing(false);
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>{t('swap.successTitle')}</Text>
          {completesCollection && (
            <View style={styles.collectionBanner}>
              <Text style={styles.collectionBannerText}>
                {completesCollection.icon} {completesCollection.name} {t('swap.collectionCompleted')}
              </Text>
            </View>
          )}
          <View style={styles.successCard}>
            <View style={styles.swapVisual}>
              <View style={styles.swapSide}>
                <View style={styles.swapImg}>
                  <AssetImage source={wantAsset.imageUrl} />
                </View>
                <Text style={styles.swapSideLabel}>{t('swap.gave')}</Text>
                <Text style={styles.swapSideValue}>
                  {offer.wantFractions} {t('swap.fractions')}
                </Text>
              </View>
              <Text style={styles.swapArrow}>→</Text>
              <View style={styles.swapSide}>
                <View style={styles.swapImg}>
                  <AssetImage source={offerAsset.imageUrl} />
                </View>
                <Text style={[styles.swapSideLabel, {color: COLORS.success}]}>{t('swap.received')}</Text>
                <Text style={styles.swapSideValue}>
                  {offer.offerFractions} {t('swap.fractions')}
                </Text>
              </View>
            </View>
            <View style={styles.txRow}>
              <Text style={styles.txLabel}>Tx Hash</Text>
              <Text style={styles.txValue}>{txHash.slice(0, 18)}...</Text>
            </View>
          </View>
          <Button
            title={t('swap.backToSwaps')}
            onPress={() => navigation.goBack()}
            style={{width: '100%', marginTop: SPACING.xl}}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.detailTitle}>{t('swap.offerDetail')}</Text>

        {/* Visual swap */}
        <View style={styles.detailCard}>
          {completesCollection && (
            <View style={styles.completeBanner}>
              <Text style={styles.completeBannerText}>
                ✨ {t('swap.completesCollection')} — {completesCollection.icon} {completesCollection.name}
              </Text>
            </View>
          )}
          <View style={styles.swapVisual}>
            <View style={styles.swapSide}>
              <View style={styles.swapImgLg}>
                <AssetImage source={wantAsset.imageUrl} />
              </View>
              <Text style={styles.swapAssetName} numberOfLines={2}>{wantAsset.title}</Text>
              <Text style={styles.swapQty}>{offer.wantFractions} {t('swap.fractions')}</Text>
              <Text style={styles.swapUsdcValue}>{formatUSDC(giveValue)}</Text>
              <Text style={styles.youGiveLabel}>{t('swap.youGive')}</Text>
            </View>

            <View style={styles.swapIconBox}>
              <Text style={styles.swapIcon}>⇄</Text>
            </View>

            <View style={styles.swapSide}>
              <View style={styles.swapImgLg}>
                <AssetImage source={offerAsset.imageUrl} />
              </View>
              <Text style={styles.swapAssetName} numberOfLines={2}>{offerAsset.title}</Text>
              <Text style={styles.swapQty}>{offer.offerFractions} {t('swap.fractions')}</Text>
              <Text style={styles.swapUsdcValue}>{formatUSDC(getValue)}</Text>
              <Text style={[styles.youGiveLabel, {color: COLORS.success}]}>{t('swap.youGet')}</Text>
            </View>
          </View>
        </View>

        {/* Offerer info */}
        <View style={styles.offererCard}>
          <Text style={styles.offererAvatar}>{offer.offerer.avatar}</Text>
          <View style={{flex: 1}}>
            <Text style={styles.offererName}>{offer.offerer.name}</Text>
            {offer.message && (
              <Text style={styles.offererMsg}>"{offer.message}"</Text>
            )}
          </View>
          <Text style={styles.demandBadge}>🔥 {offer.demandCount}</Text>
        </View>

        {/* Fee comparison */}
        <View style={styles.feeCard}>
          <Text style={styles.feeTitle}>{t('swap.feeComparison')}</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>{t('swap.swapFee')} (1.5%)</Text>
            <Text style={styles.feeGood}>{formatUSDC(swapFee)}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>{t('swap.buyAndSellFee')}</Text>
            <Text style={styles.feeBad}>{formatUSDC(buyFee)}</Text>
          </View>
          <View style={[styles.feeRow, {borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md}]}>
            <Text style={[styles.feeLabel, {fontWeight: '700', color: COLORS.success}]}>
              {t('swap.youSave')}
            </Text>
            <Text style={styles.feeGood}>{formatUSDC(buyFee - swapFee)}</Text>
          </View>
        </View>

        {!hasRequired && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              {t('swap.needFractions', {count: offer.wantFractions, asset: wantAsset.title})}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('swap.acceptSwap')}
          onPress={handleAccept}
          size="lg"
          loading={processing}
          disabled={!hasRequired || offer.status !== 'OPEN'}
          style={{width: '100%'}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  scroll: {padding: SPACING.xl, paddingBottom: 120},
  detailTitle: {fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xl},

  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  completeBanner: {backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, alignItems: 'center'},
  completeBannerText: {fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.white},
  swapVisual: {flexDirection: 'row', alignItems: 'center', padding: SPACING.xl},
  swapSide: {flex: 1, alignItems: 'center'},
  swapImg: {
    width: 64, height: 64, borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden', backgroundColor: COLORS.surface,
  },
  swapImgLg: {
    width: 90, height: 90, borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden', backgroundColor: COLORS.surface, marginBottom: SPACING.sm,
  },
  swapAssetName: {fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, textAlign: 'center', marginTop: SPACING.xs},
  swapQty: {fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary, marginTop: 4},
  swapUsdcValue: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2},
  youGiveLabel: {fontSize: FONT_SIZE.xs, color: COLORS.error, fontWeight: '600', marginTop: SPACING.sm},
  swapIconBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: SPACING.sm,
  },
  swapIcon: {fontSize: 22, color: COLORS.primary, fontWeight: '700'},
  swapArrow: {fontSize: 28, color: COLORS.primary, fontWeight: '700', marginHorizontal: SPACING.md},
  swapSideLabel: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.sm},
  swapSideValue: {fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.text},

  offererCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.lg, marginTop: SPACING.lg,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
  },
  offererAvatar: {fontSize: 28, marginRight: SPACING.md},
  offererName: {fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text},
  offererMsg: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 4},
  demandBadge: {fontSize: FONT_SIZE.sm, fontWeight: '700'},

  feeCard: {
    marginTop: SPACING.lg, padding: SPACING.lg,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
  },
  feeTitle: {fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md},
  feeRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm},
  feeLabel: {fontSize: FONT_SIZE.sm, color: COLORS.textSecondary},
  feeGood: {fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.success},
  feeBad: {fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textTertiary, textDecorationLine: 'line-through'},

  warningBox: {
    marginTop: SPACING.lg, padding: SPACING.md,
    backgroundColor: '#FEF3C7', borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  warningText: {fontSize: FONT_SIZE.sm, color: '#92400E'},

  footer: {
    padding: SPACING.xl, borderTopWidth: 1, borderTopColor: COLORS.border,
  },

  // Success
  successContainer: {
    padding: SPACING.xl, alignItems: 'center', justifyContent: 'center', flexGrow: 1,
  },
  successIcon: {fontSize: 64, marginBottom: SPACING.lg},
  successTitle: {fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.lg},
  collectionBanner: {
    backgroundColor: COLORS.primary, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.xl,
  },
  collectionBannerText: {fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white},
  successCard: {
    width: '100%', backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg, overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  txLabel: {fontSize: FONT_SIZE.sm, color: COLORS.textSecondary},
  txValue: {fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, fontFamily: 'monospace'},
});
