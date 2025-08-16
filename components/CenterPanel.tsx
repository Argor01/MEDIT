'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CenterPanelProps {
  onOrganClick: (organName: string) => void;
  selectedOrgan: string | null;
}

const CenterPanel = ({ onOrganClick, selectedOrgan }: CenterPanelProps) => {
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);

  const organs = [
    { name: 'heart', label: 'Сердце', position: { top: '35%', left: '45%' }, size: { width: '40px', height: '40px' } },
    { name: 'lungs', label: 'Легкие', position: { top: '30%', left: '25%' }, size: { width: '60px', height: '50px' } },
    { name: 'liver', label: 'Печень', position: { top: '45%', right: '20%' }, size: { width: '50px', height: '35px' } },
    { name: 'stomach', label: 'Желудок', position: { top: '50%', left: '35%' }, size: { width: '35px', height: '35px' } },
    { name: 'brain', label: 'Мозг', position: { top: '8%', left: '40%' }, size: { width: '45px', height: '35px' } },
    { name: 'intestines', label: 'Кишечник', position: { top: '60%', left: '30%' }, size: { width: '55px', height: '45px' } }
  ];

  const handleOrganClick = (organName: string) => {
    onOrganClick(organName);
  };

  const getOrganInfo = (organName: string) => {
    const organData: { [key: string]: { name: string; description: string; status: string } } = {
      heart: {
        name: 'Сердце',
        description: 'Центральный орган кровообращения',
        status: 'Нормальный ритм: 72 уд/мин'
      },
      lungs: {
        name: 'Легкие',
        description: 'Органы дыхательной системы',
        status: 'Сатурация кислорода: 98%'
      },
      liver: {
        name: 'Печень',
        description: 'Орган детоксикации и метаболизма',
        status: 'Функция в норме'
      },
      stomach: {
        name: 'Желудок',
        description: 'Орган пищеварительной системы',
        status: 'pH в норме'
      },
      brain: {
        name: 'Мозг',
        description: 'Центральная нервная система',
        status: 'Активность в норме'
      },
      intestines: {
        name: 'Кишечник',
        description: 'Орган пищеварения и всасывания',
        status: 'Микрофлора в норме'
      }
    };
    return organData[organName];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">3D Модель человека</h2>
        <p className="text-sm text-gray-600">Нажмите на орган для получения информации</p>
      </div>

      {/* 3D Model Container */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative">
          {/* Background with vignette effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-50/30 to-blue-100/50 rounded-2xl"></div>
          
          {/* Shadow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-black/10 rounded-full blur-md"></div>
          
          {/* Human Figure */}
          <div className="relative animate-float">
            <Image
              src="/images/human-anatomy.jpg"
              alt="Human Anatomy Model"
              width={300}
              height={500}
              className="object-contain rounded-2xl shadow-2xl"
              priority
            />
            
            {/* Interactive Organ Overlays */}
            {organs.map((organ) => (
              <div
                key={organ.name}
                className={`organ-overlay ${
                  selectedOrgan === organ.name ? 'active' : ''
                } ${
                  hoveredOrgan === organ.name ? 'scale-110' : ''
                }`}
                style={{
                  ...organ.position,
                  ...organ.size,
                  borderRadius: organ.name === 'lungs' || organ.name === 'liver' || organ.name === 'intestines' ? '30px' : '50%'
                }}
                onClick={() => handleOrganClick(organ.name)}
                onMouseEnter={() => setHoveredOrgan(organ.name)}
                onMouseLeave={() => setHoveredOrgan(null)}
                title={organ.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Organ Information */}
      {selectedOrgan && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-900">
              {getOrganInfo(selectedOrgan)?.name}
            </h3>
            <button
              onClick={() => onOrganClick('')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-blue-800 mb-2">
            {getOrganInfo(selectedOrgan)?.description}
          </p>
          <p className="text-xs text-blue-700 font-medium">
            Статус: {getOrganInfo(selectedOrgan)?.status}
          </p>
        </div>
      )}

      {/* Hover Information */}
      {hoveredOrgan && !selectedOrgan && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{getOrganInfo(hoveredOrgan)?.name}</span>
            {' - '}
            {getOrganInfo(hoveredOrgan)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CenterPanel;