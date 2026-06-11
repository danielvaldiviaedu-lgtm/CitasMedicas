import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import GradientHeader from '../components/GradientHeader';
import { COLORS, SHADOWS, SIZES } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, getUpcomingAppointments, getPastAppointments } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  const upcoming = getUpcomingAppointments().length;
  const completed = getPastAppointments().length;

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Información Personal',
      items: [
        { icon: 'mail', label: 'Correo electrónico', value: user.email, color: COLORS.primary },
        { icon: 'call', label: 'Teléfono', value: user.phone, color: '#30D158' },
        { icon: 'water', label: 'Tipo de sangre', value: user.bloodType, color: '#FF6B6B' },
        { icon: 'alert-circle', label: 'Alergias', value: user.allergies, color: '#FFA94D' },
        { icon: 'people', label: 'Contacto de emergencia', value: user.emergencyContact, color: '#845EF7' },
      ],
    },
    {
      title: 'Preferencias',
      items: [
        {
          icon: 'notifications',
          label: 'Notificaciones',
          color: COLORS.primary,
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'alarm',
          label: 'Recordatorios de citas',
          color: '#FF9F0A',
          toggle: true,
          value: reminders,
          onToggle: setReminders,
        },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { icon: 'help-circle', label: 'Centro de ayuda', color: '#339AF0', arrow: true },
        { icon: 'chatbubbles', label: 'Contactar soporte', color: '#20C997', arrow: true },
        { icon: 'document-text', label: 'Términos y condiciones', color: '#8E9AB5', arrow: true },
        { icon: 'shield-checkmark', label: 'Política de privacidad', color: '#845EF7', arrow: true },
      ],
    },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />

          <View style={styles.avatarWrap}>
            <View style={styles.avatarBig}>
              <Text style={styles.avatarBigEmoji}>{user.avatar}</Text>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={COLORS.textWhite} />
            </View>
          </View>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{upcoming}</Text>
              <Text style={styles.statLabel}>Próximas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{completed}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{user.bloodType}</Text>
              <Text style={styles.statLabel}>Sangre</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {menuSections.map((section, sIdx) => (
            <View key={sIdx} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.card}>
                {section.items.map((item, iIdx) => (
                  <TouchableOpacity
                    key={iIdx}
                    style={[
                      styles.menuItem,
                      iIdx < section.items.length - 1 && styles.menuItemBorder,
                    ]}
                    activeOpacity={item.toggle ? 1 : 0.7}
                  >
                    <View style={[styles.menuIconWrap, { backgroundColor: item.color + '18' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={styles.menuInfo}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.value && !item.toggle && (
                        <Text style={styles.menuValue} numberOfLines={1}>{item.value}</Text>
                      )}
                    </View>
                    {item.toggle ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
                        thumbColor={item.value ? COLORS.primary : '#DDD'}
                      />
                    ) : item.arrow ? (
                      <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>MediCita v1.0.0</Text>
          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: SIZES.lg,
    borderBottomLeftRadius: SIZES.radius.xxl,
    borderBottomRightRadius: SIZES.radius.xxl,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  decorCircle1: { width: 200, height: 200, top: -50, right: -50 },
  decorCircle2: { width: 140, height: 140, bottom: -40, left: 10 },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarBig: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarBigEmoji: {
    fontSize: 44,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.gradientEnd,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 10,
  },
  body: {
    paddingHorizontal: SIZES.lg,
    marginTop: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    borderRadius: SIZES.radius.xl,
    paddingVertical: 14,
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});
