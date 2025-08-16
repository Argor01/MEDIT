from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from app.models.models import Patient, MedicalRecord, Appointment, HealthData
from app.schemas.schemas import PatientCreate, PatientUpdate


class PatientService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_patients(self, skip: int = 0, limit: int = 100) -> List[Patient]:
        """Получить список всех пациентов"""
        return self.db.query(Patient).filter(
            Patient.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    def get_patient(self, patient_id: str) -> Optional[Patient]:
        """Получить пациента по ID"""
        return self.db.query(Patient).filter(
            and_(
                Patient.id == patient_id,
                Patient.is_deleted == False
            )
        ).first()
    
    def get_patient_by_email(self, email: str) -> Optional[Patient]:
        """Получить пациента по email"""
        return self.db.query(Patient).filter(
            and_(
                Patient.email == email,
                Patient.is_deleted == False
            )
        ).first()
    
    def search_patients(self, query: str, skip: int = 0, limit: int = 100) -> List[Patient]:
        """Поиск пациентов по имени, фамилии или email"""
        search_filter = or_(
            Patient.first_name.ilike(f"%{query}%"),
            Patient.last_name.ilike(f"%{query}%"),
            Patient.email.ilike(f"%{query}%")
        )
        
        return self.db.query(Patient).filter(
            and_(
                search_filter,
                Patient.is_deleted == False
            )
        ).offset(skip).limit(limit).all()
    
    def create_patient(self, patient_data: PatientCreate) -> Patient:
        """Создать нового пациента"""
        patient = Patient(
            id=str(uuid.uuid4()),
            first_name=patient_data.first_name,
            last_name=patient_data.last_name,
            email=patient_data.email,
            phone=patient_data.phone,
            date_of_birth=patient_data.date_of_birth,
            gender=patient_data.gender,
            address=patient_data.address,
            emergency_contact=patient_data.emergency_contact,
            medical_history=patient_data.medical_history,
            allergies=patient_data.allergies,
            current_medications=patient_data.current_medications,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient
    
    def update_patient(self, patient_id: str, patient_data: PatientUpdate) -> Optional[Patient]:
        """Обновить данные пациента"""
        patient = self.get_patient(patient_id)
        if not patient:
            return None
        
        update_data = patient_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(patient, field, value)
        
        patient.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(patient)
        return patient
    
    def delete_patient(self, patient_id: str) -> bool:
        """Мягкое удаление пациента"""
        patient = self.get_patient(patient_id)
        if not patient:
            return False
        
        patient.is_deleted = True
        patient.updated_at = datetime.utcnow()
        
        self.db.commit()
        return True
    
    def get_patient_medical_history(self, patient_id: str) -> List[MedicalRecord]:
        """Получить медицинскую историю пациента"""
        return self.db.query(MedicalRecord).filter(
            and_(
                MedicalRecord.patient_id == patient_id,
                MedicalRecord.is_deleted == False
            )
        ).order_by(MedicalRecord.created_at.desc()).all()
    
    def get_patient_appointments(self, patient_id: str, limit: int = 10) -> List[Appointment]:
        """Получить назначения пациента"""
        return self.db.query(Appointment).filter(
            Appointment.patient_id == patient_id
        ).order_by(Appointment.appointment_date.desc()).limit(limit).all()
    
    def get_patient_latest_health_data(self, patient_id: str) -> Optional[HealthData]:
        """Получить последние данные о здоровье пациента"""
        return self.db.query(HealthData).filter(
            HealthData.patient_id == patient_id
        ).order_by(HealthData.recorded_at.desc()).first()
    
    def get_patient_statistics(self, patient_id: str) -> dict:
        """Получить статистику пациента"""
        patient = self.get_patient(patient_id)
        if not patient:
            return {}
        
        # Подсчитываем различные метрики
        total_appointments = self.db.query(Appointment).filter(
            Appointment.patient_id == patient_id
        ).count()
        
        completed_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.patient_id == patient_id,
                Appointment.status == "completed"
            )
        ).count()
        
        upcoming_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.patient_id == patient_id,
                Appointment.status == "scheduled",
                Appointment.appointment_date >= datetime.now().date()
            )
        ).count()
        
        total_health_records = self.db.query(HealthData).filter(
            HealthData.patient_id == patient_id
        ).count()
        
        total_medical_records = self.db.query(MedicalRecord).filter(
            and_(
                MedicalRecord.patient_id == patient_id,
                MedicalRecord.is_deleted == False
            )
        ).count()
        
        # Вычисляем возраст
        age = None
        if patient.date_of_birth:
            today = datetime.now().date()
            age = today.year - patient.date_of_birth.year
            if today.month < patient.date_of_birth.month or \
               (today.month == patient.date_of_birth.month and today.day < patient.date_of_birth.day):
                age -= 1
        
        # Последняя активность
        last_appointment = self.db.query(Appointment).filter(
            Appointment.patient_id == patient_id
        ).order_by(Appointment.appointment_date.desc()).first()
        
        last_health_record = self.db.query(HealthData).filter(
            HealthData.patient_id == patient_id
        ).order_by(HealthData.recorded_at.desc()).first()
        
        last_activity = None
        if last_appointment and last_health_record:
            last_activity = max(
                last_appointment.appointment_date,
                last_health_record.recorded_at.date()
            )
        elif last_appointment:
            last_activity = last_appointment.appointment_date
        elif last_health_record:
            last_activity = last_health_record.recorded_at.date()
        
        return {
            "patient_id": patient_id,
            "age": age,
            "total_appointments": total_appointments,
            "completed_appointments": completed_appointments,
            "upcoming_appointments": upcoming_appointments,
            "total_health_records": total_health_records,
            "total_medical_records": total_medical_records,
            "last_activity": last_activity.isoformat() if last_activity else None,
            "registration_date": patient.created_at.date().isoformat(),
            "completion_rate": round(
                (completed_appointments / total_appointments * 100) if total_appointments > 0 else 0,
                2
            )
        }
    
    def get_patients_count(self) -> int:
        """Получить общее количество пациентов"""
        return self.db.query(Patient).filter(
            Patient.is_deleted == False
        ).count()
    
    def get_recent_patients(self, days: int = 7, limit: int = 10) -> List[Patient]:
        """Получить недавно зарегистрированных пациентов"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        return self.db.query(Patient).filter(
            and_(
                Patient.created_at >= cutoff_date,
                Patient.is_deleted == False
            )
        ).order_by(Patient.created_at.desc()).limit(limit).all()
    
    def get_patients_by_age_range(self, min_age: int, max_age: int) -> List[Patient]:
        """Получить пациентов по возрастному диапазону"""
        today = datetime.now().date()
        min_birth_date = today.replace(year=today.year - max_age - 1)
        max_birth_date = today.replace(year=today.year - min_age)
        
        return self.db.query(Patient).filter(
            and_(
                Patient.date_of_birth >= min_birth_date,
                Patient.date_of_birth <= max_birth_date,
                Patient.is_deleted == False
            )
        ).all()
    
    def get_patients_by_gender(self, gender: str) -> List[Patient]:
        """Получить пациентов по полу"""
        return self.db.query(Patient).filter(
            and_(
                Patient.gender == gender,
                Patient.is_deleted == False
            )
        ).all()