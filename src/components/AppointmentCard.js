import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../theme/colors';

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmada',
    color: COLORS.success,
    bg: COLORS.secondaryLight,
    icon: 'checkmark-circle',
  },
  pending: {
    label: 'Pendiente',
    color: COLORS.accent,
    bg: COLORS.accentLight,
    icon: 'time',
  },
  cancelled: {
    label: 'Cancelada',
    color: COLORS.danger,
    bg: COLORS.dangerLight,
    icon: 'close-circle',
  },
  completed: {
    label: 'Completada',
    color: COLORS.primary,
    bg: COLORS.primaryLight,
    icon: 'checkmark-done-circle',
  },
};

export default function AppointmentCard({ appointment, onCancel, onReschedule, showActions = true }) {
  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('es-ES', options);
  };

  const getConsultationIcon = () => {
    return appointment.type === 'telemedicina' ? 'videocam' : 'business';
  };

  return (
    <View style={styles.container}>
      {/* Status badge */}
      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
        <Ionicons name={status.icon} size={14} color={status.color} />
        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
      </View>

      <View style={styles.mainRow}>
        <View style={[styles.avatar, { backgroundColor: appointment.doctorAvatarBg || '#E8F4FD' }]}>
          <Text style={styles.avatarText}>{appointment.doctorAvatar || '👨‍⚕️'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.specialty}>{appointment.specialtyName}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="calendar" size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="time" size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>{appointment.time}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name={getConsultationIcon()} size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>
            {appointment.type === 'telemedicina' ? 'Virtual' : 'Presencial'}
          </Text>
        </View>
      </View>

      {appointment.reason ? (
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Motivo:</Text>
          <Text style={styles.reasonText} numberOfLines={2}>{appointment.reason}</Text>
        </View>
      ) : null}

      {showActions && appointment.status === 'confirmed' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.rescheduleBtn}
            onPress={() => onReschedule && onReschedule(appointment.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.rescheduleText}>Reprogramar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancel && onCancel(appointment.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={16} color={COLORS.danger} />
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.md,
    marginBottom: 14,
    ...SHADOWS.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radius.full,
    gap: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  specialty: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  reasonContainer: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.md,
    padding: 10,
    marginTop: 12,
  },
  reasonLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  rescheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: SIZES.radius.lg,
  },
  rescheduleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 10,
    borderRadius: SIZES.radius.lg,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
