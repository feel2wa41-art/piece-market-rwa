import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {Button, AssetImage} from '../../components/common';
import {QuantitySelector} from '../../components/common/QuantitySelector';
import {useAssetStore} from '../../store/useAssetStore';
import {useSwapStore} from '../../store/useSwapStore';
import {useAuthStore} from '../../store/useAuthStore';
import {formatUSDC} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

export function CreateSwapScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const portfolio = useAssetStore(s => s.portfolio);
  const assets = useAssetStore(s => s.assets);
  const user = useAuthStore(s => s.user);
  const createOffer = useSwapStore(s => s.createOffer);

  const [step, setStep] = useState(0); // 0: select give, 1: select want, 2: review
  const [giveAssetId, setGiveAssetId] = useState<string | null>(null);
  const [giveQty, setGiveQty] = useState(1);
  const [wantAssetId, setWantAssetId] = useState<string | null>(null);
  const [wantQty, setWantQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const giveItem = portfolio.find(p => p.asset.id === giveAssetId);
  const wantAsset = assets.find(a => a.id === wantAssetId);

  // Assets user doesn't own (or want to get more of)
  const availableWantAssets = assets.filter(a => a.id !== giveAssetId && a.status === 'ACTIVE');

  const handleSubmit = async () => {
    if (!giveAssetId || !wantAssetId || !user) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));

    createOffer({
      id: `swap-user-${Date.now()}`,
      offerer: {id: user.id, name: user.name, avatar: '👤'},
      offerAssetId: giveAssetId,
      offerFractions: giveQty,
      wantAssetId: wantAssetId,
      wantFractions: wantQty,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      demandCount: 0,
    });

    setSubmitting(false);
    Alert.alert(
      t('swap.offerCreated'),
      t('swap.offerCreatedDesc'),
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const renderStep0 = () => (
    <View>
      <Text style={styles.stepTitle}>{t('swap.selectGive')}</Text>
      <Text style={styles.stepDesc}>{t('swap.selectGiveDesc')}</Text>
      {portfolio.length === 0 ? (
        <Text style={styles.emptyText}>{t('swap.noFractions')}</Text>
      ) : (
        portfolio.map(item => (
          <TouchableOpacity
            key={item.asset.id}
            style={[styles.assetOption, giveAssetId === item.asset.id && styles.assetSelected]}
            onPress={() => {
              setGiveAssetId(item.asset.id);
              setGiveQty(1);
            }}
            activeOpacity={0.7}>
            <View style={styles.assetOptImg}>
              <AssetImage source={item.asset.imageUrl} />
            </View>
            <View style={styles.assetOptInfo}>
              <Text style={styles.assetOptTitle} numberOfLines={1}>{item.asset.title}</Text>
              <Text style={styles.assetOptSub}>
                {item.ownedFractions} {t('swap.fractions')} · {formatUSDC(item.ownedFractions * item.asset.unitPrice)}
              </Text>
            </View>
            {giveAssetId === item.asset.id && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>
        ))
      )}
      {giveItem && (
        <View style={styles.qtySection}>
          <Text style={styles.qtyLabel}>{t('swap.howMany')}</Text>
          <QuantitySelector
            value={giveQty}
            onChange={setGiveQty}
            min={1}
            max={giveItem.ownedFractions}
          />
        </View>
      )}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>{t('swap.selectWant')}</Text>
      <Text style={styles.stepDesc}>{t('swap.selectWantDesc')}</Text>
      {availableWantAssets.map(asset => (
        <TouchableOpacity
          key={asset.id}
          style={[styles.assetOption, wantAssetId === asset.id && styles.assetSelected]}
          onPress={() => {
            setWantAssetId(asset.id);
            setWantQty(1);
          }}
          activeOpacity={0.7}>
          <View style={styles.assetOptImg}>
            <AssetImage source={asset.imageUrl} />
          </View>
          <View style={styles.assetOptInfo}>
            <Text style={styles.assetOptTitle} numberOfLines={1}>{asset.title}</Text>
            <Text style={styles.assetOptSub}>{formatUSDC(asset.unitPrice)} / {t('swap.fraction')}</Text>
          </View>
          {wantAssetId === asset.id && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
      ))}
      {wantAsset && (
        <View style={styles.qtySection}>
          <Text style={styles.qtyLabel}>{t('swap.howManyWant')}</Text>
          <QuantitySelector
            value={wantQty}
            onChange={setWantQty}
            min={1}
            max={100}
          />
        </View>
      )}
    </View>
  );

  const renderStep2 = () => {
    if (!giveItem || !wantAsset) return null;
    const giveValue = giveQty * giveItem.asset.unitPrice;
    const wantValue = wantQty * wantAsset.unitPrice;
    return (
      <View>
        <Text style={styles.stepTitle}>{t('swap.reviewOffer')}</Text>
        <View style={styles.reviewCard}>
          <View style={styles.swapVisual}>
            <View style={styles.swapSide}>
              <View style={styles.swapImgRev}>
                <AssetImage source={giveItem.asset.imageUrl} />
              </View>
              <Text style={styles.swapName} numberOfLines={1}>{giveItem.asset.title}</Text>
              <Text style={styles.swapQty}>{giveQty} {t('swap.fractions')}</Text>
              <Text style={styles.swapVal}>{formatUSDC(giveValue)}</Text>
            </View>
            <View style={styles.arrowBox}>
              <Text style={styles.arrowIcon}>⇄</Text>
            </View>
            <View style={styles.swapSide}>
              <View style={styles.swapImgRev}>
                <AssetImage source={wantAsset.imageUrl} />
              </View>
              <Text style={styles.swapName} numberOfLines={1}>{wantAsset.title}</Text>
              <Text style={styles.swapQty}>{wantQty} {t('swap.fractions')}</Text>
              <Text style={styles.swapVal}>{formatUSDC(wantValue)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const steps = [renderStep0, renderStep1, renderStep2];
  const canNext = step === 0 ? !!giveAssetId : step === 1 ? !!wantAssetId : true;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.progress}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
          ))}
        </View>
        {steps[step]()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <Button
            title={t('common.back')}
            onPress={() => setStep(step - 1)}
            variant="outline"
            style={{flex: 1, marginRight: SPACING.sm}}
          />
        )}
        {step < 2 ? (
          <Button
            title={t('common.next')}
            onPress={() => setStep(step + 1)}
            disabled={!canNext}
            style={{flex: 1}}
          />
        ) : (
          <Button
            title={t('swap.submitOffer')}
            onPress={handleSubmit}
            loading={submitting}
            style={{flex: 1}}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  scroll: {padding: SPACING.xl, paddingBottom: 120},
  progress: {flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xxl, gap: SPACING.sm},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.border},
  dotActive: {backgroundColor: COLORS.primary},

  stepTitle: {fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm},
  stepDesc: {fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginBottom: SPACING.xl},
  emptyText: {fontSize: FONT_SIZE.sm, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.xxl},

  assetOption: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    borderWidth: 2, borderColor: 'transparent',
  },
  assetSelected: {borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight},
  assetOptImg: {
    width: 52, height: 52, borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden', backgroundColor: COLORS.white, marginRight: SPACING.md,
  },
  assetOptInfo: {flex: 1},
  assetOptTitle: {fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text},
  assetOptSub: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4},
  checkMark: {fontSize: FONT_SIZE.lg, color: COLORS.primary, fontWeight: '700'},

  qtySection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: SPACING.xl, padding: SPACING.lg,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
  },
  qtyLabel: {fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text},

  reviewCard: {
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  swapVisual: {flexDirection: 'row', alignItems: 'center', padding: SPACING.xl},
  swapSide: {flex: 1, alignItems: 'center'},
  swapImgRev: {
    width: 80, height: 80, borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden', backgroundColor: COLORS.surface, marginBottom: SPACING.sm,
  },
  swapName: {fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.text, textAlign: 'center'},
  swapQty: {fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary, marginTop: 4},
  swapVal: {fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2},
  arrowBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: SPACING.sm,
  },
  arrowIcon: {fontSize: 20, color: COLORS.primary, fontWeight: '700'},

  footer: {
    flexDirection: 'row', padding: SPACING.xl,
    borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.background,
  },
});
