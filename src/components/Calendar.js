import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../theme/colors';

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function Calendar({ selectedDate, onSelectDate, availableDays = [] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentMonth, currentYear]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDayAvailable = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = DAYS_ES[date.getDay()];
    
    // Don't allow past dates
    const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (date < todayStr) return false;
    
    // Check if doctor works on this day
    if (availableDays.length > 0 && !availableDays.includes(dayOfWeek)) return false;
    
    return true;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const handleDayPress = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(dateStr);
  };

  const renderDays = () => {
    const cells = [];
    
    // Empty cells for first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const available = isDayAvailable(day);
      const selected = isSelected(day);
      const todayMark = isToday(day);
      
      cells.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            selected && styles.dayCellSelected,
            todayMark && !selected && styles.dayCellToday,
          ]}
          onPress={() => available && handleDayPress(day)}
          activeOpacity={available ? 0.6 : 1}
        >
          <Text
            style={[
              styles.dayText,
              selected && styles.dayTextSelected,
              !available && styles.dayTextDisabled,
              todayMark && !selected && styles.dayTextToday,
            ]}
          >
            {day}
          </Text>
          {todayMark && (
            <View style={[styles.todayDot, selected && styles.todayDotSelected]} />
          )}
        </TouchableOpacity>
      );
    }
    
    return cells;
  };

  const canGoPrev = () => {
    return currentYear > today.getFullYear() || 
           (currentYear === today.getFullYear() && currentMonth > today.getMonth());
  };

  return (
    <View style={styles.container}>
      {/* Month navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPrevMonth}
          style={[styles.navBtn, !canGoPrev() && styles.navBtnDisabled]}
          disabled={!canGoPrev()}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={canGoPrev() ? COLORS.primary : COLORS.textLight}
          />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTHS_ES[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View style={styles.weekRow}>
        {DAYS_ES.map((d) => (
          <View key={d} style={styles.dayCell}>
            <Text style={styles.weekDayText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>{renderDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.md,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    backgroundColor: COLORS.background,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
  },
  dayCellToday: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayTextSelected: {
    color: COLORS.textWhite,
    fontWeight: '800',
  },
  dayTextDisabled: {
    color: COLORS.textLight,
  },
  dayTextToday: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  todayDotSelected: {
    backgroundColor: COLORS.textWhite,
  },
});
