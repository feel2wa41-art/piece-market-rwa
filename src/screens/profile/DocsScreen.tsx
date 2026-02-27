import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

const DOCS = [
  {
    id: 'business-model',
    icon: '💰',
    file: 'business-model.html',
    gradient: ['#2563EB', '#7C3AED'],
  },
  {
    id: 'requirements',
    icon: '📋',
    file: 'requirements-guide.html',
    gradient: ['#10B981', '#06B6D4'],
  },
  {
    id: 'swap',
    icon: '🔄',
    file: 'swap-structure.html',
    gradient: ['#EC4899', '#F59E0B'],
  },
];

function openDoc(file: string) {
  const url = `/docs/${file}`;
  if (Platform.OS === 'web') {
    window.open(url, '_blank');
  } else {
    Linking.openURL(url);
  }
}

export function DocsScreen() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>{t('docs.subtitle')}</Text>

        {DOCS.map(doc => (
          <TouchableOpacity
            key={doc.id}
            style={styles.card}
            onPress={() => openDoc(doc.file)}
            activeOpacity={0.7}>
            <View style={styles.cardIcon}>
              <Text style={styles.iconText}>{doc.icon}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t(`docs.${doc.id}.title`)}</Text>
              <Text style={styles.cardDesc}>{t(`docs.${doc.id}.desc`)}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.note}>
          <Text style={styles.noteText}>{t('docs.note')}</Text>
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
  scroll: {
    padding: SPACING.xl,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textTertiary,
    marginLeft: SPACING.sm,
  },
  note: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  noteText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
