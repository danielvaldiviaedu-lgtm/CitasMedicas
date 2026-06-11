import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../theme/colors';

export default function SpecialtyChip({ specialty, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: specialty.color || COLORS.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={specialty.icon}
        size={16}
        color={selected ? COLORS.textWhite : specialty.color || COLORS.primary}
      />
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
        ]}
      >
        {specialty.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radius.full,
    backgroundColor: COLORS.surface,
    marginRight: 10,
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  labelSelected: {
    color: COLORS.textWhite,
  },
});
