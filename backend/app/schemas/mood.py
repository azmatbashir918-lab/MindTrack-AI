"""Mood schemas for API requests and responses"""

from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional, List
from enum import Enum
from app.schemas.common import BaseSchema, UUIDSchema


class MoodLevel(str, Enum):
    """Mood levels"""
    VERY_BAD = "very_bad"
    BAD = "bad"
    NEUTRAL = "neutral"
    GOOD = "good"
    EXCELLENT = "excellent"


class MoodBase(BaseSchema):
    """Base mood schema"""
    mood_level: MoodLevel
    mood_score: int = Field(..., ge=1, le=5)
    notes: Optional[str] = Field(None, max_length=1000)
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    tags: Optional[List[str]] = None


class MoodCreate(MoodBase):
    """Mood creation schema"""
    pass


class MoodUpdate(BaseSchema):
    """Mood update schema"""
    mood_level: Optional[MoodLevel] = None
    mood_score: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = Field(None, max_length=1000)
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    tags: Optional[List[str]] = None


class MoodResponse(UUIDSchema):
    """Mood response schema"""
    user_id: UUID
    mood_level: MoodLevel
    mood_score: int
    notes: Optional[str]
    energy_level: Optional[int]
    stress_level: Optional[int]
    tags: Optional[List[str]]


class MoodStats(BaseSchema):
    """Mood statistics schema"""
    average_mood_score: float
    most_common_mood: MoodLevel
    total_entries: int
    average_energy: Optional[float]
    average_stress: Optional[float]
    mood_trend: Optional[str]  # 'improving', 'declining', 'stable'
    entries_this_week: int


class MoodTrend(BaseSchema):
    """Mood trend schema"""
    date: str
    average_score: float
    entry_count: int
