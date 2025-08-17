# MEDIT Frontend

Медицинское приложение для мониторинга здоровья и управления записями к врачам.

## Технологии

- Next.js 14
- TypeScript
- Tailwind CSS
- React

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер разработки:
```bash
npm run dev
```

3. Откройте [http://localhost:3000](http://localhost:3000) в браузере

## Структура проекта

- `app/` - страницы и макеты Next.js
- `components/` - React компоненты
- `lib/` - утилиты и API клиент
- `types/` - TypeScript типы
- `public/` - статические файлы

## API

Фронтенд подключается к backend API по адресу `http://localhost:8000`

## Сборка для продакшена

```bash
npm run build
npm start
```