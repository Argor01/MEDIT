'use client';

import { useState } from 'react';

const LeftPanel = () => {
  const [activeCategory, setActiveCategory] = useState('research');

  const categories = [
    { id: 'research', label: 'Исследования', count: 12 },
    { id: 'diagnostics', label: 'Диагностика', count: 8 },
    { id: 'treatment', label: 'Лечение', count: 15 },
    { id: 'prevention', label: 'Профилактика', count: 6 }
  ];

  const researchItems = [
    {
      title: 'Анализ крови',
      description: 'Общий анализ крови с лейкоцитарной формулой',
      date: '2025-01-15',
      status: 'completed'
    },
    {
      title: 'ЭКГ',
      description: 'Электрокардиограмма в покое',
      date: '2025-01-14',
      status: 'pending'
    },
    {
      title: 'УЗИ сердца',
      description: 'Эхокардиография с допплерографией',
      date: '2025-01-13',
      status: 'completed'
    }
  ];

  const calendarEvents = [
    { date: 15, type: 'appointment' },
    { date: 18, type: 'checkup' },
    { date: 22, type: 'surgery' },
    { date: 25, type: 'consultation' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Медицинские данные</h2>
        
        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Research Cards */}
      <div className="space-y-3 mb-6">
        {researchItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.status === 'completed' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status === 'completed' ? 'Готово' : 'В процессе'}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{item.description}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
        ))}
      </div>

      {/* Mini Calendar */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3 text-sm">Календарь событий</h3>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {/* Calendar header */}
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-center text-gray-500 font-medium p-1">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const hasEvent = calendarEvents.some(event => event.date === day);
            return (
              <div
                key={day}
                className={`text-center p-1 rounded cursor-pointer ${
                  hasEvent
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Button */}
      <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
        <span className="mr-2">+</span>
        Добавить запись
      </button>
    </div>
  );
};

export default LeftPanel;