"""Habit API endpoints"""

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.db import get_db, User
from app.schemas import (
    HabitCreate, HabitUpdate, HabitResponse, 
    HabitStats, PaginationParams
)
from app.services import HabitService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/habits", tags=["Habits"])


@router.get(
    "",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="List user habits"
)
async def list_habits(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    active_only: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all habits for current user.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Number of records to return (max 100)
    - **active_only**: Filter only active habits
    """
    habits = await HabitService.get_user_habits(
        db=db,
        user=current_user,
        active_only=active_only
    )
    
    # Apply pagination
    habits = habits[skip : skip + limit]
    
    return {
        "success": True,
        "data": {
            "habits": [
                {
                    "id": str(h.id),
                    "name": h.name,
                    "description": h.description,
                    "category": h.category.value,
                    "frequency": h.frequency.value,
                    "target_days": h.target_days,
                    "color": h.color,
                    "icon": h.icon,
                    "reminder_time": h.reminder_time,
                    "reminder_enabled": h.reminder_enabled,
                    "is_active": h.is_active,
                    "start_date": h.start_date,
                    "end_date": h.end_date,
                    "created_at": h.created_at,
                    "updated_at": h.updated_at
                }
                for h in habits
            ],
            "total": len(habits),
            "skip": skip,
            "limit": limit
        }
    }


@router.post(
    "",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Create new habit"
)
async def create_habit(
    payload: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new habit.
    
    - **name**: Habit name (1-200 chars)
    - **category**: fitness, study, work, health, personal
    - **frequency**: daily, weekly, monthly
    - **description**: Optional description
    - **target_days**: Target days per week (1-31)
    - **color**: Hex color code (#RRGGBB)
    - **icon**: Optional emoji/icon
    - **reminder_time**: Optional HH:MM format
    - **reminder_enabled**: Enable notifications
    - **start_date**: When habit starts
    """
    habit = await HabitService.create_habit(
        db=db,
        user=current_user,
        name=payload.name,
        category=payload.category.value,
        frequency=payload.frequency.value,
        description=payload.description,
        target_days=payload.target_days,
        color=payload.color,
        icon=payload.icon,
        reminder_time=payload.reminder_time,
        reminder_enabled=payload.reminder_enabled,
        start_date=payload.start_date
    )
    
    return {
        "success": True,
        "message": "Habit created successfully",
        "data": {
            "id": str(habit.id),
            "name": habit.name,
            "category": habit.category.value,
            "frequency": habit.frequency.value,
            "color": habit.color,
            "created_at": habit.created_at
        }
    }


@router.get(
    "/{habit_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get habit details"
)
async def get_habit(
    habit_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed information about a specific habit.
    """
    habit = await HabitService.get_habit(db, current_user, habit_id)
    
    return {
        "success": True,
        "data": {
            "id": str(habit.id),
            "name": habit.name,
            "description": habit.description,
            "category": habit.category.value,
            "frequency": habit.frequency.value,
            "target_days": habit.target_days,
            "color": habit.color,
            "icon": habit.icon,
            "reminder_time": habit.reminder_time,
            "reminder_enabled": habit.reminder_enabled,
            "is_active": habit.is_active,
            "start_date": habit.start_date,
            "end_date": habit.end_date,
            "completions": len(habit.completions),
            "created_at": habit.created_at,
            "updated_at": habit.updated_at
        }
    }


@router.put(
    "/{habit_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Update habit"
)
async def update_habit(
    habit_id: UUID,
    payload: HabitUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update habit information.
    
    Update any fields: name, description, category, frequency, target_days, color, icon, etc.
    """
    update_data = payload.model_dump(exclude_unset=True)
    
    # Convert enums to values
    if "category" in update_data and update_data["category"]:
        update_data["category"] = update_data["category"].value
    if "frequency" in update_data and update_data["frequency"]:
        update_data["frequency"] = update_data["frequency"].value
    
    habit = await HabitService.update_habit(db, current_user, habit_id, **update_data)
    
    return {
        "success": True,
        "message": "Habit updated successfully",
        "data": {
            "id": str(habit.id),
            "name": habit.name,
            "updated_at": habit.updated_at
        }
    }


@router.delete(
    "/{habit_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Delete habit"
)
async def delete_habit(
    habit_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete habit (soft delete - marks as inactive).
    """
    await HabitService.delete_habit(db, current_user, habit_id)
    
    return {
        "success": True,
        "message": "Habit deleted successfully"
    }


@router.post(
    "/{habit_id}/complete",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Mark habit as completed"
)
async def mark_complete(
    habit_id: UUID,
    notes: str = Query(""),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mark habit as completed for today.
    
    Creates a completion record and updates streaks.
    """
    completion = await HabitService.mark_habit_complete(
        db, current_user, habit_id, notes or None
    )
    
    return {
        "success": True,
        "message": "Habit completed!",
        "data": {
            "completion_id": str(completion.id),
            "completed_at": completion.completed_at,
            "notes": completion.notes
        }
    }


@router.get(
    "/{habit_id}/stats",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get habit statistics"
)
async def get_habit_stats(
    habit_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get statistics for a habit including streaks and completion rates.
    """
    stats = await HabitService.get_habit_stats(db, current_user, habit_id)
    
    return {
        "success": True,
        "data": stats
    }
