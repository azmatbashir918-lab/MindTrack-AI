# MindTrack AI - API Documentation

**Base URL:** `http://localhost:8000`  
**API Version:** v1  
**API Prefix:** `/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Habits](#habits)
4. [Mood](#mood)
5. [AI Assistant](#ai-assistant)
6. [Analytics](#analytics)
7. [Response Format](#response-format)
8. [Error Handling](#error-handling)

---

## Authentication

### Register User
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "message": "Check your email for verification link"
  }
}
```

---

### Login User
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

---

### Refresh Token
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900
  }
}
```

---

## Users

### Get Current User Profile
```
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": null,
    "bio": "Tracking habits and moods",
    "timezone": "UTC",
    "theme": "dark",
    "is_email_verified": true,
    "is_active": true,
    "created_at": "2026-05-31T10:00:00Z",
    "updated_at": "2026-05-31T10:00:00Z"
  }
}
```

---

### Update User Profile
```
PUT /api/v1/users/me
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Wellness enthusiast",
  "timezone": "America/New_York",
  "theme": "dark"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Wellness enthusiast",
    "timezone": "America/New_York",
    "theme": "dark"
  }
}
```

---

### Change Password
```
PUT /api/v1/users/me/password
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Habits

### List Habits
```
GET /api/v1/habits?skip=0&limit=50&active_only=true
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "habits": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Morning Workout",
        "description": "30 min exercise routine",
        "category": "fitness",
        "frequency": "daily",
        "target_days": 7,
        "color": "#00E5FF",
        "icon": "💪",
        "reminder_time": "06:00",
        "reminder_enabled": true,
        "is_active": true,
        "start_date": "2026-05-01T00:00:00Z",
        "end_date": null,
        "created_at": "2026-05-31T10:00:00Z",
        "updated_at": "2026-05-31T10:00:00Z"
      }
    ],
    "total": 1,
    "skip": 0,
    "limit": 50
  }
}
```

---

### Create Habit
```
POST /api/v1/habits
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Morning Workout",
  "description": "30 min exercise routine",
  "category": "fitness",
  "frequency": "daily",
  "target_days": 7,
  "color": "#00E5FF",
  "icon": "💪",
  "reminder_time": "06:00",
  "reminder_enabled": true,
  "start_date": "2026-05-31T00:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Habit created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Morning Workout",
    "category": "fitness",
    "frequency": "daily",
    "color": "#00E5FF",
    "created_at": "2026-05-31T10:05:00Z"
  }
}
```

---

### Mark Habit Complete
```
POST /api/v1/habits/{habit_id}/complete?notes=optional_notes
Authorization: Bearer <access_token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Habit completed!",
  "data": {
    "completion_id": "550e8400-e29b-41d4-a716-446655440002",
    "completed_at": "2026-05-31T10:15:00Z",
    "notes": "optional_notes"
  }
}
```

---

### Get Habit Statistics
```
GET /api/v1/habits/{habit_id}/stats
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "habit_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Morning Workout",
    "total_completions": 25,
    "current_streak": 5,
    "longest_streak": 12,
    "completion_rate": 83.33,
    "last_completed": "2026-05-31T06:30:00Z"
  }
}
```

---

## Mood

### Create Mood Entry
```
POST /api/v1/mood
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "mood_level": "good",
  "mood_score": 4,
  "notes": "Had a productive day",
  "energy_level": 8,
  "stress_level": 3,
  "tags": ["productive", "happy", "energetic"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Mood entry created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "mood_level": "good",
    "mood_score": 4,
    "created_at": "2026-05-31T20:00:00Z"
  }
}
```

---

### List Mood Entries
```
GET /api/v1/mood?skip=0&limit=50&days=30
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "mood_level": "good",
        "mood_score": 4,
        "notes": "Had a productive day",
        "energy_level": 8,
        "stress_level": 3,
        "tags": ["productive", "happy"],
        "created_at": "2026-05-31T20:00:00Z"
      }
    ],
    "total": 1,
    "skip": 0,
    "limit": 50
  }
}
```

