import React, { useState, useMemo } from 'react';
import { Medicine } from '../types';
import './MedicineHistory.css';

interface MedicineHistoryProps {
  medicines: Medicine[];
}

interface HistoryEntry {
  id: string;
  medicineName: string;
  dosage: string;
  startDate: Date;
  endDate: Date;
  frequency: string;
  timeOfDay: string[];
  notes?: string;
  isActive: boolean;
  duration: string;
}

const MedicineHistory: React.FC<MedicineHistoryProps> = ({ medicines }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'startDate' | 'endDate'>('startDate');

  const historyEntries: HistoryEntry[] = useMemo(() => {
    return medicines.map(medicine => {
      const startDate = new Date(medicine.startDate);
      const endDate = new Date(medicine.endDate);
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      
      let duration = '';
      if (durationDays === 1) {
        duration = '1 день';
      } else if (durationDays < 7) {
        duration = `${durationDays} дней`;
      } else if (durationDays < 30) {
        const weeks = Math.ceil(durationDays / 7);
        duration = `${weeks} ${weeks === 1 ? 'неделя' : weeks < 5 ? 'недели' : 'недель'}`;
      } else {
        const months = Math.ceil(durationDays / 30);
        duration = `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
      }

      return {
        id: medicine.id,
        medicineName: medicine.name,
        dosage: medicine.dosage,
        startDate,
        endDate,
        frequency: medicine.frequency,
        timeOfDay: medicine.timeOfDay,
        notes: medicine.notes,
        isActive: medicine.isActive,
        duration
      };
    });
  }, [medicines]);

  const filteredHistory = useMemo(() => {
    let filtered = historyEntries;

    // Фильтрация по поиску
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.dosage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по статусу
    if (filterStatus !== 'all') {
      filtered = filtered.filter(entry =>
        filterStatus === 'active' ? entry.isActive : !entry.isActive
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.medicineName.localeCompare(b.medicineName);
        case 'startDate':
          return b.startDate.getTime() - a.startDate.getTime();
        case 'endDate':
          return b.endDate.getTime() - a.endDate.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [historyEntries, searchTerm, filterStatus, sortBy]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#10b981' : '#6b7280';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активно' : 'Завершено';
  };

  return (
    <div className="medicine-history">
      <div className="history-header">
        <div className="header-content">
          <h1>История приёма лекарств</h1>
          <p>Просмотр всех лекарств, которые вы принимали или принимаете</p>
        </div>
        <div className="history-stats">
          <div className="stat-item">
            <div className="stat-number">{medicines.length}</div>
            <div className="stat-label">Всего лекарств</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{medicines.filter(m => m.isActive).length}</div>
            <div className="stat-label">Активных</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{medicines.filter(m => !m.isActive).length}</div>
            <div className="stat-label">Завершённых</div>
          </div>
        </div>
      </div>

      <div className="history-controls">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Поиск по названию или дозировке..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <div className="filter-icon">🔧</div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="filter-select"
          >
            <option value="all">Все лекарства</option>
            <option value="active">Только активные</option>
            <option value="inactive">Только завершённые</option>
          </select>
        </div>
        <div className="sort-container">
          <div className="sort-icon">📊</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'startDate' | 'endDate')}
            className="sort-select"
          >
            <option value="startDate">По дате начала</option>
            <option value="endDate">По дате окончания</option>
            <option value="name">По названию</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">📋</div>
          <h3>История пуста</h3>
          <p>
            {searchTerm || filterStatus !== 'all' 
              ? 'Попробуйте изменить параметры поиска или фильтрации'
              : 'Добавьте первое лекарство, чтобы начать отслеживать историю'
            }
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((entry) => (
            <div key={entry.id} className="history-item">
              <div className="history-item-header">
                <div className="medicine-info">
                  <h3 className="medicine-name">{entry.medicineName}</h3>
                  <p className="medicine-dosage">{entry.dosage}</p>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(entry.isActive) }}>
                  {getStatusText(entry.isActive)}
                </div>
              </div>
              
              <div className="history-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">📅 Начало приёма:</span>
                    <span className="detail-value">{formatDate(entry.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📅 Окончание приёма:</span>
                    <span className="detail-value">{formatDate(entry.endDate)}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">⏰ Частота:</span>
                    <span className="detail-value">{entry.frequency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">⏱️ Длительность:</span>
                    <span className="detail-value">{entry.duration}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">🕐 Время приёма:</span>
                    <span className="detail-value">
                      {entry.timeOfDay.join(', ')}
                    </span>
                  </div>
                </div>
                
                {entry.notes && (
                  <div className="detail-row">
                    <div className="detail-item full-width">
                      <span className="detail-label">📝 Примечания:</span>
                      <span className="detail-value notes">{entry.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineHistory;
