// Типы для органов
export interface Organ {
  id: string;
  name: string;
  label: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  description: string;
  healthData?: {
    status: 'normal' | 'warning' | 'critical';
    details: string;
  };
}

// Типы для показателей здоровья
export interface HealthData {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
}

// Типы для медицинских исследований
export interface ResearchItem {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
  type: 'blood' | 'urine' | 'xray' | 'mri' | 'ct' | 'ultrasound';
  results?: string;
}

// Типы для событий календаря
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'appointment' | 'medication' | 'exercise' | 'checkup';
}

// Типы для пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'patient' | 'doctor' | 'admin';
}

// Типы для уведомлений
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

// Типы для API ответов
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Типы для медицинских записей
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  medications: Medication[];
  followUp?: string;
}

// Типы для лекарств
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// Типы для пациентов
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: MedicalRecord[];
  allergies: string[];
  currentMedications: Medication[];
}

// Типы для врачей
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experience: number;
  rating: number;
  avatar?: string;
}

// Типы для назначений
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'checkup' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}