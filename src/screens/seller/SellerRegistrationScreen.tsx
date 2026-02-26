import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {Button, AssetImage} from '../../components/common';
import {useAssetStore} from '../../store/useAssetStore';
import {useWalletStore} from '../../store/useWalletStore';
import {useDemoStore} from '../../store/useDemoStore';
import {AssetImages} from '../../assets/images';
import {formatUSDC} from '../../utils/format';
import {FEE_RATES} from '../../constants/fees';
import {AssetCategory, RWAAsset} from '../../types/asset';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

const IMAGE_OPTIONS = [
  {key: 'charizardPsa10', label: 'Pokemon Card 1'},
  {key: 'pikachuVmax', label: 'Pokemon Card 2'},
  {key: 'btsProof', label: 'K-Pop Album'},
  {key: 'hermesBirkin', label: 'Luxury Item'},
  {key: 'banksyPrint', label: 'Art Print'},
  {key: 'starwarsFigures', label: 'Collectible'},
];

const CATEGORIES: {value: AssetCategory; label: string}[] = [
  {value: 'POKEMON_CARDS', label: 'Pokemon Cards'},
  {value: 'KPOP_MERCH', label: 'K-Pop Merch'},
  {value: 'LUXURY_GOODS', label: 'Luxury Goods'},
  {value: 'ART', label: 'Art'},
  {value: 'COLLECTIBLES', label: 'Collectibles'},
  {value: 'OTHER', label: 'Other'},
];

