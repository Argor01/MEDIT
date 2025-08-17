from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# Базовые схемы
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True


# Enums
class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class AppointmentTypeEnum(str, Enum):
    consultation = "consultation"
    checkup = "checkup"
    follow_up = "follow-up"
    emergency = "emergency"


class AppointmentStatusEnum(str, Enum):
    scheduled = "scheduled"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


class NotificationTypeEnum(str, Enum):
    info = "info"
    warning = "warning"
    error = "error"
    success = "success"
    appointment_reminder = "appointment_reminder"
    health_alert = "health_alert"
    medication_reminder = "medication_reminder"
    test_results = "test_results"
    system = "system"


class NotificationPriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class ResearchStatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"


class HealthMetric(str, Enum):
    heart_rate = "heart_rate"
    blood_pressure_systolic = "blood_pressure_systolic"
    blood_pressure_diastolic = "blood_pressure_diastolic"
    blood_sugar = "blood_sugar"
    cholesterol = "cholesterol"
    bmi = "bmi"
    oxygen_saturation = "oxygen_saturation"
    body_temperature = "body_temperature"
    respiratory_rate = "respiratory_rate"


# Схемы для пациентов
class PatientBase(BaseSchema):
    first_name: str
    last_name: str
    date_of_birth: str
    gender: GenderEnum
    email: EmailStr
    phone: str
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    allergies: Optional[List[str]] = []
    blood_type: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseSchema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[GenderEnum] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    allergies: Optional[List[str]] = None
    blood_type: Optional[str] = None


class Patient(PatientBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool


# Схемы для врачей
class DoctorBase(BaseSchema):
    first_name: str
    last_name: str
    specialization: str
    email: EmailStr
    phone: str
    license_number: str
    experience: Optional[int] = 0
    rating: Optional[float] = 0.0
    avatar: Optional[str] = None


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseSchema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    specialization: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    license_number: Optional[str] = None
    experience: Optional[int] = None
    rating: Optional[float] = None
    avatar: Optional[str] = None


class Doctor(DoctorBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool


# Схемы для показателей здоровья
class HealthDataBase(BaseSchema):
    heart_rate: Optional[int] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    temperature: Optional[float] = None
    oxygen_saturation: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    bmi: Optional[float] = None


class HealthDataCreate(HealthDataBase):
    patient_id: str


class HealthDataUpdate(HealthDataBase):
    pass


class HealthData(HealthDataBase):
    id: str
    patient_id: str
    recorded_at: datetime
    created_at: datetime


# Схемы для назначений
class AppointmentBase(BaseSchema):
    patient_id: str
    doctor_id: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    duration: Optional[int] = 30
    type: AppointmentTypeEnum
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseSchema):
    date: Optional[str] = None
    time: Optional[str] = None
    duration: Optional[int] = None
    type: Optional[AppointmentTypeEnum] = None
    status: Optional[AppointmentStatusEnum] = None
    notes: Optional[str] = None


class Appointment(AppointmentBase):
    id: str
    status: AppointmentStatusEnum
    created_at: datetime
    updated_at: Optional[datetime] = None
    patient: Optional[Patient] = None
    doctor: Optional[Doctor] = None


# Схемы для медицинских записей
class MedicalRecordBase(BaseSchema):
    patient_id: str
    doctor_id: str
    date: datetime
    diagnosis: str
    symptoms: Optional[List[str]] = []
    treatment: Optional[str] = None
    medications: Optional[List[Dict[str, Any]]] = []
    follow_up: Optional[str] = None


class MedicalRecordCreate(MedicalRecordBase):
    pass


class MedicalRecordUpdate(BaseSchema):
    diagnosis: Optional[str] = None
    symptoms: Optional[List[str]] = None
    treatment: Optional[str] = None
    medications: Optional[List[Dict[str, Any]]] = None
    follow_up: Optional[str] = None


class MedicalRecord(MedicalRecordBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    patient: Optional[Patient] = None
    doctor: Optional[Doctor] = None


# Схемы для органов
class OrganBase(BaseSchema):
    name: str
    label: str
    description: Optional[str] = None
    position_x: float
    position_y: float
    width: float
    height: float
    normal_function: Optional[str] = None
    common_diseases: Optional[List[str]] = []
    health_tips: Optional[List[str]] = []


class OrganCreate(OrganBase):
    id: str


class OrganUpdate(BaseSchema):
    name: Optional[str] = None
    label: Optional[str] = None
    description: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    normal_function: Optional[str] = None
    common_diseases: Optional[List[str]] = None
    health_tips: Optional[List[str]] = None


class Organ(OrganBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool


# Схемы для уведомлений
class NotificationBase(BaseSchema):
    title: str
    message: str
    type: NotificationTypeEnum
    recipient_id: str
    recipient_type: str  # patient, doctor


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseSchema):
    title: Optional[str] = None
    message: Optional[str] = None
    type: Optional[NotificationTypeEnum] = None
    is_read: Optional[bool] = None


class Notification(NotificationBase):
    id: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None


# Схемы для исследований
class ResearchItemBase(BaseSchema):
    patient_id: str
    title: str
    type: str  # blood, urine, xray, mri, ct, ultrasound
    results: Optional[str] = None
    file_url: Optional[str] = None


class ResearchItemCreate(ResearchItemBase):
    pass


class ResearchItemUpdate(BaseSchema):
    title: Optional[str] = None
    type: Optional[str] = None
    status: Optional[ResearchStatusEnum] = None
    results: Optional[str] = None
    file_url: Optional[str] = None


class ResearchItem(ResearchItemBase):
    id: str
    status: ResearchStatusEnum
    date_ordered: datetime
    date_completed: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


# Схемы для ответов API
class ApiResponse(BaseSchema):
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None


# Схемы для аналитики
class HealthAnalytics(BaseSchema):
    patient_id: str
    period: str
    heart_rate_avg: Optional[float] = None
    blood_pressure_avg: Optional[Dict[str, float]] = None
    temperature_avg: Optional[float] = None
    oxygen_saturation_avg: Optional[float] = None
    trends: Optional[Dict[str, Any]] = None


class PatientStatistics(BaseSchema):
    total_patients: int
    active_patients: int
    new_patients_this_month: int
    appointments_today: int
    critical_alerts: int


# Схемы для поиска
class SearchQuery(BaseSchema):
    query: str
    limit: Optional[int] = 10
    offset: Optional[int] = 0


class SearchResults(BaseSchema):
    query: str
    total: int
    results: List[Any]