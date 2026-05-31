"""Analytics & Dashboard API endpoints"""

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timedelta
from app.db import get_db, User, Habit, MoodEntry, HabitCompletion
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "/dashboard",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard data"
)
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all data needed for the dashboard.
    
    Includes:
    - Habit statistics
    - Mood statistics
    - Streaks and milestones
    - Weekly progress
    """
    # Get habits
    habits_result = await db.execute(
        select(Habit).where(
            and_(Habit.user_id == current_user.id, Habit.is_active == True)
        )
    )
    habits = habits_result.scalars().all()
    
    # Get mood entries from last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    mood_result = await db.execute(
        select(MoodEntry).where(
            and_(
                MoodEntry.user_id == current_user.id,
                MoodEntry.created_at >= week_ago
            )
        )
    )
    mood_entries = mood_result.scalars().all()
    
    return {
        "success": True,
        "data": {
            "user": {
                "name": f"{current_user.first_name or ''} {current_user.last_name or ''}".strip(),
                "email": current_user.email,
                "avatar": current_user.avatar_url
            },
            "stats": {
                "total_habits": len(habits),
                "active_habits": len([h for h in habits if h.is_active]),
                "mood_entries_this_week": len(mood_entries),
                "average_mood": round(sum(m.mood_score for m in mood_entries) / len(mood_entries), 2) if mood_entries else 0
            },
            "habits": [
                {
                    "id": str(h.id),
                    "name": h.name,
                    "category": h.category.value,
                    "color": h.color,
                    "is_active": h.is_active
                }
                for h in habits
            ],
            "recent_mood": [
                {
                    "date": m.created_at.date().isoformat(),
                    "mood_score": m.mood_score,
                    "energy": m.energy_level,
                    "stress": m.stress_level
                }
                for m in sorted(mood_entries, key=lambda x: x.created_at)[-7:]
            ]
        }
    }


@router.get(
    "/habits",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get habit analytics"
)
async def get_habit_analytics(
    days: int = Query(30, ge=7, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed habit analytics.
    
    Includes:
    - Completion rates by category
    - Streaks
    - Best performing habits
    - Trends
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Get all habits
    habits_result = await db.execute(
        select(Habit).where(Habit.user_id == current_user.id)
    )
    habits = habits_result.scalars().all()
    
    habit_stats = []
    for habit in habits:
        # Get completions in period
        completions_result = await db.execute(
            select(HabitCompletion).where(
                and_(
                    HabitCompletion.habit_id == habit.id,
                    HabitCompletion.created_at >= cutoff_date
                )
            )
        )
        completions = completions_result.scalars().all()
        
        if habit.frequency == "daily":
            expected = days
        elif habit.frequency == "weekly":
            expected = days // 7
        else:
            expected = 1
        
        completion_rate = (len(completions) / expected * 100) if expected > 0 else 0
        
        habit_stats.append({
            "habit_id": str(habit.id),
            "name": habit.name,
            "category": habit.category.value,
            "completions": len(completions),
            "expected": expected,
            "completion_rate": round(completion_rate, 2),
            "frequency": habit.frequency.value
        })
    
    return {
        "success": True,
        "data": {
            "period_days": days,
            "habits": habit_stats,
            "total_completion_rate": round(
                sum(h["completion_rate"] for h in habit_stats) / len(habit_stats), 2
            ) if habit_stats else 0
        }
    }


@router.get(
    "/mood",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get mood analytics"
)
async def get_mood_analytics(
    days: int = Query(30, ge=7, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get mood analytics and trends.
    
    Includes:
    - Average mood over time
    - Mood distribution
    - Trends (improving, declining, stable)
    - Correlations with habits
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(MoodEntry).where(
            and_(
                MoodEntry.user_id == current_user.id,
                MoodEntry.created_at >= cutoff_date
            )
        )
    )
    
    entries = result.scalars().all()
    
    # Group by day
    mood_by_date = {}
    for entry in entries:
        date_key = entry.created_at.date().isoformat()
        if date_key not in mood_by_date:
            mood_by_date[date_key] = []
        mood_by_date[date_key].append(entry.mood_score)
    
    # Calculate daily averages
    daily_moods = [
        {
            "date": date,
            "average_score": round(sum(scores) / len(scores), 2)
        }
        for date, scores in sorted(mood_by_date.items())
    ]
    
    return {
        "success": True,
        "data": {
            "period_days": days,
            "total_entries": len(entries),
            "average_mood_score": round(sum(e.mood_score for e in entries) / len(entries), 2) if entries else 0,
            "daily_moods": daily_moods,
            "trend": "stable"  # TODO: Calculate trend
        }
    }


@router.get(
    "/productivity",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get productivity metrics"
)
async def get_productivity_metrics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get productivity score and metrics.
    
    Calculates productivity based on:
    - Habit completion rates
    - Work-related habit performance
    - Consistency patterns
    """
    # TODO: Implement productivity calculation
    return {
        "success": True,
        "data": {
            "productivity_score": 78,
            "score_change": "+5%",
            "best_day": "Monday",
            "peak_hours": "9 AM - 12 PM"
        }
    }
