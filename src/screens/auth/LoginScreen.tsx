import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAuthStore} from '../../store/useAuthStore';
import {useWalletStore} from '../../store/useWalletStore';
import {useAssetStore} from '../../store/useAssetStore';
import {UserSwitcher} from '../../components/demo/UserSwitcher';
import {User} from '../../types/user';
import {COLORS, FONT_SIZE, SPACING} from '../../constants/theme';

export function LoginScreen() {
  const {t} = useTranslation();
  const loginAsDemoUser = useAuthStore(state => state.loginAsDemoUser);
  const initForUser = useWalletStore(state => state.initForUser);
  const seedDemoPortfolio = useAssetStore(state => state.seedDemoPortfolio);

  const handleSelectUser = (user: User) => {
    loginAsDemoUser(user);
    initForUser(user.walletAddress);
    if (user.role === 'INVESTOR') {
      seedDemoPortfolio();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.logo}>PieceMarket</Text>
          <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
        </View>

        <UserSwitcher onSelectUser={handleSelectUser} />

        <Text style={styles.demoNote}>{t('demo.demoNote')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxxl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xxl,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  demoNote: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xxl,
  },
});
