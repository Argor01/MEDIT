from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid

from app.models.models import Notification, Patient, Doctor, Appointment
from app.schemas.schemas import NotificationCreate, NotificationUpdate, NotificationTypeEnum, NotificationPriorityEnum


class NotificationService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_notifications(
        self,
        patient_id: str,
        skip: int = 0,
        limit: int = 50,
        unread_only: bool = False,
        notification_type: Optional[NotificationTypeEnum] = None
    ) -> List[Notification]:
        """Получить уведомления пациента"""
        query = self.db.query(Notification).filter(
            Notification.patient_id == patient_id
        )
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        if notification_type:
            query = query.filter(Notification.type == notification_type)
        
        return query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()
    
    def get_notification(self, notification_id: str) -> Optional[Notification]:
        """Получить уведомление по ID"""
        return self.db.query(Notification).filter(
            Notification.id == notification_id
        ).first()
    
    def create_notification(self, notification_data: NotificationCreate) -> Notification:
        """Создать новое уведомление"""
        notification = Notification(
            id=str(uuid.uuid4()),
            patient_id=notification_data.patient_id,
            title=notification_data.title,
            message=notification_data.message,
            type=notification_data.type,
            priority=notification_data.priority,
            is_read=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification
    
    def update_notification(self, notification_id: str, notification_data: NotificationUpdate) -> Optional[Notification]:
        """Обновить уведомление"""
        notification = self.get_notification(notification_id)
        if not notification:
            return None
        
        update_data = notification_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(notification, field, value)
        
        notification.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(notification)
        return notification
    
    def delete_notification(self, notification_id: str) -> bool:
        """Удалить уведомление"""
        notification = self.get_notification(notification_id)
        if not notification:
            return False
        
        self.db.delete(notification)
        self.db.commit()
        return True
    
    def mark_as_read(self, notification_id: str) -> bool:
        """Отметить уведомление как прочитанное"""
        notification = self.get_notification(notification_id)
        if not notification:
            return False
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        notification.updated_at = datetime.utcnow()
        
        self.db.commit()
        return True
    
    def mark_all_as_read(self, patient_id: str) -> int:
        """Отметить все уведомления пациента как прочитанные"""
        updated_count = self.db.query(Notification).filter(
            and_(
                Notification.patient_id == patient_id,
                Notification.is_read == False
            )
        ).update({
            "is_read": True,
            "read_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        self.db.commit()
        return updated_count
    
    def get_unread_notifications(self, patient_id: str) -> List[Notification]:
        """Получить непрочитанные уведомления"""
        return self.db.query(Notification).filter(
            and_(
                Notification.patient_id == patient_id,
                Notification.is_read == False
            )
        ).order_by(desc(Notification.created_at)).all()
    
    def get_unread_count(self, patient_id: str) -> int:
        """Получить количество непрочитанных уведомлений"""
        return self.db.query(Notification).filter(
            and_(
                Notification.patient_id == patient_id,
                Notification.is_read == False
            )
        ).count()
    
    def get_notification_count(self, patient_id: str) -> Dict[str, int]:
        """Получить статистику уведомлений пациента"""
        total = self.db.query(Notification).filter(
            Notification.patient_id == patient_id
        ).count()
        
        unread = self.get_unread_count(patient_id)
        read = total - unread
        
        # Статистика по типам
        type_stats = {}
        for notification_type in NotificationTypeEnum:
            count = self.db.query(Notification).filter(
                and_(
                    Notification.patient_id == patient_id,
                    Notification.type == notification_type
                )
            ).count()
            type_stats[notification_type.value] = count
        
        # Статистика по приоритетам
        priority_stats = {}
        for priority in NotificationPriorityEnum:
            count = self.db.query(Notification).filter(
                and_(
                    Notification.patient_id == patient_id,
                    Notification.priority == priority
                )
            ).count()
            priority_stats[priority.value] = count
        
        return {
            "total": total,
            "unread": unread,
            "read": read,
            "by_type": type_stats,
            "by_priority": priority_stats
        }
    
    def send_appointment_reminder(self, appointment_id: str, hours_before: int = 24) -> Optional[Notification]:
        """Отправить напоминание о назначении"""
        appointment = self.db.query(Appointment).filter(
            Appointment.id == appointment_id
        ).first()
        
        if not appointment:
            return None
        
        # Проверяем, что назначение в будущем
        appointment_datetime = datetime.combine(
            appointment.appointment_date,
            appointment.appointment_time
        )
        
        if appointment_datetime <= datetime.now():
            return None
        
        # Получаем информацию о враче
        doctor = self.db.query(Doctor).filter(
            Doctor.id == appointment.doctor_id
        ).first()
        
        doctor_name = f"Dr. {doctor.first_name} {doctor.last_name}" if doctor else "врачом"
        
        notification_data = NotificationCreate(
            patient_id=appointment.patient_id,
            title="Напоминание о приеме",
            message=f"У вас назначен прием с {doctor_name} на {appointment.appointment_date.strftime('%d.%m.%Y')} в {appointment.appointment_time.strftime('%H:%M')}",
            type=NotificationTypeEnum.appointment_reminder,
            priority=NotificationPriorityEnum.medium
        )
        
        return self.create_notification(notification_data)
    
    def send_health_alert(self, patient_id: str, metric_name: str, value: float, critical_range: str) -> Notification:
        """Отправить предупреждение о критических показателях здоровья"""
        notification_data = NotificationCreate(
            patient_id=patient_id,
            title="Критические показатели здоровья",
            message=f"Внимание! Показатель '{metric_name}' имеет критическое значение: {value}. Нормальный диапазон: {critical_range}. Рекомендуется обратиться к врачу.",
            type=NotificationTypeEnum.health_alert,
            priority=NotificationPriorityEnum.high
        )
        
        return self.create_notification(notification_data)
    
    def send_medication_reminder(self, patient_id: str, medication_name: str, dosage: str, time: str) -> Notification:
        """Отправить напоминание о приеме лекарств"""
        notification_data = NotificationCreate(
            patient_id=patient_id,
            title="Напоминание о приеме лекарств",
            message=f"Время принять лекарство: {medication_name}, дозировка: {dosage}. Время приема: {time}",
            type=NotificationTypeEnum.medication_reminder,
            priority=NotificationPriorityEnum.medium
        )
        
        return self.create_notification(notification_data)
    
    def send_test_result_notification(self, patient_id: str, test_name: str, result_summary: str) -> Notification:
        """Отправить уведомление о результатах анализов"""
        notification_data = NotificationCreate(
            patient_id=patient_id,
            title="Результаты анализов готовы",
            message=f"Готовы результаты анализа: {test_name}. {result_summary}",
            type=NotificationTypeEnum.test_results,
            priority=NotificationPriorityEnum.medium
        )
        
        return self.create_notification(notification_data)
    
    def send_system_notification(self, patient_id: str, title: str, message: str, priority: NotificationPriorityEnum = NotificationPriorityEnum.low) -> Notification:
        """Отправить системное уведомление"""
        notification_data = NotificationCreate(
            patient_id=patient_id,
            title=title,
            message=message,
            type=NotificationTypeEnum.system,
            priority=priority
        )
        
        return self.create_notification(notification_data)
    
    def cleanup_old_notifications(self, days_old: int = 30) -> int:
        """Очистить старые уведомления"""
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        
        # Удаляем только прочитанные уведомления старше указанного срока
        deleted_count = self.db.query(Notification).filter(
            and_(
                Notification.created_at < cutoff_date,
                Notification.is_read == True
            )
        ).delete()
        
        self.db.commit()
        return deleted_count
    
    def get_notifications_by_priority(self, patient_id: str, priority: NotificationPriorityEnum) -> List[Notification]:
        """Получить уведомления по приоритету"""
        return self.db.query(Notification).filter(
            and_(
                Notification.patient_id == patient_id,
                Notification.priority == priority
            )
        ).order_by(desc(Notification.created_at)).all()
    
    def get_notifications_by_type(self, patient_id: str, notification_type: NotificationTypeEnum) -> List[Notification]:
        """Получить уведомления по типу"""
        return self.db.query(Notification).filter(
            and_(
                Notification.patient_id == patient_id,
                Notification.type == notification_type
            )
        ).order_by(desc(Notification.created_at)).all()
    
    def get_recent_notifications(self, patient_id: str, hours: int = 24) -> List[Notification]:
        """Получить недавние уведомления"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        return self.db.query(Notification).filter(
            and_(
                Notification.patient_id == patient_id,
                Notification.created_at >= cutoff_time
            )
        ).order_by(desc(Notification.created_at)).all()
    
    def bulk_create_notifications(self, notifications_data: List[NotificationCreate]) -> List[Notification]:
        """Массовое создание уведомлений"""
        notifications = []
        
        for notification_data in notifications_data:
            notification = Notification(
                id=str(uuid.uuid4()),
                patient_id=notification_data.patient_id,
                title=notification_data.title,
                message=notification_data.message,
                type=notification_data.type,
                priority=notification_data.priority,
                is_read=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            notifications.append(notification)
        
        self.db.add_all(notifications)
        self.db.commit()
        
        for notification in notifications:
            self.db.refresh(notification)
        
        return notifications
    
    def get_notification_statistics(self) -> Dict[str, Any]:
        """Получить общую статистику уведомлений"""
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Общее количество уведомлений
        total_notifications = self.db.query(Notification).count()
        
        # Уведомления за неделю
        week_notifications = self.db.query(Notification).filter(
            Notification.created_at >= datetime.combine(week_ago, datetime.min.time())
        ).count()
        
        # Уведомления за месяц
        month_notifications = self.db.query(Notification).filter(
            Notification.created_at >= datetime.combine(month_ago, datetime.min.time())
        ).count()
        
        # Непрочитанные уведомления
        unread_notifications = self.db.query(Notification).filter(
            Notification.is_read == False
        ).count()
        
        # Статистика по типам
        type_stats = {}
        for notification_type in NotificationTypeEnum:
            count = self.db.query(Notification).filter(
                Notification.type == notification_type
            ).count()
            type_stats[notification_type.value] = count
        
        # Статистика по приоритетам
        priority_stats = {}
        for priority in NotificationPriorityEnum:
            count = self.db.query(Notification).filter(
                Notification.priority == priority
            ).count()
            priority_stats[priority.value] = count
        
        return {
            "total_notifications": total_notifications,
            "week_notifications": week_notifications,
            "month_notifications": month_notifications,
            "unread_notifications": unread_notifications,
            "read_rate": round(((total_notifications - unread_notifications) / total_notifications * 100) if total_notifications > 0 else 0, 2),
            "type_distribution": type_stats,
            "priority_distribution": priority_stats,
            "generated_at": datetime.utcnow().isoformat()
        }
    
    def patient_exists(self, patient_id: str) -> bool:
        """Проверить существование пациента"""
        return self.db.query(Patient).filter(
            and_(
                Patient.id == patient_id,
                Patient.is_deleted == False
            )
        ).first() is not None