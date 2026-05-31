import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Login,
  Register,
  Dashboard,
  Habits,
  Mood,
  Chat,
  Analytics,
  Reports,
  Settings,
} from './pages';

function App() {
  // TODO: Implement proper authentication check
  const isAuthenticated = true;

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
