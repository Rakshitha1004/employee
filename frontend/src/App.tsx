import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ProjectsPage from './pages/Projects';
import NotFoundPage from './pages/NotFound';
import NavBar from './components/NavBar';
import { getCurrentUser } from './api';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser().then((data) => {
      setUser(data.user);
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('authToken');
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div className="page-shell">Loading application...</div>;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Employee Task & Workflow Management</h1>
          <p className="app-subtitle">Centralized team planning, project execution, and workflow analytics.</p>
        </div>
        {user && <NavBar user={user} onLogout={handleLogout} />}
      </header>

      <main className="page-shell">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/projects" element={user ? <ProjectsPage /> : <Navigate to="/login" />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