---

### Get Mood Statistics
```
GET /api/v1/mood/analytics/stats?days=30
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_entries": 28,
    "average_mood_score": 3.64,
    "most_common_mood": "good",
    "entries_this_week": 7
  }
}
```

---

## AI Assistant

### Chat with AI
```
POST /api/v1/ai/chat
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "I missed my workout today. Should I be worried?"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user_message": {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "content": "I missed my workout today. Should I be worried?",
      "role": "user",
      "created_at": "2026-05-31T20:30:00Z"
    },
    "assistant_response": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "content": "Missing one day won't hurt your progress. Focus on consistency over perfection.",
      "role": "assistant",
      "created_at": "2026-05-31T20:30:15Z"
    }
  }
}
```

---

### Get Chat History
```
GET /api/v1/ai/chat-history?limit=50
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "role": "user",
        "content": "I missed my workout today.",
        "tokens_used": null,
        "created_at": "2026-05-31T20:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "role": "assistant",
        "content": "Missing one day won't hurt your progress...",
        "tokens_used": 45,
        "created_at": "2026-05-31T20:30:15Z"
      }
    ],
    "total": 2
  }
}
```

---

### Analyze Patterns
```
POST /api/v1/ai/analyze?days=30
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period_days": 30,
    "insights": [
      {
        "title": "Productivity Peak",
        "description": "You are most productive on weekdays between 9 AM and 12 PM",
        "type": "productivity"
      }
    ],
    "recommendations": [
      {
        "title": "Schedule Important Tasks",
        "description": "Schedule important tasks during your peak hours",
        "priority": "high"
      }
    ]
  }
}
```

---

## Analytics

### Get Dashboard Data
```
GET /api/v1/analytics/dashboard
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "John Doe",
      "email": "user@example.com",
      "avatar": null
    },
    "stats": {
      "total_habits": 5,
      "active_habits": 5,
      "mood_entries_this_week": 7,
      "average_mood": 3.86
    },
    "habits": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Morning Workout",
        "category": "fitness",
        "color": "#00E5FF",
        "is_active": true
      }
    ],
    "recent_mood": [
      {
        "date": "2026-05-31",
        "mood_score": 4,
        "energy": 8,
        "stress": 3
      }
    ]
  }
}
```

---

### Get Habit Analytics
```
GET /api/v1/analytics/habits?days=30
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period_days": 30,
    "habits": [
      {
        "habit_id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Morning Workout",
        "category": "fitness",
        "completions": 25,
        "expected": 30,
        "completion_rate": 83.33,
        "frequency": "daily"
      }
    ],
    "total_completion_rate": 83.33
  }
}
```

---

### Get Mood Analytics
```
GET /api/v1/analytics/mood?days=30
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period_days": 30,
    "total_entries": 28,
    "average_mood_score": 3.64,
    "daily_moods": [
      {
        "date": "2026-05-01",
        "average_score": 3.5
      },
      {
        "date": "2026-05-02",
        "average_score": 4.0
      }
    ],
    "trend": "stable"
  }
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Error Handling

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error |

### Error Examples

**Missing Token (401):**
```json
{
  "success": false,
  "error": "Could not validate credentials",
  "code": "AUTHENTICATION_ERROR"
}
```

**Invalid Data (422):**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR"
}
```

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Access tokens expire in 15 minutes. Use the refresh token to get a new access token without re-logging in.

---

## Rate Limiting

- Per-user rate limit: 100 requests per minute
- Per-IP rate limit: 1000 requests per minute

---

## Pagination

List endpoints support pagination:

```
GET /api/v1/habits?skip=0&limit=50
```

- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 50, max: 100)

---

## API Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

**Last Updated:** 2026-05-31  
**API Version:** 1.0.0
