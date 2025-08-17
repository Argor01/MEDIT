from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.schemas import Organ, OrganCreate, OrganUpdate, ApiResponse
from app.services.organ_service import OrganService

router = APIRouter()


@router.get("/", response_model=List[Organ])
async def get_organs(
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Получить список всех органов
    """
    service = OrganService(db)
    organs = service.get_organs(active_only)
    
    # Если нет органов в базе, создаем базовый набор
    if not organs:
        organs = service.create_default_organs()
    
    return organs


@router.get("/{organ_id}", response_model=Organ)
async def get_organ(
    organ_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить информацию о конкретном органе
    """
    service = OrganService(db)
    organ = service.get_organ(organ_id)
    
    if not organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    return organ


@router.post("/", response_model=Organ)
async def create_organ(
    organ_data: OrganCreate,
    db: Session = Depends(get_db)
):
    """
    Создать новый орган
    """
    service = OrganService(db)
    
    # Проверяем, не существует ли уже орган с таким ID
    existing_organ = service.get_organ(organ_data.id)
    if existing_organ:
        raise HTTPException(
            status_code=400,
            detail="Орган с таким ID уже существует"
        )
    
    organ = service.create_organ(organ_data)
    return organ


@router.put("/{organ_id}", response_model=Organ)
async def update_organ(
    organ_id: str,
    organ_data: OrganUpdate,
    db: Session = Depends(get_db)
):
    """
    Обновить информацию об органе
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    existing_organ = service.get_organ(organ_id)
    if not existing_organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    organ = service.update_organ(organ_id, organ_data)
    return organ


@router.delete("/{organ_id}", response_model=ApiResponse)
async def delete_organ(
    organ_id: str,
    db: Session = Depends(get_db)
):
    """
    Удалить орган (мягкое удаление)
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    existing_organ = service.get_organ(organ_id)
    if not existing_organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    success = service.delete_organ(organ_id)
    
    if success:
        return ApiResponse(
            success=True,
            message="Орган успешно удален"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при удалении органа"
        )


@router.get("/{organ_id}/health-info", response_model=dict)
async def get_organ_health_info(
    organ_id: str,
    patient_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Получить информацию о здоровье конкретного органа
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    organ = service.get_organ(organ_id)
    if not organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    health_info = service.get_organ_health_info(organ_id, patient_id)
    return health_info


@router.get("/{organ_id}/diseases", response_model=List[dict])
async def get_organ_diseases(
    organ_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить список заболеваний, связанных с органом
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    organ = service.get_organ(organ_id)
    if not organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    diseases = service.get_organ_diseases(organ_id)
    return diseases


@router.get("/{organ_id}/tips", response_model=List[dict])
async def get_organ_health_tips(
    organ_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить советы по здоровью для конкретного органа
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    organ = service.get_organ(organ_id)
    if not organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    tips = service.get_organ_health_tips(organ_id)
    return tips


@router.post("/initialize-default", response_model=ApiResponse)
async def initialize_default_organs(
    db: Session = Depends(get_db)
):
    """
    Инициализировать базовый набор органов
    """
    service = OrganService(db)
    
    try:
        organs = service.create_default_organs()
        return ApiResponse(
            success=True,
            message=f"Создано {len(organs)} органов",
            data={"count": len(organs)}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании органов: {str(e)}"
        )


@router.get("/{organ_id}/statistics", response_model=dict)
async def get_organ_statistics(
    organ_id: str,
    db: Session = Depends(get_db)
):
    """
    Получить статистику по органу
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    organ = service.get_organ(organ_id)
    if not organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    statistics = service.get_organ_statistics(organ_id)
    return statistics


@router.post("/{organ_id}/interact", response_model=dict)
async def interact_with_organ(
    organ_id: str,
    patient_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Обработать взаимодействие с органом (клик)
    """
    service = OrganService(db)
    
    # Проверяем, существует ли орган
    organ = service.get_organ(organ_id)
    if not organ:
        raise HTTPException(status_code=404, detail="Орган не найден")
    
    interaction_result = service.handle_organ_interaction(organ_id, patient_id)
    return interaction_result