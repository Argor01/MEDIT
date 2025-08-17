import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import MedicineList from './components/MedicineList.tsx';
import SimpleCalendar from './components/SimpleCalendar.tsx';
import MedicineHistory from './components/MedicineHistory.tsx';
import { Medicine } from './types';
import './App.css';

type View = 'medicines' | 'calendar' | 'history';

const App: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [currentView, setCurrentView] = useState<View>('medicines');
  const [completedEvents, setCompletedEvents] = useState<Set<string>>(new Set());

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedMedicines = localStorage.getItem('medicines');
    const savedCompletedEvents = localStorage.getItem('completedEvents');
    
    if (savedMedicines) {
      const parsedMedicines = JSON.parse(savedMedicines).map((medicine: any) => ({
        ...medicine,
        startDate: new Date(medicine.startDate),
        endDate: new Date(medicine.endDate)
      }));
      setMedicines(parsedMedicines);
    }
    
    if (savedCompletedEvents) {
      setCompletedEvents(new Set(JSON.parse(savedCompletedEvents)));
    }
  }, []);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('completedEvents', JSON.stringify(Array.from(completedEvents)));
  }, [completedEvents]);

  const handleAddMedicine = (medicine: Medicine) => {
    setMedicines(prev => [...prev, medicine]);
  };

  const handleEditMedicine = (updatedMedicine: Medicine) => {
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === updatedMedicine.id ? updatedMedicine : medicine
      )
    );
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(medicine => medicine.id !== id));
    // Удаляем связанные события из календаря
    setCompletedEvents(prev => {
      const newSet = new Set(prev);
      Array.from(newSet).forEach(eventId => {
        if (eventId.startsWith(id)) {
          newSet.delete(eventId);
        }
      });
      return newSet;
    });
  };

  const handleToggleMedicine = (id: string) => {
    setMedicines(prev => 
      prev.map(medicine => 
        medicine.id === id 
          ? { ...medicine, isActive: !medicine.isActive }
          : medicine
      )
    );
  };

  const handleEventToggle = (eventId: string) => {
    setCompletedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const getActiveMedicines = () => {
    return medicines.filter(medicine => medicine.isActive);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="view-navigation">
          <button
            className={`nav-btn ${currentView === 'medicines' ? 'active' : ''}`}
            onClick={() => setCurrentView('medicines')}
          >
            <div className="nav-icon">💊</div>
            <span>Лекарства</span>
          </button>
          
          <button
            className={`nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            <div className="nav-icon">📅</div>
            <span>Календарь</span>
          </button>
          
          <button
            className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <div className="nav-icon">📋</div>
            <span>История</span>
          </button>
        </div>

        <div className="view-content">
          {currentView === 'medicines' ? (
            <MedicineList
              medicines={medicines}
              onAddMedicine={handleAddMedicine}
              onEditMedicine={handleEditMedicine}
              onDeleteMedicine={handleDeleteMedicine}
              onToggleMedicine={handleToggleMedicine}
            />
          ) : currentView === 'calendar' ? (
            <SimpleCalendar
              medicines={getActiveMedicines()}
              onEventToggle={handleEventToggle}
              completedEvents={completedEvents}
            />
          ) : (
            <MedicineHistory medicines={medicines} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
