"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VideoConsultation {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  price: number;
}

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  status: 'active' | 'expired' | 'used';
  pharmacyDelivery?: {
    pharmacy: string;
    address: string;
    estimatedTime: string;
    trackingNumber?: string;
  };
}

interface OnlineDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  photo: string;
  isOnline: boolean;
  consultationPrice: number;
  languages: string[];
  nextAvailable: string;
}

export default function TelemedicinePage() {
  const [activeTab, setActiveTab] = useState<'consultations' | 'prescriptions' | 'book-online'>('consultations');
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<VideoConsultation | null>(null);

  // SVG Avatar Component
  const DoctorAvatar = ({ name, gender, isOnline }: { name: string; gender: 'male' | 'female'; isOnline?: boolean }) => {
    const initials = name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2);
    const colors = gender === 'female' 
      ? ['from-pink-400 to-purple-500', 'from-rose-400 to-pink-500', 'from-purple-400 to-indigo-500']
      : ['from-blue-400 to-indigo-500', 'from-green-400 to-blue-500', 'from-indigo-400 to-purple-500'];
    const colorIndex = name.length % colors.length;
    
    return (
      <div className="relative">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg mr-4`}>
          {initials}
        </div>
        {isOnline !== undefined && (
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        )}
      </div>
    );
  };

  const [consultations] = useState<VideoConsultation[]>([
    {
      id: '1',
      doctorName: 'Др. Анна Петрова',
      specialty: 'Терапевт',
      date: '2024-01-15',
      time: '14:30',
      duration: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/abc123',
      price: 2000
    },
    {
      id: '2',
      doctorName: 'Др. Михаил Иванов',
      specialty: 'Кардиолог',
      date: '2024-01-12',
      time: '16:00',
      duration: 45,
      status: 'completed',
      price: 3000
    },
    {
      id: '3',
      doctorName: 'Др. Елена Сидорова',
      specialty: 'Эндокринолог',
      date: '2024-01-18',
      time: '10:00',
      duration: 30,
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/def456',
      price: 2500
    }
  ]);

  const [prescriptions] = useState<Prescription[]>([
    {
      id: '1',
      doctorName: 'Др. Анна Петрова',
      date: '2024-01-12',
      medications: [
        {
          name: 'Аспирин',
          dosage: '100 мг',
          frequency: '1 раз в день',
          duration: '30 дней',
          instructions: 'Принимать после еды'
        },
        {
          name: 'Омега-3',
          dosage: '1000 мг',
          frequency: '1 раз в день',
          duration: '60 дней',
          instructions: 'Принимать во время еды'
        }
      ],
      status: 'active',
      pharmacyDelivery: {
        pharmacy: 'Аптека "Здоровье"',
        address: 'ул. Ленина, 15',
        estimatedTime: '2-3 часа',
        trackingNumber: 'TRK123456789'
      }
    },
    {
      id: '2',
      doctorName: 'Др. Михаил Иванов',
      date: '2024-01-10',
      medications: [
        {
          name: 'Метформин',
          dosage: '500 мг',
          frequency: '2 раза в день',
          duration: '90 дней',
          instructions: 'Принимать с едой, утром и вечером'
        }
      ],
      status: 'active'
    }
  ]);

  const [onlineDoctors] = useState<OnlineDoctor[]>([
    {
      id: '1',
      name: 'Др. Анна Петрова',
      specialty: 'Терапевт',
      rating: 4.8,
      experience: 15,
      photo: 'avatar',
      isOnline: true,
      consultationPrice: 2000,
      languages: ['Русский', 'Английский'],
      nextAvailable: 'Сейчас'
    },
    {
      id: '2',
      name: 'Др. Ольга Васильева',
      specialty: 'Педиатр',
      rating: 4.9,
      experience: 12,
      photo: 'avatar',
      isOnline: true,
      consultationPrice: 2200,
      languages: ['Русский'],
      nextAvailable: 'Через 15 мин'
    },
    {
      id: '3',
      name: 'Др. Сергей Николаев',
      specialty: 'Дерматолог',
      rating: 4.7,
      experience: 18,
      photo: 'avatar',
      isOnline: false,
      consultationPrice: 2800,
      languages: ['Русский', 'Немецкий'],
      nextAvailable: 'Завтра в 09:00'
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router]);

  const startVideoCall = (consultation: VideoConsultation) => {
    setCurrentCall(consultation);
    setIsInCall(true);
  };

  const endVideoCall = () => {
    setIsInCall(false);
    setCurrentCall(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Запланирована';
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      case 'active': return 'Активный';
      case 'expired': return 'Истёк';
      case 'used': return 'Использован';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Video Call Modal */}
      {isInCall && currentCall && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Video Call Header */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{currentCall.doctorName}</h2>
              <p className="text-sm text-gray-300">{currentCall.specialty}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">00:15:32</span>
              <button 
                onClick={endVideoCall}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Завершить звонок
              </button>
            </div>
          </div>
          
          {/* Video Area */}
          <div className="flex-1 relative bg-gray-800">
            {/* Doctor Video */}
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg font-medium">{currentCall.doctorName}</p>
                <p className="text-sm text-gray-300">Видеоконсультация</p>
              </div>
            </div>
            
            {/* Patient Video (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-600 rounded-lg border-2 border-white">
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs">Вы</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-gray-900 p-4 flex justify-center space-x-6">
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
              <h1 className="text-2xl font-bold text-gray-900">Телемедицина</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Онлайн</span>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                Экстренная консультация
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
                onClick={() => setActiveTab('consultations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'consultations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Мои консультации
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Электронные рецепты
              </button>
              <button
                onClick={() => setActiveTab('book-online')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'book-online'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Онлайн-консультация
              </button>
            </nav>
          </div>
        </div>

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            {consultations.map((consultation, index) => (
              <div key={consultation.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-[1.02]" style={{animationDelay: `${index * 100}ms`}}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{consultation.doctorName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {getStatusText(consultation.status)}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium mb-1">{consultation.specialty}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      {consultation.date} в {consultation.time} • {consultation.duration} мин
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{consultation.price} ₽</p>
                  </div>
                  <div className="flex space-x-3">
                    {consultation.status === 'scheduled' && consultation.meetingLink && (
                      <button 
                        onClick={() => startVideoCall(consultation)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Присоединиться
                      </button>
                    )}
                    {consultation.status === 'completed' && (
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                        Повторная консультация
                      </button>
                    )}
                    {consultation.status === 'scheduled' && (
                      <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105">
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            {prescriptions.map((prescription, index) => (
              <div key={prescription.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-[1.02]" style={{animationDelay: `${index * 100}ms`}}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">Рецепт от {prescription.doctorName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                        {getStatusText(prescription.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Выписан: {prescription.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                      Скачать PDF
                    </button>
                    {prescription.status === 'active' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                        Заказать доставку
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <span className="text-sm text-gray-600">{medication.dosage}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <p><span className="font-medium">Частота:</span> {medication.frequency}</p>
                        <p><span className="font-medium">Курс:</span> {medication.duration}</p>
                        <p><span className="font-medium">Инструкции:</span> {medication.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {prescription.pharmacyDelivery && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Доставка заказана</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {prescription.pharmacyDelivery.pharmacy} • {prescription.pharmacyDelivery.address}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Время доставки: {prescription.pharmacyDelivery.estimatedTime}
                        </p>
                        {prescription.pharmacyDelivery.trackingNumber && (
                          <p className="text-sm text-green-600 font-medium">
                            Трек-номер: {prescription.pharmacyDelivery.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Book Online Tab */}
        {activeTab === 'book-online' && (
          <div>
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Онлайн-консультации</h3>
                  <p className="text-sm text-gray-600">
                    Получите профессиональную медицинскую консультацию не выходя из дома. 
                    Видеосвязь с врачами, электронные рецепты и доставка лекарств.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {onlineDoctors.map((doctor, index) => (
                <div key={doctor.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start mb-4">
                    <DoctorAvatar 
                      name={doctor.name} 
                      gender={doctor.name.includes('Анна') || doctor.name.includes('Ольга') ? 'female' : 'male'}
                      isOnline={doctor.isOnline}
                    />
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
                    <p className="text-lg font-semibold text-gray-900 mb-2">{doctor.consultationPrice} ₽</p>
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doctor.isOnline ? 'Онлайн' : 'Оффлайн'}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">Доступен: {doctor.nextAvailable}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((language, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        doctor.isOnline 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!doctor.isOnline}
                    >
                      {doctor.isOnline ? 'Начать консультацию' : 'Недоступен'}
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                      Запланировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}