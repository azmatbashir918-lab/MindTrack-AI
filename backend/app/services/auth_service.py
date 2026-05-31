"""Authentication service - Business logic for auth"""

from datetime import timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.core.exceptions import (
    AuthenticationException,
    ResourceAlreadyExistsException,
    ValidationException
)
from app.config import get_settings

settings = get_settings()


class AuthService:
    """Authentication business logic"""
    
    @staticmethod
    async def register(
        db: AsyncSession,
        email: str,
        username: str,
        password: str,
        first_name: str = None,
        last_name: str = None
    ) -> User:
        """Register a new user"""
        
        # Check if user exists
        result = await db.execute(
            select(User).where((User.email == email) | (User.username == username))
        )
        if result.scalars().first():
            raise ResourceAlreadyExistsException("User", "email or username")
        
        # Create new user
        user = User(
            email=email,
            username=username,
            password_hash=hash_password(password),
            first_name=first_name,
            last_name=last_name,
            is_email_verified=False
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def login(db: AsyncSession, email: str, password: str) -> dict:
        """Authenticate user and return tokens"""
        
        # Find user
        result = await db.execute(
            select(User).where(User.email == email).where(User.is_active == True)
        )
        user = result.scalars().first()
        
        if not user:
            raise AuthenticationException("Invalid email or password")
        
        # Verify password
        if not verify_password(password, user.password_hash):
            raise AuthenticationException("Invalid email or password")
        
        # Generate tokens
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        refresh_token = create_refresh_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }
    
    @staticmethod
    async def refresh_token(refresh_token: str) -> dict:
        """Generate new access token from refresh token"""
        
        payload = decode_token(refresh_token)
        
        if payload is None or payload.get("type") != "refresh":
            raise AuthenticationException("Invalid refresh token")
        
        user_id = payload.get("sub")
        
        access_token = create_access_token(
            data={"sub": user_id},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    
    @staticmethod
    async def change_password(
        db: AsyncSession,
        user: User,
        old_password: str,
        new_password: str
    ) -> bool:
        """Change user password"""
        
        if not verify_password(old_password, user.password_hash):
            raise ValidationException("Current password is incorrect")
        
        user.password_hash = hash_password(new_password)
        await db.commit()
        
        return True
