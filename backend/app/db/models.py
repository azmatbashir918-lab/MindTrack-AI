"""Database models"""

from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from enum import Enum as PyEnum
from uuid import UUID
from app.db.base import BaseModel


# Enums
class MoodLevel(str, PyEnum):
    """Mood levels"""
    VERY_BAD = "very_bad"
    BAD = "bad"
    NEUTRAL = "neutral"
    GOOD = "good"
    EXCELLENT = "excellent"


class HabitCategory(str, PyEnum):
    """Habit categories"""
    FITNESS = "fitness"
    STUDY = "study"
    WORK = "work"
    HEALTH = "health"
    PERSONAL = "personal"


class HabitFrequency(str, PyEnum):
    """Habit frequencies"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class NotificationType(str, PyEnum):
    """Notification types"""
    REMINDER = "reminder"
    ACHIEVEMENT = "achievement"
    INSIGHT = "insight"
    REPORT = "report"


# Models
class User(BaseModel):
    """User model"""
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")
    theme: Mapped[str] = mapped_column(String(20), default="dark")
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    deleted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    mood_entries = relationship("MoodEntry", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    ai_reports = relationship("AIReport", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("Settings", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Habit(BaseModel):
    """Habit model"""
    __tablename__ = "habits"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    category: Mapped[HabitCategory] = mapped_column(Enum(HabitCategory), nullable=False)
    frequency: Mapped[HabitFrequency] = mapped_column(Enum(HabitFrequency), nullable=False)
    target_days: Mapped[int] = mapped_column(Integer, default=7)
    color: Mapped[str] = mapped_column(String(7), default="#00E5FF")
    icon: Mapped[str] = mapped_column(String(50), nullable=True)
    reminder_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    reminder_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="habits")
    completions = relationship("HabitCompletion", back_populates="habit", cascade="all, delete-orphan")


class HabitCompletion(BaseModel):
    """Habit completion tracking model"""
    __tablename__ = "habit_completions"
    
    habit_id: Mapped[UUID] = mapped_column(ForeignKey("habits.id"), nullable=False, index=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Relationships
    habit = relationship("Habit", back_populates="completions")


class MoodEntry(BaseModel):
    """Mood entry model"""
    __tablename__ = "mood_entries"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    mood_level: Mapped[MoodLevel] = mapped_column(Enum(MoodLevel), nullable=False)
    mood_score: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    energy_level: Mapped[int] = mapped_column(Integer, nullable=True)  # 1-10
    stress_level: Mapped[int] = mapped_column(Integer, nullable=True)  # 1-10
    tags: Mapped[list] = mapped_column(JSON, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="mood_entries")


class ChatMessage(BaseModel):
    """Chat message model"""
    __tablename__ = "chat_messages"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False)  # 'user' or 'assistant'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    tokens_used: Mapped[int] = mapped_column(Integer, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="chat_messages")


class AIReport(BaseModel):
    """AI-generated report model"""
    __tablename__ = "ai_reports"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    report_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'daily', 'weekly', 'monthly'
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[dict] = mapped_column(JSON, nullable=False)
    insights: Mapped[list] = mapped_column(JSON, nullable=True)
    recommendations: Mapped[list] = mapped_column(JSON, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="ai_reports")


class Notification(BaseModel):
    """Notification model"""
    __tablename__ = "notifications"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    notification_type: Mapped[NotificationType] = mapped_column(Enum(NotificationType), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="notifications")


class Achievement(BaseModel):
    """Achievement/Badge model"""
    __tablename__ = "achievements"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    achievement_type: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    badge_icon: Mapped[str] = mapped_column(String(500), nullable=True)
    unlocked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="achievements")


class Settings(BaseModel):
    """User settings model"""
    __tablename__ = "settings"
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    ai_suggestions_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    daily_digest_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    digest_time: Mapped[str] = mapped_column(String(5), default="09:00")  # HH:MM format
    language: Mapped[str] = mapped_column(String(10), default="en")
    
    # Relationships
    user = relationship("User", back_populates="settings")
