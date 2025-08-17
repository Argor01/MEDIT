from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.schemas import (
    Notification, NotificationCreate, NotificationUpdate,
    ApiResponse, NotificationTypeEnum
)
from app.services.notification_service import NotificationService

router = APIRouter()


@router.get("/", response_model=List[Notification])
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    patient_id: Optional[str] = Query(None),
    notification_type: Optional[NotificationTypeEnum] = Query(None),
    is_read: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить список уведомлений с фильтрацией
    """
    service = NotificationService(db)
    
    notifications = service.get_notifications(
        skip=skip,
        limit=limit,
        patient_id=patient_id,
        notification_type=notification_type,
        is_read=is_read
    )
    
    return notifications


@router.get("/{notification_id}", response_model=Notification)
async def get_notification(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить конкретное уведомление
    """
    service = NotificationService(db)
    notification = service.get_notification(notification_id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")
    
    return notification


@router.post("/", response_model=Notification)
async def create_notification(
    notification_data: NotificationCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новое уведомление
    """
    service = NotificationService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(notification_data.patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    notification = service.create_notification(notification_data)
    return notification


@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    notification_id: str,
    notification_data: NotificationUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить уведомление
    """
    service = NotificationService(db)
    
    # Проверяем, существует ли уведомление
    existing_notification = service.get_notification(notification_id)
    if not existing_notification:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")
    
    notification = service.update_notification(notification_id, notification_data)
    return notification


@router.delete("/{notification_id}", response_model=ApiResponse)
async def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """
    Удалить уведомление
    """
    service = NotificationService(db)
    
    # Проверяем, существует ли уведомление
    existing_notification = service.get_notification(notification_id)
    if not existing_notification:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")
    
    success = service.delete_notification(notification_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Уведомление успешно удалено"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при удалении уведомления"
        )


@router.patch("/{notification_id}/read", response_model=Notification)
async def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """
    Отметить уведомление как прочитанное
    """
    service = NotificationService(db)
    
    # Проверяем, существует ли уведомление
    existing_notification = service.get_notification(notification_id)
    if not existing_notification:
        raise HTTPException(status_code=404, detail="Уведомление не найдено")
    
    notification = service.mark_as_read(notification_id)
    return notification


@router.patch("/patient/{patient_id}/read-all", response_model=ApiResponse)
async def mark_all_notifications_as_read(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Отметить все уведомления пациента как прочитанные
    """
    service = NotificationService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    count = service.mark_all_as_read(patient_id)
    
    return ApiResponse(
        success=True,
        message=f"Отмечено как прочитанное {count} уведомлений"
    )


@router.get("/patient/{patient_id}/unread", response_model=List[Notification])
async def get_unread_notifications(
    patient_id: str,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Получить непрочитанные уведомления пациента
    """
    service = NotificationService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    notifications = service.get_unread_notifications(patient_id, limit)
    return notifications


@router.get("/patient/{patient_id}/count", response_model=dict)
async def get_notification_count(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить количество уведомлений пациента
    """
    service = NotificationService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    count_data = service.get_notification_count(patient_id)
    return count_data


@router.post("/send-reminder", response_model=ApiResponse)
async def send_appointment_reminder(
    appointment_id: str,
    db: Session = Depends(get_db)
):
    """
    Отправить напоминание о назначении
    """
    service = NotificationService(db)
    
    # Проверяем, что назначение существует
    if not service.appointment_exists(appointment_id):
        raise HTTPException(
            status_code=404,
            detail="Назначение не найдено"
        )
    
    success = service.send_appointment_reminder(appointment_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Напоминание отправлено"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при отправке напоминания"
        )


@router.post("/send-health-alert", response_model=ApiResponse)
async def send_health_alert(
    patient_id: str,
    message: str,
    priority: str = "medium",
    db: Session = Depends(get_db)
):
    """
    Отправить уведомление о здоровье
    """
    service = NotificationService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    success = service.send_health_alert(patient_id, message, priority)
    
    if success:
        return ApiResponse(
            success=True,
            message="Уведомление о здоровье отправлено"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при отправке уведомления"
        )


@router.delete("/patient/{patient_id}/cleanup", response_model=ApiResponse)
async def cleanup_old_notifications(
    patient_id: str,
    days_old: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Очистить старые уведомления пациента
    """
    service = NotificationService(db)
    
    # Проверяем, что пациент существует
    if not service.patient_exists(patient_id):
        raise HTTPException(
            status_code=404,
            detail="Пациент не найден"
        )
    
    deleted_count = service.cleanup_old_notifications(patient_id, days_old)
    
    return ApiResponse(
        success=True,
        message=f"Удалено {deleted_count} старых уведомлений"
    )