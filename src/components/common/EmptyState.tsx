import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from './Button';
import {COLORS, FONT_SIZE, SPACING} from '../../constants/theme';

interface EmptyStateProps {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({icon = '📦', message, actionLabel, onAction}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={{marginTop: SPACING.md}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
