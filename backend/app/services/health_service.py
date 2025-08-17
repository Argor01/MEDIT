from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import statistics

from app.models.models import HealthData, Patient, Notification
from app.schemas.schemas import HealthDataCreate, HealthDataUpdate, NotificationTypeEnum


class HealthService:
    def __init__(self, db: Session):
        self.db = db
        
        # Нормальные диапазоны для различных показателей
        self.normal_ranges = {
            "heart_rate": {"min": 60, "max": 100},
            "blood_pressure_systolic": {"min": 90, "max": 140},
            "blood_pressure_diastolic": {"min": 60, "max": 90},
            "temperature": {"min": 36.1, "max": 37.2},
            "weight": {"min": 40, "max": 200},
            "blood_sugar": {"min": 70, "max": 140},
            "oxygen_saturation": {"min": 95, "max": 100}
        }
        
        # Критические значения
        self.critical_ranges = {
            "heart_rate": {"min": 40, "max": 150},
            "blood_pressure_systolic": {"min": 70, "max": 180},
            "blood_pressure_diastolic": {"min": 40, "max": 110},
            "temperature": {"min": 35.0, "max": 39.0},
            "blood_sugar": {"min": 50, "max": 250},
            "oxygen_saturation": {"min": 90, "max": 100}
        }
    
    def get_latest_health_data(self, patient_id: str) -> Optional[HealthData]:
        """Получить последние данные о здоровье пациента"""
        return self.db.query(HealthData).filter(
            HealthData.patient_id == patient_id
        ).order_by(desc(HealthData.recorded_at)).first()
    
    def get_health_history(self, patient_id: str, days: int = 30, limit: int = 100) -> List[HealthData]:
        """Получить историю данных о здоровье"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        return self.db.query(HealthData).filter(
            and_(
                HealthData.patient_id == patient_id,
                HealthData.recorded_at >= cutoff_date
            )
        ).order_by(desc(HealthData.recorded_at)).limit(limit).all()
    
    def create_health_data(self, health_data: HealthDataCreate) -> HealthData:
        """Создать новую запись о здоровье"""
        health_record = HealthData(
            id=str(uuid.uuid4()),
            patient_id=health_data.patient_id,
            heart_rate=health_data.heart_rate,
            blood_pressure_systolic=health_data.blood_pressure_systolic,
            blood_pressure_diastolic=health_data.blood_pressure_diastolic,
            temperature=health_data.temperature,
            weight=health_data.weight,
            height=health_data.height,
            blood_sugar=health_data.blood_sugar,
            oxygen_saturation=health_data.oxygen_saturation,
            notes=health_data.notes,
            recorded_at=health_data.recorded_at or datetime.utcnow()
        )
        
        self.db.add(health_record)
        self.db.commit()
        self.db.refresh(health_record)
        
        # Проверяем критические значения и создаем уведомления
        self._check_critical_values(health_record)
        
        return health_record
    
    def update_health_data(self, health_id: str, health_data: HealthDataUpdate) -> Optional[HealthData]:
        """Обновить данные о здоровье"""
        health_record = self.db.query(HealthData).filter(
            HealthData.id == health_id
        ).first()
        
        if not health_record:
            return None
        
        update_data = health_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(health_record, field, value)
        
        self.db.commit()
        self.db.refresh(health_record)
        
        # Проверяем критические значения после обновления
        self._check_critical_values(health_record)
        
        return health_record
    
    def delete_health_data(self, health_id: str) -> bool:
        """Удалить данные о здоровье"""
        health_record = self.db.query(HealthData).filter(
            HealthData.id == health_id
        ).first()
        
        if not health_record:
            return False
        
        self.db.delete(health_record)
        self.db.commit()
        return True
    
    def get_health_analytics(self, patient_id: str, days: int = 30) -> Dict[str, Any]:
        """Получить аналитику здоровья пациента"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        health_records = self.db.query(HealthData).filter(
            and_(
                HealthData.patient_id == patient_id,
                HealthData.recorded_at >= cutoff_date
            )
        ).order_by(HealthData.recorded_at).all()
        
        if not health_records:
            return {"message": "Нет данных за указанный период"}
        
        analytics = {
            "period_days": days,
            "total_records": len(health_records),
            "date_range": {
                "start": health_records[0].recorded_at.isoformat(),
                "end": health_records[-1].recorded_at.isoformat()
            },
            "metrics": {}
        }
        
        # Анализируем каждую метрику
        metrics = [
            "heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic",
            "temperature", "weight", "blood_sugar", "oxygen_saturation"
        ]
        
        for metric in metrics:
            values = [getattr(record, metric) for record in health_records if getattr(record, metric) is not None]
            
            if values:
                analytics["metrics"][metric] = {
                    "average": round(statistics.mean(values), 2),
                    "min": min(values),
                    "max": max(values),
                    "latest": values[-1],
                    "trend": self._calculate_trend(values),
                    "normal_range": self.normal_ranges.get(metric, {}),
                    "status": self._get_metric_status(values[-1], metric)
                }
        
        # Общий статус здоровья
        analytics["overall_status"] = self._calculate_overall_status(analytics["metrics"])
        
        return analytics
    
    def get_health_trends(self, patient_id: str, metric: str, days: int = 30) -> List[Dict[str, Any]]:
        """Получить тренды конкретной метрики"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        health_records = self.db.query(HealthData).filter(
            and_(
                HealthData.patient_id == patient_id,
                HealthData.recorded_at >= cutoff_date
            )
        ).order_by(HealthData.recorded_at).all()
        
        trends = []
        for record in health_records:
            value = getattr(record, metric)
            if value is not None:
                trends.append({
                    "date": record.recorded_at.isoformat(),
                    "value": value,
                    "status": self._get_metric_status(value, metric)
                })
        
        return trends
    
    def get_health_alerts(self, patient_id: str, days: int = 7) -> List[Dict[str, Any]]:
        """Получить уведомления о здоровье"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        health_records = self.db.query(HealthData).filter(
            and_(
                HealthData.patient_id == patient_id,
                HealthData.recorded_at >= cutoff_date
            )
        ).order_by(desc(HealthData.recorded_at)).all()
        
        alerts = []
        for record in health_records:
            record_alerts = self._check_values_for_alerts(record)
            alerts.extend(record_alerts)
        
        return alerts
    
    def simulate_health_data(self, patient_id: str, days: int = 30) -> List[HealthData]:
        """Симулировать данные о здоровье для тестирования"""
        import random
        
        simulated_data = []
        base_date = datetime.utcnow() - timedelta(days=days)
        
        for i in range(days):
            record_date = base_date + timedelta(days=i)
            
            # Генерируем случайные, но реалистичные значения
            health_data = HealthDataCreate(
                patient_id=patient_id,
                heart_rate=random.randint(60, 100),
                blood_pressure_systolic=random.randint(110, 140),
                blood_pressure_diastolic=random.randint(70, 90),
                temperature=round(random.uniform(36.2, 37.0), 1),
                weight=round(random.uniform(60, 80), 1),
                blood_sugar=random.randint(80, 120),
                oxygen_saturation=random.randint(96, 100),
                recorded_at=record_date
            )
            
            record = self.create_health_data(health_data)
            simulated_data.append(record)
        
        return simulated_data
    
    def get_health_status(self, patient_id: str) -> Dict[str, Any]:
        """Получить общий статус здоровья пациента"""
        latest_data = self.get_latest_health_data(patient_id)
        
        if not latest_data:
            return {
                "status": "no_data",
                "message": "Нет данных о здоровье",
                "last_update": None
            }
        
        # Проверяем все показатели
        status_scores = []
        alerts = []
        
        metrics = [
            "heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic",
            "temperature", "blood_sugar", "oxygen_saturation"
        ]
        
        for metric in metrics:
            value = getattr(latest_data, metric)
            if value is not None:
                status = self._get_metric_status(value, metric)
                if status == "critical":
                    status_scores.append(0)
                    alerts.append(f"{metric}: критическое значение {value}")
                elif status == "warning":
                    status_scores.append(1)
                    alerts.append(f"{metric}: значение вне нормы {value}")
                else:
                    status_scores.append(2)
        
        if not status_scores:
            overall_status = "no_data"
        elif min(status_scores) == 0:
            overall_status = "critical"
        elif min(status_scores) == 1:
            overall_status = "warning"
        else:
            overall_status = "good"
        
        return {
            "status": overall_status,
            "last_update": latest_data.recorded_at.isoformat(),
            "alerts": alerts,
            "metrics_checked": len(status_scores),
            "score": round(sum(status_scores) / len(status_scores) * 50, 1) if status_scores else 0
        }
    
    def _check_critical_values(self, health_record: HealthData):
        """Проверить критические значения и создать уведомления"""
        alerts = self._check_values_for_alerts(health_record)
        
        for alert in alerts:
            if alert["severity"] == "critical":
                # Создаем критическое уведомление
                notification = Notification(
                    id=str(uuid.uuid4()),
                    patient_id=health_record.patient_id,
                    title="Критическое значение показателя здоровья",
                    message=alert["message"],
                    notification_type=NotificationTypeEnum.health_alert,
                    priority="high",
                    is_read=False,
                    created_at=datetime.utcnow()
                )
                
                self.db.add(notification)
        
        self.db.commit()
    
    def _check_values_for_alerts(self, health_record: HealthData) -> List[Dict[str, Any]]:
        """Проверить значения на предмет создания уведомлений"""
        alerts = []
        
        metrics = [
            "heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic",
            "temperature", "blood_sugar", "oxygen_saturation"
        ]
        
        for metric in metrics:
            value = getattr(health_record, metric)
            if value is not None:
                status = self._get_metric_status(value, metric)
                
                if status in ["warning", "critical"]:
                    alerts.append({
                        "metric": metric,
                        "value": value,
                        "severity": status,
                        "message": f"{metric.replace('_', ' ').title()}: {value} - {status}",
                        "recorded_at": health_record.recorded_at.isoformat()
                    })
        
        return alerts
    
    def _get_metric_status(self, value: float, metric: str) -> str:
        """Определить статус метрики"""
        if metric not in self.normal_ranges:
            return "unknown"
        
        normal_range = self.normal_ranges[metric]
        critical_range = self.critical_ranges.get(metric, {})
        
        # Проверяем критические значения
        if critical_range:
            if value < critical_range["min"] or value > critical_range["max"]:
                return "critical"
        
        # Проверяем нормальные значения
        if value < normal_range["min"] or value > normal_range["max"]:
            return "warning"
        
        return "normal"
    
    def _calculate_trend(self, values: List[float]) -> str:
        """Вычислить тренд значений"""
        if len(values) < 2:
            return "stable"
        
        # Простой расчет тренда по первому и последнему значению
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]
        
        first_avg = statistics.mean(first_half)
        second_avg = statistics.mean(second_half)
        
        change_percent = ((second_avg - first_avg) / first_avg) * 100
        
        if change_percent > 5:
            return "increasing"
        elif change_percent < -5:
            return "decreasing"
        else:
            return "stable"
    
    def _calculate_overall_status(self, metrics: Dict[str, Any]) -> str:
        """Вычислить общий статус здоровья"""
        if not metrics:
            return "no_data"
        
        statuses = [metric_data["status"] for metric_data in metrics.values()]
        
        if "critical" in statuses:
            return "critical"
        elif "warning" in statuses:
            return "warning"
        else:
            return "good"
    
    def patient_exists(self, patient_id: str) -> bool:
        """Проверить существование пациента"""
        return self.db.query(Patient).filter(
            and_(
                Patient.id == patient_id,
                Patient.is_deleted == False
            )
        ).first() is not None