import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AssetImage} from '../../components/common';
import {useAssetStore} from '../../store/useAssetStore';
import {useSwapStore} from '../../store/useSwapStore';
import {COLLECTIONS} from '../../data/mockCollections';
import {formatUSDC} from '../../utils/format';
import {FEE_RATES} from '../../constants/fees';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {SwapStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<SwapStackParamList>;

export function SwapMarketScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const portfolio = useAssetStore(s => s.portfolio);
  const assets = useAssetStore(s => s.assets);
  const offers = useSwapStore(s => s.offers);
  const openOffers = offers.filter(o => o.status === 'OPEN');
  const ownedIds = portfolio.map(p => p.asset.id);

  const savingsPercent = Math.round(
    (1 - (FEE_RATES.SWAP * 2) / (FEE_RATES.BUY + FEE_RATES.SELL)) * 100,
  );

  const getAsset = (id: string) => assets.find(a => a.id === id);

  // Find offers that match user's portfolio (they want what you have)
  const matchingOffers = openOffers.filter(o => ownedIds.includes(o.wantAssetId));
  const otherOffers = openOffers.filter(o => !ownedIds.includes(o.wantAssetId));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('swap.title')}</Text>
          <Text style={styles.subtitle}>{t('swap.subtitle')}</Text>
        </View>

        {/* Savings Banner */}
        <View style={styles.savingsBanner}>
          <Text style={styles.savingsIcon}>💰</Text>
          <View style={{flex: 1}}>
            <Text style={styles.savingsTitle}>
              {t('swap.saveBanner', {percent: savingsPercent})}
            </Text>
            <Text style={styles.savingsDesc}>{t('swap.saveBannerDesc')}</Text>
          </View>
        </View>

        {/* Collections */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('swap.collections')}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsRow}>
          {COLLECTIONS.map(col => {
            const owned = col.assetIds.filter(id => ownedIds.includes(id)).length;
            const total = col.assetIds.length;
            const complete = owned === total;
            return (
              <View key={col.id} style={[styles.collectionCard, complete && styles.collectionComplete]}>
                <Text style={styles.collectionIcon}>{col.icon}</Text>
                <Text style={styles.collectionName}>{col.name}</Text>
                <View style={styles.collectionSlots}>
                  {col.assetIds.map((aid, i) => {
                    const has = ownedIds.includes(aid);
                    return (
                      <View key={i} style={[styles.slot, has ? styles.slotFilled : styles.slotEmpty]}>
                        {has ? (
                          <Text style={styles.slotCheck}>✓</Text>
                        ) : (
                          <Text style={styles.slotQ}>?</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.collectionProgress}>
                  {owned}/{total} {complete ? '✨' : ''}
                </Text>
                {!complete && owned > 0 && (
                  <Text style={styles.collectionHint}>{t('swap.completeSet')}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Matching Offers — "They want what you have!" */}
        {matchingOffers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('swap.matchingOffers')}</Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>MATCH</Text>
              </View>
            </View>
            {matchingOffers.map(offer => {
              const offerAsset = getAsset(offer.offerAssetId);
              const wantAsset = getAsset(offer.wantAssetId);
              if (!offerAsset || !wantAsset) return null;

              // Check if this completes a collection
              const completesCollection = COLLECTIONS.some(col =>
                col.assetIds.includes(offer.offerAssetId) &&
                !ownedIds.includes(offer.offerAssetId) &&
                ownedIds.includes(offer.wantAssetId),
              );

              return (
                <TouchableOpacity
                  key={offer.id}
                  style={styles.swapCard}
                  onPress={() => navigation.navigate('SwapDetail', {swapId: offer.id})}
                  activeOpacity={0.7}>
                  {completesCollection && (
                    <View style={styles.completeBanner}>
                      <Text style={styles.completeBannerText}>
                        {t('swap.completesCollection')} ✨
                      </Text>
                    </View>
                  )}
                  <View style={styles.swapVisual}>
                    {/* What you give */}
                    <View style={styles.swapSide}>
                      <View style={styles.swapImg}>
                        <AssetImage source={wantAsset.imageUrl} />
                      </View>
                      <Text style={styles.swapAssetName} numberOfLines={1}>
                        {wantAsset.title}
                      </Text>
                      <Text style={styles.swapFractions}>
                        {offer.wantFractions} {t('swap.fractions')}
                      </Text>
                      <Text style={styles.swapLabel}>{t('swap.youGive')}</Text>
                    </View>

                    {/* Swap icon */}
                    <View style={styles.swapIconBox}>
                      <Text style={styles.swapIcon}>⇄</Text>
                    </View>

                    {/* What you get */}
                    <View style={styles.swapSide}>
                      <View style={styles.swapImg}>
                        <AssetImage source={offerAsset.imageUrl} />
                      </View>
                      <Text style={styles.swapAssetName} numberOfLines={1}>
                        {offerAsset.title}
                      </Text>
                      <Text style={styles.swapFractions}>
                        {offer.offerFractions} {t('swap.fractions')}
                      </Text>
                      <Text style={[styles.swapLabel, {color: COLORS.success}]}>
                        {t('swap.youGet')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.swapFooter}>
                    <Text style={styles.offererName}>
                      {offer.offerer.avatar} {offer.offerer.name}
                    </Text>
                    {offer.message && (
                      <Text style={styles.swapMessage}>"{offer.message}"</Text>
                    )}
                    <View style={styles.demandRow}>
                      <Text style={styles.demandText}>
                        🔥 {t('swap.demand', {count: offer.demandCount})}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* All Open Offers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('swap.allOffers')}</Text>
          <Text style={styles.offerCount}>{openOffers.length}</Text>
        </View>
        {(matchingOffers.length > 0 ? otherOffers : openOffers).map(offer => {
          const offerAsset = getAsset(offer.offerAssetId);
          const wantAsset = getAsset(offer.wantAssetId);
          if (!offerAsset || !wantAsset) return null;

          return (
            <TouchableOpacity
              key={offer.id}
              style={styles.offerRow}
              onPress={() => navigation.navigate('SwapDetail', {swapId: offer.id})}
              activeOpacity={0.7}>
              <View style={styles.offerImgSmall}>
                <AssetImage source={offerAsset.imageUrl} />
              </View>
              <View style={styles.offerInfo}>
                <Text style={styles.offerTitle} numberOfLines={1}>
                  {offerAsset.title}
                </Text>
                <Text style={styles.offerSub}>
                  {offer.offerFractions} → {offer.wantFractions} {wantAsset.title}
                </Text>
              </View>
              <View style={styles.offerImgSmall}>
                <AssetImage source={wantAsset.imageUrl} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Create Swap CTA */}
        {portfolio.length > 0 && (
          <TouchableOpacity
            style={styles.createCta}
            onPress={() => navigation.navigate('CreateSwap')}
            activeOpacity={0.7}>
            <Text style={styles.createCtaIcon}>+</Text>
            <Text style={styles.createCtaText}>{t('swap.createOffer')}</Text>
          </TouchableOpacity>
        )}

        <View style={{height: SPACING.xxxl * 2}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg},
  title: {fontSize: FONT_SIZE.title, fontWeight: '700', color: COLORS.text},
  subtitle: {fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: SPACING.xs},

  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: '#FEF3C7',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  savingsIcon: {fontSize: 24, marginRight: SPACING.md},
  savingsTitle: {fontSize: FONT_SIZE.sm, fontWeight: '700', color: '#92400E'},
  savingsDesc: {fontSize: FONT_SIZE.xs, color: '#A16207', marginTop: 2},

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, flex: 1},
  matchBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  matchBadgeText: {fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.error},
  offerCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },

  collectionsRow: {paddingHorizontal: SPACING.xl, gap: SPACING.md},
  collectionCard: {
    width: 140,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  collectionComplete: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FDF4',
  },
  collectionIcon: {fontSize: 28, marginBottom: SPACING.sm},
  collectionName: {fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, textAlign: 'center'},
  collectionSlots: {flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md},
  slot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {backgroundColor: COLORS.success},
  slotEmpty: {backgroundColor: COLORS.border, borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed'},
  slotCheck: {fontSize: 12, color: COLORS.white, fontWeight: '700'},
  slotQ: {fontSize: 12, color: '#9CA3AF', fontWeight: '700'},
  collectionProgress: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.sm},
  collectionHint: {fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600', marginTop: 4},

  // Swap card (visual side-by-side)
  swapCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  completeBanner: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  completeBannerText: {fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.white},
  swapVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  swapSide: {flex: 1, alignItems: 'center'},
  swapImg: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  swapAssetName: {fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.text, textAlign: 'center'},
  swapFractions: {fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary, marginTop: 2},
  swapLabel: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4},
  swapIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
  },
  swapIcon: {fontSize: 20, color: COLORS.primary, fontWeight: '700'},
  swapFooter: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  offererName: {fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text},
  swapMessage: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 4},
  demandRow: {marginTop: SPACING.sm},
  demandText: {fontSize: FONT_SIZE.xs, color: COLORS.warning, fontWeight: '600'},

  // Compact offer row
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  offerImgSmall: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  offerInfo: {flex: 1, marginHorizontal: SPACING.md},
  offerTitle: {fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text},
  offerSub: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2},

  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  createCtaIcon: {fontSize: FONT_SIZE.xl, color: COLORS.white, fontWeight: '700', marginRight: SPACING.sm},
  createCtaText: {fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white},
});
