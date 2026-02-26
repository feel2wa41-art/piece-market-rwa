import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS, FONT_SIZE, SPACING, BORDER_RADIUS} from '../../constants/theme';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
}

export function QuantitySelector({value, onChange, min = 1, max}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value <= min && styles.buttonDisabled]}
        onPress={decrease}
        disabled={value <= min}>
        <Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>-</Text>
      </TouchableOpacity>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, value >= max && styles.buttonDisabled]}
        onPress={increase}
        disabled={value >= max}>
        <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  buttonTextDisabled: {
    color: COLORS.textTertiary,
  },
  valueContainer: {
    paddingHorizontal: SPACING.xl,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  value: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
});
