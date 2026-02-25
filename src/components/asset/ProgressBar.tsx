import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export function ProgressBar({current, total, showLabel = true}: ProgressBarProps) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <View>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${percent}%`}]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {Math.round(percent)}% ({current}/{total})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
