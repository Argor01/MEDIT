from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base
import uuid


class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(String(10), nullable=False)  # YYYY-MM-DD
    gender = Column(String(10), nullable=False)  # male, female, other
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text)
    
    # Экстренный контакт
    emergency_contact_name = Column(String(200))
    emergency_contact_phone = Column(String(20))
    emergency_contact_relationship = Column(String(50))
    
    # Медицинская информация
    allergies = Column(JSON)  # Список аллергий
    blood_type = Column(String(5))  # A+, B-, O+, etc.
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Связи
    medical_records = relationship("MedicalRecord", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")
    health_data = relationship("HealthData", back_populates="patient")


class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    license_number = Column(String(50), unique=True, nullable=False)
    experience = Column(Integer, default=0)  # Годы опыта
    rating = Column(Float, default=0.0)
    avatar = Column(String(500))  # URL аватара
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Связи
    medical_records = relationship("MedicalRecord", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")


class MedicalRecord(Base):
    __tablename__ = "medical_records"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=False)
    
    date = Column(DateTime(timezone=True), nullable=False)
    diagnosis = Column(Text, nullable=False)
    symptoms = Column(JSON)  # Список симптомов
    treatment = Column(Text)
    medications = Column(JSON)  # Список лекарств
    follow_up = Column(Text)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")


class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=False)
    
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    time = Column(String(5), nullable=False)   # HH:MM
    duration = Column(Integer, default=30)     # Минуты
    
    type = Column(String(50), nullable=False)  # consultation, checkup, follow-up, emergency
    status = Column(String(20), default="scheduled")  # scheduled, confirmed, completed, cancelled
    
    notes = Column(Text)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")


class HealthData(Base):
    __tablename__ = "health_data"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    
    # Показатели здоровья
    heart_rate = Column(Integer)  # уд/мин
    blood_pressure_systolic = Column(Integer)  # мм рт.ст.
    blood_pressure_diastolic = Column(Integer)  # мм рт.ст.
    temperature = Column(Float)  # °C
    oxygen_saturation = Column(Integer)  # %
    
    # Дополнительные показатели
    weight = Column(Float)  # кг
    height = Column(Float)  # см
    bmi = Column(Float)  # Индекс массы тела
    
    # Метаданные
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Связи
    patient = relationship("Patient", back_populates="health_data")


class Organ(Base):
    __tablename__ = "organs"
    
    id = Column(String, primary_key=True)
    name = Column(String(100), nullable=False)
    label = Column(String(100), nullable=False)
    description = Column(Text)
    
    # Позиция на изображении
    position_x = Column(Float, nullable=False)
    position_y = Column(Float, nullable=False)
    
    # Размер области
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    
    # Медицинская информация
    normal_function = Column(Text)
    common_diseases = Column(JSON)
    health_tips = Column(JSON)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)


class Medication(Base):
    __tablename__ = "medications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    generic_name = Column(String(200))
    dosage_form = Column(String(50))  # tablet, capsule, liquid, injection
    strength = Column(String(50))  # 500mg, 10ml, etc.
    manufacturer = Column(String(200))
    
    # Инструкции
    instructions = Column(Text)
    side_effects = Column(JSON)
    contraindications = Column(JSON)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(20), nullable=False)  # info, warning, error, success
    
    # Получатель (может быть пациент или врач)
    recipient_id = Column(String, nullable=False)
    recipient_type = Column(String(20), nullable=False)  # patient, doctor
    
    # Статус
    is_read = Column(Boolean, default=False)
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))


class ResearchItem(Base):
    __tablename__ = "research_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # blood, urine, xray, mri, ct, ultrasound
    status = Column(String(20), default="pending")  # pending, in-progress, completed
    
    date_ordered = Column(DateTime(timezone=True), server_default=func.now())
    date_completed = Column(DateTime(timezone=True))
    
    results = Column(Text)
    file_url = Column(String(500))  # URL файла с результатами
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    patient = relationship("Patient")