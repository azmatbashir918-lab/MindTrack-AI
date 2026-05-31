"""API v1 routes"""

from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .habits import router as habits_router
from .mood import router as mood_router
from .ai import router as ai_router
from .analytics import router as analytics_router

# Create main API router
api_router = APIRouter(prefix="/api/v1")

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(habits_router)
api_router.include_router(mood_router)
api_router.include_router(ai_router)
api_router.include_router(analytics_router)

__all__ = ["api_router"]
