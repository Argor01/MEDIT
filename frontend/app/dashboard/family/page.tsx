"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  avatar: string;
  lastCheckup: string;
  upcomingAppointments: number;
  medications: number;
}

export default function FamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Анна Петрова',
      relationship: 'Я',
      age: 35,
      gender: 'female',
      avatar: '👩',
      lastCheckup: '2024-01-15',
      upcomingAppointments: 1,
      medications: 2
    },
    {
      id: '2',
      name: 'Михаил Петров',
      relationship: 'Супруг',
      age: 38,
      gender: 'male',
      avatar: '👨',
      lastCheckup: '2023-12-20',
      upcomingAppointments: 0,
      medications: 1
    },
    {
      id: '3',
      name: 'София Петрова',
      relationship: 'Дочь',
      age: 12,
      gender: 'female',
      avatar: '👧',
      lastCheckup: '2024-01-10',
      upcomingAppointments: 1,
      medications: 0
    },
    {
      id: '4',
      name: 'Александр Петров',
      relationship: 'Сын',
      age: 8,
      gender: 'male',
      avatar: '👦',
      lastCheckup: '2024-01-08',
      upcomingAppointments: 0,
      medications: 0
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    age: '',
    gender: ''
  });
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const avatarMap: {[key: string]: string} = {
      'male': '👨',
      'female': '👩'
    };
    
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      relationship: newMember.relationship,
      age: parseInt(newMember.age),
      gender: newMember.gender,
      avatar: avatarMap[newMember.gender] || '👤',
      lastCheckup: 'Не проводился',
      upcomingAppointments: 0,
      medications: 0
    };
    
    setFamilyMembers([...familyMembers, member]);
    setNewMember({ name: '', relationship: '', age: '', gender: '' });
    setShowAddForm(false);
  };

  const getRelationshipColor = (relationship: string) => {
    const colors: {[key: string]: string} = {
      'Я': 'bg-blue-100 text-blue-800',
      'Супруг': 'bg-green-100 text-green-800',
      'Супруга': 'bg-green-100 text-green-800',
      'Дочь': 'bg-pink-100 text-pink-800',
      'Сын': 'bg-purple-100 text-purple-800',
      'Мать': 'bg-yellow-100 text-yellow-800',
      'Отец': 'bg-orange-100 text-orange-800'
    };
    return colors[relationship] || 'bg-gray-100 text-gray-800';
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
              <h1 className="text-2xl font-bold text-gray-900">Семейные аккаунты</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Добавить члена семьи
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Family Overview */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Обзор семьи</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl font-bold text-blue-600">{familyMembers.length}</div>
                <div className="text-sm text-gray-600">Всего членов семьи</div>
              </div>
              <div className="text-center transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl font-bold text-green-600">
                  {familyMembers.reduce((sum, member) => sum + member.upcomingAppointments, 0)}
                </div>
                <div className="text-sm text-gray-600">Предстоящих приёмов</div>
              </div>
              <div className="text-center transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl font-bold text-purple-600">
                  {familyMembers.reduce((sum, member) => sum + member.medications, 0)}
                </div>
                <div className="text-sm text-gray-600">Активных лекарств</div>
              </div>
            </div>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member, index) => (
            <div key={member.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{animationDelay: `${index * 100}ms`}}>
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4 transform transition-all duration-300 hover:scale-110">{member.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(member.relationship)} transition-all duration-300`}>
                    {member.relationship}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Возраст:</span>
                  <span className="font-medium">{member.age} лет</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Последний осмотр:</span>
                  <span className="font-medium">{member.lastCheckup}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Предстоящие приёмы:</span>
                  <span className="font-medium text-blue-600">{member.upcomingAppointments}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Лекарства:</span>
                  <span className="font-medium text-purple-600">{member.medications}</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                  Профиль
                </button>
                <button className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg hover:bg-green-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium">
                  Записи
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Family Calendar */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Семейный календарь</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg transform transition-all duration-300 hover:scale-105">
              <div className="p-2 bg-blue-100 rounded-lg transform transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">Анна Петрова - Кардиолог</p>
                <p className="text-sm text-gray-600">Завтра, 15 января в 14:30</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full transition-all duration-300">Завтра</span>
            </div>
            
            <div className="flex items-center p-4 bg-pink-50 rounded-lg transform transition-all duration-300 hover:scale-105">
              <div className="p-2 bg-pink-100 rounded-lg transform transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">София Петрова - Педиатр</p>
                <p className="text-sm text-gray-600">18 января в 10:00</p>
              </div>
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full transition-all duration-300">Через 4 дня</span>
            </div>
            
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg transform transition-all duration-300 hover:scale-105">
              <div className="p-2 bg-yellow-100 rounded-lg transform transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">Напоминание: Прививка от гриппа</p>
                <p className="text-sm text-gray-600">Для всей семьи - до 25 января</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full transition-all duration-300">Напоминание</span>
            </div>
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all duration-500 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Добавить члена семьи</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя и фамилия</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Введите имя и фамилию"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Родственная связь</label>
                <select
                  required
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="">Выберите связь</option>
                  <option value="Супруг">Супруг</option>
                  <option value="Супруга">Супруга</option>
                  <option value="Сын">Сын</option>
                  <option value="Дочь">Дочь</option>
                  <option value="Мать">Мать</option>
                  <option value="Отец">Отец</option>
                  <option value="Брат">Брат</option>
                  <option value="Сестра">Сестра</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Возраст</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="120"
                    value={newMember.age}
                    onChange={(e) => setNewMember({...newMember, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Возраст"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
                  <select
                    required
                    value={newMember.gender}
                    onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}