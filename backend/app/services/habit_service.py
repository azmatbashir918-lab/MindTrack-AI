"""Habit service - Business logic for habits"""

from datetime import datetime
from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.models import Habit, HabitCompletion, User
from app.core.exceptions import ResourceNotFoundException, ValidationException
from app.core.constants import MAX_HABITS_PER_USER
from typing import List, Optional


class HabitService:
    """Habit management business logic"""
    
    @staticmethod
    async def create_habit(
        db: AsyncSession,
        user: User,
        name: str,
        category: str,
        frequency: str,
        description: str = None,
        target_days: int = 7,
        color: str = "#00E5FF",
        icon: str = None,
        reminder_time: str = None,
        reminder_enabled: bool = False,
        start_date: datetime = None
    ) -> Habit:
        """Create new habit"""
        
        # Count existing habits
        result = await db.execute(
            select(Habit).where(Habit.user_id == user.id).where(Habit.is_active == True)
        )
        habit_count = len(result.scalars().all())
        
        if habit_count >= MAX_HABITS_PER_USER:
            raise ValidationException(f"Maximum {MAX_HABITS_PER_USER} active habits allowed")
        
        habit = Habit(
            user_id=user.id,
            name=name,
            category=category,
            frequency=frequency,
            description=description,
            target_days=target_days,
            color=color,
            icon=icon,
            reminder_time=reminder_time,
            reminder_enabled=reminder_enabled,
            start_date=start_date or datetime.utcnow(),
            is_active=True
        )
        
        db.add(habit)
        await db.commit()
        await db.refresh(habit)
        
        return habit
    
    @staticmethod
    async def get_habit(db: AsyncSession, user: User, habit_id: UUID) -> Habit:
        """Get habit by ID"""
        
        result = await db.execute(
            select(Habit).where(
                and_(Habit.id == habit_id, Habit.user_id == user.id)
            ).options(selectinload(Habit.completions))
        )
        
        habit = result.scalars().first()
        
        if not habit:
            raise ResourceNotFoundException("Habit", habit_id)
        
        return habit
    
    @staticmethod
    async def get_user_habits(
        db: AsyncSession,
        user: User,
        active_only: bool = True
    ) -> List[Habit]:
        """Get all habits for user"""
        
        query = select(Habit).where(Habit.user_id == user.id)
        
        if active_only:
            query = query.where(Habit.is_active == True)
        
        query = query.options(selectinload(Habit.completions))
        result = await db.execute(query)
        
        return result.scalars().all()
    
    @staticmethod
    async def update_habit(
        db: AsyncSession,
        user: User,
        habit_id: UUID,
        **kwargs
    ) -> Habit:
        """Update habit"""
        
        habit = await HabitService.get_habit(db, user, habit_id)
        
        for key, value in kwargs.items():
            if hasattr(habit, key) and value is not None:
                setattr(habit, key, value)
        
        await db.commit()
        await db.refresh(habit)
        
        return habit
    
    @staticmethod
    async def delete_habit(db: AsyncSession, user: User, habit_id: UUID) -> bool:
        """Delete habit (soft delete)"""
        
        habit = await HabitService.get_habit(db, user, habit_id)
        
        habit.is_active = False
        await db.commit()
        
        return True
    
    @staticmethod
    async def mark_habit_complete(
        db: AsyncSession,
        user: User,
        habit_id: UUID,
        notes: str = None
    ) -> HabitCompletion:
        """Mark habit as completed today"""
        
        habit = await HabitService.get_habit(db, user, habit_id)
        
        # Check if already completed today
        today = datetime.utcnow().date()
        result = await db.execute(
            select(HabitCompletion).where(
                and_(
                    HabitCompletion.habit_id == habit_id,
                    HabitCompletion.user_id == user.id,
                    HabitCompletion.completed_at >= datetime(today.year, today.month, today.day)
                )
            )
        )
        
        if result.scalars().first():
            raise ValidationException("Habit already completed today")
        
        completion = HabitCompletion(
            habit_id=habit_id,
            user_id=user.id,
            completed_at=datetime.utcnow(),
            notes=notes
        )
        
        db.add(completion)
        await db.commit()
        await db.refresh(completion)
        
        return completion
    
    @staticmethod
    async def get_habit_stats(db: AsyncSession, user: User, habit_id: UUID) -> dict:
        """Get statistics for a habit"""
        
        habit = await HabitService.get_habit(db, user, habit_id)
        completions = habit.completions
        
        total = len(completions)
        last_completed = None if not completions else max(c.completed_at for c in completions)
        
        # Calculate streaks
        current_streak = 0
        longest_streak = 0
        
        if completions:
            sorted_completions = sorted(completions, key=lambda x: x.completed_at)
            current_date = datetime.utcnow().date()
            streak = 0
            
            for completion in sorted_completions:
                completion_date = completion.completed_at.date()
                if (current_date - completion_date).days <= 1:
                    streak += 1
                    current_streak = streak
                else:
                    longest_streak = max(longest_streak, streak)
                    streak = 1
                current_date = completion_date
            
            longest_streak = max(longest_streak, current_streak)
        
        # Calculate completion rate (last 30 days)
        completion_rate = 0
        if habit.frequency == "daily":
            expected = 30
        elif habit.frequency == "weekly":
            expected = 4
        else:  # monthly
            expected = 1
        
        if total > 0:
            completion_rate = (total / expected) * 100
        
        return {
            "habit_id": str(habit.id),
            "name": habit.name,
            "total_completions": total,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "completion_rate": min(100, completion_rate),
            "last_completed": last_completed
        }
