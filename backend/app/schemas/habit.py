"""Habit schemas for API requests and responses"""

from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from enum import Enum
from app.schemas.common import BaseSchema, UUIDSchema


class HabitCategory(str, Enum):
    """Habit categories"""
    FITNESS = "fitness"
    STUDY = "study"
    WORK = "work"
    HEALTH = "health"
    PERSONAL = "personal"


class HabitFrequency(str, Enum):
    """Habit frequencies"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class HabitBase(BaseSchema):
    """Base habit schema"""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: HabitCategory
    frequency: HabitFrequency
    target_days: int = Field(7, ge=1, le=31)
    color: str = Field("#00E5FF", regex="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = None
    reminder_time: Optional[str] = None  # HH:MM format
    reminder_enabled: bool = False
    start_date: datetime


class HabitCreate(HabitBase):
    """Habit creation schema"""
    pass


class HabitUpdate(BaseSchema):
    """Habit update schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[HabitCategory] = None
    frequency: Optional[HabitFrequency] = None
    target_days: Optional[int] = Field(None, ge=1, le=31)
    color: Optional[str] = Field(None, regex="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = None
    reminder_time: Optional[str] = None
    reminder_enabled: Optional[bool] = None
    is_active: Optional[bool] = None
    end_date: Optional[datetime] = None


class HabitResponse(UUIDSchema):
    """Habit response schema"""
    user_id: UUID
    name: str
    description: Optional[str]
    category: HabitCategory
    frequency: HabitFrequency
    target_days: int
    color: str
    icon: Optional[str]
    reminder_time: Optional[str]
    reminder_enabled: bool
    is_active: bool
    start_date: datetime
    end_date: Optional[datetime]


class HabitCompletion(UUIDSchema):
    """Habit completion schema"""
    habit_id: UUID
    user_id: UUID
    completed_at: datetime
    notes: Optional[str]


class HabitStats(BaseSchema):
    """Habit statistics schema"""
    habit_id: UUID
    name: str
    total_completions: int
    current_streak: int
    longest_streak: int
    completion_rate: float  # 0-100
    last_completed: Optional[datetime]
    next_due: Optional[datetime]
