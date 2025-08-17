import React from 'react';
import { Medicine } from '../types';
import './MedicineCard.css';

interface MedicineCardProps {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const getStatusColor = () => {
    return medicine.isActive ? '#10b981' : '#6b7280';
  };

  return (
    <div className={`medicine-card ${medicine.isActive ? 'active' : 'inactive'}`}>
      <div className="medicine-header">
        <div className="medicine-icon">
          <div className="pill-icon">💊</div>
        </div>
        <div className="medicine-status">
          <div 
            className="status-dot" 
            style={{ backgroundColor: getStatusColor() }}
          />
          <span className="status-text">
            {medicine.isActive ? 'Активно' : 'Неактивно'}
          </span>
        </div>
      </div>
      
      <div className="medicine-content">
        <h3 className="medicine-name">{medicine.name}</h3>
        <p className="medicine-dosage">{medicine.dosage}</p>
        
        <div className="medicine-details">
          <div className="detail-item">
            <div className="detail-icon">⏰</div>
            <span>{medicine.frequency}</span>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">📅</div>
            <span>
              {formatDate(medicine.startDate)} - {formatDate(medicine.endDate)}
            </span>
          </div>
        </div>
        
        {medicine.timeOfDay.length > 0 && (
          <div className="time-slots">
            <span className="time-label">Время приема:</span>
            <div className="time-tags">
              {medicine.timeOfDay.map((time, index) => (
                <span key={index} className="time-tag">{time}</span>
              ))}
            </div>
          </div>
        )}
        
        {medicine.notes && (
          <p className="medicine-notes">{medicine.notes}</p>
        )}
      </div>
      
      <div className="medicine-actions">
        <button 
          className="action-btn edit-btn"
          onClick={() => onEdit(medicine)}
        >
          <div className="action-icon">✏️</div>
          Изменить
        </button>
        
        <button 
          className="action-btn toggle-btn"
          onClick={() => onToggleActive(medicine.id)}
        >
          {medicine.isActive ? 'Остановить' : 'Активировать'}
        </button>
        
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(medicine.id)}
        >
          <div className="action-icon">🗑️</div>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
