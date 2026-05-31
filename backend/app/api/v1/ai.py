"""AI Assistant API endpoints"""

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.db import get_db, User, ChatMessage
from app.api.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


class ChatRequest(BaseModel):
    """Chat message request"""
    message: str


@router.post(
    "/chat",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Chat with AI assistant"
)
async def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a message to the AI wellness assistant.
    
    The assistant can help with:
    - Habit coaching and motivation
    - Mood analysis and support
    - Productivity advice
    - Daily check-ins
    - Personalized recommendations
    """
    # TODO: Implement OpenAI integration
    # For now, return mock response
    
    # Save user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)
    
    # Generate AI response (TODO: Call OpenAI API)
    ai_response_text = f"I received your message: '{payload.message}'. AI responses coming soon!"
    
    ai_msg = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=ai_response_text,
        tokens_used=0
    )
    db.add(ai_msg)
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "user_message": {
                "id": str(user_msg.id),
                "content": user_msg.content,
                "role": "user",
                "created_at": user_msg.created_at
            },
            "assistant_response": {
                "id": str(ai_msg.id),
                "content": ai_msg.content,
                "role": "assistant",
                "created_at": ai_msg.created_at
            }
        }
    }


@router.get(
    "/chat-history",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get chat history"
)
async def get_chat_history(
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get chat history with AI assistant.
    
    Returns last N messages ordered by most recent.
    """
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
    )
    
    messages = result.scalars().all()
    messages.reverse()  # Show oldest first
    
    return {
        "success": True,
        "data": {
            "messages": [
                {
                    "id": str(m.id),
                    "role": m.role,
                    "content": m.content,
                    "tokens_used": m.tokens_used,
                    "created_at": m.created_at
                }
                for m in messages
            ],
            "total": len(messages)
        }
    }


@router.delete(
    "/chat/{message_id}",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Delete chat message"
)
async def delete_chat_message(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a chat message from history.
    """
    # TODO: Implement message deletion
    return {
        "success": True,
        "message": "Chat message deleted successfully"
    }


@router.post(
    "/analyze",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Analyze habits and mood"
)
async def analyze_patterns(
    days: int = Query(30, ge=7, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze user's habits and mood patterns over last N days.
    
    Returns insights about:
    - Most productive times
    - Mood patterns
    - Habit consistency
    - Recommendations for improvement
    """
    # TODO: Implement analysis engine
    return {
        "success": True,
        "data": {
            "period_days": days,
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
                    "description": "Schedule important tasks during your peak productivity hours",
                    "priority": "high"
                }
            ]
        }
    }


@router.post(
    "/report",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Generate AI report"
)
async def generate_report(
    report_type: str = Query("weekly"),  # daily, weekly, monthly
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate an AI-powered report based on user data.
    
    Report types:
    - **daily**: Today's summary
    - **weekly**: Last 7 days analysis
    - **monthly**: Last 30 days analysis
    """
    # TODO: Implement report generation
    return {
        "success": True,
        "data": {
            "report_type": report_type,
            "title": f"{report_type.capitalize()} Report",
            "generated_at": datetime.utcnow(),
            "summary": "AI report generation coming soon",
            "sections": []
        }
    }


@router.get(
    "/insights",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Get personalized insights"
)
async def get_insights(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get personalized AI insights based on user's habits and mood.
    """
    # TODO: Implement insights generation
    return {
        "success": True,
        "data": {
            "insights": [
                {
                    "id": "insight_1",
                    "title": "Morning Routine Success",
                    "description": "You've maintained your morning routine 95% of the time",
                    "type": "achievement",
                    "confidence": 0.95
                }
            ]
        }
    }


from datetime import datetime
