"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  nextAppointment: string;
  diagnosis: string;
  status: 'stable' | 'attention' | 'critical';
  familyMembers: number;
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Анна Петрова',
      age: 35,
      gender: 'female',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      diagnosis: 'Гипертония',
      status: 'stable',
      familyMembers: 4
    },
    {
      id: '2',
      name: 'Михаил Сидоров',
      age: 42,
      gender: 'male',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-02-10',
      diagnosis: 'Диабет 2 типа',
      status: 'attention',
      familyMembers: 3
    },
    {
      id: '3',
      name: 'Елена Иванова',
      age: 28,
      gender: 'female',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-20',
      diagnosis: 'Профилактический осмотр',
      status: 'stable',
      familyMembers: 2
    }
  ]);

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Анна Петрова',
      time: '09:00',
      type: 'Консультация',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'Михаил Сидоров',
      time: '10:30',
      type: 'Контрольный осмотр',
      status: 'completed'
    },
    {
      id: '3',
      patientName: 'Елена Иванова',
      time: '14:00',
      type: 'Профилактический осмотр',
      status: 'scheduled'
    }
  ]);

  const router = useRouter();
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    const isDoctorAuthenticated = localStorage.getItem('isDoctorAuthenticated');
    if (!isDoctorAuthenticated) {
      router.push('/auth/doctor-login');
    } else {
      setDoctorName(localStorage.getItem('doctorName') || 'Доктор');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isDoctorAuthenticated');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('doctorSpecialty');
    router.push('/auth/doctor-login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Панель врача</h1>
                <p className="text-sm text-gray-600">Добро пожаловать, {doctorName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего пациентов</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Приёмы сегодня</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Требуют внимания</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.status === 'attention').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Семейных аккаунтов</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.reduce((sum, p) => sum + p.familyMembers, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 transform transition-all duration-300 hover:shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Приёмы на сегодня</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-medium text-blue-600">{appointment.time}</div>
                      <div>
                        <div className="font-medium text-gray-900">{appointment.patientName}</div>
                        <div className="text-sm text-gray-600">{appointment.type}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                      {appointment.status === 'scheduled' ? 'Запланирован' : 
                       appointment.status === 'completed' ? 'Завершён' : 'Отменён'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 transform transition-all duration-300 hover:shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Мои пациенты</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-102">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-600">{patient.age} лет • {patient.diagnosis}</div>
                        <div className="text-xs text-purple-600">Семья: {patient.familyMembers} чел.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status === 'stable' ? 'Стабильно' : 
                         patient.status === 'attention' ? 'Внимание' : 'Критично'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">След. приём: {patient.nextAppointment}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}