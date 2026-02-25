import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    (disabled || loading) && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    textSizeStyles[size],
    variantTextStyles[variant],
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  sm: {paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md},
  md: {paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl},
  lg: {paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl},
};

const textSizeStyles: Record<string, TextStyle> = {
  sm: {fontSize: FONT_SIZE.sm},
  md: {fontSize: FONT_SIZE.md},
  lg: {fontSize: FONT_SIZE.lg},
};

const variantStyles: Record<string, ViewStyle> = {
  primary: {backgroundColor: COLORS.primary},
  outline: {backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border},
  ghost: {backgroundColor: 'transparent'},
};

const variantTextStyles: Record<string, TextStyle> = {
  primary: {color: COLORS.white},
  outline: {color: COLORS.text},
  ghost: {color: COLORS.primary},
};
