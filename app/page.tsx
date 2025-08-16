'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';

export default function Home() {
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 36.6,
    oxygenSaturation: 98
  });

  useEffect(() => {
    // Симуляция реального времени обновления данных
    const interval = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 10),
        oxygenSaturation: 96 + Math.floor(Math.random() * 4)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOrganClick = (organName: string) => {
    setSelectedOrgan(organName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            <LeftPanel />
          </div>
          
          {/* Center Panel */}
          <div className="lg:col-span-6">
            <CenterPanel 
              onOrganClick={handleOrganClick}
              selectedOrgan={selectedOrgan}
            />
          </div>
          
          {/* Right Panel */}
          <div className="lg:col-span-3">
            <RightPanel 
              healthData={healthData}
              selectedOrgan={selectedOrgan}
            />
          </div>
        </div>
      </main>
    </div>
  );
}