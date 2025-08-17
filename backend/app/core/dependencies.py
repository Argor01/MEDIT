from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.patient_service import PatientService
from app.services.doctor_service import DoctorService
from app.services.health_service import HealthService
from app.services.appointment_service import AppointmentService
from app.services.notification_service import NotificationService
from app.services.analytics_service import AnalyticsService
from app.services.organ_service import OrganService


def get_patient_service(db: Session = Depends(get_db)) -> PatientService:
    """Получить сервис для работы с пациентами"""
    return PatientService(db)


def get_doctor_service(db: Session = Depends(get_db)) -> DoctorService:
    """Получить сервис для работы с врачами"""
    return DoctorService(db)


def get_health_service(db: Session = Depends(get_db)) -> HealthService:
    """Получить сервис для работы с данными о здоровье"""
    return HealthService(db)


def get_appointment_service(db: Session = Depends(get_db)) -> AppointmentService:
    """Получить сервис для работы с назначениями"""
    return AppointmentService(db)


def get_notification_service(db: Session = Depends(get_db)) -> NotificationService:
    """Получить сервис для работы с уведомлениями"""
    return NotificationService(db)


def get_analytics_service(db: Session = Depends(get_db)) -> AnalyticsService:
    """Получить сервис для аналитики"""
    return AnalyticsService(db)


def get_organ_service(db: Session = Depends(get_db)) -> OrganService:
    """Получить сервис для работы с органами"""
    return OrganService(db)