import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../theme/colors';

export default function DoctorCard({ doctor, onPress, compact = false }) {
  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.compactAvatar, { backgroundColor: doctor.avatarBg }]}>
          <Text style={styles.compactAvatarText}>{doctor.avatar}</Text>
        </View>
        <Text style={styles.compactName} numberOfLines={1}>{doctor.name}</Text>
        <Text style={styles.compactSpecialty} numberOfLines={1}>{doctor.specialtyName}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={[styles.avatarContainer, { backgroundColor: doctor.avatarBg }]}>
          <Text style={styles.avatarText}>{doctor.avatar}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialtyName}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.rating}>{doctor.rating}</Text>
              <Text style={styles.reviews}>({doctor.reviews})</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.experienceContainer}>
              <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.experience}>{doctor.experience}</Text>
            </View>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.price}>{doctor.price}</Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.md,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  specialty: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviews: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textLight,
    marginHorizontal: 8,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  experience: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Compact styles
  compactContainer: {
    alignItems: 'center',
    width: 90,
    marginRight: 14,
  },
  compactAvatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  compactAvatarText: {
    fontSize: 32,
  },
  compactName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  compactSpecialty: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
