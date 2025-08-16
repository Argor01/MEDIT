from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.models import Patient as PatientModel
from app.schemas.schemas import Patient, PatientCreate, PatientUpdate, ApiResponse
from app.services.patient_service import PatientService

router = APIRouter()


@router.get("/", response_model=List[Patient])
async def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить список всех пациентов с возможностью поиска и пагинации
    """
    service = PatientService(db)
    
    if search:
        patients = service.search_patients(search, skip, limit)
    else:
        patients = service.get_patients(skip, limit)
    
    return patients


@router.get("/{patient_id}", response_model=Patient)
async def get_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить информацию о конкретном пациенте
    """
    service = PatientService(db)
    patient = service.get_patient(patient_id)
    
    if not patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    return patient


@router.post("/", response_model=Patient)
async def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db)
):
    """
    Создать нового пациента
    """
    service = PatientService(db)
    
    # Проверяем, не существует ли уже пациент с таким email
    existing_patient = service.get_patient_by_email(patient_data.email)
    if existing_patient:
        raise HTTPException(
            status_code=400, 
            detail="Пациент с таким email уже существует"
        )
    
    patient = service.create_patient(patient_data)
    return patient


@router.put("/{patient_id}", response_model=Patient)
async def update_patient(
    patient_id: str,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить информацию о пациенте
    """
    service = PatientService(db)
    
    # Проверяем, существует ли пациент
    existing_patient = service.get_patient(patient_id)
    if not existing_patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    # Если обновляется email, проверяем уникальность
    if patient_data.email:
        email_patient = service.get_patient_by_email(patient_data.email)
        if email_patient and email_patient.id != patient_id:
            raise HTTPException(
                status_code=400,
                detail="Пациент с таким email уже существует"
            )
    
    patient = service.update_patient(patient_id, patient_data)
    return patient


@router.delete("/{patient_id}", response_model=ApiResponse)
async def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Удалить пациента (мягкое удаление - устанавливает is_active = False)
    """
    service = PatientService(db)
    
    # Проверяем, существует ли пациент
    existing_patient = service.get_patient(patient_id)
    if not existing_patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    success = service.delete_patient(patient_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Пациент успешно удален"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при удалении пациента"
        )


@router.get("/{patient_id}/medical-history", response_model=List[dict])
async def get_patient_medical_history(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить медицинскую историю пациента
    """
    service = PatientService(db)
    
    # Проверяем, существует ли пациент
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    medical_history = service.get_patient_medical_history(patient_id)
    return medical_history


@router.get("/{patient_id}/appointments", response_model=List[dict])
async def get_patient_appointments(
    patient_id: str,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить назначения пациента
    """
    service = PatientService(db)
    
    # Проверяем, существует ли пациент
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    appointments = service.get_patient_appointments(patient_id, status)
    return appointments


@router.get("/{patient_id}/health-data", response_model=List[dict])
async def get_patient_health_data(
    patient_id: str,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Получить последние показатели здоровья пациента
    """
    service = PatientService(db)
    
    # Проверяем, существует ли пациент
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    health_data = service.get_patient_health_data(patient_id, limit)
    return health_data


@router.get("/{patient_id}/statistics", response_model=dict)
async def get_patient_statistics(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить статистику по пациенту
    """
    service = PatientService(db)
    
    # Проверяем, существует ли пациент
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Пациент не найден")
    
    statistics = service.get_patient_statistics(patient_id)
    return statistics