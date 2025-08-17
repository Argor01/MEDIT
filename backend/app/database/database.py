from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.core.config import settings

# Создаем движок базы данных
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=settings.debug  # Логирование SQL запросов в режиме отладки
)

# Создаем фабрику сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()


# Dependency для получения сессии базы данных
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Функция для создания всех таблиц
def create_tables():
    Base.metadata.create_all(bind=engine)


# Функция для удаления всех таблиц (для тестов)
def drop_tables():
    Base.metadata.drop_all(bind=engine)


# Функция для проверки подключения к базе данных
def check_database_connection() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Ошибка подключения к базе данных: {e}")
        return False