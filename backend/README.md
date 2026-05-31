# MindTrack AI - Backend API

Premium AI-powered Habit & Mood Tracking SaaS Backend

## Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL with AsyncPG
- **ORM:** SQLAlchemy
- **Authentication:** JWT
- **AI Integration:** OpenAI API
- **Async:** Python 3.10+ AsyncIO

## Project Structure

```
backend/
├── app/
│   ├── core/              # Core utilities (security, exceptions, constants)
│   ├── db/                # Database models and session management
│   ├── api/               # API routes and dependencies
│   ├── services/          # Business logic
│   ├── schemas/           # Pydantic validation schemas
│   ├── utils/             # Helper functions
│   ├── middleware/        # FastAPI middleware
│   ├── config.py          # Configuration
│   └── main.py            # FastAPI application
├── migrations/            # Alembic database migrations
├── tests/                 # Unit and integration tests
├── requirements.txt       # Python dependencies
├── .env.example          # Example environment variables
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL 12+
- pip or conda

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file**
```bash
cp .env.example .env
```

5. **Configure environment variables**
Edit `.env` and update:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing key (generate random string)
- `OPENAI_API_KEY` - OpenAI API key
- Other services as needed

6. **Initialize database**
```bash
# Create tables
alembic upgrade head

# Or using SQLAlchemy
python -c "from app.db import engine, Base; Base.metadata.create_all(bind=engine)"
```

### Running the Server

```bash
uvicorn app.main:app --reload
```

Server runs on `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile
- `PUT /api/v1/users/me/password` - Change password

### Habits
- `GET /api/v1/habits` - List habits
- `POST /api/v1/habits` - Create habit
- `GET /api/v1/habits/{id}` - Get habit
- `PUT /api/v1/habits/{id}` - Update habit
- `DELETE /api/v1/habits/{id}` - Delete habit

### Mood
- `GET /api/v1/mood` - List mood entries
- `POST /api/v1/mood` - Create mood entry
- `GET /api/v1/mood/{id}` - Get mood entry

### AI
- `POST /api/v1/ai/chat` - Chat with AI
- `GET /api/v1/ai/chat-history` - Get chat history
- `POST /api/v1/ai/analyze` - Analyze data

## Database Schema

### Core Tables

**users** - User accounts
**habits** - Habit records
**habit_completions** - Daily completion tracking
**mood_entries** - Daily mood logs
**chat_messages** - AI chat history
**ai_reports** - Generated reports
**notifications** - User notifications
**achievements** - Earned badges
**settings** - User preferences

See `ARCHITECTURE.md` for detailed ER diagram.

## Security

✅ **Password Hashing:** Argon2 via passlib  
✅ **JWT Tokens:** Stateless, expiring tokens  
✅ **HTTPS:** Enforce SSL/TLS in production  
✅ **CORS:** Restricted to frontend origin  
✅ **Rate Limiting:** To be implemented  
✅ **Input Validation:** Pydantic models for all inputs  
✅ **SQL Injection:** Protected by SQLAlchemy ORM  

## Environment Variables

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/mindtrack_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-xxx
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
DEBUG=True
```

## Testing

Run tests with pytest:
```bash
pytest
```

With coverage:
```bash
pytest --cov=app
```

## Development

### Code Style
- Follow PEP 8
- Use type hints
- Write docstrings

### Creating New Endpoints

1. Create route in `app/api/v1/`
2. Create schemas in `app/schemas/`
3. Add business logic in `app/services/`
4. Include in `app/main.py` router

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Deployment

### Docker

```bash
docker build -t mindtrack-api .
docker run -p 8000:8000 mindtrack-api
```

### Render

1. Connect GitHub repository
2. Select `backend` as root directory
3. Set environment variables
4. Deploy

### AWS Lambda

Use with API Gateway and RDS for serverless deployment.

## Monitoring & Logging

- Structured logging with JSON format
- OpenTelemetry integration ready
- Health check endpoint: `GET /health`

## Contributing

1. Create feature branch
2. Make changes
3. Add tests
4. Submit PR

## License

MIT License - See LICENSE file

## Support

- Issues: GitHub Issues
- Docs: `/docs` endpoint
- Email: support@mindtrack.ai
