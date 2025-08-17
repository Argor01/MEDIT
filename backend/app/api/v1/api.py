from fastapi import APIRouter

from app.api.v1.endpoints import (
    patients,
    doctors,
    appointments,
    health,
    organs,
    notifications,
    analytics
)

api_router = APIRouter()

# Подключаем все роутеры эндпоинтов
api_router.include_router(
    patients.router,
    prefix="/patients",
    tags=["patients"]
)

api_router.include_router(
    doctors.router,
    prefix="/doctors",
    tags=["doctors"]
)

api_router.include_router(
    appointments.router,
    prefix="/appointments",
    tags=["appointments"]
)

api_router.include_router(
    health.router,
    prefix="/health",
    tags=["health"]
)

api_router.include_router(
    organs.router,
    prefix="/organs",
    tags=["organs"]
)

api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["notifications"]
)

api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["analytics"]
)