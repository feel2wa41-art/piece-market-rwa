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
import {EmptyState, Button, AssetImage} from '../../components/common';
import {ProgressBar} from '../../components/asset';
import {useAssetStore} from '../../store/useAssetStore';
import {formatUSDC} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import {PortfolioStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<PortfolioStackParamList>;

export function PortfolioScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const portfolio = useAssetStore(s => s.portfolio);
  const getPortfolioValue = useAssetStore(s => s.getPortfolioValue);

  const totalValue = getPortfolioValue();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('portfolio.title')}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t('portfolio.totalValue')}</Text>
        <Text style={styles.summaryValue}>{formatUSDC(totalValue)}</Text>
        <Text style={styles.summaryCount}>
          {portfolio.length} {t('portfolio.holdings').toLowerCase()}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('portfolio.holdings')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
          <Text style={styles.seeHistory}>{t('portfolio.transactions')}</Text>
        </TouchableOpacity>
      </View>

      {portfolio.length === 0 ? (
        <EmptyState icon="📦" message={t('portfolio.emptyState')} />
      ) : (
        <FlatList
          data={portfolio}
          keyExtractor={item => item.asset.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.holdingCard}
                onPress={() =>
                  navigation.navigate('AssetDetail', {assetId: item.asset.id})
                }>
                <View style={styles.holdingIcon}>
                  <AssetImage source={item.asset.imageUrl} />
                </View>
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingTitle} numberOfLines={1}>
                    {item.asset.title}
                  </Text>
                  <Text style={styles.holdingFractions}>
                    {item.ownedFractions} {t('asset.fractionCount', {count: item.ownedFractions})}
                  </Text>
                  <ProgressBar
                    current={item.asset.soldFractions}
                    total={item.asset.fractionCount}
                    showLabel={false}
                  />
                </View>
                <Text style={styles.holdingValue}>
                  {formatUSDC(item.ownedFractions * item.asset.unitPrice)}
                </Text>
              </TouchableOpacity>
            );
          }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeHistory: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
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
    overflow: 'hidden',
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
