"""Authentication API endpoints"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas import (
    UserRegister, UserLogin, TokenResponse, 
    UserProfile, RefreshTokenRequest, SuccessResponse
)
from app.services import AuthService
from app.core.exceptions import ValidationException

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user"
)
async def register(
    payload: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account.
    
    - **email**: User email (must be unique)
    - **username**: Username (3-100 chars, must be unique)
    - **password**: Password (min 8 chars, must contain uppercase and digit)
    - **first_name**: Optional first name
    - **last_name**: Optional last name
    """
    user = await AuthService.register(
        db=db,
        email=payload.email,
        username=payload.username,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name
    )
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "user_id": str(user.id),
            "email": user.email,
            "username": user.username,
            "message": "Check your email for verification link"
        }
    }


@router.post(
    "/login",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Login user"
)
async def login(
    payload: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with email and password.
    
    Returns access token and refresh token for authenticated requests.
    """
    tokens = await AuthService.login(
        db=db,
        email=payload.email,
        password=payload.password
    )
    
    return {
        "success": True,
        "message": "Login successful",
        "data": tokens
    }


@router.post(
    "/refresh",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token"
)
async def refresh(payload: RefreshTokenRequest):
    """
    Refresh access token using refresh token.
    
    Returns new access token with 15 minute expiration.
    """
    tokens = await AuthService.refresh_token(payload.refresh_token)
    
    return {
        "success": True,
        "message": "Token refreshed successfully",
        "data": tokens
    }


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout user"
)
async def logout():
    """
    Logout current user.
    
    Client should discard tokens after calling this endpoint.
    """
    return {
        "success": True,
        "message": "Logout successful"
    }


@router.post(
    "/forgot-password",
    status_code=status.HTTP_200_OK,
    summary="Request password reset"
)
async def forgot_password(email: str, db: AsyncSession = Depends(get_db)):
    """
    Request password reset link.
    
    Sends reset link to user email if account exists.
    """
    # TODO: Implement forgot password logic
    return {
        "success": True,
        "message": "If account exists, password reset link has been sent"
    }


@router.post(
    "/verify-email",
    status_code=status.HTTP_200_OK,
    summary="Verify email address"
)
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    """
    Verify user email with token from email link.
    """
    # TODO: Implement email verification logic
    return {
        "success": True,
        "message": "Email verified successfully"
    }
