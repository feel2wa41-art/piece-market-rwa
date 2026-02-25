import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useLanguage, type SupportedLanguage} from '../../hooks/useLanguage';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

export function LanguageSettingsScreen() {
  const {t} = useTranslation();
  const {currentLanguage, changeLanguage, languages} = useLanguage();

  const handleSelect = async (code: SupportedLanguage) => {
    await changeLanguage(code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.list}>
        {languages.map(lang => {
          const isSelected = currentLanguage === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => handleSelect(lang.code)}>
              <View>
                <Text style={styles.nativeLabel}>{lang.nativeLabel}</Text>
                <Text style={styles.label}>{lang.label}</Text>
              </View>
              {isSelected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    margin: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  nativeLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  check: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
