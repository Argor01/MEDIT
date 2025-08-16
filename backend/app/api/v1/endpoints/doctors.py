from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.schemas import Doctor, DoctorCreate, DoctorUpdate, ApiResponse
from app.services.doctor_service import DoctorService

router = APIRouter()


@router.get("/", response_model=List[Doctor])
async def get_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    specialization: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить список всех врачей
    """
    service = DoctorService(db)
    
    if search:
        doctors = service.search_doctors(search, skip, limit)
    elif specialization:
        doctors = service.get_doctors_by_specialization(specialization, skip, limit)
    else:
        doctors = service.get_doctors(skip, limit)
    
    return doctors


@router.get("/{doctor_id}", response_model=Doctor)
async def get_doctor(
    doctor_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить информацию о конкретном враче
    """
    service = DoctorService(db)
    doctor = service.get_doctor(doctor_id)
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Врач не найден")
    
    return doctor


@router.post("/", response_model=Doctor)
async def create_doctor(
    doctor_data: DoctorCreate,
    db: Session = Depends(get_db)
):
    """
    Создать нового врача
    """
    service = DoctorService(db)
    
    # Проверяем уникальность email
    existing_doctor = service.get_doctor_by_email(doctor_data.email)
    if existing_doctor:
        raise HTTPException(
            status_code=400,
            detail="Врач с таким email уже существует"
        )
    
    # Проверяем уникальность номера лицензии
    existing_license = service.get_doctor_by_license(doctor_data.license_number)
    if existing_license:
        raise HTTPException(
            status_code=400,
            detail="Врач с таким номером лицензии уже существует"
        )
    
    doctor = service.create_doctor(doctor_data)
    return doctor


@router.put("/{doctor_id}", response_model=Doctor)
async def update_doctor(
    doctor_id: str,
    doctor_data: DoctorUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить информацию о враче
    """
    service = DoctorService(db)
    
    # Проверяем, существует ли врач
    existing_doctor = service.get_doctor(doctor_id)
    if not existing_doctor:
        raise HTTPException(status_code=404, detail="Врач не найден")
    
    # Проверяем уникальность email при обновлении
    if doctor_data.email:
        email_doctor = service.get_doctor_by_email(doctor_data.email)
        if email_doctor and email_doctor.id != doctor_id:
            raise HTTPException(
                status_code=400,
                detail="Врач с таким email уже существует"
            )
    
    # Проверяем уникальность лицензии при обновлении
    if doctor_data.license_number:
        license_doctor = service.get_doctor_by_license(doctor_data.license_number)
        if license_doctor and license_doctor.id != doctor_id:
            raise HTTPException(
                status_code=400,
                detail="Врач с таким номером лицензии уже существует"
            )
    
    doctor = service.update_doctor(doctor_id, doctor_data)
    return doctor


@router.delete("/{doctor_id}", response_model=ApiResponse)
async def delete_doctor(
    doctor_id: str,
    db: Session = Depends(get_db)
):
    """
    Удалить врача
    """
    service = DoctorService(db)
    
    # Проверяем, существует ли врач
    existing_doctor = service.get_doctor(doctor_id)
    if not existing_doctor:
        raise HTTPException(status_code=404, detail="Врач не найден")
    
    success = service.delete_doctor(doctor_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Врач успешно удален"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при удалении врача"
        )


@router.get("/specializations/list", response_model=List[str])
async def get_specializations(
    db: Session = Depends(get_db)
):
    """
    Получить список всех специализаций
    """
    service = DoctorService(db)
    specializations = service.get_specializations()
    return specializations


@router.get("/{doctor_id}/appointments", response_model=List[dict])
async def get_doctor_appointments(
    doctor_id: str,
    status: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить назначения врача
    """
    service = DoctorService(db)
    
    # Проверяем, существует ли врач
    doctor = service.get_doctor(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Врач не найден")
    
    appointments = service.get_doctor_appointments(doctor_id, status, date)
    return appointments


@router.get("/{doctor_id}/patients", response_model=List[dict])
async def get_doctor_patients(
    doctor_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить пациентов врача
    """
    service = DoctorService(db)
    
    # Проверяем, существует ли врач
    doctor = service.get_doctor(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Врач не найден")
    
    patients = service.get_doctor_patients(doctor_id)
    return patients


@router.get("/{doctor_id}/statistics", response_model=dict)
async def get_doctor_statistics(
    doctor_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить статистику врача
    """
    service = DoctorService(db)
    
    # Проверяем, существует ли врач
    doctor = service.get_doctor(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Врач не найден")
    
    statistics = service.get_doctor_statistics(doctor_id)
    return statistics