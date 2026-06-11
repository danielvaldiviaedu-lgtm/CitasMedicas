import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { DOCTORS, CONSULTATION_TYPES } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';
import Calendar from '../components/Calendar';
import TimeSlot from '../components/TimeSlot';
import GradientHeader from '../components/GradientHeader';
import { COLORS, SHADOWS, SIZES } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function BookingScreen({ navigation, route }) {
  const { addAppointment, doctors } = useApp();
  const [step, setStep] = useState(route.params?.doctor ? 2 : 1);
  const [selectedDoctor, setSelectedDoctor] = useState(route.params?.doctor || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState(null);
  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const totalSteps = 4;

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const canContinue = () => {
    switch (step) {
      case 1: return !!selectedDoctor;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return !!consultationType;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleConfirm();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirm = () => {
    const appointment = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorAvatar: selectedDoctor.avatar,
      doctorAvatarBg: selectedDoctor.avatarBg,
      specialtyName: selectedDoctor.specialtyName,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      reason: reason.trim(),
      price: selectedDoctor.price,
    };

    addAppointment(appointment);
    
    // Show success animation
    setShowSuccess(true);
    Animated.parallel([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    navigation.navigate('Citas');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((s) => (
        <View key={s} style={styles.stepRow}>
          <View
            style={[
              styles.stepDot,
              s <= step && styles.stepDotActive,
              s < step && styles.stepDotDone,
            ]}
          >
            {s < step ? (
              <Ionicons name="checkmark" size={12} color="#FFF" />
            ) : (
              <Text style={[styles.stepNum, s <= step && styles.stepNumActive]}>{s}</Text>
            )}
          </View>
          {s < 4 && (
            <View style={[styles.stepLine, s < step && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  const stepLabels = ['Doctor', 'Fecha y Hora', 'Tipo', 'Confirmar'];

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Selecciona un Doctor</Text>
      <Text style={styles.stepSubtitle}>Elige al especialista de tu preferencia</Text>
      {doctors.map((doc) => (
        <DoctorCard
          key={doc.id}
          doctor={doc}
          onPress={() => handleSelectDoctor(doc)}
        />
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Selecciona Fecha y Hora</Text>
      <Text style={styles.stepSubtitle}>Elige un horario disponible con {selectedDoctor?.name}</Text>
      
      {/* Selected doctor mini */}
      <View style={styles.miniDoctorCard}>
        <View style={[styles.miniAvatar, { backgroundColor: selectedDoctor?.avatarBg }]}>
          <Text style={styles.miniAvatarText}>{selectedDoctor?.avatar}</Text>
        </View>
        <View>
          <Text style={styles.miniName}>{selectedDoctor?.name}</Text>
          <Text style={styles.miniSpec}>{selectedDoctor?.specialtyName}</Text>
        </View>
      </View>

      <Calendar
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        availableDays={selectedDoctor?.availableDays || []}
      />

      {selectedDate && (
        <View style={styles.timeSlotsSection}>
          <Text style={styles.timeSlotsTitle}>
            Horarios disponibles — {formatDate(selectedDate)}
          </Text>
          <View style={styles.timeSlotsGrid}>
            {(selectedDoctor?.timeSlots || []).map((time) => (
              <TimeSlot
                key={time}
                time={time}
                selected={selectedTime === time}
                onPress={() => setSelectedTime(time)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Tipo de Consulta</Text>
      <Text style={styles.stepSubtitle}>¿Cómo prefieres tu consulta?</Text>
      
      {CONSULTATION_TYPES.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.consultCard,
            consultationType === type.id && styles.consultCardSelected,
          ]}
          onPress={() => setConsultationType(type.id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.consultIconWrap,
              consultationType === type.id && styles.consultIconWrapSelected,
            ]}
          >
            <Ionicons
              name={type.icon}
              size={28}
              color={consultationType === type.id ? COLORS.textWhite : COLORS.primary}
            />
          </View>
          <View style={styles.consultInfo}>
            <Text style={styles.consultName}>{type.name}</Text>
            <Text style={styles.consultDesc}>{type.description}</Text>
          </View>
          <View
            style={[
              styles.radioOuter,
              consultationType === type.id && styles.radioOuterSelected,
            ]}
          >
            {consultationType === type.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.reasonSection}>
        <Text style={styles.reasonLabel}>Motivo de la consulta (opcional)</Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Describe brevemente el motivo de tu visita..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={reason}
          onChangeText={setReason}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Confirmar Reserva</Text>
      <Text style={styles.stepSubtitle}>Revisa los detalles de tu cita</Text>

      <View style={styles.summaryCard}>
        {/* Doctor */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryAvatar, { backgroundColor: selectedDoctor?.avatarBg }]}>
            <Text style={styles.summaryAvatarText}>{selectedDoctor?.avatar}</Text>
          </View>
          <View style={styles.summaryDoctorInfo}>
            <Text style={styles.summaryDoctorName}>{selectedDoctor?.name}</Text>
            <Text style={styles.summaryDoctorSpec}>{selectedDoctor?.specialtyName}</Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        {/* Details */}
        <View style={styles.summaryDetails}>
          <View style={styles.summaryDetailRow}>
            <View style={styles.summaryIconWrap}>
              <Ionicons name="calendar" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.summaryDetailLabel}>Fecha</Text>
              <Text style={styles.summaryDetailValue}>{formatDate(selectedDate)}</Text>
            </View>
          </View>

          <View style={styles.summaryDetailRow}>
            <View style={styles.summaryIconWrap}>
              <Ionicons name="time" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.summaryDetailLabel}>Hora</Text>
              <Text style={styles.summaryDetailValue}>{selectedTime}</Text>
            </View>
          </View>

          <View style={styles.summaryDetailRow}>
            <View style={styles.summaryIconWrap}>
              <Ionicons
                name={consultationType === 'telemedicina' ? 'videocam' : 'business'}
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View>
              <Text style={styles.summaryDetailLabel}>Tipo</Text>
              <Text style={styles.summaryDetailValue}>
                {consultationType === 'telemedicina' ? 'Telemedicina (Videollamada)' : 'Presencial (En clínica)'}
              </Text>
            </View>
          </View>

          {reason.trim() ? (
            <View style={styles.summaryDetailRow}>
              <View style={styles.summaryIconWrap}>
                <Ionicons name="document-text" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryDetailLabel}>Motivo</Text>
                <Text style={styles.summaryDetailValue}>{reason}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.summaryDivider} />

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Costo de consulta</Text>
          <Text style={styles.priceValue}>{selectedDoctor?.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <GradientHeader
        title="Reservar Cita"
        subtitle={stepLabels[step - 1]}
        icon="add-circle"
      />

      <View style={styles.body}>
        {renderStepIndicator()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom action */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            <Text style={styles.backBtnText}>Atrás</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextBtn, !canContinue() && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!canContinue()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                canContinue()
                  ? [COLORS.gradientStart, COLORS.gradientEnd]
                  : ['#CCC', '#BBB']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>
                {step === totalSteps ? 'Confirmar Reserva' : 'Siguiente'}
              </Text>
              <Ionicons
                name={step === totalSteps ? 'checkmark-circle' : 'chevron-forward'}
                size={18}
                color="#FFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successModal,
              {
                opacity: successAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.successIconWrap}>
              <LinearGradient
                colors={[COLORS.secondary, '#20C997']}
                style={styles.successIconGradient}
              >
                <Ionicons name="checkmark" size={48} color="#FFF" />
              </LinearGradient>
            </View>
            <Text style={styles.successTitle}>¡Cita Reservada!</Text>
            <Text style={styles.successSubtitle}>
              Tu cita con {selectedDoctor?.name} ha sido confirmada exitosamente
            </Text>
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} />
                <Text style={styles.successDetailText}>{formatDate(selectedDate)}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Ionicons name="time" size={16} color={COLORS.primary} />
                <Text style={styles.successDetailText}>{selectedTime}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.successBtn}
              onPress={handleSuccessDone}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.successBtnGradient}
              >
                <Text style={styles.successBtnText}>Ver Mis Citas</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Step indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepDotDone: {
    backgroundColor: COLORS.secondary,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stepNumActive: {
    color: COLORS.textWhite,
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginHorizontal: 6,
  },
  stepLineActive: {
    backgroundColor: COLORS.secondary,
  },
  // Step content
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  // Mini doctor card
  miniDoctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.lg,
    padding: 12,
    marginBottom: 16,
    ...SHADOWS.small,
    gap: 12,
  },
  miniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: { fontSize: 22 },
  miniName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  miniSpec: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 1 },
  // Time slots
  timeSlotsSection: {
    marginTop: 20,
  },
  timeSlotsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  // Consultation type
  consultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  consultCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  consultIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultIconWrapSelected: {
    backgroundColor: COLORS.primary,
  },
  consultInfo: {
    flex: 1,
    marginLeft: 14,
  },
  consultName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  consultDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  // Reason
  reasonSection: {
    marginTop: 24,
  },
  reasonLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.lg,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  // Summary
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: 20,
    ...SHADOWS.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryAvatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAvatarText: { fontSize: 28 },
  summaryDoctorInfo: { marginLeft: 14 },
  summaryDoctorName: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  summaryDoctorSpec: { fontSize: 14, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  summaryDetails: {
    gap: 14,
  },
  summaryDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryDetailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  summaryDetailValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '700',
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  nextBtn: {
    flex: 1,
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  nextBtnDisabled: {
    opacity: 0.6,
  },
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  // Success modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  successModal: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xxl,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.large,
  },
  successIconWrap: {
    marginBottom: 20,
  },
  successIconGradient: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  successDetails: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.lg,
    padding: 14,
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  successDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successDetailText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  successBtn: {
    width: '100%',
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
  },
  successBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  successBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
});
