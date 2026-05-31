"""Mood API endpoints"""

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from uuid import UUID
from datetime import datetime, timedelta
from app.db import get_db, User, MoodEntry
from app.schemas import MoodCreate, MoodUpdate, MoodResponse, MoodStats
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/mood", tags=["Mood"])


@router.get(
    "",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="List mood entries"
)
async def list_mood_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get mood entries for current user.
    
    - **skip**: Pagination offset
    - **limit**: Number of entries to return
    - **days**: Get entries from last N days
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(MoodEntry)
        .where(
            and_(
                MoodEntry.user_id == current_user.id,
                MoodEntry.created_at >= cutoff_date
            )
        )
        .order_by(MoodEntry.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    
    entries = result.scalars().all()
    
    return {
        "success": True,
        "data": {
            "entries": [
                {
                    "id": str(e.id),
                    "mood_level": e.mood_level.value,
                    "mood_score": e.mood_score,
                    "notes": e.notes,
                    "energy_level": e.energy_level,
                    "stress_level": e.stress_level,
                    "tags": e.tags,
                    "created_at": e.created_at
                }
                for e in entries
            ],
            "total": len(entries),
            "skip": skip,
            "limit": limit
        }
    }


@router.post(
    "",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Create mood entry"
)
async def create_mood_entry(
    payload: MoodCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new mood entry.
    
    - **mood_level**: very_bad, bad, neutral, good, excellent
    - **mood_score**: 1-5 numeric scale
    - **notes**: Optional notes about mood
    - **energy_level**: Optional 1-10 scale
    - **stress_level**: Optional 1-10 scale
    - **tags**: Optional list of tags
    """
    entry = MoodEntry(
        user_id=current_user.id,
        mood_level=payload.mood_level,
        mood_score=payload.mood_score,
        notes=payload.notes,
        energy_level=payload.energy_level,
        stress_level=payload.stress_level,
        tags=payload.tags
    )
    
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    
    return {
        "success": True,
        "message": "Mood entry created successfully",
        "data": {
            "id": str(entry.id),
            "mood_level": entry.mood_level.value,
            "mood_score": entry.mood_score,
            "created_at": entry.created_at
        }
    }


@router.get(
    "/{mood_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get mood entry"
)
async def get_mood_entry(
    mood_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific mood entry.
    """
    result = await db.execute(
        select(MoodEntry).where(
            and_(MoodEntry.id == mood_id, MoodEntry.user_id == current_user.id)
        )
    )
    
    entry = result.scalars().first()
    
    if not entry:
        return {
            "success": False,
            "error": "Mood entry not found"
        }
    
    return {
        "success": True,
        "data": {
            "id": str(entry.id),
            "mood_level": entry.mood_level.value,
            "mood_score": entry.mood_score,
            "notes": entry.notes,
            "energy_level": entry.energy_level,
            "stress_level": entry.stress_level,
            "tags": entry.tags,
            "created_at": entry.created_at
        }
    }


@router.put(
    "/{mood_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Update mood entry"
)
async def update_mood_entry(
    mood_id: UUID,
    payload: MoodUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a mood entry.
    """
    result = await db.execute(
        select(MoodEntry).where(
            and_(MoodEntry.id == mood_id, MoodEntry.user_id == current_user.id)
        )
    )
    
    entry = result.scalars().first()
    
    if not entry:
        return {"success": False, "error": "Mood entry not found"}
    
    update_data = payload.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            setattr(entry, field, value)
    
    await db.commit()
    await db.refresh(entry)
    
    return {
        "success": True,
        "message": "Mood entry updated successfully",
        "data": {"id": str(entry.id), "updated_at": entry.updated_at}
    }


@router.delete(
    "/{mood_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Delete mood entry"
)
async def delete_mood_entry(
    mood_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a mood entry.
    """
    result = await db.execute(
        select(MoodEntry).where(
            and_(MoodEntry.id == mood_id, MoodEntry.user_id == current_user.id)
        )
    )
    
    entry = result.scalars().first()
    
    if not entry:
        return {"success": False, "error": "Mood entry not found"}
    
    await db.delete(entry)
    await db.commit()
    
    return {
        "success": True,
        "message": "Mood entry deleted successfully"
    }


@router.get(
    "/analytics/stats",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get mood statistics"
)
async def get_mood_stats(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get mood statistics for last N days.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(MoodEntry)
        .where(
            and_(
                MoodEntry.user_id == current_user.id,
                MoodEntry.created_at >= cutoff_date
            )
        )
    )
    
    entries = result.scalars().all()
    
    if not entries:
        return {
            "success": True,
            "data": {
                "total_entries": 0,
                "average_mood_score": 0,
                "most_common_mood": None
            }
        }
    
    avg_score = sum(e.mood_score for e in entries) / len(entries)
    mood_counts = {}
    for entry in entries:
        mood = entry.mood_level.value
        mood_counts[mood] = mood_counts.get(mood, 0) + 1
    
    most_common = max(mood_counts, key=mood_counts.get)
    
    return {
        "success": True,
        "data": {
            "total_entries": len(entries),
            "average_mood_score": round(avg_score, 2),
            "most_common_mood": most_common,
            "entries_this_week": len([e for e in entries if e.created_at >= datetime.utcnow() - timedelta(days=7)])
        }
    }
