import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EmptyState} from '../../components/common';
import {ProgressBar} from '../../components/asset';
import {MOCK_PORTFOLIO} from '../../data/mockAssets';
import {formatCurrency} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import {PortfolioStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<PortfolioStackParamList>;

export function PortfolioScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();

  const totalValue = MOCK_PORTFOLIO.reduce(
    (sum, a) => sum + a.ownedFractions * a.unitPrice,
    0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('portfolio.title')}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t('portfolio.totalValue')}</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text>
        <Text style={styles.summaryCount}>
          {MOCK_PORTFOLIO.length} {t('portfolio.holdings').toLowerCase()}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('portfolio.holdings')}</Text>
      </View>

      {MOCK_PORTFOLIO.length === 0 ? (
        <EmptyState icon="📦" message={t('portfolio.emptyState')} />
      ) : (
        <FlatList
          data={MOCK_PORTFOLIO}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.holdingCard}
              onPress={() =>
                navigation.navigate('AssetDetail', {assetId: item.id})
              }>
              <View style={styles.holdingIcon}>
                <Text style={{fontSize: 24}}>🖼️</Text>
              </View>
              <View style={styles.holdingInfo}>
                <Text style={styles.holdingTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.holdingFractions}>
                  {item.ownedFractions} {t('asset.fractionCount', {count: item.ownedFractions})}
                </Text>
                <ProgressBar
                  current={item.soldFractions}
                  total={item.fractionCount}
                  showLabel={false}
                />
              </View>
              <Text style={styles.holdingValue}>
                {formatCurrency(item.ownedFractions * item.unitPrice)}
              </Text>
            </TouchableOpacity>
          )}
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
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryCard: {
    margin: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  summaryCount: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: SPACING.xs,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  holdingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  holdingIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  holdingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  holdingTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  holdingFractions: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginVertical: SPACING.xs,
  },
  holdingValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
