import React, { useState } from 'react';
import { Medicine } from '../types';
import MedicineCard from './MedicineCard.tsx';
import MedicineForm from './MedicineForm.tsx';
import './MedicineList.css';

interface MedicineListProps {
  medicines: Medicine[];
  onAddMedicine: (medicine: Medicine) => void;
  onEditMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  onToggleMedicine: (id: string) => void;
}

const MedicineList: React.FC<MedicineListProps> = ({
  medicines,
  onAddMedicine,
  onEditMedicine,
  onDeleteMedicine,
  onToggleMedicine
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setIsFormOpen(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsFormOpen(true);
  };

  const handleSaveMedicine = (medicine: Medicine) => {
    if (editingMedicine) {
      onEditMedicine(medicine);
    } else {
      onAddMedicine(medicine);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMedicine(null);
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && medicine.isActive) ||
                         (filterStatus === 'inactive' && !medicine.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const activeMedicines = medicines.filter(m => m.isActive).length;
  const totalMedicines = medicines.length;

  return (
    <div className="medicine-list">
      <div className="list-header">
        <div className="header-content">
          <h1>Мои лекарства</h1>
          <div className="stats">
            <span className="stat-item">
              <span className="stat-number">{activeMedicines}</span>
              <span className="stat-label">Активных</span>
            </span>
            <span className="stat-item">
              <span className="stat-number">{totalMedicines}</span>
              <span className="stat-label">Всего</span>
            </span>
          </div>
        </div>
        
        <button className="add-medicine-btn" onClick={handleAddMedicine}>
          <div className="add-icon">➕</div>
          Добавить лекарство
        </button>
      </div>

      <div className="list-controls">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Поиск лекарств..."
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
            <option value="inactive">Только неактивные</option>
          </select>
        </div>
      </div>

      {filteredMedicines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <div className="empty-plus-icon">➕</div>
          </div>
          <h3>Нет лекарств</h3>
          <p>
            {searchTerm || filterStatus !== 'all' 
              ? 'Попробуйте изменить поиск или фильтр'
              : 'Добавьте свое первое лекарство для начала отслеживания'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button className="empty-add-btn" onClick={handleAddMedicine}>
              Добавить лекарство
            </button>
          )}
        </div>
      ) : (
        <div className="medicines-grid">
          {filteredMedicines.map(medicine => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onEdit={handleEditMedicine}
              onDelete={onDeleteMedicine}
              onToggleActive={onToggleMedicine}
            />
          ))}
        </div>
      )}

      <MedicineForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveMedicine}
        editingMedicine={editingMedicine}
      />
    </div>
  );
};

export default MedicineList;
