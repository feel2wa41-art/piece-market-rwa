import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {DEMO_USERS} from '../../data/mockUsers';
import {User, UserRole} from '../../types/user';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface UserSwitcherProps {
  onSelectUser: (user: User) => void;
}

const ROLE_CONFIG: Record<UserRole, {color: string; icon: string; label: string}> = {
  INVESTOR: {color: COLORS.primary, icon: 'I', label: 'Investor'},
  SELLER: {color: COLORS.secondary, icon: 'S', label: 'Seller'},
  ADMIN: {color: COLORS.error, icon: 'A', label: 'Admin'},
};

export function UserSwitcher({onSelectUser}: UserSwitcherProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('demo.selectAccount')}</Text>
      <Text style={styles.subtitle}>{t('demo.selectAccountDesc')}</Text>

      {DEMO_USERS.map(user => {
        const config = ROLE_CONFIG[user.role];
        return (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            onPress={() => onSelectUser(user)}
            activeOpacity={0.7}>
            <View style={[styles.avatar, {backgroundColor: config.color + '20'}]}>
              <Text style={[styles.avatarText, {color: config.color}]}>{config.icon}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{user.displayName}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
            <View style={[styles.roleBadge, {backgroundColor: config.color}]}>
              <Text style={styles.roleText}>{config.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  email: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
});
