"""User API endpoints"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db, User
from app.schemas import UserProfile, UserUpdate, UserPasswordChange, SuccessResponse
from app.api.dependencies import get_current_user
from app.services import AuthService
from app.core.exceptions import ValidationException

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile"
)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get authenticated user's profile information.
    """
    return {
        "success": True,
        "data": {
            "id": str(current_user.id),
            "email": current_user.email,
            "username": current_user.username,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "avatar_url": current_user.avatar_url,
            "bio": current_user.bio,
            "timezone": current_user.timezone,
            "theme": current_user.theme,
            "is_email_verified": current_user.is_email_verified,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at,
            "updated_at": current_user.updated_at
        }
    }


@router.put(
    "/me",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Update user profile"
)
async def update_user_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update user profile information.
    
    Update any of: first_name, last_name, bio, avatar_url, timezone, theme
    """
    update_data = payload.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "id": str(current_user.id),
            "email": current_user.email,
            "username": current_user.username,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "avatar_url": current_user.avatar_url,
            "bio": current_user.bio,
            "timezone": current_user.timezone,
            "theme": current_user.theme
        }
    }


@router.put(
    "/me/password",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Change user password"
)
async def change_password(
    payload: UserPasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change user password.
    
    Requires current password and new password (min 8 chars, uppercase, digit).
    """
    await AuthService.change_password(
        db=db,
        user=current_user,
        old_password=payload.old_password,
        new_password=payload.new_password
    )
    
    return {
        "success": True,
        "message": "Password changed successfully"
    }


@router.delete(
    "/me",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Delete user account"
)
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete user account (soft delete - mark as inactive).
    
    User data is preserved but account cannot be used.
    """
    from datetime import datetime
    current_user.is_active = False
    current_user.deleted_at = datetime.utcnow()
    
    await db.commit()
    
    return {
        "success": True,
        "message": "Account deleted successfully"
    }
