'use client';

import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Панель управления', icon: '📊' },
    { id: 'patients', label: 'Пациенты', icon: '👥' },
    { id: 'appointments', label: 'Записи', icon: '📅' },
    { id: 'reports', label: 'Отчеты', icon: '📋' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H+</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">Health+</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Доктор Иванов</p>
              <p className="text-xs text-gray-500">Кардиолог</p>
            </div>
            <div className="relative">
              <Image
                src="/images/photo_2025-08-14_00-02-35.jpg"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-200"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;