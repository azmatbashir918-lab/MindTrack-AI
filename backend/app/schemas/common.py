"""Common schemas used across the API"""

from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional, Generic, TypeVar


T = TypeVar("T")


class BaseSchema(BaseModel):
    """Base schema with common fields"""
    
    class Config:
        from_attributes = True


class TimestampSchema(BaseSchema):
    """Schema with timestamp fields"""
    created_at: datetime
    updated_at: datetime


class UUIDSchema(TimestampSchema):
    """Schema with UUID and timestamps"""
    id: UUID


# Pagination
class PaginationParams(BaseModel):
    """Pagination parameters"""
    skip: int = Field(0, ge=0)
    limit: int = Field(50, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_order: Optional[str] = "asc"


class PaginatedResponse(BaseSchema, Generic[T]):
    """Generic paginated response"""
    items: list[T]
    total: int
    skip: int
    limit: int
    has_more: bool


# Status response
class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = True
    message: str
    data: Optional[dict] = None


class ErrorResponse(BaseModel):
    """Generic error response"""
    success: bool = False
    error: str
    code: str
    detail: Optional[str] = None


# Token
class TokenResponse(BaseModel):
    """Token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str
