"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  photo: string;
  clinic: string;
  price: number;
  availableSlots: string[];
  nextAvailable: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'offline' | 'online';
}

interface Symptom {
  id: string;
  name: string;
  selected: boolean;
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'my-appointments' | 'ai-assistant'>('book');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: '1', name: 'Головная боль', selected: false },
    { id: '2', name: 'Повышенная температура', selected: false },
    { id: '3', name: 'Кашель', selected: false },
    { id: '4', name: 'Боль в горле', selected: false },
    { id: '5', name: 'Насморк', selected: false },
    { id: '6', name: 'Боль в животе', selected: false },
    { id: '7', name: 'Тошнота', selected: false },
    { id: '8', name: 'Усталость', selected: false }
  ]);

  // SVG Avatar Component
  const DoctorAvatar = ({ name, gender }: { name: string; gender: 'male' | 'female' }) => {
    const initials = name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2);
    const colors = gender === 'female' 
      ? ['from-pink-400 to-purple-500', 'from-rose-400 to-pink-500', 'from-purple-400 to-indigo-500']
      : ['from-blue-400 to-indigo-500', 'from-green-400 to-blue-500', 'from-indigo-400 to-purple-500'];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
        {initials}
      </div>
    );
  };

  const [doctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Др. Анна Петрова',
      specialty: 'Терапевт',
      rating: 4.8,
      experience: 15,
      photo: 'avatar',
      clinic: 'Медицинский центр "Здоровье"',
      price: 2500,
      availableSlots: ['09:00', '10:30', '14:00', '15:30'],
      nextAvailable: '2024-01-16'
    },
    {
      id: '2',
      name: 'Др. Михаил Иванов',
      specialty: 'Кардиолог',
      rating: 4.9,
      experience: 20,
      photo: 'avatar',
      clinic: 'Кардиологический центр',
      price: 3500,
      availableSlots: ['11:00', '13:00', '16:00'],
      nextAvailable: '2024-01-17'
    },
    {
      id: '3',
      name: 'Др. Елена Сидорова',
      specialty: 'Эндокринолог',
      rating: 4.7,
      experience: 12,
      photo: 'avatar',
      clinic: 'Эндокринологическая клиника',
      price: 3000,
      availableSlots: ['10:00', '12:00', '15:00', '17:00'],
      nextAvailable: '2024-01-15'
    },
    {
      id: '4',
      name: 'Др. Александр Козлов',
      specialty: 'Невролог',
      rating: 4.6,
      experience: 18,
      photo: 'avatar',
      clinic: 'Неврологический центр',
      price: 3200,
      availableSlots: ['09:30', '11:30', '14:30'],
      nextAvailable: '2024-01-18'
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Др. Анна Петрова',
      specialty: 'Терапевт',
      date: '2024-01-16',
      time: '10:30',
      clinic: 'Медицинский центр "Здоровье"',
      status: 'upcoming',
      type: 'offline'
    },
    {
      id: '2',
      doctorName: 'Др. Михаил Иванов',
      specialty: 'Кардиолог',
      date: '2024-01-12',
      time: '14:00',
      clinic: 'Кардиологический центр',
      status: 'completed',
      type: 'online'
    },
    {
      id: '3',
      doctorName: 'Др. Елена Сидорова',
      specialty: 'Эндокринолог',
      date: '2024-01-20',
      time: '15:00',
      clinic: 'Эндокринологическая клиника',
      status: 'upcoming',
      type: 'offline'
    }
  ]);

  const specialties = ['Терапевт', 'Кардиолог', 'Эндокринолог', 'Невролог', 'Дерматолог', 'Офтальмолог'];

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesSearch = !searchQuery || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleSymptomToggle = (symptomId: string) => {
    setSymptoms(prev => prev.map(symptom => 
      symptom.id === symptomId 
        ? { ...symptom, selected: !symptom.selected }
        : symptom
    ));
  };

  const getAIRecommendation = () => {
    const selectedSymptoms = symptoms.filter(s => s.selected);
    if (selectedSymptoms.length === 0) return null;

    // Простая логика рекомендаций на основе симптомов
    const symptomNames = selectedSymptoms.map(s => s.name.toLowerCase());
    
    if (symptomNames.some(s => s.includes('головная боль') || s.includes('усталость'))) {
      return {
        specialty: 'Невролог',
        reason: 'На основе ваших симптомов рекомендуется консультация невролога',
        urgency: 'medium'
      };
    }
    
    if (symptomNames.some(s => s.includes('кашель') || s.includes('горле') || s.includes('насморк'))) {
      return {
        specialty: 'Терапевт',
        reason: 'Симптомы указывают на возможную респираторную инфекцию',
        urgency: 'low'
      };
    }
    
    if (symptomNames.some(s => s.includes('животе') || s.includes('тошнота'))) {
      return {
        specialty: 'Терапевт',
        reason: 'Рекомендуется обследование желудочно-кишечного тракта',
        urgency: 'medium'
      };
    }

    return {
      specialty: 'Терапевт',
      reason: 'Рекомендуется общая консультация терапевта',
      urgency: 'low'
    };
  };

  const aiRecommendation = getAIRecommendation();

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
              <h1 className="text-2xl font-bold text-gray-900">Запись к врачам</h1>
            </div>
            <button 
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-Ассистент
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('book')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'book'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Записаться на приём
              </button>
              <button
                onClick={() => setActiveTab('my-appointments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Мои записи
              </button>
            </nav>
          </div>
        </div>

        {/* AI Assistant Modal */}
        {showAIAssistant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">AI-Ассистент для подбора специалиста</h2>
                <button 
                  onClick={() => setShowAIAssistant(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Выберите ваши симптомы:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {symptoms.map((symptom) => (
                    <label key={symptom.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={symptom.selected}
                        onChange={() => handleSymptomToggle(symptom.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{symptom.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {aiRecommendation && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Рекомендация AI</h4>
                      <p className="text-sm text-gray-700 mb-2">{aiRecommendation.reason}</p>
                      <p className="text-sm font-medium text-purple-600">Рекомендуемый специалист: {aiRecommendation.specialty}</p>
                      <button 
                        onClick={() => {
                          setSelectedSpecialty(aiRecommendation.specialty);
                          setShowAIAssistant(false);
                          setActiveTab('book');
                        }}
                        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Найти {aiRecommendation.specialty.toLowerCase()}а
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Book Appointment Tab */}
        {activeTab === 'book' && (
          <div>
            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6 transform transition-all duration-500 animate-in slide-in-from-top">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Специальность</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Все специальности</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Имя врача, клиника..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    Найти врача
                  </button>
                </div>
              </div>
            </div>

            {/* Doctors List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <div key={doctor.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-xl" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start mb-4">
                    <div className="mr-4">
                      <DoctorAvatar 
                        name={doctor.name} 
                        gender={doctor.name.includes('Анна') || doctor.name.includes('Елена') ? 'female' : 'male'} 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{doctor.experience} лет опыта</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{doctor.clinic}</p>
                    <p className="text-lg font-semibold text-gray-900">{doctor.price} ₽</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ближайшие слоты:</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableSlots.slice(0, 3).map((slot, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {slot}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Следующая дата: {doctor.nextAvailable}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                      Записаться
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === 'my-appointments' && (
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-semibold text-gray-900">Мои записи</h2>
              </div>
              <div className="divide-y divide-white/20">
                {appointments.map((appointment, index) => (
                  <div key={appointment.id} className="p-6 transform transition-all duration-300 hover:bg-white/50 hover:scale-[1.02]" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">{appointment.doctorName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status === 'upcoming' ? 'Предстоящий' :
                             appointment.status === 'completed' ? 'Завершён' : 'Отменён'}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.type === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.type === 'online' ? 'Онлайн' : 'Очно'}
                          </span>
                        </div>
                        <p className="text-blue-600 font-medium mb-1">{appointment.specialty}</p>
                        <p className="text-sm text-gray-600 mb-1">{appointment.clinic}</p>
                        <p className="text-sm text-gray-600">{appointment.date} в {appointment.time}</p>
                      </div>
                      <div className="flex space-x-2">
                        {appointment.status === 'upcoming' && (
                          <>
                            {appointment.type === 'online' && (
                              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                                Присоединиться
                              </button>
                            )}
                            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                              Перенести
                            </button>
                            <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105">
                              Отменить
                            </button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                            Повторная запись
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}