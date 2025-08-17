import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Pill, CheckCircle, Circle, Clock } from 'lucide-react';
import { Medicine, CalendarEvent } from '../types';
import './MedicineCalendar.css';

interface MedicineCalendarProps {
  medicines: Medicine[];
  onEventToggle: (eventId: string) => void;
}

const MedicineCalendar: React.FC<MedicineCalendarProps> = ({
  medicines,
  onEventToggle
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

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
            id: `${medicine.id}-${format(currentDate, 'yyyy-MM-dd')}-${time}`,
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
    return calendarEvents.filter(event => isSameDay(event.date, date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventToggle = (eventId: string) => {
    setCalendarEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, isCompleted: !event.isCompleted }
          : event
      )
    );
    onEventToggle(eventId);
  };

  const tileContent = ({ date }: any) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return null;
    
    const completedCount = dayEvents.filter(event => event.isCompleted).length;
    const totalCount = dayEvents.length;
    
    return (
      <div className="calendar-tile-content">
        <div className="events-indicator">
          <Pill className="pill-indicator" />
          <span className="events-count">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
    );
  };

  const tileClassName = ({ date }: any) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return '';
    
    const completedCount = dayEvents.filter(event => event.isCompleted).length;
    const totalCount = dayEvents.length;
    
    if (completedCount === totalCount) return 'calendar-tile-completed';
    if (completedCount > 0) return 'calendar-tile-partial';
    return 'calendar-tile-pending';
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="medicine-calendar">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>Календарь приема лекарств</h2>
          <div className="calendar-legend">
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
        
        <div className="calendar-wrapper">
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale={ru}
            formatDay={(locale, date) => format(date, 'd')}
            formatMonth={(locale, date) => format(date, 'MMMM', { locale: ru })}
            formatMonthYear={(locale, date) => format(date, 'MMMM yyyy', { locale: ru })}
            className="medicine-calendar-component"
          />
        </div>
      </div>
      
      <div className="events-panel">
        <div className="events-header">
          <h3>События на {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}</h3>
        </div>
        
        {selectedDateEvents.length === 0 ? (
          <div className="no-events">
            <Pill className="no-events-icon" />
            <p>На этот день нет запланированных приемов лекарств</p>
          </div>
        ) : (
          <div className="events-list">
            {selectedDateEvents
              .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay))
              .map(event => (
                <div 
                  key={event.id} 
                  className={`event-item ${event.isCompleted ? 'completed' : ''}`}
                  onClick={() => handleEventToggle(event.id)}
                >
                  <div className="event-time">
                    <Clock className="time-icon" />
                    <span>{event.timeOfDay}</span>
                  </div>
                  
                  <div className="event-content">
                    <h4 className="event-medicine">{event.medicineName}</h4>
                    <p className="event-dosage">{event.dosage}</p>
                  </div>
                  
                  <div className="event-status">
                    {event.isCompleted ? (
                      <CheckCircle className="status-icon completed" />
                    ) : (
                      <Circle className="status-icon pending" />
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

export default MedicineCalendar;
