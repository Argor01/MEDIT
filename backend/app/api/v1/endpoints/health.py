from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database.database import get_db
from app.schemas.schemas import HealthData, HealthDataCreate, HealthDataUpdate, ApiResponse
from app.services.health_service import HealthService

router = APIRouter()


@router.get("/{patient_id}", response_model=HealthData)
async def get_latest_health_data(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить последние показатели здоровья пациента
    """
    service = HealthService(db)
    health_data = service.get_latest_health_data(patient_id)
    
    if not health_data:
        # Если нет данных, возвращаем базовые показатели
        return {
            "id": "temp",
            "patient_id": patient_id,
            "heart_rate": 72,
            "blood_pressure_systolic": 120,
            "blood_pressure_diastolic": 80,
            "temperature": 36.6,
            "oxygen_saturation": 98,
            "recorded_at": datetime.now(),
            "created_at": datetime.now()
        }
    
    return health_data


@router.get("/{patient_id}/history", response_model=List[HealthData])
async def get_health_data_history(
    patient_id: str,
    days: int = Query(7, ge=1, le=365),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """
    Получить историю показателей здоровья пациента
    """
    service = HealthService(db)
    
    start_date = datetime.now() - timedelta(days=days)
    health_data = service.get_health_data_history(patient_id, start_date, limit)
    
    return health_data


@router.post("/", response_model=HealthData)
async def create_health_data(
    health_data: HealthDataCreate,
    db: Session = Depends(get_db)
):
    """
    Добавить новые показатели здоровья
    """
    service = HealthService(db)
    
    # Валидация показателей
    validation_result = service.validate_health_data(health_data)
    if not validation_result["valid"]:
        raise HTTPException(
            status_code=400,
            detail=f"Некорректные показатели здоровья: {validation_result['errors']}"
        )
    
    new_health_data = service.create_health_data(health_data)
    
    # Проверяем критические показатели и создаем уведомления при необходимости
    critical_alerts = service.check_critical_values(new_health_data)
    if critical_alerts:
        # Здесь можно добавить логику отправки уведомлений
        pass
    
    return new_health_data


@router.put("/{health_data_id}", response_model=HealthData)
async def update_health_data(
    health_data_id: str,
    health_data: HealthDataUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить показатели здоровья
    """
    service = HealthService(db)
    
    # Проверяем, существуют ли данные
    existing_data = service.get_health_data_by_id(health_data_id)
    if not existing_data:
        raise HTTPException(status_code=404, detail="Данные о здоровье не найдены")
    
    updated_data = service.update_health_data(health_data_id, health_data)
    return updated_data


@router.delete("/{health_data_id}", response_model=ApiResponse)
async def delete_health_data(
    health_data_id: str,
    db: Session = Depends(get_db)
):
    """
    Удалить запись о показателях здоровья
    """
    service = HealthService(db)
    
    # Проверяем, существуют ли данные
    existing_data = service.get_health_data_by_id(health_data_id)
    if not existing_data:
        raise HTTPException(status_code=404, detail="Данные о здоровье не найдены")
    
    success = service.delete_health_data(health_data_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Данные о здоровье успешно удалены"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при удалении данных о здоровье"
        )


@router.get("/{patient_id}/analytics", response_model=dict)
async def get_health_analytics(
    patient_id: str,
    period: str = Query("7d", regex="^(1d|7d|30d|90d|1y)$"),
    db: Session = Depends(get_db)
):
    """
    Получить аналитику показателей здоровья
    """
    service = HealthService(db)
    
    # Определяем период
    period_days = {
        "1d": 1,
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365
    }
    
    days = period_days.get(period, 7)
    start_date = datetime.now() - timedelta(days=days)
    
    analytics = service.get_health_analytics(patient_id, start_date)
    return analytics


@router.get("/{patient_id}/trends", response_model=dict)
async def get_health_trends(
    patient_id: str,
    metric: str = Query("heart_rate", regex="^(heart_rate|blood_pressure|temperature|oxygen_saturation)$"),
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Получить тренды конкретного показателя здоровья
    """
    service = HealthService(db)
    
    start_date = datetime.now() - timedelta(days=days)
    trends = service.get_health_trends(patient_id, metric, start_date)
    
    return trends


@router.get("/{patient_id}/alerts", response_model=List[dict])
async def get_health_alerts(
    patient_id: str,
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Получить предупреждения о здоровье пациента
    """
    service = HealthService(db)
    alerts = service.get_health_alerts(patient_id, active_only)
    
    return alerts


@router.post("/{patient_id}/simulate", response_model=HealthData)
async def simulate_health_data(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Симулировать новые показатели здоровья (для демонстрации)
    """
    service = HealthService(db)
    
    # Получаем последние показатели или используем базовые
    latest_data = service.get_latest_health_data(patient_id)
    
    simulated_data = service.simulate_health_data(patient_id, latest_data)
    new_health_data = service.create_health_data(simulated_data)
    
    return new_health_data


@router.get("/{patient_id}/status", response_model=dict)
async def get_health_status(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить общий статус здоровья пациента
    """
    service = HealthService(db)
    
    latest_data = service.get_latest_health_data(patient_id)
    if not latest_data:
        return {
            "status": "unknown",
            "message": "Нет данных о здоровье",
            "last_update": None
        }
    
    status = service.calculate_health_status(latest_data)
    return status