from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid

from app.models.models import Organ, HealthData, Patient
from app.schemas.schemas import OrganCreate, OrganUpdate, HealthMetric


class OrganService:
    def __init__(self, db: Session):
        self.db = db
    
    # Данные по умолчанию для органов
    DEFAULT_ORGANS = [
        {
            "name": "Сердце",
            "description": "Центральный орган кровообращения, обеспечивающий циркуляцию крови по всему организму",
            "function": "Перекачивание крови, обеспечение кислородом и питательными веществами всех органов и тканей",
            "related_metrics": [HealthMetric.heart_rate, HealthMetric.blood_pressure_systolic, HealthMetric.blood_pressure_diastolic]
        },
        {
            "name": "Легкие",
            "description": "Органы дыхательной системы, обеспечивающие газообмен между воздухом и кровью",
            "function": "Поглощение кислорода из воздуха и выделение углекислого газа из крови",
            "related_metrics": [HealthMetric.oxygen_saturation, HealthMetric.respiratory_rate]
        },
        {
            "name": "Печень",
            "description": "Крупнейший внутренний орган, выполняющий множество жизненно важных функций",
            "function": "Детоксикация, синтез белков, производство желчи, метаболизм углеводов и жиров",
            "related_metrics": [HealthMetric.cholesterol, HealthMetric.blood_sugar]
        },
        {
            "name": "Почки",
            "description": "Парные органы выделительной системы, фильтрующие кровь и образующие мочу",
            "function": "Фильтрация крови, регуляция водно-солевого баланса, выведение токсинов",
            "related_metrics": [HealthMetric.blood_pressure_systolic, HealthMetric.blood_pressure_diastolic]
        },
        {
            "name": "Мозг",
            "description": "Центральный орган нервной системы, контролирующий все функции организма",
            "function": "Координация всех функций организма, обработка информации, управление поведением",
            "related_metrics": [HealthMetric.blood_pressure_systolic, HealthMetric.blood_sugar]
        },
        {
            "name": "Поджелудочная железа",
            "description": "Орган пищеварительной и эндокринной систем",
            "function": "Производство пищеварительных ферментов и гормонов (инсулин, глюкагон)",
            "related_metrics": [HealthMetric.blood_sugar]
        },
        {
            "name": "Щитовидная железа",
            "description": "Эндокринная железа, регулирующая обмен веществ",
            "function": "Производство гормонов, регулирующих метаболизм, рост и развитие",
            "related_metrics": [HealthMetric.heart_rate, HealthMetric.body_temperature]
        },
        {
            "name": "Желудок",
            "description": "Орган пищеварительной системы для переваривания пищи",
            "function": "Механическое и химическое переваривание пищи",
            "related_metrics": []
        }
    ]
    
    def get_organs(self, skip: int = 0, limit: int = 100) -> List[Organ]:
        """Получить список органов"""
        organs = self.db.query(Organ).filter(
            Organ.is_deleted == False
        ).offset(skip).limit(limit).all()
        
        # Если органов нет, создаем набор по умолчанию
        if not organs and skip == 0:
            self.create_default_organs()
            organs = self.db.query(Organ).filter(
                Organ.is_deleted == False
            ).offset(skip).limit(limit).all()
        
        return organs
    
    def get_organ(self, organ_id: str) -> Optional[Organ]:
        """Получить орган по ID"""
        return self.db.query(Organ).filter(
            and_(
                Organ.id == organ_id,
                Organ.is_deleted == False
            )
        ).first()
    
    def get_organ_by_name(self, name: str) -> Optional[Organ]:
        """Получить орган по названию"""
        return self.db.query(Organ).filter(
            and_(
                Organ.name.ilike(f"%{name}%"),
                Organ.is_deleted == False
            )
        ).first()
    
    def create_organ(self, organ_data: OrganCreate) -> Organ:
        """Создать новый орган"""
        organ = Organ(
            id=str(uuid.uuid4()),
            name=organ_data.name,
            description=organ_data.description,
            function=organ_data.function,
            related_metrics=organ_data.related_metrics,
            is_deleted=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(organ)
        self.db.commit()
        self.db.refresh(organ)
        return organ
    
    def update_organ(self, organ_id: str, organ_data: OrganUpdate) -> Optional[Organ]:
        """Обновить орган"""
        organ = self.get_organ(organ_id)
        if not organ:
            return None
        
        update_data = organ_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(organ, field, value)
        
        organ.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(organ)
        return organ
    
    def delete_organ(self, organ_id: str) -> bool:
        """Мягкое удаление органа"""
        organ = self.get_organ(organ_id)
        if not organ:
            return False
        
        organ.is_deleted = True
        organ.updated_at = datetime.utcnow()
        
        self.db.commit()
        return True
    
    def create_default_organs(self) -> List[Organ]:
        """Создать набор органов по умолчанию"""
        organs = []
        
        for organ_data in self.DEFAULT_ORGANS:
            # Проверяем, не существует ли уже орган с таким названием
            existing_organ = self.get_organ_by_name(organ_data["name"])
            if existing_organ:
                continue
            
            organ = Organ(
                id=str(uuid.uuid4()),
                name=organ_data["name"],
                description=organ_data["description"],
                function=organ_data["function"],
                related_metrics=organ_data["related_metrics"],
                is_deleted=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            organs.append(organ)
        
        if organs:
            self.db.add_all(organs)
            self.db.commit()
            
            for organ in organs:
                self.db.refresh(organ)
        
        return organs
    
    def get_organ_health_info(self, organ_id: str, patient_id: str, days: int = 30) -> Dict[str, Any]:
        """Получить информацию о здоровье органа для конкретного пациента"""
        organ = self.get_organ(organ_id)
        if not organ:
            return None
        
        # Получаем связанные метрики
        related_metrics = organ.related_metrics or []
        
        if not related_metrics:
            return {
                "organ_id": organ_id,
                "organ_name": organ.name,
                "health_status": "unknown",
                "message": "Нет связанных метрик для анализа",
                "metrics_data": []
            }
        
        # Получаем данные о здоровье за указанный период
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        health_data = self.db.query(HealthData).filter(
            and_(
                HealthData.patient_id == patient_id,
                HealthData.metric.in_(related_metrics),
                HealthData.recorded_at >= start_date,
                HealthData.recorded_at <= end_date
            )
        ).order_by(desc(HealthData.recorded_at)).all()
        
        # Группируем данные по метрикам
        metrics_data = {}
        for metric in related_metrics:
            metric_records = [r for r in health_data if r.metric == metric]
            if metric_records:
                latest_record = metric_records[0]
                metrics_data[metric.value] = {
                    "latest_value": latest_record.value,
                    "unit": latest_record.unit,
                    "recorded_at": latest_record.recorded_at.isoformat(),
                    "status": self._get_metric_status(metric, latest_record.value)
                }
        
        # Определяем общий статус здоровья органа
        health_status = self._determine_organ_health_status(metrics_data)
        
        return {
            "organ_id": organ_id,
            "organ_name": organ.name,
            "health_status": health_status,
            "metrics_data": metrics_data,
            "analysis_period_days": days,
            "last_updated": datetime.now().isoformat()
        }
    
    def get_organ_diseases(self, organ_id: str) -> List[Dict[str, Any]]:
        """Получить список заболеваний, связанных с органом"""
        organ = self.get_organ(organ_id)
        if not organ:
            return []
        
        # Предопределенные заболевания для каждого органа
        organ_diseases = {
            "Сердце": [
                {
                    "name": "Ишемическая болезнь сердца",
                    "description": "Заболевание, вызванное недостаточным кровоснабжением сердечной мышцы",
                    "symptoms": ["Боль в груди", "Одышка", "Усталость"],
                    "risk_factors": ["Высокое давление", "Высокий холестерин", "Курение"]
                },
                {
                    "name": "Аритмия",
                    "description": "Нарушение ритма сердечных сокращений",
                    "symptoms": ["Неровное сердцебиение", "Головокружение", "Обмороки"],
                    "risk_factors": ["Стресс", "Кофеин", "Заболевания сердца"]
                },
                {
                    "name": "Гипертония",
                    "description": "Повышенное артериальное давление",
                    "symptoms": ["Головная боль", "Головокружение", "Шум в ушах"],
                    "risk_factors": ["Избыточный вес", "Соль", "Стресс"]
                }
            ],
            "Легкие": [
                {
                    "name": "Астма",
                    "description": "Хроническое воспалительное заболевание дыхательных путей",
                    "symptoms": ["Затрудненное дыхание", "Кашель", "Свистящее дыхание"],
                    "risk_factors": ["Аллергены", "Загрязнение воздуха", "Инфекции"]
                },
                {
                    "name": "ХОБЛ",
                    "description": "Хроническая обструктивная болезнь легких",
                    "symptoms": ["Хронический кашель", "Одышка", "Мокрота"],
                    "risk_factors": ["Курение", "Загрязнение воздуха", "Профессиональные вредности"]
                }
            ],
            "Печень": [
                {
                    "name": "Гепатит",
                    "description": "Воспаление печени",
                    "symptoms": ["Желтуха", "Усталость", "Боль в правом подреберье"],
                    "risk_factors": ["Вирусы", "Алкоголь", "Токсины"]
                },
                {
                    "name": "Цирроз",
                    "description": "Рубцевание печени",
                    "symptoms": ["Желтуха", "Отеки", "Кровотечения"],
                    "risk_factors": ["Алкоголь", "Гепатит", "Жировая болезнь печени"]
                }
            ],
            "Почки": [
                {
                    "name": "Хроническая болезнь почек",
                    "description": "Постепенная потеря функции почек",
                    "symptoms": ["Отеки", "Усталость", "Изменения в моче"],
                    "risk_factors": ["Диабет", "Гипертония", "Семейная история"]
                },
                {
                    "name": "Почечные камни",
                    "description": "Твердые отложения в почках",
                    "symptoms": ["Острая боль", "Кровь в моче", "Тошнота"],
                    "risk_factors": ["Обезвоживание", "Диета", "Генетика"]
                }
            ]
        }
        
        return organ_diseases.get(organ.name, [])
    
    def get_organ_health_tips(self, organ_id: str) -> List[Dict[str, str]]:
        """Получить советы по здоровью для органа"""
        organ = self.get_organ(organ_id)
        if not organ:
            return []
        
        # Предопределенные советы для каждого органа
        organ_tips = {
            "Сердце": [
                {
                    "category": "Питание",
                    "tip": "Ограничьте потребление насыщенных жиров и трансжиров"
                },
                {
                    "category": "Физическая активность",
                    "tip": "Занимайтесь аэробными упражнениями минимум 150 минут в неделю"
                },
                {
                    "category": "Образ жизни",
                    "tip": "Избегайте курения и ограничьте употребление алкоголя"
                },
                {
                    "category": "Стресс",
                    "tip": "Практикуйте техники управления стрессом"
                }
            ],
            "Легкие": [
                {
                    "category": "Воздух",
                    "tip": "Избегайте загрязненного воздуха и курения"
                },
                {
                    "category": "Дыхание",
                    "tip": "Практикуйте глубокое дыхание и дыхательные упражнения"
                },
                {
                    "category": "Инфекции",
                    "tip": "Делайте прививки от гриппа и пневмонии"
                }
            ],
            "Печень": [
                {
                    "category": "Алкоголь",
                    "tip": "Ограничьте или исключите употребление алкоголя"
                },
                {
                    "category": "Питание",
                    "tip": "Поддерживайте здоровый вес и сбалансированную диету"
                },
                {
                    "category": "Лекарства",
                    "tip": "Будьте осторожны с лекарствами и добавками"
                }
            ],
            "Почки": [
                {
                    "category": "Гидратация",
                    "tip": "Пейте достаточно воды (8-10 стаканов в день)"
                },
                {
                    "category": "Соль",
                    "tip": "Ограничьте потребление натрия"
                },
                {
                    "category": "Давление",
                    "tip": "Контролируйте артериальное давление и уровень сахара"
                }
            ]
        }
        
        return organ_tips.get(organ.name, [
            {
                "category": "Общее",
                "tip": "Поддерживайте здоровый образ жизни"
            }
        ])
    
    def get_organ_statistics(self, organ_id: str) -> Dict[str, Any]:
        """Получить статистику по органу"""
        organ = self.get_organ(organ_id)
        if not organ:
            return None
        
        # Количество связанных метрик
        related_metrics_count = len(organ.related_metrics or [])
        
        # Количество записей о здоровье за последний месяц
        month_ago = datetime.now() - timedelta(days=30)
        health_records_count = 0
        
        if organ.related_metrics:
            health_records_count = self.db.query(HealthData).filter(
                and_(
                    HealthData.metric.in_(organ.related_metrics),
                    HealthData.recorded_at >= month_ago
                )
            ).count()
        
        # Количество пациентов с данными по этому органу
        patients_with_data = 0
        if organ.related_metrics:
            patients_with_data = self.db.query(HealthData.patient_id).filter(
                HealthData.metric.in_(organ.related_metrics)
            ).distinct().count()
        
        return {
            "organ_id": organ_id,
            "organ_name": organ.name,
            "related_metrics_count": related_metrics_count,
            "health_records_last_month": health_records_count,
            "patients_with_data": patients_with_data,
            "created_at": organ.created_at.isoformat(),
            "last_updated": organ.updated_at.isoformat()
        }
    
    def get_organ_interactions(self, organ_id: str) -> List[Dict[str, Any]]:
        """Получить информацию о взаимодействии органа с другими органами"""
        organ = self.get_organ(organ_id)
        if not organ:
            return []
        
        # Предопределенные взаимодействия
        organ_interactions = {
            "Сердце": [
                {
                    "organ": "Легкие",
                    "interaction": "Сердце перекачивает кровь через легкие для оксигенации",
                    "type": "circulatory"
                },
                {
                    "organ": "Почки",
                    "interaction": "Сердце обеспечивает кровоснабжение почек для фильтрации",
                    "type": "circulatory"
                },
                {
                    "organ": "Мозг",
                    "interaction": "Мозг регулирует сердечный ритм через нервную систему",
                    "type": "nervous"
                }
            ],
            "Легкие": [
                {
                    "organ": "Сердце",
                    "interaction": "Легкие насыщают кровь кислородом для сердца",
                    "type": "respiratory"
                },
                {
                    "organ": "Мозг",
                    "interaction": "Мозг контролирует дыхание через дыхательный центр",
                    "type": "nervous"
                }
            ],
            "Печень": [
                {
                    "organ": "Поджелудочная железа",
                    "interaction": "Печень и поджелудочная железа работают вместе в пищеварении",
                    "type": "digestive"
                },
                {
                    "organ": "Почки",
                    "interaction": "Печень и почки совместно очищают кровь от токсинов",
                    "type": "detoxification"
                }
            ]
        }
        
        return organ_interactions.get(organ.name, [])
    
    def _get_metric_status(self, metric: HealthMetric, value: float) -> str:
        """Определить статус метрики"""
        # Упрощенная логика определения статуса
        normal_ranges = {
            HealthMetric.heart_rate: (60, 100),
            HealthMetric.blood_pressure_systolic: (90, 120),
            HealthMetric.blood_pressure_diastolic: (60, 80),
            HealthMetric.blood_sugar: (70, 100),
            HealthMetric.cholesterol: (0, 200),
            HealthMetric.bmi: (18.5, 24.9),
            HealthMetric.oxygen_saturation: (95, 100),
            HealthMetric.body_temperature: (36.1, 37.2)
        }
        
        if metric in normal_ranges:
            min_val, max_val = normal_ranges[metric]
            if min_val <= value <= max_val:
                return "normal"
            elif value < min_val:
                return "low"
            else:
                return "high"
        
        return "unknown"
    
    def _determine_organ_health_status(self, metrics_data: Dict[str, Any]) -> str:
        """Определить общий статус здоровья органа"""
        if not metrics_data:
            return "unknown"
        
        statuses = [data["status"] for data in metrics_data.values()]
        
        # Если есть критические показатели
        if "high" in statuses or "low" in statuses:
            return "attention_needed"
        
        # Если все показатели нормальные
        if all(status == "normal" for status in statuses):
            return "healthy"
        
        return "unknown"