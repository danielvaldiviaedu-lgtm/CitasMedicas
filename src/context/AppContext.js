import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DOCTORS, USER_PROFILE } from '../data/mockData';

const AppContext = createContext();

const STORAGE_KEY = '@citas_medicas';

export function AppProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [user] = useState(USER_PROFILE);
  const [doctors] = useState(DOCTORS);

  // Load appointments from AsyncStorage
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setAppointments(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error loading appointments:', e);
    }
  };

  const saveAppointments = async (newAppointments) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments));
    } catch (e) {
      console.log('Error saving appointments:', e);
    }
  };

  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    saveAppointments(updated);
    return newAppointment;
  };

  const cancelAppointment = (appointmentId) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId
        ? { ...apt, date: newDate, time: newTime, status: 'confirmed' }
        : apt
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date + 'T' + apt.time);
        return aptDate >= now && apt.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date + 'T' + apt.time);
        return aptDate < now && apt.status !== 'cancelled';
      })
      .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
  };

  const getCancelledAppointments = () => {
    return appointments
      .filter((apt) => apt.status === 'cancelled')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getNextAppointment = () => {
    const upcoming = getUpcomingAppointments();
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        doctors,
        appointments,
        addAppointment,
        cancelAppointment,
        rescheduleAppointment,
        getUpcomingAppointments,
        getPastAppointments,
        getCancelledAppointments,
        getNextAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
