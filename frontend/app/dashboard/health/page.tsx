"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  remaining: number;
  warnings: string[];
}

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected';
  lastSync: string;
  batteryLevel?: number;
}

export default function HealthPage() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'Артериальное давление',
      value: 125,
      unit: 'мм рт.ст.',
      status: 'normal',
      lastUpdated: '2024-01-14 09:30',
      trend: 'stable'
    },
    {
      id: '2',
      name: 'Уровень сахара',
      value: 6.2,
      unit: 'ммоль/л',
      status: 'warning',
      lastUpdated: '2024-01-14 08:15',
      trend: 'up'
    },
    {
      id: '3',
      name: 'Пульс',
      value: 72,
      unit: 'уд/мин',
      status: 'normal',
      lastUpdated: '2024-01-14 09:30',
      trend: 'stable'
    },
    {
      id: '4',
      name: 'Вес',
      value: 68.5,
      unit: 'кг',
      status: 'normal',
      lastUpdated: '2024-01-14 07:00',
      trend: 'down'
    }
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Аспирин',
      dosage: '100 мг',
      frequency: '1 раз в день',
      nextDose: '2024-01-15 09:00',
      remaining: 28,
      warnings: []
    },
    {
      id: '2',
      name: 'Метформин',
      dosage: '500 мг',
      frequency: '2 раза в день',
      nextDose: '2024-01-14 20:00',
      remaining: 15,
      warnings: ['Заканчивается', 'Принимать с едой']
    },
    {
      id: '3',
      name: 'Омега-3',
      dosage: '1000 мг',
      frequency: '1 раз в день',
      nextDose: '2024-01-15 09:00',
      remaining: 45,
      warnings: []
    }
  ]);

  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Глюкометр Accu-Chek',
      type: 'glucometer',
      status: 'connected',
      lastSync: '2024-01-14 08:15',
      batteryLevel: 85
    },
    {
      id: '2',
      name: 'Тонометр Omron',
      type: 'blood_pressure',
      status: 'connected',
      lastSync: '2024-01-14 09:30',
      batteryLevel: 92
    },
    {
      id: '3',
      name: 'Фитнес-трекер Xiaomi',
      type: 'fitness_tracker',
      status: 'disconnected',
      lastSync: '2024-01-13 22:45',
      batteryLevel: 45
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7m0 10H7" />
        </svg>;
      case 'down':
        return <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10m0-10h10" />
        </svg>;
      case 'stable':
        return <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>;
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Управление здоровьем</h1>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                Добавить показатель
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                Синхронизировать устройства
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Показатели здоровья</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => (
              <div key={metric.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{animationDelay: `${index * 100}ms`}}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor(metric.status)}`}>
                    {metric.status === 'normal' ? 'Норма' : metric.status === 'warning' ? 'Внимание' : 'Критично'}
                  </span>
                  <span className="text-xs text-gray-500">{metric.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Медицинская аналитика</h2>
          <div className="h-64 bg-gray-50/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600">График показателей здоровья за последние 30 дней</p>
              <p className="text-sm text-gray-500 mt-2">Интерактивная диаграмма будет здесь</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Контроль лекарств</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300">
                Добавить лекарство
              </button>
            </div>
            <div className="space-y-4">
              {medications.map((medication, index) => (
                <div key={medication.id} className="border border-white/30 rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{medication.name}</h3>
                    <span className="text-sm text-gray-500">{medication.dosage}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Частота: {medication.frequency}</p>
                    <p>Следующий приём: {medication.nextDose}</p>
                    <p>Осталось: {medication.remaining} таблеток</p>
                  </div>
                  {medication.warnings.length > 0 && (
                    <div className="space-y-1">
                      {medication.warnings.map((warning, index) => (
                        <div key={index} className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded transition-all duration-300">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connected Devices */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Подключенные устройства</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-300">
                Добавить устройство
              </button>
            </div>
            <div className="space-y-4">
              {devices.map((device, index) => (
                <div key={device.id} className="border border-white/30 rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{device.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      device.status === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status === 'connected' ? 'Подключено' : 'Отключено'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Последняя синхронизация: {device.lastSync}</p>
                    {device.batteryLevel && (
                      <div className="flex items-center mt-2">
                        <span className="mr-2">Батарея:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              device.batteryLevel > 50 ? 'bg-green-500' : 
                              device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${device.batteryLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{device.batteryLevel}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                      Синхронизировать
                    </button>
                    <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                      Настройки
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Рекомендации по здоровью</h2>
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-50/80 rounded-lg transform transition-all duration-300 hover:scale-[1.02]" style={{animationDelay: '100ms'}}>
              <div className="p-2 bg-blue-100 rounded-lg mr-4 transform transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Уровень сахара повышен</h3>
                <p className="text-sm text-gray-600">Рекомендуется ограничить потребление углеводов и увеличить физическую активность. Обратитесь к эндокринологу.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-green-50/80 rounded-lg transform transition-all duration-300 hover:scale-[1.02]" style={{animationDelay: '200ms'}}>
              <div className="p-2 bg-green-100 rounded-lg mr-4 transform transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Отличная динамика веса</h3>
                <p className="text-sm text-gray-600">Вы успешно снижаете вес. Продолжайте в том же духе!</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-yellow-50/80 rounded-lg transform transition-all duration-300 hover:scale-[1.02]" style={{animationDelay: '300ms'}}>
              <div className="p-2 bg-yellow-100 rounded-lg mr-4 transform transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Напоминание о лекарствах</h3>
                <p className="text-sm text-gray-600">У вас заканчивается Метформин. Не забудьте обновить рецепт.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}