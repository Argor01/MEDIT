"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  remaining: number;
  totalQuantity: number;
  instructions: string;
  sideEffects: string[];
  interactions: string[];
  reminders: boolean;
  lastTaken?: string;
  nextDose: string;
  category: 'prescription' | 'otc' | 'supplement';
  doctor?: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  takenAt: string;
  dosage: string;
  notes?: string;
  skipped: boolean;
}

interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  time: string;
  taken: boolean;
  skipped: boolean;
}

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'reminders'>('current');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Аспирин',
      dosage: '100 мг',
      frequency: 'Ежедневно',
      times: ['09:00'],
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      remaining: 28,
      totalQuantity: 60,
      instructions: 'Принимать после еды, запивать большим количеством воды',
      sideEffects: ['Расстройство желудка', 'Головокружение'],
      interactions: ['Варфарин', 'Ибупрофен'],
      reminders: true,
      lastTaken: '2024-01-13 09:00',
      nextDose: '2024-01-15 09:00',
      category: 'prescription',
      doctor: 'Др. Анна Петрова'
    },
    {
      id: '2',
      name: 'Метформин',
      dosage: '500 мг',
      frequency: '2 раза в день',
      times: ['08:00', '20:00'],
      startDate: '2023-12-15',
      endDate: '2024-06-15',
      remaining: 15,
      totalQuantity: 180,
      instructions: 'Принимать во время еды',
      sideEffects: ['Тошнота', 'Диарея', 'Металлический привкус'],
      interactions: ['Алкоголь', 'Контрастные вещества'],
      reminders: true,
      lastTaken: '2024-01-14 20:00',
      nextDose: '2024-01-15 08:00',
      category: 'prescription',
      doctor: 'Др. Елена Сидорова'
    },
    {
      id: '3',
      name: 'Омега-3',
      dosage: '1000 мг',
      frequency: 'Ежедневно',
      times: ['09:00'],
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      remaining: 45,
      totalQuantity: 90,
      instructions: 'Принимать во время еды',
      sideEffects: ['Рыбный привкус', 'Отрыжка'],
      interactions: [],
      reminders: true,
      lastTaken: '2024-01-14 09:00',
      nextDose: '2024-01-15 09:00',
      category: 'supplement'
    },
    {
      id: '4',
      name: 'Парацетамол',
      dosage: '500 мг',
      frequency: 'По необходимости',
      times: [],
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      remaining: 18,
      totalQuantity: 20,
      instructions: 'Не более 4 таблеток в день, интервал между приёмами не менее 4 часов',
      sideEffects: ['Аллергические реакции'],
      interactions: ['Алкоголь', 'Варфарин'],
      reminders: false,
      nextDose: 'По необходимости',
      category: 'otc'
    }
  ]);

  const [medicationLogs] = useState<MedicationLog[]>([
    {
      id: '1',
      medicationId: '1',
      medicationName: 'Аспирин',
      takenAt: '2024-01-14 09:00',
      dosage: '100 мг',
      skipped: false
    },
    {
      id: '2',
      medicationId: '2',
      medicationName: 'Метформин',
      takenAt: '2024-01-14 08:00',
      dosage: '500 мг',
      skipped: false
    },
    {
      id: '3',
      medicationId: '2',
      medicationName: 'Метформин',
      takenAt: '2024-01-14 20:00',
      dosage: '500 мг',
      skipped: false
    },
    {
      id: '4',
      medicationId: '1',
      medicationName: 'Аспирин',
      takenAt: '2024-01-13 09:00',
      dosage: '100 мг',
      skipped: true,
      notes: 'Забыл принять'
    }
  ]);

  const [todayReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicationId: '1',
      medicationName: 'Аспирин',
      time: '09:00',
      taken: false,
      skipped: false
    },
    {
      id: '2',
      medicationId: '2',
      medicationName: 'Метформин',
      time: '08:00',
      taken: true,
      skipped: false
    },
    {
      id: '3',
      medicationId: '2',
      medicationName: 'Метформин',
      time: '20:00',
      taken: false,
      skipped: false
    },
    {
      id: '4',
      medicationId: '3',
      medicationName: 'Омега-3',
      time: '09:00',
      taken: false,
      skipped: false
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'otc': return 'bg-green-100 text-green-800';
      case 'supplement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'prescription': return 'Рецептурный';
      case 'otc': return 'Безрецептурный';
      case 'supplement': return 'БАД';
      default: return category;
    }
  };

  const getStockStatus = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 10) return { color: 'text-red-600 bg-red-100', text: 'Заканчивается' };
    if (percentage <= 25) return { color: 'text-yellow-600 bg-yellow-100', text: 'Мало' };
    return { color: 'text-green-600 bg-green-100', text: 'В наличии' };
  };

  const markAsTaken = (reminderId: string) => {
    // Логика отметки о приёме лекарства
    console.log('Marked as taken:', reminderId);
  };

  const markAsSkipped = (reminderId: string) => {
    // Логика пропуска приёма
    console.log('Marked as skipped:', reminderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mr-4 transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Управление лекарствами</h1>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Добавить лекарство
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Активных лекарств</p>
                <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Принято сегодня</p>
                <p className="text-2xl font-bold text-gray-900">{todayReminders.filter(r => r.taken).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Предстоящих приёмов</p>
                <p className="text-2xl font-bold text-gray-900">{todayReminders.filter(r => !r.taken && !r.skipped).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Заканчивается</p>
                <p className="text-2xl font-bold text-gray-900">{medications.filter(m => (m.remaining / m.totalQuantity) <= 0.25).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('current')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'current'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Текущие лекарства
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reminders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Напоминания на сегодня
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                История приёма
              </button>
            </nav>
          </div>
        </div>

        {/* Current Medications Tab */}
        {activeTab === 'current' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {medications.map((medication, index) => {
              const stockStatus = getStockStatus(medication.remaining, medication.totalQuantity);
              return (
                <div key={medication.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{medication.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(medication.category)}`}>
                          {getCategoryText(medication.category)}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{medication.dosage} • {medication.frequency}</p>
                      {medication.doctor && (
                        <p className="text-sm text-gray-600 mb-2">Назначил: {medication.doctor}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedMedication(medication)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Остаток</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            (medication.remaining / medication.totalQuantity) <= 0.1 ? 'bg-red-500' :
                            (medication.remaining / medication.totalQuantity) <= 0.25 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(medication.remaining / medication.totalQuantity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{medication.remaining}/{medication.totalQuantity}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Следующий приём:</span> {medication.nextDose}
                    </p>
                    {medication.lastTaken && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Последний приём:</span> {medication.lastTaken}
                      </p>
                    )}
                  </div>
                  
                  {medication.times.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Время приёма:</p>
                      <div className="flex flex-wrap gap-2">
                        {medication.times.map((time, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm">
                      Принял
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 text-sm">
                      Редактировать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Напоминания на сегодня</h2>
              <div className="space-y-4">
                {todayReminders.map((reminder) => (
                  <div key={reminder.id} className={`border rounded-lg p-4 ${
                    reminder.taken ? 'bg-green-50 border-green-200' :
                    reminder.skipped ? 'bg-red-50 border-red-200' : 'bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-gray-900 mr-3">{reminder.medicationName}</h3>
                          <span className="text-sm text-gray-600">{reminder.time}</span>
                          {reminder.taken && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Принято
                            </span>
                          )}
                          {reminder.skipped && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Пропущено
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {medications.find(m => m.id === reminder.medicationId)?.dosage}
                        </p>
                      </div>
                      {!reminder.taken && !reminder.skipped && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => markAsTaken(reminder.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm"
                          >
                            Принял
                          </button>
                          <button 
                            onClick={() => markAsSkipped(reminder.id)}
                            className="border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 text-sm"
                          >
                            Пропустить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">История приёма лекарств</h2>
            </div>
            <div className="divide-y">
              {medicationLogs.map((log) => (
                <div key={log.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium text-gray-900 mr-3">{log.medicationName}</h3>
                        <span className="text-sm text-gray-600">{log.dosage}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          log.skipped ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {log.skipped ? 'Пропущено' : 'Принято'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.takenAt}</p>
                      {log.notes && (
                        <p className="text-sm text-gray-500 mt-1">Заметка: {log.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medication Details Modal */}
        {selectedMedication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedMedication.name}</h2>
                <button 
                  onClick={() => setSelectedMedication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Инструкции по применению</h3>
                  <p className="text-sm text-gray-600">{selectedMedication.instructions}</p>
                </div>
                
                {selectedMedication.sideEffects.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Побочные эффекты</h3>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedMedication.sideEffects.map((effect, index) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedMedication.interactions.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Взаимодействие с другими препаратами</h3>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedMedication.interactions.map((interaction, index) => (
                        <li key={index}>{interaction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Период приёма</h3>
                    <p className="text-sm text-gray-600">{selectedMedication.startDate} - {selectedMedication.endDate}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Напоминания</h3>
                    <p className="text-sm text-gray-600">{selectedMedication.reminders ? 'Включены' : 'Отключены'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}