export function SellerRegistrationScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const addAsset = useAssetStore(s => s.addAsset);
  const deductBalance = useWalletStore(s => s.deductBalance);
  const addTransaction = useWalletStore(s => s.addTransaction);
  const recordTransaction = useDemoStore(s => s.recordTransaction);
  const balance = useWalletStore(s => s.balance);

  const [step, setStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState('charizardPsa10');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AssetCategory>('POKEMON_CARDS');
  const [totalValue, setTotalValue] = useState('');
  const [fractionCount, setFractionCount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalValueNum = parseFloat(totalValue) || 0;
  const fractionCountNum = parseInt(fractionCount) || 0;
  const unitPrice = fractionCountNum > 0 ? totalValueNum / fractionCountNum : 0;
  const listingFee = totalValueNum * FEE_RATES.LISTING;

  const canProceed = () => {
    if (step === 0) return !!selectedImage;
    if (step === 1) return title.length > 0 && totalValueNum > 0;
    if (step === 2) return fractionCountNum > 0 && fractionCountNum <= 10000;
    return true;
  };

  const handleSubmit = async () => {
    if (balance < listingFee) {
      Alert.alert(t('seller.insufficientFunds'), t('seller.needMoreFunds'));
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));

    const success = deductBalance(listingFee);
    if (!success) {
      setSubmitting(false);
      return;
    }

    const newId = `${Date.now()}`;
    const newAsset: RWAAsset = {
      id: newId,
      tokenId: `20${newId.slice(-3)}`,
      title,
      description: description || title,
      imageUrl: AssetImages[selectedImage],
      category,
      totalValue: totalValueNum,
      fractionCount: fractionCountNum,
      unitPrice,
      soldFractions: 0,
      status: 'ACTIVE',
      seller: {id: 'seller-1', name: 'Sarah Park', verified: true},
      createdAt: new Date().toISOString(),
      metadata: {condition: 'New', storageLocation: 'Platform Vault'},
    };

    addAsset(newAsset);

    const tx = {
      id: `tx-${Date.now()}`,
      type: 'LISTING' as const,
      assetId: newId,
      assetTitle: title,
      fractionCount: fractionCountNum,
      pricePerFraction: unitPrice,
      totalAmount: totalValueNum,
      fee: listingFee,
      txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`,
      status: 'CONFIRMED' as const,
      createdAt: new Date().toISOString(),
    };

    addTransaction(tx);
    recordTransaction(tx);

    setSubmitting(false);
    Alert.alert(
      t('seller.successTitle'),
      t('seller.successMessage'),
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const renderStep0 = () => (
    <View>
      <Text style={styles.stepTitle}>{t('seller.step1Title')}</Text>
      <Text style={styles.stepDesc}>{t('seller.step1Desc')}</Text>
      <View style={styles.imageGrid}>
        {IMAGE_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.imageOption,
              selectedImage === opt.key && styles.imageSelected,
            ]}
            onPress={() => setSelectedImage(opt.key)}>
            <AssetImage source={AssetImages[opt.key]} style={styles.imageThumb} />
            <Text style={styles.imageLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>{t('seller.step2Title')}</Text>
      <Text style={styles.inputLabel}>{t('seller.assetName')}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={t('seller.assetNamePlaceholder')}
        placeholderTextColor={COLORS.textTertiary}
      />
      <Text style={styles.inputLabel}>{t('seller.description')}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder={t('seller.descriptionPlaceholder')}
        placeholderTextColor={COLORS.textTertiary}
        multiline
        numberOfLines={3}
      />
      <Text style={styles.inputLabel}>{t('seller.category')}</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryChip,
              category === cat.value && styles.categorySelected,
            ]}
            onPress={() => setCategory(cat.value)}>
            <Text
              style={[
                styles.categoryText,
                category === cat.value && styles.categoryTextSelected,
              ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.inputLabel}>{t('seller.totalValue')}</Text>
      <TextInput
        style={styles.input}
        value={totalValue}
        onChangeText={setTotalValue}
        placeholder="e.g. 50000"
        placeholderTextColor={COLORS.textTertiary}
        keyboardType="numeric"
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>{t('seller.step3Title')}</Text>
      <Text style={styles.inputLabel}>{t('seller.fractionCount')}</Text>
      <TextInput
        style={styles.input}
        value={fractionCount}
        onChangeText={setFractionCount}
        placeholder="e.g. 500"
        placeholderTextColor={COLORS.textTertiary}
        keyboardType="numeric"
      />
      {fractionCountNum > 0 && (
        <View style={styles.calcCard}>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>{t('seller.unitPrice')}</Text>
            <Text style={styles.calcValue}>{formatUSDC(unitPrice)}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>{t('seller.totalFractions')}</Text>
            <Text style={styles.calcValue}>{fractionCountNum}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>{t('seller.step4Title')}</Text>
      <View style={styles.reviewCard}>
        <AssetImage source={AssetImages[selectedImage]} style={styles.reviewImage} />
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>{t('seller.assetName')}</Text>
          <Text style={styles.reviewValue}>{title}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>{t('seller.category')}</Text>
          <Text style={styles.reviewValue}>{category}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>{t('seller.totalValue')}</Text>
          <Text style={styles.reviewValue}>{formatUSDC(totalValueNum)}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>{t('seller.fractionCount')}</Text>
          <Text style={styles.reviewValue}>{fractionCountNum}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>{t('seller.unitPrice')}</Text>
          <Text style={styles.reviewValue}>{formatUSDC(unitPrice)}</Text>
        </View>
        <View style={[styles.reviewRow, styles.feeRow]}>
          <Text style={styles.feeLabel}>{t('seller.listingFee')} (5%)</Text>
          <Text style={styles.feeValue}>{formatUSDC(listingFee)}</Text>
        </View>
      </View>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.progress}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={[styles.dot, i <= step && styles.dotActive]}
            />
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
        {step < 3 ? (
          <Button
            title={t('common.next')}
            onPress={() => setStep(step + 1)}
            disabled={!canProceed()}
            style={{flex: 1}}
          />
        ) : (
          <Button
            title={t('seller.submit')}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.xl,
    paddingBottom: 100,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  stepTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  stepDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  imageOption: {
    width: '47%',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageSelected: {
    borderColor: COLORS.primary,
  },
  imageThumb: {
    width: '100%',
    height: 100,
  },
  imageLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    textAlign: 'center',
    padding: SPACING.sm,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  categorySelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  calcCard: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  calcLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  calcValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  reviewImage: {
    width: '100%',
    height: 160,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  reviewValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  feeRow: {
    backgroundColor: COLORS.warning + '10',
    borderBottomWidth: 0,
  },
  feeLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.warning,
  },
  feeValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.warning,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});
