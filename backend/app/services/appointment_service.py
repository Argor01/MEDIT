from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time, timedelta
import uuid

from app.models.models import Appointment, Patient, Doctor
from app.schemas.schemas import AppointmentCreate, AppointmentUpdate, AppointmentStatusEnum


class AppointmentService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_appointments(
        self,
        skip: int = 0,
        limit: int = 100,
        patient_id: Optional[str] = None,
        doctor_id: Optional[str] = None,
        status: Optional[AppointmentStatusEnum] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ) -> List[Appointment]:
        """Получить список назначений с фильтрацией"""
        query = self.db.query(Appointment)
        
        if patient_id:
            query = query.filter(Appointment.patient_id == patient_id)
        
        if doctor_id:
            query = query.filter(Appointment.doctor_id == doctor_id)
        
        if status:
            query = query.filter(Appointment.status == status)
        
        if date_from:
            query = query.filter(Appointment.appointment_date >= date_from)
        
        if date_to:
            query = query.filter(Appointment.appointment_date <= date_to)
        
        return query.order_by(desc(Appointment.appointment_date)).offset(skip).limit(limit).all()
    
    def get_appointment(self, appointment_id: str) -> Optional[Appointment]:
        """Получить назначение по ID"""
        return self.db.query(Appointment).filter(
            Appointment.id == appointment_id
        ).first()
    
    def create_appointment(self, appointment_data: AppointmentCreate) -> Appointment:
        """Создать новое назначение"""
        appointment = Appointment(
            id=str(uuid.uuid4()),
            patient_id=appointment_data.patient_id,
            doctor_id=appointment_data.doctor_id,
            appointment_date=appointment_data.appointment_date,
            appointment_time=appointment_data.appointment_time,
            appointment_type=appointment_data.appointment_type,
            status=AppointmentStatusEnum.scheduled,
            notes=appointment_data.notes,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(appointment)
        self.db.commit()
        self.db.refresh(appointment)
        return appointment
    
    def update_appointment(self, appointment_id: str, appointment_data: AppointmentUpdate) -> Optional[Appointment]:
        """Обновить назначение"""
        appointment = self.get_appointment(appointment_id)
        if not appointment:
            return None
        
        update_data = appointment_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(appointment, field, value)
        
        appointment.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(appointment)
        return appointment
    
    def cancel_appointment(self, appointment_id: str) -> bool:
        """Отменить назначение"""
        appointment = self.get_appointment(appointment_id)
        if not appointment:
            return False
        
        appointment.status = AppointmentStatusEnum.cancelled
        appointment.updated_at = datetime.utcnow()
        
        self.db.commit()
        return True
    
    def update_appointment_status(self, appointment_id: str, status: AppointmentStatusEnum, notes: Optional[str] = None) -> Optional[Appointment]:
        """Обновить статус назначения"""
        appointment = self.get_appointment(appointment_id)
        if not appointment:
            return None
        
        appointment.status = status
        if notes:
            appointment.notes = notes
        appointment.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(appointment)
        return appointment
    
    def is_time_slot_taken(
        self,
        doctor_id: str,
        appointment_date: date,
        appointment_time: time,
        exclude_appointment_id: Optional[str] = None
    ) -> bool:
        """Проверить, занято ли время у врача"""
        query = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date == appointment_date,
                Appointment.appointment_time == appointment_time,
                Appointment.status.in_([AppointmentStatusEnum.scheduled, AppointmentStatusEnum.confirmed])
            )
        )
        
        if exclude_appointment_id:
            query = query.filter(Appointment.id != exclude_appointment_id)
        
        return query.first() is not None
    
    def get_available_slots(self, doctor_id: str, appointment_date: date) -> List[Dict[str, Any]]:
        """Получить доступные временные слоты для врача"""
        # Рабочие часы (можно вынести в настройки врача)
        work_start = time(9, 0)  # 9:00
        work_end = time(17, 0)   # 17:00
        slot_duration = 30       # 30 минут
        
        # Генерируем все возможные слоты
        available_slots = []
        current_time = datetime.combine(appointment_date, work_start)
        end_time = datetime.combine(appointment_date, work_end)
        
        while current_time < end_time:
            slot_time = current_time.time()
            
            # Проверяем, не занят ли слот
            if not self.is_time_slot_taken(doctor_id, appointment_date, slot_time):
                available_slots.append({
                    "time": slot_time.strftime("%H:%M"),
                    "available": True
                })
            else:
                available_slots.append({
                    "time": slot_time.strftime("%H:%M"),
                    "available": False
                })
            
            current_time += timedelta(minutes=slot_duration)
        
        return available_slots
    
    def get_upcoming_appointments(self, patient_id: str, limit: int = 10) -> List[Appointment]:
        """Получить предстоящие назначения пациента"""
        today = datetime.now().date()
        
        return self.db.query(Appointment).filter(
            and_(
                Appointment.patient_id == patient_id,
                Appointment.appointment_date >= today,
                Appointment.status == AppointmentStatusEnum.scheduled
            )
        ).order_by(Appointment.appointment_date, Appointment.appointment_time).limit(limit).all()
    
    def get_doctor_appointment_statistics(
        self,
        doctor_id: str,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None
    ) -> Dict[str, Any]:
        """Получить статистику назначений врача"""
        query = self.db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id
        )
        
        if date_from:
            query = query.filter(Appointment.appointment_date >= date_from)
        
        if date_to:
            query = query.filter(Appointment.appointment_date <= date_to)
        
        appointments = query.all()
        
        if not appointments:
            return {
                "total_appointments": 0,
                "completed": 0,
                "cancelled": 0,
                "scheduled": 0,
                "completion_rate": 0,
                "cancellation_rate": 0
            }
        
        total = len(appointments)
        completed = len([a for a in appointments if a.status == AppointmentStatusEnum.completed])
        cancelled = len([a for a in appointments if a.status == AppointmentStatusEnum.cancelled])
        scheduled = len([a for a in appointments if a.status == AppointmentStatusEnum.scheduled])
        confirmed = len([a for a in appointments if a.status == AppointmentStatusEnum.confirmed])
        
        return {
            "total_appointments": total,
            "completed": completed,
            "cancelled": cancelled,
            "scheduled": scheduled,
            "in_progress": in_progress,
            "completion_rate": round((completed / total * 100) if total > 0 else 0, 2),
            "cancellation_rate": round((cancelled / total * 100) if total > 0 else 0, 2),
            "date_range": {
                "from": date_from.isoformat() if date_from else None,
                "to": date_to.isoformat() if date_to else None
            }
        }
    
    def get_appointments_by_date_range(
        self,
        date_from: date,
        date_to: date,
        doctor_id: Optional[str] = None,
        patient_id: Optional[str] = None
    ) -> List[Appointment]:
        """Получить назначения за период"""
        query = self.db.query(Appointment).filter(
            and_(
                Appointment.appointment_date >= date_from,
                Appointment.appointment_date <= date_to
            )
        )
        
        if doctor_id:
            query = query.filter(Appointment.doctor_id == doctor_id)
        
        if patient_id:
            query = query.filter(Appointment.patient_id == patient_id)
        
        return query.order_by(Appointment.appointment_date, Appointment.appointment_time).all()
    
    def get_daily_schedule(self, doctor_id: str, appointment_date: date) -> List[Dict[str, Any]]:
        """Получить расписание врача на день"""
        appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date == appointment_date
            )
        ).order_by(Appointment.appointment_time).all()
        
        schedule = []
        for appointment in appointments:
            patient = self.db.query(Patient).filter(
                Patient.id == appointment.patient_id
            ).first()
            
            schedule.append({
                "appointment_id": appointment.id,
                "time": appointment.appointment_time.strftime("%H:%M"),
                "patient_name": f"{patient.first_name} {patient.last_name}" if patient else "Unknown",
                "patient_id": appointment.patient_id,
                "appointment_type": appointment.appointment_type,
                "status": appointment.status,
                "notes": appointment.notes
            })
        
        return schedule
    
    def get_appointment_conflicts(self, doctor_id: str, days_ahead: int = 7) -> List[Dict[str, Any]]:
        """Найти конфликты в расписании врача"""
        end_date = datetime.now().date() + timedelta(days=days_ahead)
        
        appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_date >= datetime.now().date(),
                Appointment.appointment_date <= end_date,
                Appointment.status.in_([AppointmentStatusEnum.scheduled, AppointmentStatusEnum.confirmed])
            )
        ).order_by(Appointment.appointment_date, Appointment.appointment_time).all()
        
        conflicts = []
        for i in range(len(appointments) - 1):
            current = appointments[i]
            next_appointment = appointments[i + 1]
            
            # Проверяем, если назначения в один день и время пересекается
            if (current.appointment_date == next_appointment.appointment_date and
                current.appointment_time == next_appointment.appointment_time):
                
                conflicts.append({
                    "date": current.appointment_date.isoformat(),
                    "time": current.appointment_time.strftime("%H:%M"),
                    "appointments": [
                        {
                            "id": current.id,
                            "patient_id": current.patient_id,
                            "type": current.appointment_type
                        },
                        {
                            "id": next_appointment.id,
                            "patient_id": next_appointment.patient_id,
                            "type": next_appointment.appointment_type
                        }
                    ]
                })
        
        return conflicts
    
    def patient_exists(self, patient_id: str) -> bool:
        """Проверить существование пациента"""
        return self.db.query(Patient).filter(
            and_(
                Patient.id == patient_id,
                Patient.is_deleted == False
            )
        ).first() is not None
    
    def doctor_exists(self, doctor_id: str) -> bool:
        """Проверить существование врача"""
        return self.db.query(Doctor).filter(
            and_(
                Doctor.id == doctor_id,
                Doctor.is_deleted == False
            )
        ).first() is not None
    
    def get_appointment_statistics_summary(self) -> Dict[str, Any]:
        """Получить общую статистику назначений"""
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Общее количество назначений
        total_appointments = self.db.query(Appointment).count()
        
        # Назначения за неделю
        week_appointments = self.db.query(Appointment).filter(
            Appointment.appointment_date >= week_ago
        ).count()
        
        # Назначения за месяц
        month_appointments = self.db.query(Appointment).filter(
            Appointment.appointment_date >= month_ago
        ).count()
        
        # Предстоящие назначения
        upcoming_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.appointment_date >= today,
                Appointment.status == AppointmentStatusEnum.scheduled
            )
        ).count()
        
        # Статистика по статусам
        status_stats = {}
        for status in AppointmentStatusEnum:
            count = self.db.query(Appointment).filter(
                Appointment.status == status
            ).count()
            status_stats[status.value] = count
        
        return {
            "total_appointments": total_appointments,
            "week_appointments": week_appointments,
            "month_appointments": month_appointments,
            "upcoming_appointments": upcoming_appointments,
            "status_distribution": status_stats,
            "generated_at": datetime.utcnow().isoformat()
        }