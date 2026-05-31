"""CORS middleware"""

from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

settings = get_settings()


def setup_cors(app):
    """Setup CORS middleware"""
    
    origins = [
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]
    
    if settings.ENVIRONMENT == "production":
        origins = [
            settings.FRONTEND_URL,
        ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
