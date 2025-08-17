from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func, extract
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, date, timedelta
import statistics
from collections import defaultdict

from app.models.models import Patient, Doctor, Appointment, HealthData, Organ
from app.schemas.schemas import AppointmentStatusEnum, HealthMetric
from app.services.health_service import HealthService


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.health_service = HealthService(db)
    
    def get_patient_health_analytics(self, patient_id: str, days: int = 30) -> Dict[str, Any]:
        """Получить аналитику здоровья пациента"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Получаем данные о здоровье за период
        health_data = self.db.query(HealthData).filter(
            and_(
                HealthData.patient_id == patient_id,
                HealthData.recorded_at >= datetime.combine(start_date, datetime.min.time()),
                HealthData.recorded_at <= datetime.combine(end_date, datetime.max.time())
            )
        ).order_by(HealthData.recorded_at).all()
        
        if not health_data:
            return {
                "patient_id": patient_id,
                "period_days": days,
                "total_records": 0,
                "metrics_summary": {},
                "trends": {},
                "health_score": 0,
                "recommendations": []
            }
        
        # Группируем данные по метрикам
        metrics_data = defaultdict(list)
        for record in health_data:
            metrics_data[record.metric].append({
                "value": record.value,
                "date": record.recorded_at.date(),
                "unit": record.unit
            })
        
        # Анализируем каждую метрику
        metrics_summary = {}
        trends = {}
        
        for metric, values in metrics_data.items():
            metric_values = [v["value"] for v in values]
            
            metrics_summary[metric.value] = {
                "count": len(metric_values),
                "latest_value": metric_values[-1],
                "average": round(statistics.mean(metric_values), 2),
                "min": min(metric_values),
                "max": max(metric_values),
                "unit": values[0]["unit"]
            }
            
            # Анализ тренда
            if len(metric_values) >= 2:
                trend = self._calculate_trend(metric_values)
                trends[metric.value] = trend
        
        # Расчет общего показателя здоровья
        health_score = self._calculate_health_score(metrics_data)
        
        # Генерация рекомендаций
        recommendations = self._generate_recommendations(metrics_data)
        
        return {
            "patient_id": patient_id,
            "period_days": days,
            "total_records": len(health_data),
            "metrics_summary": metrics_summary,
            "trends": trends,
            "health_score": health_score,
            "recommendations": recommendations,
            "analysis_date": datetime.now().isoformat()
        }
    
    def get_patient_statistics(self) -> Dict[str, Any]:
        """Получить общую статистику пациентов"""
        total_patients = self.db.query(Patient).filter(
            Patient.is_deleted == False
        ).count()
        
        # Статистика по полу
        gender_stats = self.db.query(
            Patient.gender,
            func.count(Patient.id)
        ).filter(
            Patient.is_deleted == False
        ).group_by(Patient.gender).all()
        
        # Статистика по возрастным группам
        current_year = datetime.now().year
        age_groups = {
            "0-18": 0,
            "19-30": 0,
            "31-50": 0,
            "51-70": 0,
            "70+": 0
        }
        
        patients = self.db.query(Patient).filter(
            Patient.is_deleted == False
        ).all()
        
        for patient in patients:
            if patient.date_of_birth:
                age = current_year - patient.date_of_birth.year
                if age <= 18:
                    age_groups["0-18"] += 1
                elif age <= 30:
                    age_groups["19-30"] += 1
                elif age <= 50:
                    age_groups["31-50"] += 1
                elif age <= 70:
                    age_groups["51-70"] += 1
                else:
                    age_groups["70+"] += 1
        
        # Новые пациенты за последние 30 дней
        thirty_days_ago = datetime.now() - timedelta(days=30)
        new_patients = self.db.query(Patient).filter(
            and_(
                Patient.created_at >= thirty_days_ago,
                Patient.is_deleted == False
            )
        ).count()
        
        return {
            "total_patients": total_patients,
            "new_patients_30_days": new_patients,
            "gender_distribution": dict(gender_stats),
            "age_distribution": age_groups,
            "generated_at": datetime.now().isoformat()
        }
    
    def get_health_metrics_trends(
        self,
        metric: HealthMetric,
        days: int = 30,
        patient_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Получить тренды по конкретной метрике здоровья"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        query = self.db.query(HealthData).filter(
            and_(
                HealthData.metric == metric,
                HealthData.recorded_at >= datetime.combine(start_date, datetime.min.time()),
                HealthData.recorded_at <= datetime.combine(end_date, datetime.max.time())
            )
        )
        
        if patient_id:
            query = query.filter(HealthData.patient_id == patient_id)
        
        health_data = query.order_by(HealthData.recorded_at).all()
        
        if not health_data:
            return {
                "metric": metric.value,
                "period_days": days,
                "total_records": 0,
                "trend_data": [],
                "statistics": {}
            }
        
        # Группируем данные по дням
        daily_data = defaultdict(list)
        for record in health_data:
            day = record.recorded_at.date()
            daily_data[day].append(record.value)
        
        # Создаем тренд данные
        trend_data = []
        for day in sorted(daily_data.keys()):
            values = daily_data[day]
            trend_data.append({
                "date": day.isoformat(),
                "average_value": round(statistics.mean(values), 2),
                "min_value": min(values),
                "max_value": max(values),
                "count": len(values)
            })
        
        # Статистика
        all_values = [record.value for record in health_data]
        statistics_data = {
            "total_records": len(all_values),
            "average": round(statistics.mean(all_values), 2),
            "median": round(statistics.median(all_values), 2),
            "min": min(all_values),
            "max": max(all_values),
            "std_deviation": round(statistics.stdev(all_values) if len(all_values) > 1 else 0, 2)
        }
        
        return {
            "metric": metric.value,
            "period_days": days,
            "total_records": len(health_data),
            "trend_data": trend_data,
            "statistics": statistics_data,
            "generated_at": datetime.now().isoformat()
        }
    
    def get_dashboard_overview(self) -> Dict[str, Any]:
        """Получить обзор для дашборда"""
        today = datetime.now().date()
        
        # Общие счетчики
        total_patients = self.db.query(Patient).filter(
            Patient.is_deleted == False
        ).count()
        
        total_doctors = self.db.query(Doctor).filter(
            Doctor.is_deleted == False
        ).count()
        
        # Назначения на сегодня
        today_appointments = self.db.query(Appointment).filter(
            and_(
                Appointment.appointment_date == today,
                Appointment.status.in_([AppointmentStatusEnum.scheduled, AppointmentStatusEnum.confirmed])
            )
        ).count()
        
        # Критические показатели здоровья за последние 24 часа
        yesterday = datetime.now() - timedelta(days=1)
        critical_health_records = self.db.query(HealthData).filter(
            HealthData.recorded_at >= yesterday
        ).all()
        
        critical_count = 0
        for record in critical_health_records:
            if self.health_service._is_critical_value(record.metric, record.value):
                critical_count += 1
        
        # Статистика назначений за неделю
        week_ago = today - timedelta(days=7)
        week_appointments = self.db.query(Appointment).filter(
            Appointment.appointment_date >= week_ago
        ).count()
        
        # Новые пациенты за месяц
        month_ago = datetime.now() - timedelta(days=30)
        new_patients = self.db.query(Patient).filter(
            and_(
                Patient.created_at >= month_ago,
                Patient.is_deleted == False
            )
        ).count()
        
        return {
            "overview": {
                "total_patients": total_patients,
                "total_doctors": total_doctors,
                "today_appointments": today_appointments,
                "critical_health_alerts": critical_count,
                "week_appointments": week_appointments,
                "new_patients_month": new_patients
            },
            "generated_at": datetime.now().isoformat()
        }
    
    def get_critical_alerts(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Получить критические предупреждения"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        health_data = self.db.query(HealthData).filter(
            HealthData.recorded_at >= cutoff_time
        ).order_by(desc(HealthData.recorded_at)).all()
        
        alerts = []
        for record in health_data:
            if self.health_service._is_critical_value(record.metric, record.value):
                patient = self.db.query(Patient).filter(
                    Patient.id == record.patient_id
                ).first()
                
                normal_range = self.health_service.normal_ranges.get(record.metric, "Неизвестно")
                
                alerts.append({
                    "patient_id": record.patient_id,
                    "patient_name": f"{patient.first_name} {patient.last_name}" if patient else "Unknown",
                    "metric": record.metric.value,
                    "value": record.value,
                    "unit": record.unit,
                    "normal_range": normal_range,
                    "recorded_at": record.recorded_at.isoformat(),
                    "severity": "critical"
                })
        
        return alerts
    
    def get_patient_risk_assessment(self, patient_id: str) -> Dict[str, Any]:
        """Получить оценку рисков пациента"""
        # Получаем последние данные о здоровье
        latest_data = self.health_service.get_latest_health_data(patient_id)
        
        if not latest_data:
            return {
                "patient_id": patient_id,
                "risk_level": "unknown",
                "risk_factors": [],
                "recommendations": ["Необходимо провести обследование"]
            }
        
        risk_factors = []
        risk_score = 0
        
        # Анализируем каждую метрику
        for data in latest_data:
            metric = data.metric
            value = data.value
            
            # Проверяем критические значения
            if self.health_service._is_critical_value(metric, value):
                risk_factors.append({
                    "metric": metric.value,
                    "value": value,
                    "severity": "high",
                    "description": f"Критическое значение {metric.value}: {value}"
                })
                risk_score += 3
            
            # Проверяем пограничные значения
            elif self._is_borderline_value(metric, value):
                risk_factors.append({
                    "metric": metric.value,
                    "value": value,
                    "severity": "medium",
                    "description": f"Пограничное значение {metric.value}: {value}"
                })
                risk_score += 1
        
        # Определяем уровень риска
        if risk_score >= 6:
            risk_level = "high"
        elif risk_score >= 3:
            risk_level = "medium"
        elif risk_score >= 1:
            risk_level = "low"
        else:
            risk_level = "minimal"
        
        # Генерируем рекомендации
        recommendations = self._generate_risk_recommendations(risk_level, risk_factors)
        
        return {
            "patient_id": patient_id,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "assessment_date": datetime.now().isoformat()
        }
    
    def get_appointment_statistics(self, days: int = 30) -> Dict[str, Any]:
        """Получить статистику назначений"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        appointments = self.db.query(Appointment).filter(
            Appointment.appointment_date >= start_date
        ).all()
        
        # Статистика по статусам
        status_stats = {}
        for status in AppointmentStatusEnum:
            count = len([a for a in appointments if a.status == status])
            status_stats[status.value] = count
        
        # Статистика по дням недели
        weekday_stats = defaultdict(int)
        for appointment in appointments:
            weekday = appointment.appointment_date.strftime('%A')
            weekday_stats[weekday] += 1
        
        # Статистика по часам
        hour_stats = defaultdict(int)
        for appointment in appointments:
            hour = appointment.appointment_time.hour
            hour_stats[f"{hour:02d}:00"] += 1
        
        return {
            "period_days": days,
            "total_appointments": len(appointments),
            "status_distribution": status_stats,
            "weekday_distribution": dict(weekday_stats),
            "hour_distribution": dict(hour_stats),
            "generated_at": datetime.now().isoformat()
        }
    
    def _calculate_trend(self, values: List[float]) -> Dict[str, Any]:
        """Рассчитать тренд для списка значений"""
        if len(values) < 2:
            return {"direction": "stable", "change_percent": 0}
        
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]
        
        first_avg = statistics.mean(first_half)
        second_avg = statistics.mean(second_half)
        
        if first_avg == 0:
            change_percent = 0
        else:
            change_percent = ((second_avg - first_avg) / first_avg) * 100
        
        if abs(change_percent) < 5:
            direction = "stable"
        elif change_percent > 0:
            direction = "increasing"
        else:
            direction = "decreasing"
        
        return {
            "direction": direction,
            "change_percent": round(change_percent, 2)
        }
    
    def _calculate_health_score(self, metrics_data: Dict) -> int:
        """Рассчитать общий показатель здоровья (0-100)"""
        if not metrics_data:
            return 0
        
        total_score = 0
        metric_count = 0
        
        for metric, values in metrics_data.items():
            latest_value = values[-1]["value"]
            
            # Получаем оценку для метрики (0-100)
            metric_score = self._get_metric_score(metric, latest_value)
            total_score += metric_score
            metric_count += 1
        
        return round(total_score / metric_count) if metric_count > 0 else 0
    
    def _get_metric_score(self, metric: HealthMetric, value: float) -> int:
        """Получить оценку для конкретной метрики (0-100)"""
        # Упрощенная логика оценки
        if self.health_service._is_critical_value(metric, value):
            return 30  # Критическое значение
        elif self._is_borderline_value(metric, value):
            return 70  # Пограничное значение
        else:
            return 90  # Нормальное значение
    
    def _is_borderline_value(self, metric: HealthMetric, value: float) -> bool:
        """Проверить, является ли значение пограничным"""
        # Упрощенная логика для пограничных значений
        borderline_ranges = {
            HealthMetric.blood_pressure_systolic: (130, 139),
            HealthMetric.blood_pressure_diastolic: (80, 89),
            HealthMetric.heart_rate: (100, 110),
            HealthMetric.blood_sugar: (100, 125),
            HealthMetric.cholesterol: (200, 239),
            HealthMetric.bmi: (25, 29.9)
        }
        
        if metric in borderline_ranges:
            min_val, max_val = borderline_ranges[metric]
            return min_val <= value <= max_val
        
        return False
    
    def _generate_recommendations(self, metrics_data: Dict) -> List[str]:
        """Генерировать рекомендации на основе данных о здоровье"""
        recommendations = []
        
        for metric, values in metrics_data.items():
            latest_value = values[-1]["value"]
            
            if self.health_service._is_critical_value(metric, latest_value):
                recommendations.append(f"Срочно обратитесь к врачу по поводу {metric.value}")
            elif self._is_borderline_value(metric, latest_value):
                recommendations.append(f"Следите за показателем {metric.value}, рекомендуется консультация врача")
        
        if not recommendations:
            recommendations.append("Продолжайте поддерживать здоровый образ жизни")
        
        return recommendations
    
    def _generate_risk_recommendations(self, risk_level: str, risk_factors: List[Dict]) -> List[str]:
        """Генерировать рекомендации на основе уровня риска"""
        recommendations = []
        
        if risk_level == "high":
            recommendations.extend([
                "Немедленно обратитесь к врачу",
                "Требуется срочное медицинское обследование",
                "Следуйте всем рекомендациям врача"
            ])
        elif risk_level == "medium":
            recommendations.extend([
                "Запишитесь на прием к врачу в ближайшее время",
                "Регулярно контролируйте показатели здоровья",
                "Соблюдайте здоровый образ жизни"
            ])
        elif risk_level == "low":
            recommendations.extend([
                "Рекомендуется профилактический осмотр",
                "Продолжайте следить за своим здоровьем"
            ])
        else:
            recommendations.append("Поддерживайте текущий здоровый образ жизни")
        
        return recommendations