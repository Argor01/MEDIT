"""API эндпоинты версии 1"""

# Импорты для удобства использования
from . import (
    patients,
    doctors,
    appointments,
    health,
    organs,
    notifications,
    analytics
)

__all__ = [
    "patients",
    "doctors",
    "appointments",
    "health",
    "organs",
    "notifications",
    "analytics"
]