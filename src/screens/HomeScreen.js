import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SPECIALTIES } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';
import { COLORS, SHADOWS, SIZES } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, doctors, getNextAppointment, getUpcomingAppointments, getPastAppointments } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const nextApt = getNextAppointment();
  const upcomingCount = getUpcomingAppointments().length;
  const completedCount = getPastAppointments().length;
  const topDoctors = doctors.slice(0, 4);
  const specialties = SPECIALTIES.filter((s) => s.id !== 'all');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />
          <View style={[styles.decorCircle, styles.decorCircle3]} />

          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()} 👋</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{user.avatar}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Search bar mock */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Doctores')}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <Text style={styles.searchText}>Buscar doctor, especialidad...</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Animated.View
          style={[
            styles.body,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Next appointment card */}
          {nextApt ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Próxima Cita</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Citas')}
              >
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextAptCard}
                >
                  <View style={styles.nextAptRow}>
                    <View style={styles.nextAptAvatar}>
                      <Text style={styles.nextAptAvatarText}>
                        {nextApt.doctorAvatar || '👨‍⚕️'}
                      </Text>
                    </View>
                    <View style={styles.nextAptInfo}>
                      <Text style={styles.nextAptDoctor}>{nextApt.doctorName}</Text>
                      <Text style={styles.nextAptSpec}>{nextApt.specialtyName}</Text>
                    </View>
                    <View style={styles.nextAptBadge}>
                      <Ionicons name="videocam" size={14} color={COLORS.textWhite} />
                    </View>
                  </View>
                  <View style={styles.nextAptDivider} />
                  <View style={styles.nextAptDetails}>
                    <View style={styles.nextAptDetail}>
                      <Ionicons name="calendar" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.nextAptDetailText}>{formatDate(nextApt.date)}</Text>
                    </View>
                    <View style={styles.nextAptDetail}>
                      <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.nextAptDetailText}>{nextApt.time}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.noAptCard}
                onPress={() => navigation.navigate('Reservar')}
                activeOpacity={0.8}
              >
                <View style={styles.noAptIconWrap}>
                  <Ionicons name="calendar-outline" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.noAptTitle}>No tienes citas próximas</Text>
                <Text style={styles.noAptSub}>Reserva una cita con nuestros especialistas</Text>
                <View style={styles.noAptBtn}>
                  <Text style={styles.noAptBtnText}>Reservar Ahora</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.textWhite} />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acceso Rápido</Text>
            <View style={styles.actionsGrid}>
              {[
                { icon: 'add-circle', label: 'Reservar\nCita', color: COLORS.primary, bg: COLORS.primaryLight, screen: 'Reservar' },
                { icon: 'people', label: 'Ver\nDoctores', color: '#845EF7', bg: '#F0EBFF', screen: 'Doctores' },
                { icon: 'document-text', label: 'Mis\nCitas', color: COLORS.success, bg: COLORS.secondaryLight, screen: 'Citas' },
                { icon: 'person', label: 'Mi\nPerfil', color: '#F06595', bg: '#FCE4EC', screen: 'Profile' },
              ].map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.actionCard, { backgroundColor: action.bg }]}
                  onPress={() => navigation.navigate(action.screen)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon} size={22} color={COLORS.textWhite} />
                  </View>
                  <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#0A84FF', '#5B4FCF']}
                  style={styles.statIconWrap}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="calendar" size={20} color="#FFF" />
                </LinearGradient>
                <Text style={styles.statNum}>{upcomingCount}</Text>
                <Text style={styles.statLabel}>Próximas</Text>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#30D158', '#20C997']}
                  style={styles.statIconWrap}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="checkmark-done" size={20} color="#FFF" />
                </LinearGradient>
                <Text style={styles.statNum}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completadas</Text>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF3B30']}
                  style={styles.statIconWrap}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="heart" size={20} color="#FFF" />
                </LinearGradient>
                <Text style={styles.statNum}>{doctors.length}</Text>
                <Text style={styles.statLabel}>Doctores</Text>
              </View>
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Especialidades</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Doctores')}>
                <Text style={styles.seeAll}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {specialties.map((spec) => (
                <TouchableOpacity
                  key={spec.id}
                  style={styles.specCard}
                  onPress={() => navigation.navigate('Doctores', { specialty: spec.id })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.specIcon, { backgroundColor: spec.color + '18' }]}>
                    <Ionicons name={spec.icon} size={24} color={spec.color} />
                  </View>
                  <Text style={styles.specName}>{spec.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Top Doctors */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Doctores Destacados</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Doctores')}>
                <Text style={styles.seeAll}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {topDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onPress={() => navigation.navigate('Reservar', { doctor: doc })}
              />
            ))}
          </View>

          <View style={{ height: 30 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: SIZES.lg,
    borderBottomLeftRadius: SIZES.radius.xxl,
    borderBottomRightRadius: SIZES.radius.xxl,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  decorCircle1: { width: 220, height: 220, top: -60, right: -60 },
  decorCircle2: { width: 140, height: 140, bottom: -40, left: 10 },
  decorCircle3: { width: 90, height: 90, top: 30, right: 120 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  notifBtn: {
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
  },
  searchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  body: {
    paddingHorizontal: SIZES.lg,
    marginTop: -10,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 14,
  },
  // Next appointment card
  nextAptCard: {
    borderRadius: SIZES.radius.xl,
    padding: 18,
    ...SHADOWS.large,
  },
  nextAptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextAptAvatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextAptAvatarText: { fontSize: 26 },
  nextAptInfo: { flex: 1, marginLeft: 12 },
  nextAptDoctor: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  nextAptSpec: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  nextAptBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextAptDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 14,
  },
  nextAptDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  nextAptDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextAptDetailText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  // No appointment card
  noAptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  noAptIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  noAptTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  noAptSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  noAptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radius.full,
    gap: 6,
  },
  noAptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  // Actions grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 60) / 2,
    borderRadius: SIZES.radius.xl,
    padding: 18,
    ...SHADOWS.small,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  // Specialties
  specCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  specIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  specName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
});
