from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from app.database.database import get_db
from app.schemas.schemas import (
    Appointment, AppointmentCreate, AppointmentUpdate, 
    ApiResponse, AppointmentStatusEnum
)
from app.services.appointment_service import AppointmentService

router = APIRouter()


@router.get("/", response_model=List[Appointment])
async def get_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    patient_id: Optional[str] = Query(None),
    doctor_id: Optional[str] = Query(None),
    status: Optional[AppointmentStatusEnum] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить список назначений с фильтрацией
    """
    service = AppointmentService(db)
    
    appointments = service.get_appointments(
        skip=skip,
        limit=limit,
        patient_id=patient_id,
        doctor_id=doctor_id,
        status=status,
        date_from=date_from,
        date_to=date_to
    )
    
    return appointments


@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(
    appointment_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить информацию о конкретном назначении
    """
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Назначение не найдено")
    
    return appointment


@router.post("/", response_model=Appointment)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новое назначение
    """
    service = AppointmentService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(appointment_data.patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    # Проверяем, что врач существует
    if not service.doctor_exists(appointment_data.doctor_id):
        raise HTTPException(
            status_code=404,
            detail="Врач не найден"
        )
    
    # Проверяем доступность времени
    if service.is_time_slot_taken(
        appointment_data.doctor_id,
        appointment_data.appointment_date,
        appointment_data.appointment_time
    ):
        raise HTTPException(
            status_code=400,
            detail="Это время уже занято"
        )
    
    # Проверяем, что время назначения в будущем
    appointment_datetime = datetime.combine(
        appointment_data.appointment_date,
        appointment_data.appointment_time
    )
    
    if appointment_datetime <= datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Время назначения должно быть в будущем"
        )
    
    appointment = service.create_appointment(appointment_data)
    return appointment


@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(
    appointment_id: str,
    appointment_data: AppointmentUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить назначение
    """
    service = AppointmentService(db)
    
    # Проверяем, существует ли назначение
    existing_appointment = service.get_appointment(appointment_id)
    if not existing_appointment:
        raise HTTPException(status_code=404, detail="Назначение не найдено")
    
    # Если обновляется время, проверяем доступность
    if (appointment_data.appointment_date or appointment_data.appointment_time):
        new_date = appointment_data.appointment_date or existing_appointment.appointment_date
        new_time = appointment_data.appointment_time or existing_appointment.appointment_time
        doctor_id = appointment_data.doctor_id or existing_appointment.doctor_id
        
        if service.is_time_slot_taken(doctor_id, new_date, new_time, appointment_id):
            raise HTTPException(
                status_code=400,
                detail="Это время уже занято"
            )
    
    appointment = service.update_appointment(appointment_id, appointment_data)
    return appointment


@router.delete("/{appointment_id}", response_model=ApiResponse)
async def cancel_appointment(
    appointment_id: str,
    db: Session = Depends(get_db)
):
    """
    Отменить назначение
    """
    service = AppointmentService(db)
    
    # Проверяем, существует ли назначение
    existing_appointment = service.get_appointment(appointment_id)
    if not existing_appointment:
        raise HTTPException(status_code=404, detail="Назначение не найдено")
    
    success = service.cancel_appointment(appointment_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Назначение успешно отменено"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при отмене назначения"
        )


@router.patch("/{appointment_id}/status", response_model=Appointment)
async def update_appointment_status(
    appointment_id: str,
    status: AppointmentStatusEnum,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Обновить статус назначения
    """
    service = AppointmentService(db)
    
    # Проверяем, существует ли назначение
    existing_appointment = service.get_appointment(appointment_id)
    if not existing_appointment:
        raise HTTPException(status_code=404, detail="Назначение не найдено")
    
    appointment = service.update_appointment_status(appointment_id, status, notes)
    return appointment


@router.get("/available-slots/{doctor_id}", response_model=List[dict])
async def get_available_slots(
    doctor_id: str,
    date: date,
    db: Session = Depends(get_db)
):
    """
    Получить доступные временные слоты для врача на определенную дату
    """
    service = AppointmentService(db)
    
    # Проверяем, что врач существует
    if not service.doctor_exists(doctor_id):
        raise HTTPException(
            status_code=404,
            detail="Врач не найден"
        )
    
    # Проверяем, что дата не в прошлом
    if date < datetime.now().date():
        raise HTTPException(
            status_code=400,
            detail="Нельзя получить слоты для прошедшей даты"
        )
    
    available_slots = service.get_available_slots(doctor_id, date)
    return available_slots


@router.get("/upcoming/{patient_id}", response_model=List[Appointment])
async def get_upcoming_appointments(
    patient_id: str,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Получить предстоящие назначения пациента
    """
    service = AppointmentService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    appointments = service.get_upcoming_appointments(patient_id, limit)
    return appointments


@router.get("/statistics/doctor/{doctor_id}", response_model=dict)
async def get_doctor_appointment_statistics(
    doctor_id: str,
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить статистику назначений врача
    """
    service = AppointmentService(db)
    
    # Проверяем, что врач существует
    if not service.doctor_exists(doctor_id):
        raise HTTPException(
            status_code=404,
            detail="Врач не найден"
        )
    
    statistics = service.get_doctor_appointment_statistics(
        doctor_id, date_from, date_to
    )
    return statistics