from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Основные настройки
    PROJECT_NAME: str = "MEDIT API"
    API_V1_STR: str = "/api/v1"
    app_name: str = "MEDIT API"
    debug: bool = True
    version: str = "1.0.0"
    
    # База данных
    database_url: str = "sqlite:///./medit.db"
    
    # Альтернативная настройка для PostgreSQL
    # database_url: str = "postgresql://user:password@localhost/medit_db"
    
    # Безопасность
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
        "https://127.0.0.1:3000",
    ]
    
    # Файлы
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
    
    # Внешние API
    openai_api_key: Optional[str] = None
    
    # Логирование
    log_level: str = "INFO"
    
    # Медицинские настройки
    default_health_thresholds: dict = {
        "heart_rate": {"min": 60, "max": 100, "critical_min": 50, "critical_max": 120},
        "blood_pressure_systolic": {"min": 100, "max": 140, "critical_min": 90, "critical_max": 180},
        "blood_pressure_diastolic": {"min": 70, "max": 90, "critical_min": 60, "critical_max": 110},
        "temperature": {"min": 36.1, "max": 37.2, "critical_min": 35.0, "critical_max": 39.0},
        "oxygen_saturation": {"min": 95, "max": 100, "critical_min": 90, "critical_max": 100}
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Создаем экземпляр настроек
settings = Settings()


# Функция для получения URL базы данных
def get_database_url() -> str:
    return settings.database_url


# Функция для проверки настроек в продакшене
def validate_production_settings():
    if not settings.debug:
        if settings.secret_key == "your-secret-key-here-change-in-production":
            raise ValueError("Необходимо изменить SECRET_KEY в продакшене")
        
        if "localhost" in settings.allowed_origins[0]:
            print("Предупреждение: localhost в allowed_origins в продакшене")


# Настройки для разных сред
class DevelopmentSettings(Settings):
    debug: bool = True
    database_url: str = "sqlite:///./medit_dev.db"


class ProductionSettings(Settings):
    debug: bool = False
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/medit_prod")
    secret_key: str = os.getenv("SECRET_KEY", "")
    allowed_origins: list = os.getenv("ALLOWED_ORIGINS", "").split(",")


class TestingSettings(Settings):
    debug: bool = True
    database_url: str = "sqlite:///./test_medit.db"
    

# Функция для получения настроек в зависимости от среды
def get_settings() -> Settings:
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        return ProductionSettings()
    elif env == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()