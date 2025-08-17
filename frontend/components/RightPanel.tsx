'use client';

import { useEffect, useState } from 'react';

interface HealthData {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
}

interface RightPanelProps {
  healthData: HealthData;
  selectedOrgan: string | null;
}

const RightPanel = ({ healthData, selectedOrgan }: RightPanelProps) => {
  const [animatedHeartRate, setAnimatedHeartRate] = useState(healthData.heartRate);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedHeartRate(prev => {
        const diff = healthData.heartRate - prev;
        return prev + (diff * 0.1);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [healthData.heartRate]);

  const healthIndicators = [
    {
      id: 'cardiac',
      title: 'Сердечный ритм',
      value: Math.round(animatedHeartRate),
      unit: 'уд/мин',
      status: 'normal',
      icon: '❤️',
      gradient: 'from-red-400 to-pink-500',
      description: 'Частота сердечных сокращений'
    },
    {
      id: 'pressure',
      title: 'Артериальное давление',
      value: healthData.bloodPressure,
      unit: 'мм рт.ст.',
      status: 'normal',
      icon: '🩸',
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Систолическое/диастолическое давление'
    },
    {
      id: 'temperature',
      title: 'Температура тела',
      value: healthData.temperature,
      unit: '°C',
      status: 'normal',
      icon: '🌡️',
      gradient: 'from-orange-400 to-red-500',
      description: 'Температура тела'
    },
    {
      id: 'oxygen',
      title: 'Сатурация кислорода',
      value: healthData.oxygenSaturation,
      unit: '%',
      status: 'normal',
      icon: '🫁',
      gradient: 'from-cyan-400 to-blue-500',
      description: 'Насыщение крови кислородом'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Показатели здоровья</h2>
        <p className="text-sm text-gray-600">Мониторинг в реальном времени</p>
      </div>

      {/* Health Indicators */}
      <div className="space-y-4 flex-1">
        {healthIndicators.map((indicator) => (
          <div
            key={indicator.id}
            className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
              selectedOrgan && indicator.id === 'cardiac' && selectedOrgan === 'heart'
                ? 'border-red-300 bg-red-50'
                : selectedOrgan && indicator.id === 'oxygen' && selectedOrgan === 'lungs'
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{indicator.icon}</span>
                <h3 className="font-medium text-gray-900 text-sm">{indicator.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                getStatusBg(indicator.status)
              } ${getStatusColor(indicator.status)}`}>
                {indicator.status === 'normal' ? 'Норма' : 
                 indicator.status === 'warning' ? 'Внимание' : 'Критично'}
              </span>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${indicator.gradient} bg-clip-text text-transparent`}>
                    {indicator.value}
                  </span>
                  <span className="text-sm text-gray-500">{indicator.unit}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{indicator.description}</p>
              </div>
              
              {/* Mini chart placeholder */}
              <div className="w-16 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded opacity-50"></div>
            </div>
            
            {/* Animated progress bar for heart rate */}
            {indicator.id === 'cardiac' && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-pink-500 h-1 rounded-full transition-all duration-1000 animate-heartbeat"
                    style={{ width: `${Math.min((animatedHeartRate / 120) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-gray-900 mb-2 text-sm">Активность мозга</h3>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm text-gray-600">Активна</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">Нейронная активность в пределах нормы</p>
      </div>

      {/* Add Metric Button */}
      <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
        <span className="mr-2">+</span>
        Добавить показатель
      </button>
    </div>
  );
};

export default RightPanel;