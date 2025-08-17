"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MedicalRecord {
  id: string;
  type: 'consultation' | 'test' | 'procedure' | 'vaccination' | 'hospitalization';
  title: string;
  date: string;
  doctor: string;
  clinic: string;
  diagnosis?: string;
  symptoms?: string[];
  treatment?: string;
  notes?: string;
  attachments?: {
    name: string;
    type: 'pdf' | 'image' | 'document';
    size: string;
    url: string;
  }[];
  testResults?: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low';
  }[];
  medications?: {
    name: string;
    dosage: string;
    duration: string;
  }[];
  followUp?: {
    date: string;
    notes: string;
  };
}

interface VitalSigns {
  id: string;
  date: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
}

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState<'records' | 'tests' | 'vitals' | 'documents'>('records');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      type: 'consultation',
      title: 'Плановый осмотр терапевта',
      date: '2024-01-12',
      doctor: 'Др. Анна Петрова',
      clinic: 'Медицинский центр "Здоровье"',
      diagnosis: 'Здоров',
      symptoms: ['Общая слабость', 'Головная боль'],
      treatment: 'Рекомендован отдых, витаминный комплекс',
      notes: 'Пациент жалуется на усталость. Рекомендовано обследование через 3 месяца.',
      medications: [
        { name: 'Витамин D3', dosage: '1000 МЕ', duration: '30 дней' },
        { name: 'Магний B6', dosage: '2 таблетки', duration: '30 дней' }
      ],
      followUp: {
        date: '2024-04-12',
        notes: 'Контрольный осмотр'
      },
      attachments: [
        { name: 'Заключение врача.pdf', type: 'pdf', size: '245 KB', url: '#' }
      ]
    },
    {
      id: '2',
      type: 'test',
      title: 'Общий анализ крови',
      date: '2024-01-10',
      doctor: 'Др. Михаил Иванов',
      clinic: 'Лаборатория "Инвитро"',
      testResults: [
        { parameter: 'Гемоглобин', value: '145', unit: 'г/л', normalRange: '120-160', status: 'normal' },
        { parameter: 'Эритроциты', value: '4.8', unit: '×10¹²/л', normalRange: '4.0-5.5', status: 'normal' },
        { parameter: 'Лейкоциты', value: '7.2', unit: '×10⁹/л', normalRange: '4.0-9.0', status: 'normal' },
        { parameter: 'Глюкоза', value: '6.8', unit: 'ммоль/л', normalRange: '3.9-6.1', status: 'high' },
        { parameter: 'Холестерин', value: '5.8', unit: 'ммоль/л', normalRange: '<5.2', status: 'high' }
      ],
      notes: 'Повышенный уровень глюкозы и холестерина. Рекомендована консультация эндокринолога.',
      attachments: [
        { name: 'Результаты анализов.pdf', type: 'pdf', size: '156 KB', url: '#' }
      ]
    },
    {
      id: '3',
      type: 'vaccination',
      title: 'Вакцинация от гриппа',
      date: '2023-10-15',
      doctor: 'Др. Ольга Васильева',
      clinic: 'Поликлиника №1',
      treatment: 'Вакцина Гриппол плюс',
      notes: 'Вакцинация прошла без осложнений. Следующая вакцинация через год.',
      followUp: {
        date: '2024-10-15',
        notes: 'Повторная вакцинация от гриппа'
      }
    },
    {
      id: '4',
      type: 'procedure',
      title: 'УЗИ органов брюшной полости',
      date: '2024-01-08',
      doctor: 'Др. Сергей Николаев',
      clinic: 'Диагностический центр',
      diagnosis: 'Без патологий',
      notes: 'Все органы в норме. Рекомендовано повторное обследование через год.',
      attachments: [
        { name: 'УЗИ заключение.pdf', type: 'pdf', size: '89 KB', url: '#' },
        { name: 'УЗИ снимки.jpg', type: 'image', size: '2.1 MB', url: '#' }
      ]
    },
    {
      id: '5',
      type: 'consultation',
      title: 'Консультация кардиолога',
      date: '2023-12-20',
      doctor: 'Др. Михаил Иванов',
      clinic: 'Кардиологический центр',
      diagnosis: 'Артериальная гипертензия 1 степени',
      symptoms: ['Повышенное давление', 'Головокружение'],
      treatment: 'Назначена гипотензивная терапия',
      medications: [
        { name: 'Лизиноприл', dosage: '10 мг', duration: '3 месяца' },
        { name: 'Аспирин', dosage: '100 мг', duration: 'постоянно' }
      ],
      notes: 'Рекомендован контроль артериального давления, диета с ограничением соли.',
      followUp: {
        date: '2024-03-20',
        notes: 'Контроль эффективности терапии'
      }
    }
  ]);

  const [vitalSigns] = useState<VitalSigns[]>([
    {
      id: '1',
      date: '2024-01-14',
      bloodPressure: { systolic: 125, diastolic: 80 },
      heartRate: 72,
      temperature: 36.6,
      weight: 68.5,
      height: 175,
      bmi: 22.4
    },
    {
      id: '2',
      date: '2024-01-12',
      bloodPressure: { systolic: 130, diastolic: 85 },
      heartRate: 75,
      temperature: 36.7,
      weight: 69.0,
      height: 175,
      bmi: 22.5
    },
    {
      id: '3',
      date: '2024-01-10',
      bloodPressure: { systolic: 128, diastolic: 82 },
      heartRate: 70,
      temperature: 36.5,
      weight: 69.2,
      height: 175,
      bmi: 22.6
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'test': return 'bg-green-100 text-green-800';
      case 'procedure': return 'bg-purple-100 text-purple-800';
      case 'vaccination': return 'bg-yellow-100 text-yellow-800';
      case 'hospitalization': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation': return 'Консультация';
      case 'test': return 'Анализы';
      case 'procedure': return 'Процедура';
      case 'vaccination': return 'Вакцинация';
      case 'hospitalization': return 'Госпитализация';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'high': return 'text-red-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesType = !filterType || record.type === filterType;
    const matchesSearch = !searchQuery || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

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
              <h1 className="text-2xl font-bold text-gray-900">Медицинские записи</h1>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                Добавить запись
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                Экспорт данных
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('records')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Все записи
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Анализы
              </button>
              <button
                onClick={() => setActiveTab('vitals')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vitals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Показатели
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Документы
              </button>
            </nav>
          </div>
        </div>

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div>
            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип записи</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Все типы</option>
                    <option value="consultation">Консультации</option>
                    <option value="test">Анализы</option>
                    <option value="procedure">Процедуры</option>
                    <option value="vaccination">Вакцинации</option>
                    <option value="hospitalization">Госпитализации</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по записям..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    Применить фильтры
                  </button>
                </div>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{record.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {getTypeText(record.type)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600"><span className="font-medium">Дата:</span> {record.date}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Врач:</span> {record.doctor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600"><span className="font-medium">Клиника:</span> {record.clinic}</p>
                          {record.diagnosis && (
                            <p className="text-sm text-gray-600"><span className="font-medium">Диагноз:</span> {record.diagnosis}</p>
                          )}
                        </div>
                        <div>
                          {record.followUp && (
                            <p className="text-sm text-blue-600"><span className="font-medium">Повторный приём:</span> {record.followUp.date}</p>
                          )}
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mb-3">{record.notes}</p>
                      )}
                      {record.attachments && record.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {record.attachments.map((attachment, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              {attachment.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedRecord(record)}
                      className="ml-4 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-300 transform hover:scale-105"
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            {medicalRecords.filter(r => r.type === 'test').map((record) => (
              <div key={record.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                    <p className="text-sm text-gray-600">{record.date} • {record.doctor} • {record.clinic}</p>
                  </div>
                </div>
                
                {record.testResults && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Показатель</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Значение</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Единицы</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Норма</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.testResults.map((result, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-3 text-sm text-gray-900">{result.parameter}</td>
                            <td className={`py-2 px-3 text-sm font-medium ${getStatusColor(result.status)}`}>
                              {result.value}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-600">{result.unit}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{result.normalRange}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.status === 'normal' ? 'bg-green-100 text-green-800' :
                                result.status === 'high' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {result.status === 'normal' ? 'Норма' :
                                 result.status === 'high' ? 'Повышен' : 'Понижен'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {record.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">График показателей</h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-600">Интерактивный график показателей здоровья</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {vitalSigns.map((vital) => (
                <div key={vital.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Показатели от {vital.date}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Давление</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                      </p>
                      <p className="text-xs text-gray-500">мм рт.ст.</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Пульс</p>
                      <p className="text-lg font-semibold text-gray-900">{vital.heartRate}</p>
                      <p className="text-xs text-gray-500">уд/мин</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Температура</p>
                      <p className="text-lg font-semibold text-gray-900">{vital.temperature}</p>
                      <p className="text-xs text-gray-500">°C</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Вес</p>
                      <p className="text-lg font-semibold text-gray-900">{vital.weight}</p>
                      <p className="text-xs text-gray-500">кг</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Рост</p>
                      <p className="text-lg font-semibold text-gray-900">{vital.height}</p>
                      <p className="text-xs text-gray-500">см</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">ИМТ</p>
                      <p className="text-lg font-semibold text-gray-900">{vital.bmi}</p>
                      <p className="text-xs text-gray-500">кг/м²</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalRecords.filter(r => r.attachments && r.attachments.length > 0).map((record) => (
              record.attachments?.map((attachment, index) => (
                <div key={`${record.id}-${index}`} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{attachment.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{record.title}</p>
                      <p className="text-xs text-gray-500">{attachment.size} • {record.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm">
                      Открыть
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 text-sm">
                      Скачать
                    </button>
                  </div>
                </div>
              ))
            ))}
          </div>
        )}

        {/* Record Details Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-500 animate-in slide-in-from-bottom shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">{selectedRecord.title}</h2>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Основная информация</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Дата:</span> {selectedRecord.date}</p>
                    <p><span className="font-medium text-gray-700">Врач:</span> {selectedRecord.doctor}</p>
                    <p><span className="font-medium text-gray-700">Клиника:</span> {selectedRecord.clinic}</p>
                    {selectedRecord.diagnosis && (
                      <p><span className="font-medium text-gray-700">Диагноз:</span> {selectedRecord.diagnosis}</p>
                    )}
                  </div>
                </div>
                
                {selectedRecord.symptoms && selectedRecord.symptoms.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Симптомы</h3>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedRecord.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {selectedRecord.treatment && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Лечение</h3>
                  <p className="text-sm text-gray-600">{selectedRecord.treatment}</p>
                </div>
              )}
              
              {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Назначенные лекарства</h3>
                  <div className="space-y-2">
                    {selectedRecord.medications.map((medication, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <p className="font-medium text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage} • {medication.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRecord.testResults && selectedRecord.testResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Результаты анализов</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Показатель</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Значение</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Норма</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-900">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.testResults.map((result, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 px-3 text-sm text-gray-900">{result.parameter}</td>
                            <td className={`py-2 px-3 text-sm font-medium ${getStatusColor(result.status)}`}>
                              {result.value} {result.unit}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-600">{result.normalRange}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.status === 'normal' ? 'bg-green-100 text-green-800' :
                                result.status === 'high' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {result.status === 'normal' ? 'Норма' :
                                 result.status === 'high' ? 'Повышен' : 'Понижен'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {selectedRecord.notes && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Заметки врача</h3>
                  <p className="text-sm text-gray-600">{selectedRecord.notes}</p>
                </div>
              )}
              
              {selectedRecord.followUp && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Повторный приём</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Дата:</span> {selectedRecord.followUp.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Заметки:</span> {selectedRecord.followUp.notes}
                  </p>
                </div>
              )}
              
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Прикреплённые файлы</h3>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-300 transform hover:scale-105">
                            Открыть
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-all duration-300 transform hover:scale-105">
                            Скачать
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}