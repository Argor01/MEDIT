from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from app.models.models import Doctor, Appointment, Patient
from app.schemas.schemas import DoctorCreate, DoctorUpdate


class DoctorService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_doctors(self, skip: int = 0, limit: int = 100) -> List[Doctor]:
        """Получить список всех врачей"""
        return self.db.query(Doctor).filter(
            Doctor.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    def get_doctor(self, doctor_id: str) -> Optional[Doctor]:
        """Получить врача по ID"""
        return self.db.query(Doctor).filter(
            and_(
                Doctor.id == doctor_id,
                Doctor.is_deleted == False
            )
        ).first()
    
    def get_doctor_by_email(self, email: str) -> Optional[Doctor]:
        """Получить врача по email"""
        return self.db.query(Doctor).filter(
            and_(
                Doctor.email == email,
                Doctor.is_deleted == False
            )
        ).first()
    
    def get_doctor_by_license(self, license_number: str) -> Optional[Doctor]:
        """Получить врача по номеру лицензии"""
        return self.db.query(Doctor).filter(
            and_(
                Doctor.license_number == license_number,
                Doctor.is_deleted == False
            )
        ).first()
    
    def search_doctors(self, query: str, skip: int = 0, limit: int = 100) -> List[Doctor]:
        """Поиск врачей по имени, фамилии или специализации"""
        search_filter = or_(
            Doctor.first_name.ilike(f"%{query}%"),
            Doctor.last_name.ilike(f"%{query}%"),
            Doctor.specialization.ilike(f"%{query}%")
        )
        
        return self.db.query(Doctor).filter(
            and_(
                search_filter,
                Doctor.is_deleted == False
            )
        ).offset(skip).limit(limit).all()
    
    def get_doctors_by_specialization(self, specialization: str, skip: int = 0, limit: int = 100) -> List[Doctor]:
        """Получить врачей по специализации"""
        return self.db.query(Doctor).filter(
            and_(
                Doctor.specialization.ilike(f"%{specialization}%"),
                Doctor.is_deleted == False
            )
        ).offset(skip).limit(limit).all()
    
    def create_doctor(self, doctor_data: DoctorCreate) -> Doctor:
        """Создать нового врача"""
        doctor = Doctor(
            id=str(uuid.uuid4()),
            first_name=doctor_data.first_name,
            last_name=doctor_data.last_name,
            email=doctor_data.email,
            phone=doctor_data.phone,
            specialization=doctor_data.specialization,
            license_number=doctor_data.license_number,
            years_of_experience=doctor_data.years_of_experience,
            education=doctor_data.education,
            certifications=doctor_data.certifications,
            bio=doctor_data.bio,
            consultation_fee=doctor_data.consultation_fee,
            working_hours=doctor_data.working_hours,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(doctor)
        self.db.commit()
        self.db.refresh(doctor)
        return doctor
    
    def update_doctor(self, doctor_id: str, doctor_data: DoctorUpdate) -> Optional[Doctor]:
        """Обновить данные врача"""
        doctor = self.get_doctor(doctor_id)
        if not doctor:
            return None
        
        update_data = doctor_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(doctor, field, value)
        
        doctor.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(doctor)
        return doctor
    
    def delete_doctor(self, doctor_id: str) -> bool:
        """Мягкое удаление врача"""
        doctor = self.get_doctor(doctor_id)
        if not doctor:
            return False
        
        doctor.is_deleted = True
        doctor.updated_at = datetime.utcnow()
        
        self.db.commit()
        return True
    
    def get_specializations(self) -> List[str]:
        """Получить список всех специализаций"""
        result = self.db.query(Doctor.specialization).filter(
            Doctor.is_deleted == False
        ).distinct().all()
        
        return [spec[0] for spec in result if spec[0]]
    
    def get_doctor_appointments(self, doctor_id: str, status: Optional[str] = None, date: Optional[str] = None) -> List[dict]:
        """Получить назначения врача"""
        query = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id
        )
        
        if status:
            query = query.filter(Appointment.status == status)
        
        if date:
            try:
                appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
                query = query.filter(Appointment.appointment_date == appointment_date)
            except ValueError:
                pass
        
        appointments = query.order_by(Appointment.appointment_date.desc()).all()
        
        result = []
        for appointment in appointments:
            patient = self.db.query(Patient).filter(Patient.id == appointment.patient_id).first()
            result.append({
                "id": appointment.id,
                "patient_name": f"{patient.first_name} {patient.last_name}" if patient else "Unknown",
                "patient_id": appointment.patient_id,
                "appointment_date": appointment.appointment_date.isoformat(),
                "appointment_time": appointment.appointment_time.strftime("%H:%M"),
                "status": appointment.status,
                "appointment_type": appointment.appointment_type,
                "notes": appointment.notes
            })
        
        return result
    
    def get_doctor_patients(self, doctor_id: str) -> List[dict]:
        """Получить пациентов врача"""
        # Получаем уникальных пациентов через назначения
        patient_ids = self.db.query(Appointment.patient_id).filter(
            Appointment.doctor_id == doctor_id
        ).distinct().all()
        
        result = []
        for patient_id_tuple in patient_ids:
            patient_id = patient_id_tuple[0]
            patient = self.db.query(Patient).filter(
                and_(
                    Patient.id == patient_id,
                    Patient.is_deleted == False
                )
            ).first()
            
            if patient:
                # Подсчитываем количество назначений
                appointment_count = self.db.query(Appointment).filter(
                    and_(
                        Appointment.doctor_id == doctor_id,
                        Appointment.patient_id == patient_id
                    )
                ).count()
                
                # Последнее назначение
                last_appointment = self.db.query(Appointment).filter(
                    and_(
                        Appointment.doctor_id == doctor_id,
                        Appointment.patient_id == patient_id
                    )
                ).order_by(Appointment.appointment_date.desc()).first()
                
                result.append({
                    "id": patient.id,
                    "name": f"{patient.first_name} {patient.last_name}",
                    "email": patient.email,
                    "phone": patient.phone,
                    "appointment_count": appointment_count,
                    "last_appointment": last_appointment.appointment_date.isoformat() if last_appointment else None
                })
        
        return result
    
    def get_doctor_statistics(self, doctor_id: str) -> dict:
        """Получить статистику врача"""
        doctor = self.get_doctor(doctor_id)
        if not doctor:
            return {}
        
        # Общее количество назначений
        total_appointments = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id
        ).count()
        
        # Завершенные назначения
        completed_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.status == "completed"
            )
        ).count()
        
        # Предстоящие назначения
        upcoming_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.status == "scheduled",
                Appointment.appointment_date >= datetime.now().date()
            )
        ).count()
        
        # Отмененные назначения
        cancelled_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.status == "cancelled"
            )
        ).count()
        
        # Уникальные пациенты
        unique_patients = self.db.query(Appointment.patient_id).filter(
            Appointment.doctor_id == doctor_id
        ).distinct().count()
        
        # Назначения за последние 30 дней
        thirty_days_ago = datetime.now().date() - timedelta(days=30)
        recent_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date >= thirty_days_ago
            )
        ).count()
        
        # Средний рейтинг (если есть система рейтингов)
        average_rating = 4.5  # Заглушка
        
        return {
            "doctor_id": doctor_id,
            "total_appointments": total_appointments,
            "completed_appointments": completed_appointments,
            "upcoming_appointments": upcoming_appointments,
            "cancelled_appointments": cancelled_appointments,
            "unique_patients": unique_patients,
            "recent_appointments": recent_appointments,
            "completion_rate": round(
                (completed_appointments / total_appointments * 100) if total_appointments > 0 else 0,
                2
            ),
            "cancellation_rate": round(
                (cancelled_appointments / total_appointments * 100) if total_appointments > 0 else 0,
                2
            ),
            "average_rating": average_rating,
            "years_of_experience": doctor.years_of_experience,
            "specialization": doctor.specialization
        }
    
    def get_doctors_count(self) -> int:
        """Получить общее количество врачей"""
        return self.db.query(Doctor).filter(
            Doctor.is_deleted == False
        ).count()
    
    def get_available_doctors(self, date: str, time: str) -> List[Doctor]:
        """Получить доступных врачей на определенную дату и время"""
        try:
            appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
            appointment_time = datetime.strptime(time, "%H:%M").time()
        except ValueError:
            return []
        
        # Получаем врачей, у которых нет назначений на это время
        busy_doctors = self.db.query(Appointment.doctor_id).filter(
            and_(
                Appointment.appointment_date == appointment_date,
                Appointment.appointment_time == appointment_time,
                Appointment.status.in_(["scheduled", "in_progress"])
            )
        ).subquery()
        
        available_doctors = self.db.query(Doctor).filter(
            and_(
                Doctor.is_deleted == False,
                ~Doctor.id.in_(busy_doctors)
            )
        ).all()
        
        return available_doctors