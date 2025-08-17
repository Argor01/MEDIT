import React, { useState, useEffect } from 'react';
import { Medicine, CalendarEvent } from '../types';
import './SimpleCalendar.css';

interface SimpleCalendarProps {
  medicines: Medicine[];
  onEventToggle: (eventId: string) => void;
  completedEvents?: Set<string>;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  medicines,
  onEventToggle,
  completedEvents = new Set()
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Генерируем события календаря на основе лекарств
  useEffect(() => {
    const events: CalendarEvent[] = [];
    
    medicines.forEach(medicine => {
      if (!medicine.isActive) return;
      
      const startDate = new Date(medicine.startDate);
      const endDate = new Date(medicine.endDate);
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        medicine.timeOfDay.forEach(time => {
          events.push({
            id: `${medicine.id}-${currentDate.toISOString().split('T')[0]}-${time}`,
            date: new Date(currentDate),
            medicineId: medicine.id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            timeOfDay: time,
            isCompleted: false
          });
        });
        
        // Переходим к следующему дню
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    setCalendarEvents(events);
  }, [medicines]);

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];

    // Adjust startingDay for Monday as first day of week (0 for Sunday, 1 for Monday)
    const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

    // Добавляем пустые дни в начале месяца
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(null);
    }

    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventToggle = (eventId: string) => {
    onEventToggle(eventId);
  };

  const getMedicineColor = (medicineId: string) => {
    const colors = [
      '#667eea', // синий
      '#10b981', // зеленый
      '#f59e0b', // оранжевый
      '#ef4444', // красный
      '#8b5cf6', // фиолетовый
      '#06b6d4', // голубой
      '#84cc16', // лаймовый
      '#f97316', // оранжевый
      '#ec4899', // розовый
      '#14b8a6', // бирюзовый
    ];
    
    const medicineIndex = medicines.findIndex(m => m.id === medicineId);
    return colors[medicineIndex % colors.length];
  };

  const getDayEvents = (date: Date) => {
    return getEventsForDate(date);
  };

  const getUniqueMedicinesForDay = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    const uniqueMedicines = new Map();
    
    dayEvents.forEach(event => {
      if (!uniqueMedicines.has(event.medicineId)) {
        const medicineEvents = dayEvents.filter(e => e.medicineId === event.medicineId);
        const completedCount = medicineEvents.filter(e => completedEvents.has(e.id)).length;
        
        uniqueMedicines.set(event.medicineId, {
          id: event.medicineId,
          name: event.medicineName,
          color: getMedicineColor(event.medicineId),
          completed: completedCount,
          total: medicineEvents.length
        });
      }
    });
    
    return Array.from(uniqueMedicines.values());
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const days = getDaysInMonth(currentMonth);

  return (
    <div className="simple-calendar">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>Календарь приема лекарств</h2>
          <div className="calendar-legend">
            <div className="legend-section">
              <h4>Статус приема:</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-dot completed"></div>
                  <span>Все принято</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot partial"></div>
                  <span>Частично принято</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot pending"></div>
                  <span>Ожидает приема</span>
                </div>
              </div>
            </div>
            {medicines.length > 0 && (
              <div className="legend-section">
                <h4>Лекарства:</h4>
                <div className="legend-items">
                  {medicines.map((medicine, index) => (
                    <div key={medicine.id} className="legend-item">
                      <div 
                        className="legend-dot medicine" 
                        style={{ backgroundColor: getMedicineColor(medicine.id) }}
                      ></div>
                      <span>{medicine.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="calendar-wrapper">
          <div className="calendar-navigation">
            <button onClick={goToPreviousMonth} className="nav-btn">‹</button>
            <h3>{getMonthName(currentMonth)}</h3>
            <button onClick={goToNextMonth} className="nav-btn">›</button>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div>Пн</div>
              <div>Вт</div>
              <div>Ср</div>
              <div>Чт</div>
              <div>Пт</div>
              <div>Сб</div>
              <div>Вс</div>
            </div>
            
            <div className="calendar-days">
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`calendar-day ${!date ? 'empty' : ''}`}
                  onClick={() => date && handleDateClick(date)}
                >
                  {date && (
                    <>
                      <span className="day-number">{date.getDate()}</span>
                      <div className="medicine-dots">
                        {getUniqueMedicinesForDay(date).map((medicine, dotIndex) => (
                          <div
                            key={medicine.id}
                            className={`medicine-dot ${medicine.completed === medicine.total ? 'completed' : medicine.completed > 0 ? 'partial' : 'pending'}`}
                            style={{ backgroundColor: medicine.color }}
                            title={`${medicine.name}: ${medicine.completed}/${medicine.total}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="events-panel">
        <div className="events-header">
          <h3>События на {formatDate(selectedDate)}</h3>
        </div>
        
        {selectedDateEvents.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">💊</div>
            <p>На этот день нет запланированных приемов лекарств</p>
          </div>
        ) : (
          <div className="events-list">
            {selectedDateEvents
              .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay))
              .map(event => (
                <div 
                  key={event.id} 
                  className={`event-item ${completedEvents.has(event.id) ? 'completed' : ''}`}
                  onClick={() => handleEventToggle(event.id)}
                >
                  <div className="event-time">
                    <div className="time-icon">⏰</div>
                    <span>{event.timeOfDay}</span>
                  </div>
                  
                  <div className="event-content">
                    <h4 className="event-medicine">{event.medicineName}</h4>
                    <p className="event-dosage">{event.dosage}</p>
                  </div>
                  
                  <div className="event-status">
                    {completedEvents.has(event.id) ? (
                      <div className="status-icon completed">✅</div>
                    ) : (
                      <div className="status-icon pending">⭕</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCalendar;
