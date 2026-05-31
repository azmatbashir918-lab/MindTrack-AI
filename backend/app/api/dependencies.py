"""API Dependencies - Shared dependencies for endpoints"""

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
from app.db import get_db
from app.core.security import decode_token
from app.core.exceptions import AuthenticationException
from app.db.models import User
from sqlalchemy import select


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    
    credentials_exception = AuthenticationException(
        detail="Could not validate credentials"
    )
    
    try:
        payload = decode_token(token)
        if payload is None:
            raise credentials_exception
        
        user_id = payload.get("sub")
        token_type = payload.get("type", "access")
        
        if token_type != "access":
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Fetch user from database
    result = await db.execute(
        select(User).where(User.id == user_id).where(User.is_active == True)
    )
    user = result.scalars().first()
    
    if user is None:
        raise credentials_exception
    
    return user


# OAuth2 scheme for Swagger docs
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()


async def oauth2_scheme(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """Extract bearer token from Authorization header"""
    return credentials.credentials


async def get_optional_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User | None:
    """Get current user if authenticated, return None otherwise"""
    
    try:
        payload = decode_token(token)
        if payload is None:
            return None
        
        user_id = payload.get("sub")
        
        result = await db.execute(
            select(User).where(User.id == user_id).where(User.is_active == True)
        )
        user = result.scalars().first()
        
        return user
    except Exception:
        return None
