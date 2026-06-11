import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import AppointmentCard from '../components/AppointmentCard';
import GradientHeader from '../components/GradientHeader';
import { COLORS, SIZES } from '../theme/colors';

const TABS = [
  { id: 'upcoming', label: 'Próximas', icon: 'calendar' },
  { id: 'past', label: 'Pasadas', icon: 'checkmark-done-circle' },
  { id: 'cancelled', label: 'Canceladas', icon: 'close-circle' },
];

export default function AppointmentsScreen({ navigation }) {
  const {
    cancelAppointment,
    getUpcomingAppointments,
    getPastAppointments,
    getCancelledAppointments,
  } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const getAppointments = () => {
    switch (activeTab) {
      case 'upcoming':
        return getUpcomingAppointments();
      case 'past':
        return getPastAppointments();
      case 'cancelled':
        return getCancelledAppointments();
      default:
        return [];
    }
  };

  const appointments = getAppointments();

  const handleCancel = (id) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que deseas cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            cancelAppointment(id);
            setRefreshKey((k) => k + 1);
          },
        },
      ]
    );
  };

  const handleReschedule = (id) => {
    Alert.alert(
      'Reprogramar Cita',
      'Para reprogramar, cancelaremos la cita actual y podrás crear una nueva.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            cancelAppointment(id);
            setRefreshKey((k) => k + 1);
            navigation.navigate('Reservar');
          },
        },
      ]
    );
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'upcoming':
        return {
          icon: 'calendar-outline',
          title: 'Sin citas próximas',
          subtitle: 'Reserva una cita con nuestros especialistas',
        };
      case 'past':
        return {
          icon: 'time-outline',
          title: 'Sin historial',
          subtitle: 'Aquí aparecerán tus citas anteriores',
        };
      case 'cancelled':
        return {
          icon: 'close-circle-outline',
          title: 'Sin cancelaciones',
          subtitle: 'No has cancelado ninguna cita',
        };
      default:
        return { icon: 'help', title: '', subtitle: '' };
    }
  };

  const emptyMsg = getEmptyMessage();

  return (
    <View style={styles.screen}>
      <GradientHeader
        title="Mis Citas"
        subtitle={`${appointments.length} ${activeTab === 'upcoming' ? 'próximas' : activeTab === 'past' ? 'pasadas' : 'canceladas'}`}
        icon="document-text"
      />

      <View style={styles.body}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? COLORS.textWhite : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
              showActions={activeTab === 'upcoming'}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name={emptyMsg.icon} size={48} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>{emptyMsg.title}</Text>
              <Text style={styles.emptySubtitle}>{emptyMsg.subtitle}</Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => navigation.navigate('Reservar')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyBtnText}>Reservar Cita</Text>
                  <Ionicons name="add" size={18} color={COLORS.textWhite} />
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
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
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.lg,
    padding: 4,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: SIZES.radius.md,
    gap: 5,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textWhite,
  },
  // List
  listContent: {
    paddingBottom: 20,
  },
  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius.full,
    gap: 6,
  },
  emptyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
});
