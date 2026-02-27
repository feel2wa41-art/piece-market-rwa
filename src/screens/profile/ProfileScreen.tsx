import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useLanguage} from '../../hooks/useLanguage';
import {useAuthStore} from '../../store/useAuthStore';
import {useWalletStore} from '../../store/useWalletStore';
import {formatUSDC, shortenAddress} from '../../utils/format';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';
import type {ProfileScreenProps} from '../../navigation/types';

const ROLE_CONFIG: Record<string, {color: string; label: string}> = {
  INVESTOR: {color: COLORS.primary, label: 'Investor'},
  SELLER: {color: COLORS.secondary, label: 'Seller'},
  ADMIN: {color: COLORS.error, label: 'Admin'},
};

export function ProfileScreen({navigation}: ProfileScreenProps) {
  const {t} = useTranslation();
  const {currentLanguage, languages} = useLanguage();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const balance = useWalletStore(s => s.balance);
  const address = useWalletStore(s => s.address);
  const disconnect = useWalletStore(s => s.disconnect);

  const currentLangLabel =
    languages.find(l => l.code === currentLanguage)?.nativeLabel || 'English';

  const roleConfig = user?.role ? ROLE_CONFIG[user.role] : null;

  const menuItems = [
    {
      label: t('profile.wallet'),
      value: formatUSDC(balance),
      onPress: () => navigation.navigate('WalletDetail'),
    },
    ...(user?.role === 'SELLER' || user?.role === 'ADMIN'
      ? [{
          label: t('seller.registerAsset'),
          value: '>',
          onPress: () => navigation.navigate('SellerRegistration' as any),
        }]
      : []),
    {
      label: t('profile.language'),
      value: currentLangLabel,
      onPress: () => navigation.navigate('LanguageSettings'),
    },
    {
      label: t('docs.title'),
      value: '>',
      onPress: () => navigation.navigate('Docs' as any),
    },
    {
      label: t('profile.notifications'),
      value: '>',
      onPress: () => {},
    },
    {
      label: t('profile.helpCenter'),
      value: '>',
      onPress: () => {},
    },
  ];

  const handleLogout = () => {
    disconnect();
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          {roleConfig && (
            <View style={[styles.roleBadge, {backgroundColor: roleConfig.color}]}>
              <Text style={styles.roleText}>{roleConfig.label}</Text>
            </View>
          )}
          {address && (
            <Text style={styles.walletAddress}>{shortenAddress(address)}</Text>
          )}
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuValue}>{item.value || '>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.switchButton} onPress={handleLogout}>
          <Text style={styles.switchText}>{t('demo.switchAccount')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userName: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  roleBadge: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  walletAddress: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontFamily: 'monospace',
  },
  menu: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  menuValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  switchButton: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
  },
  switchText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    marginBottom: SPACING.xxxl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    fontWeight: '600',
  },
});
