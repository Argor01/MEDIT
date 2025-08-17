import React, { useState, useEffect } from 'react';
import { Medicine, MedicineFormData } from '../types';
import './MedicineForm.css';

interface MedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
  editingMedicine?: Medicine | null;
}

const MedicineForm: React.FC<MedicineFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMedicine
}) => {
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // По умолчанию через неделю
    timeOfDay: [],
    notes: ''
  });

  const [newTime, setNewTime] = useState('');

  const timeOptions = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  useEffect(() => {
    if (editingMedicine) {
      const startDate = new Date(editingMedicine.startDate);
      const endDate = new Date(editingMedicine.endDate);
      
      setFormData({
        name: editingMedicine.name,
        dosage: editingMedicine.dosage,
        frequency: editingMedicine.frequency,
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        endDate: isNaN(endDate.getTime()) ? new Date() : endDate,
        timeOfDay: [...editingMedicine.timeOfDay],
        notes: editingMedicine.notes || ''
      });
    } else {
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // По умолчанию через неделю
        timeOfDay: [],
        notes: ''
      });
    }
  }, [editingMedicine]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDate = new Date(value);
    
    // Проверяем, что дата валидна
    if (!isNaN(newDate.getTime())) {
      setFormData(prev => ({
        ...prev,
        [name]: newDate
      }));
    }
  };

  const addTimeSlot = () => {
    if (newTime && !formData.timeOfDay.includes(newTime)) {
      setFormData(prev => ({
        ...prev,
        timeOfDay: [...prev.timeOfDay, newTime].sort()
      }));
      setNewTime('');
    }
  };

  const removeTimeSlot = (time: string) => {
    setFormData(prev => ({
      ...prev,
      timeOfDay: prev.timeOfDay.filter(t => t !== time)
    }));
  };

  const formatDateForInput = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    try {
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем валидность дат
    if (isNaN(formData.startDate.getTime()) || isNaN(formData.endDate.getTime())) {
      alert('Пожалуйста, введите корректные даты');
      return;
    }
    
    // Проверяем, что дата окончания не раньше даты начала
    if (formData.endDate < formData.startDate) {
      alert('Дата окончания не может быть раньше даты начала');
      return;
    }
    
    const medicine: Medicine = {
      id: editingMedicine?.id || Date.now().toString(),
      ...formData,
      isActive: editingMedicine?.isActive ?? true
    };
    
    onSave(medicine);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay">
      <div className="medicine-form">
        <div className="form-header">
          <h2>{editingMedicine ? 'Редактировать лекарство' : 'Добавить лекарство'}</h2>
          <button className="close-btn" onClick={onClose}>
            <div className="close-icon">✕</div>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Название лекарства *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Введите название лекарства"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dosage">Дозировка *</label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              required
              placeholder="Например: 1 таблетка"
            />
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Частота приема *</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите частоту</option>
              <option value="1 раз в день">1 раз в день</option>
              <option value="2 раза в день">2 раза в день</option>
              <option value="3 раза в день">3 раза в день</option>
              <option value="4 раза в день">4 раза в день</option>
              <option value="По необходимости">По необходимости</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Дата начала *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formatDateForInput(formData.startDate)}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Дата окончания *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formatDateForInput(formData.endDate)}
                onChange={handleDateChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Время приема</label>
            <div className="time-input-group">
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              >
                <option value="">Выберите время</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <button
                type="button"
                className="add-time-btn"
                onClick={addTimeSlot}
                disabled={!newTime}
              >
                <div className="add-icon">➕</div>
              </button>
            </div>
            
            {formData.timeOfDay.length > 0 && (
              <div className="time-slots-display">
                {formData.timeOfDay.map(time => (
                  <div key={time} className="time-slot-item">
                    <div className="time-icon">⏰</div>
                    <span>{time}</span>
                    <button
                      type="button"
                      className="remove-time-btn"
                      onClick={() => removeTimeSlot(time)}
                    >
                      <div className="remove-icon">✕</div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Примечания</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Дополнительная информация о лекарстве"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="save-btn">
              {editingMedicine ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineForm;
