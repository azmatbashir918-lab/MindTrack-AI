"""User schemas for API requests and responses"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.schemas.common import BaseSchema, UUIDSchema


class UserBase(BaseSchema):
    """Base user schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)


class UserRegister(BaseSchema):
    """User registration schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password strength"""
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v


class UserLogin(BaseSchema):
    """User login schema"""
    email: EmailStr
    password: str


class UserProfile(UUIDSchema):
    """User profile schema"""
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    timezone: str
    theme: str
    is_email_verified: bool
    is_active: bool


class UserUpdate(BaseSchema):
    """User update schema"""
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    timezone: Optional[str] = None
    theme: Optional[str] = None


class UserPasswordChange(BaseSchema):
    """Password change schema"""
    old_password: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        """Validate password strength"""
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v


class PasswordResetRequest(BaseSchema):
    """Password reset request schema"""
    email: EmailStr


class PasswordReset(BaseSchema):
    """Password reset schema"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)


class EmailVerification(BaseSchema):
    """Email verification schema"""
    token: str
