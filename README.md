# MEDIT

Медицинское приложение для мониторинга здоровья и управления записями к врачам.

## Архитектура

Проект состоит из двух независимых частей:
- **Frontend** - Next.js приложение (порт 3000)
- **Backend** - FastAPI сервер (порт 8000)

## Быстрый старт

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

После запуска:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)

## Структура проекта

```
MEDIT/
├── frontend/          # Next.js приложение
│   ├── app/          # Страницы и макеты
│   ├── components/   # React компоненты
│   ├── lib/          # Утилиты и API
│   └── types/        # TypeScript типы
├── backend/          # FastAPI сервер
│   ├── app/          # Основной код
│   │   ├── api/      # API endpoints
│   │   ├── models/   # Модели БД
│   │   ├── schemas/  # Pydantic схемы
│   │   └── services/ # Бизнес-логика
│   └── main.py       # Точка входа
└── README.md         # Этот файл
```