import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COLORS, FONT_SIZE, SPACING} from '../../constants/theme';

export function MarketScreen() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('market.title')}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{t('market.orderBook')}</Text>
        </View>
      </View>
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
  body: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  placeholder: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.md,
  },
});
