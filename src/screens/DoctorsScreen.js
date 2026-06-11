import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SPECIALTIES } from '../data/mockData';
import DoctorCard from '../components/DoctorCard';
import SpecialtyChip from '../components/SpecialtyChip';
import GradientHeader from '../components/GradientHeader';
import { COLORS, SIZES } from '../theme/colors';

export default function DoctorsScreen({ navigation, route }) {
  const { doctors } = useApp();
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (route.params?.specialty) {
      setSelectedSpecialty(route.params.specialty);
    }
  }, [route.params?.specialty]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === 'all' || doc.specialty === selectedSpecialty;
    const matchesSearch =
      searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialtyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <View style={styles.screen}>
      <GradientHeader
        title="Doctores"
        subtitle={`${doctors.length} especialistas disponibles`}
        icon="people"
      />

      <View style={styles.body}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o especialidad..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={COLORS.textSecondary}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>

        {/* Specialty filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {SPECIALTIES.map((spec) => (
            <SpecialtyChip
              key={spec.id}
              specialty={spec}
              selected={selectedSpecialty === spec.id}
              onPress={() => setSelectedSpecialty(spec.id)}
            />
          ))}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsText}>
          {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor encontrado' : 'doctores encontrados'}
        </Text>

        {/* Doctor list */}
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DoctorCard
                doctor={item}
                onPress={() => navigation.navigate('Reservar', { doctor: item })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyTitle}>No se encontraron doctores</Text>
                <Text style={styles.emptySubtitle}>
                  Intenta con otra búsqueda o especialidad
                </Text>
              </View>
            }
          />
        </Animated.View>
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
    marginTop: -10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  chipsScroll: {
    marginTop: 16,
    maxHeight: 42,
  },
  chipsContent: {
    paddingRight: 20,
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
