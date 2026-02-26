import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SearchBar} from '../../components/common';
import {AssetCard} from '../../components/asset';
import {useAssetStore} from '../../store/useAssetStore';
import {COLORS, FONT_SIZE, SPACING} from '../../constants/theme';
import {MarketStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<MarketStackParamList>;

export function MarketScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const assets = useAssetStore(s => s.assets);

  const filtered = assets.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('market.title')}</Text>
        <View style={styles.searchWrap}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={t('home.searchPlaceholder')}
          />
        </View>
        <Text style={styles.count}>
          {filtered.length} items
        </Text>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <AssetCard
            asset={item}
            onPress={() =>
              navigation.navigate('AssetDetail', {assetId: item.id})
            }
          />
        )}
      />
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
  searchWrap: {
    marginTop: SPACING.md,
  },
  count: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
});
