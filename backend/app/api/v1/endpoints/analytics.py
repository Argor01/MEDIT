from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta

from app.database.database import get_db
from app.schemas.schemas import HealthAnalytics, PatientStatistics
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/health/{patient_id}", response_model=HealthAnalytics)
async def get_health_analytics(
    patient_id: str,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Получить аналитику здоровья пациента
    """
    service = AnalyticsService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    analytics = service.get_health_analytics(patient_id, days)
    return analytics


@router.get("/patient/{patient_id}/statistics", response_model=PatientStatistics)
async def get_patient_statistics(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить общую статистику пациента
    """
    service = AnalyticsService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    statistics = service.get_patient_statistics(patient_id)
    return statistics


@router.get("/trends/{patient_id}/{metric}", response_model=List[dict])
async def get_health_trends(
    patient_id: str,
    metric: str,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Получить тренды конкретной метрики здоровья
    """
    service = AnalyticsService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    # Проверяем валидность метрики
    valid_metrics = [
        'heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic',
        'temperature', 'weight', 'height', 'blood_sugar', 'oxygen_saturation'
    ]
    
    if metric not in valid_metrics:
        raise HTTPException(
            status_code=400,
            detail=f"Недопустимая метрика. Доступные: {', '.join(valid_metrics)}"
        )
    
    trends = service.get_health_trends(patient_id, metric, days)
    return trends


@router.get("/dashboard/overview", response_model=dict)
async def get_dashboard_overview(
    db: Session = Depends(get_db)
):
    """
    Получить общий обзор для дашборда
    """
    service = AnalyticsService(db)
    overview = service.get_dashboard_overview()
    return overview


@router.get("/alerts/critical", response_model=List[dict])
async def get_critical_alerts(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Получить критические уведомления
    """
    service = AnalyticsService(db)
    alerts = service.get_critical_alerts(limit)
    return alerts


@router.get("/patients/risk-assessment", response_model=List[dict])
async def get_patients_risk_assessment(
    risk_level: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    Получить оценку рисков пациентов
    """
    service = AnalyticsService(db)
    
    if risk_level and risk_level not in ['low', 'medium', 'high', 'critical']:
        raise HTTPException(
            status_code=400,
            detail="Недопустимый уровень риска. Доступные: low, medium, high, critical"
        )
    
    risk_assessment = service.get_patients_risk_assessment(risk_level, limit)
    return risk_assessment


@router.get("/appointments/statistics", response_model=dict)
async def get_appointment_statistics(
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    doctor_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить статистику назначений
    """
    service = AnalyticsService(db)
    
    # Устанавливаем дефолтные даты если не указаны
    if not date_from:
        date_from = datetime.now().date() - timedelta(days=30)
    if not date_to:
        date_to = datetime.now().date()
    
    if date_from > date_to:
        raise HTTPException(
            status_code=400,
            detail="Дата начала не может быть больше даты окончания"
        )
    
    statistics = service.get_appointment_statistics(date_from, date_to, doctor_id)
    return statistics


@router.get("/health-metrics/summary", response_model=dict)
async def get_health_metrics_summary(
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить сводку по метрикам здоровья
    """
    service = AnalyticsService(db)
    
    # Устанавливаем дефолтные даты если не указаны
    if not date_from:
        date_from = datetime.now().date() - timedelta(days=30)
    if not date_to:
        date_to = datetime.now().date()
    
    if date_from > date_to:
        raise HTTPException(
            status_code=400,
            detail="Дата начала не может быть больше даты окончания"
        )
    
    summary = service.get_health_metrics_summary(date_from, date_to)
    return summary


@router.get("/organs/health-status", response_model=List[dict])
async def get_organs_health_status(
    patient_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить статус здоровья органов
    """
    service = AnalyticsService(db)
    
    if patient_id and not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    organs_status = service.get_organs_health_status(patient_id)
    return organs_status


@router.get("/predictions/{patient_id}", response_model=dict)
async def get_health_predictions(
    patient_id: str,
    days_ahead: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db)
):
    """
    Получить прогнозы здоровья пациента
    """
    service = AnalyticsService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    predictions = service.get_health_predictions(patient_id, days_ahead)
    return predictions


@router.get("/reports/monthly", response_model=dict)
async def get_monthly_report(
    year: int = Query(..., ge=2020, le=2030),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db)
):
    """
    Получить месячный отчет
    """
    service = AnalyticsService(db)
    
    try:
        report_date = date(year, month, 1)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Недопустимая дата"
        )
    
    if report_date > datetime.now().date():
        raise HTTPException(
            status_code=400,
            detail="Нельзя получить отчет для будущего месяца"
        )
    
    report = service.get_monthly_report(year, month)
    return report


@router.get("/export/patient-data/{patient_id}", response_model=dict)
async def export_patient_data(
    patient_id: str,
    format: str = Query("json", regex="^(json|csv|pdf)$"),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Экспортировать данные пациента
    """
    service = AnalyticsService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    # Устанавливаем дефолтные даты если не указаны
    if not date_from:
        date_from = datetime.now().date() - timedelta(days=365)
    if not date_to:
        date_to = datetime.now().date()
    
    if date_from > date_to:
        raise HTTPException(
            status_code=400,
            detail="Дата начала не может быть больше даты окончания"
        )
    
    export_data = service.export_patient_data(
        patient_id, format, date_from, date_to
    )
    return export_data