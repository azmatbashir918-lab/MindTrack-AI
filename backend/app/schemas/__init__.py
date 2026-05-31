"""Schemas module"""

from .common import (
    BaseSchema,
    TimestampSchema,
    UUIDSchema,
    PaginationParams,
    PaginatedResponse,
    SuccessResponse,
    ErrorResponse,
    TokenResponse,
    RefreshTokenRequest
)
from .user import (
    UserBase,
    UserRegister,
    UserLogin,
    UserProfile,
    UserUpdate,
    UserPasswordChange,
    PasswordResetRequest,
    PasswordReset,
    EmailVerification
)
from .habit import (
    HabitBase,
    HabitCreate,
    HabitUpdate,
    HabitResponse,
    HabitCompletion,
    HabitStats,
    HabitCategory,
    HabitFrequency
)
from .mood import (
    MoodBase,
    MoodCreate,
    MoodUpdate,
    MoodResponse,
    MoodStats,
    MoodTrend,
    MoodLevel
)

__all__ = [
    # Common
    "BaseSchema",
    "TimestampSchema",
    "UUIDSchema",
    "PaginationParams",
    "PaginatedResponse",
    "SuccessResponse",
    "ErrorResponse",
    "TokenResponse",
    "RefreshTokenRequest",
    # User
    "UserBase",
    "UserRegister",
    "UserLogin",
    "UserProfile",
    "UserUpdate",
    "UserPasswordChange",
    "PasswordResetRequest",
    "PasswordReset",
    "EmailVerification",
    # Habit
    "HabitBase",
    "HabitCreate",
    "HabitUpdate",
    "HabitResponse",
    "HabitCompletion",
    "HabitStats",
    "HabitCategory",
    "HabitFrequency",
    # Mood
    "MoodBase",
    "MoodCreate",
    "MoodUpdate",
    "MoodResponse",
    "MoodStats",
    "MoodTrend",
    "MoodLevel"
]
