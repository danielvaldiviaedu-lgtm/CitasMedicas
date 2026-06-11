import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../theme/colors';

export default function TimeSlot({ time, selected, available = true, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.slot,
        selected && styles.slotSelected,
        !available && styles.slotDisabled,
      ]}
      onPress={available ? onPress : null}
      activeOpacity={available ? 0.7 : 1}
    >
      <Ionicons
        name="time-outline"
        size={14}
        color={
          !available
            ? COLORS.textLight
            : selected
            ? COLORS.textWhite
            : COLORS.primary
        }
      />
      <Text
        style={[
          styles.text,
          selected && styles.textSelected,
          !available && styles.textDisabled,
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.primaryLight,
    gap: 5,
    minWidth: 95,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  slotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  slotDisabled: {
    backgroundColor: COLORS.background,
    borderColor: 'transparent',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  textSelected: {
    color: COLORS.textWhite,
  },
  textDisabled: {
    color: COLORS.textLight,
  },
});
