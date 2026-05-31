"""Application constants"""

# Mood Levels
MOOD_LEVELS = {
    "very_bad": 1,
    "bad": 2,
    "neutral": 3,
    "good": 4,
    "excellent": 5
}

MOOD_LABELS = {v: k for k, v in MOOD_LEVELS.items()}

# Habit Categories
HABIT_CATEGORIES = [
    "fitness",
    "study",
    "work",
    "health",
    "personal"
]

# Habit Frequencies
HABIT_FREQUENCIES = [
    "daily",
    "weekly",
    "monthly"
]

# Notification Types
NOTIFICATION_TYPES = [
    "reminder",
    "achievement",
    "insight",
    "report"
]

# Report Types
REPORT_TYPES = [
    "daily",
    "weekly",
    "monthly"
]

# Achievement Types
ACHIEVEMENT_TYPES = [
    "first_habit",
    "7_day_streak",
    "30_day_streak",
    "100_mood_entries",
    "perfect_week",
    "mood_master"
]

# Pagination
DEFAULT_PAGE_SIZE = 50
MAX_PAGE_SIZE = 100

# Limits
MAX_HABITS_PER_USER = 50
MAX_DAILY_MOOD_ENTRIES = 10
CHAT_MESSAGE_LIMIT = 1000
STREAK_RESET_DAYS = 1
