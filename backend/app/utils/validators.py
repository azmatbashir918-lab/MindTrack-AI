"""Input and data validators"""

import re
from datetime import datetime
from typing import Any
from app.core.exceptions import ValidationException


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns: (is_valid, message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain uppercase letter"
    
    if not any(c.isdigit() for c in password):
        return False, "Password must contain digit"
    
    if not any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?" for c in password):
        return False, "Password must contain special character"
    
    return True, "Password is strong"


def validate_username(username: str) -> tuple[bool, str]:
    """
    Validate username format
    Returns: (is_valid, message)
    """
    if len(username) < 3:
        return False, "Username must be at least 3 characters"
    
    if len(username) > 100:
        return False, "Username must be at most 100 characters"
    
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        return False, "Username can only contain letters, numbers, dashes, and underscores"
    
    return True, "Username is valid"


def validate_hex_color(color: str) -> bool:
    """Validate hex color format"""
    return re.match(r'^#[0-9A-Fa-f]{6}$', color) is not None


def validate_time_format(time_str: str) -> bool:
    """Validate HH:MM time format"""
    try:
        datetime.strptime(time_str, "%H:%M")
        return True
    except ValueError:
        return False


def sanitize_string(text: str, max_length: int = 10000) -> str:
    """Sanitize and truncate string input"""
    if text is None:
        return None
    
    # Remove null bytes
    text = text.replace('\x00', '')
    
    # Truncate if necessary
    if len(text) > max_length:
        text = text[:max_length]
    
    return text.strip()
