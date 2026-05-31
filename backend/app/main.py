"""FastAPI Application"""

from fastapi import FastAPI
from fastapi.middleware.gzip import GZIPMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings
from app.middleware.error_handler import ErrorHandlingMiddleware
from app.middleware.cors import setup_cors
from app.db.session import engine
from app.db.base import Base

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Premium AI-powered Habit & Mood Tracking SaaS",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware
setup_cors(app)
app.add_middleware(GZIPMiddleware, minimum_size=1000)
app.add_middleware(ErrorHandlingMiddleware)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await engine.dispose()


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to MindTrack AI API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


# API Routes
from app.api.v1 import api_router
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
