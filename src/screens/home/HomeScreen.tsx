import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchBar, SectionHeader} from '../../components/common';
import {AssetCard, CategoryChip} from '../../components/asset';
import {MOCK_ASSETS} from '../../data/mockAssets';
import {COLORS, FONT_SIZE, SPACING} from '../../constants/theme';
import {HomeStackParamList} from '../../navigation/types';
import {AssetCategory} from '../../types/asset';

const CATEGORIES: {key: AssetCategory | 'ALL'; labelKey: string}[] = [
  {key: 'ALL', labelKey: 'common.seeAll'},
  {key: 'POKEMON_CARDS', labelKey: 'categories.POKEMON_CARDS'},
  {key: 'KPOP_MERCH', labelKey: 'categories.KPOP_MERCH'},
  {key: 'LUXURY_GOODS', labelKey: 'categories.LUXURY_GOODS'},
  {key: 'ART', labelKey: 'categories.ART'},
  {key: 'COLLECTIBLES', labelKey: 'categories.COLLECTIBLES'},
];

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export function HomeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const featured = MOCK_ASSETS.slice(0, 4);
  const filtered =
    selectedCategory === 'ALL'
      ? MOCK_ASSETS
      : MOCK_ASSETS.filter(a => a.category === selectedCategory);
  const trending = filtered.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.title')}</Text>
          <View style={styles.searchWrap}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder={t('home.searchPlaceholder')}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat.key}
              label={t(cat.labelKey)}
              selected={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
            />
          ))}
        </ScrollView>

        {/* Featured */}
        <View style={styles.section}>
          <SectionHeader title={t('home.featuredTitle')} />
          <FlatList
            horizontal
            data={featured}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <AssetCard
                asset={item}
                compact
                onPress={() =>
                  navigation.navigate('AssetDetail', {assetId: item.id})
                }
              />
            )}
          />
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <SectionHeader title={t('home.trendingTitle')} />
          {trending.map(item => (
            <AssetCard
              key={item.id}
              asset={item}
              onPress={() =>
                navigation.navigate('AssetDetail', {assetId: item.id})
              }
            />
          ))}
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
  content: {
    paddingBottom: SPACING.xxxl,
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
  searchWrap: {
    marginTop: SPACING.md,
  },
  chipRow: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
  },
});
