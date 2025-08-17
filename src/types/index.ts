export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  timeOfDay: string[];
  notes?: string;
  isActive: boolean;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  medicineId: string;
  medicineName: string;
  dosage: string;
  timeOfDay: string;
  isCompleted: boolean;
}

export interface MedicineFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  timeOfDay: string[];
  notes: string;
}

