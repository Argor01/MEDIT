# MEDIT Backend

RESTful API для медицинского приложения MEDIT.

## Технологии

- FastAPI
- SQLAlchemy
- PostgreSQL/SQLite
- Pydantic
- Python 3.8+

## Установка и запуск

1. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

4. Запустите сервер:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Документация

После запуска сервера документация доступна по адресам:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Структура проекта

- `app/` - основной код приложения
  - `api/` - API endpoints
  - `core/` - конфигурация и настройки
  - `database/` - подключение к базе данных
  - `models/` - SQLAlchemy модели
  - `schemas/` - Pydantic схемы
  - `services/` - бизнес-логика
- `main.py` - точка входа приложения

## Основные endpoints

- `/api/v1/patients/` - управление пациентами
- `/api/v1/appointments/` - управление записями
- `/api/v1/notifications/` - уведомления
- `/api/v1/analytics/` - аналитика
- `/api/v1/organs/` - информация об органах

## База данных

По умолчанию используется SQLite для разработки. Для продакшена рекомендуется PostgreSQL.