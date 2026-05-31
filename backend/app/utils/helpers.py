"""Environment and database utilities"""

import os
from typing import Optional
from datetime import datetime


def get_env_var(key: str, default: Optional[str] = None) -> str:
    """Get environment variable with optional default"""
    return os.getenv(key, default)


def get_env_bool(key: str, default: bool = False) -> bool:
    """Get boolean environment variable"""
    value = os.getenv(key, str(default)).lower()
    return value in ("true", "1", "yes")


def get_env_int(key: str, default: int = 0) -> int:
    """Get integer environment variable"""
    try:
        return int(os.getenv(key, default))
    except ValueError:
        return default


def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format datetime object to string"""
    if dt is None:
        return None
    return dt.strftime(format_str)


def get_days_between(start: datetime, end: datetime) -> int:
    """Calculate days between two dates"""
    delta = end - start
    return delta.days
