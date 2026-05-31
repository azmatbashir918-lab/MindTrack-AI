# MindTrack AI - Frontend Setup

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── index.ts
│   │   └── features/            # Feature-specific components
│   │       ├── HabitCard.tsx
│   │       ├── MoodCard.tsx
│   │       ├── ChatMessage.tsx
│   │       ├── Chart.tsx
│   │       └── index.ts
│   ├── pages/                   # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Habits.tsx
│   │   ├── Mood.tsx
│   │   ├── Chat.tsx
│   │   ├── Analytics.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   └── index.ts
│   ├── services/                # API services
│   │   ├── api.ts              # Axios client with interceptors
│   │   ├── auth.ts             # Authentication API
│   │   ├── habit.ts            # Habit API
│   │   ├── mood.ts             # Mood API
│   │   ├── ai.ts               # AI/Chat API
│   │   ├── analytics.ts        # Analytics API
│   │   └── index.ts
│   ├── stores/                  # Zustand state management
│   │   ├── authStore.ts
│   │   ├── habitStore.ts
│   │   ├── moodStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   ├── utils/                   # Utility functions
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── styles/                  # Global styles
│   │   ├── globals.css
│   │   └── theme.css
│   ├── App.tsx                  # Main app component with routing
│   └── main.tsx                 # Entry point
├── public/
├── index.html                   # HTML entry point
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.cjs
├── vite.config.ts
├── .env.example
├── .env
├── .gitignore
└── README.md
```

## Completed Components

### Common UI Components (10)
✅ **Button** - Multiple variants (primary, secondary, ghost, danger, outline)
✅ **Input** - With label, error states, and icons
✅ **Card** - Interactive cards with optional gradient backgrounds
✅ **Modal** - Animated modals with configurable sizes
✅ **LoadingSpinner** - Animated loading indicator
✅ **StatsCard** - Statistics display with trends
✅ **Alert** - Animated alerts (success, error, warning, info)
✅ **Sidebar** - Navigation sidebar with active state indicators
✅ **Navbar** - Top navigation with search and profile menu
✅ **Layout** - Main layout wrapper combining Sidebar + Navbar

### Feature Components (4)
✅ **HabitCard** - Display habit with streak info and actions
✅ **MoodCard** - Display mood entry with emoji and score
✅ **ChatMessage** - Message display for AI chat (user/assistant)
✅ **Chart** - Recharts wrapper for line/bar charts

### Pages (9)
✅ **Login** - Authentication page with form validation
✅ **Register** - User registration with confirmation
✅ **Dashboard** - Home page with stats, charts, and quick actions
✅ **Habits** - Habit management (CRUD, view stats)
✅ **Mood** - Mood tracking with entry form and history
✅ **Chat** - AI assistant chat interface
✅ **Analytics** - In-depth analytics and insights
✅ **Reports** - Report generation and downloads
✅ **Settings** - User profile, security, preferences

### Services (6)
✅ **api.ts** - Axios client with JWT token refresh interceptors
✅ **auth.ts** - Login, register, password reset, email verification
✅ **habit.ts** - CRUD, stats, analytics for habits
✅ **mood.ts** - CRUD, history, stats for moods
✅ **ai.ts** - Chat, history, analysis, reports
✅ **analytics.ts** - Dashboard, habit, mood, productivity analytics

### State Management (4 Zustand Stores)
✅ **authStore** - User auth state, login/logout
✅ **habitStore** - Habit list management
✅ **moodStore** - Mood entries management
✅ **uiStore** - Theme and UI preferences

## Key Features

### Authentication Flow
- Login/Register pages with form validation
- JWT token management with refresh interceptors
- Auto token refresh on 401 responses
- Protected routes

### Habit Tracking
- Create, read, update, delete habits
- Streak tracking
- Habit completion marking
- Category organization (Fitness, Study, Work, Health, Personal)
- Reminder scheduling

### Mood Tracking
- Daily mood logging (5 levels: Excellent → Very Bad)
- Mood score (1-10)
- Notes and activities logging
- Mood history timeline

### AI Assistant
- Real-time chat with AI coach
- Chat history management
- Quick prompt suggestions
- Streaming message support ready

### Analytics & Reports
- Weekly/Monthly habit completion trends
- Mood trends visualization
- Productivity scoring
- Key insights and recommendations
- Export to PDF, CSV, Excel

### User Settings
- Profile management
- Password management
- 2FA setup
- Notification preferences
- Theme and language options
- Data download/deletion

## Tech Stack

### Frontend Framework
- React 18.2.0 with TypeScript 5.3
- Vite 5.0 (build tool)
- React Router v6 (routing)

### UI & Styling
- Tailwind CSS with custom dark theme
- Framer Motion (animations)
- Recharts (data visualization)

### State Management
- Zustand (lightweight state management)

### API Integration
- Axios with interceptors
- JWT token management
- Automatic token refresh

### Type Safety
- Full TypeScript support
- Shared types with backend
- IDE autocomplete for API responses

## Environment Variables

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=MindTrack AI
```

## Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
# App runs on http://localhost:5173
```

### Build
```bash
npm run build
# Output in dist/
```

### Preview Build
```bash
npm run preview
```

## Component Usage Examples

### Using StatsCard
```tsx
<StatsCard
  label="Current Streak"
  value={12}
  icon="🔥"
  trend={8}
  color="orange"
/>
```

### Using HabitCard
```tsx
<HabitCard
  habit={habit}
  onComplete={(id) => handleComplete(id)}
  onEdit={(h) => handleEdit(h)}
  onDelete={(id) => handleDelete(id)}
  isCompleted={false}
/>
```

### Using API Service
```tsx
import { habitService } from '@/services';

// In component
const { data } = await habitService.list();
const habit = await habitService.create(habitData);
await habitService.markComplete(habitId);
```

### Using Zustand Store
```tsx
import { useHabitStore } from '@/stores';

// In component
const { habits, addHabit } = useHabitStore();
addHabit(newHabit);
```

## Next Steps

1. **Wire API Calls** - Replace mock data with real API calls
2. **Implement Auth Flow** - Connect login/register to backend
3. **Add Error Handling** - Global error toast notifications
4. **Performance** - Code splitting, lazy loading, image optimization
5. **Testing** - Unit tests with Vitest, E2E with Playwright
6. **Deployment** - Deploy to Vercel with environment variables

## Notes

- All components use Tailwind's dark theme with cyan and purple accents
- Animations powered by Framer Motion for smooth UX
- Responsive design for mobile, tablet, and desktop
- Form validation in place, ready for API integration
- Loading states and error handling scaffolded
